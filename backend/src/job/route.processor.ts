import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as cheerio from 'cheerio';
import * as climbingGrade from 'climbing-grade';
import { RouteService } from '../route/route.service';
const baseUrl = 'https://thecrag.com';

interface RouteScrapeResult {
  externalId?: string;
  externalCragId?: string;
  name?: string;
  cragName?: string;
  region?: string;
  area?: string;
  grade?: string;
  latitude?: string;
  longitude?: string;
  height?: number;
  bolts?: number;
  style?: string;
}

function trimWhiteSpace(string): string {
  return string && string.replace(/\s+/g, '');
}

function convertFont({
  grade,
  gradecontext,
}): { gradecontext?: string; grade?: string } {
  const loweredAndTrimmed = grade && trimWhiteSpace(grade.toLowerCase());
  const isFont = loweredAndTrimmed && loweredAndTrimmed.startsWith('{fb}');

  if (isFont) {
    grade = trimWhiteSpace(loweredAndTrimmed).split('{fb}')[1];
    gradecontext = 'font';
  }

  return { gradecontext, grade };
}

const gradeMappings = {
  au: 'australian',
  us: 'yds',
  fr: 'french',
  font: 'font',
  uk: 'british',
};

@Processor('route')
export class RouteProcessor {
  constructor(private readonly routeService: RouteService) {}

  private readonly logger = new Logger(RouteProcessor.name);

  private async fetchAndFormatRoute(href): Promise<RouteScrapeResult> {
    const broken = href.split('/');
    const id = broken[broken.length - 1];
    const region = broken[2];
    const area = broken[3];

    this.logger.debug(`scraping route id ${id} from the crag`);
    const res = await fetch(`${baseUrl}/${href}`);
    const html = await res.text();
    this.logger.debug(
      `FINISHED scraping route id ${id} from the crag. Now parsing html.`,
    );

    const $ = cheerio.load(html);
    const name = $('span[itemprop=name]').text();
    const originalGrade = $('span.grade').text();

    const style = $('.style-band')
      .text()
      .trim()
      .toLowerCase();

    const latLongEl = trimWhiteSpace($('.areaInfo').text());

    const [latitude, longitude] =
      latLongEl && latLongEl.substring(latLongEl.indexOf(':') + 1).split(',');

    const stats = Array.from($('ul.stats > li')).reduce((memo, current) => {
      const [key, value] = $(current)
        .text()
        .trim()
        .split(':');

      memo[trimWhiteSpace(key.toLowerCase())] = trimWhiteSpace(
        value.toLowerCase(),
      );
      return memo;
    }, {});

    /* eslint-disable prefer-const */
    let {
      height,
      bolts,
      gradecontext,
    }: { height?: number; bolts?: string; gradecontext?: string } = stats;
    /* eslint-enable prefer-const */

    let grade;
    try {
      if (style !== 'boulder' && gradeMappings[gradecontext]) {
        const conversion = new climbingGrade(
          originalGrade.toLowerCase(),
          gradeMappings[gradecontext],
        );
        grade = conversion.format('yds');
      }

      if (style === 'boulder' && gradeMappings[gradecontext]) {
        ({ grade, gradecontext } = convertFont({
          grade: originalGrade,
          gradecontext,
        }));

        const conversion = new climbingGrade(
          grade.toLowerCase(),
          gradeMappings[gradecontext],
        );
        grade = conversion.format('hueco');
      }
    } catch (error) {
      grade = originalGrade;
    }

    const breadCrumbs = $('.crumb__a');
    const cragNameEl = breadCrumbs[breadCrumbs.length - 2];
    const cragName = $(cragNameEl)
      .text()
      .trim();
    const cragHref = cragNameEl.attribs && cragNameEl.attribs.href;
    const externalCragId = cragHref.substring(cragHref.lastIndexOf('/') + 1);
    const boltsVal = /^-{0,1}\d+$/.test(bolts) && parseInt(bolts);
    const externalId = id;
    return {
      externalId,
      externalCragId,
      name,
      cragName,
      region,
      area,
      grade,
      latitude,
      longitude,
      height,
      bolts: boltsVal || null,
      style,
    };
  }

  private async scrapeSingleRoute(href): Promise<void> {
    const data: RouteScrapeResult = await this.fetchAndFormatRoute(href);
    this.logger.debug(
      'completed scrape of single route, gonna, um, write it down now',
      JSON.stringify(data),
    );
    await this.routeService.create(data);
    this.logger.debug(`FINISHED scraping and creating route: ${href}`);
    return;
  }

  @Process()
  async scrape(job: Job): Promise<void> {
    const { href } = job.data;
    this.logger.debug(
      'Scraper received job to scrape single route',
      href as string,
    );
    try {
      await this.scrapeSingleRoute(href);
      Promise.resolve();
    } catch (error) {
      this.logger.error('FAILED ROUTE JOB', error);
      Promise.reject(error);
    }
  }
}
