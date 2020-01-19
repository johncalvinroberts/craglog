import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as cheerio from 'cheerio';
import { JobService } from '../job.service';
const baseUrl = 'https://thecrag.com';

@Processor('list')
export class ListProcessor {
  constructor(private readonly jobService: JobService) {}

  private readonly logger = new Logger(ListProcessor.name);

  private async scrapeRouteListPage(page: number): Promise<string[]> {
    const res = await fetch(
      `${baseUrl}/climbing/world/routes/search/?page=${page}`,
    );
    const html = await res.text();
    this.logger.debug(`Scraped page number ${page}`);
    const $ = cheerio.load(html);
    const routeEls: { attribs?: { href?: string } }[] = Array.from(
      $('span.route > a'),
    );
    this.logger.debug({ routeEls: routeEls.length });
    const routeHrefs: string[] = routeEls
      .map(el => {
        return el.attribs && el.attribs.href;
      })
      .filter(item => !!item);
    this.logger.debug({ routeHrefs: routeHrefs.length });
    return routeHrefs;
  }

  @Process()
  async scrape(job: Job): Promise<void> {
    const { page }: { page?: number } = job.data;
    this.logger.debug(
      'Scraper received job to scrape single page of routes',
      JSON.stringify(job),
    );
    try {
      const hrefs = await this.scrapeRouteListPage(page);
      this.jobService.add({ type: 'route', data: hrefs });
      Promise.resolve();
    } catch (error) {
      this.logger.error('FAILED LIST JOB', error);
      Promise.reject(error);
    }
  }
}
