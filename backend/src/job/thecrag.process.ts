import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import climbingGrade from 'climbing-grade';
import debugModule from 'debug';
const debug = debugModule('scraper:route');
const baseUrl = 'https://thecrag.com';

function trimWhiteSpace(string) {
  return string && string.replace(/\s+/g, '');
}

const gradeMappings = {
  au: 'australian',
  us: 'yds',
  fr: 'french',
  font: 'font',
  uk: 'british',
};

function convertFont({ grade, gradecontext }) {
  const loweredAndTrimmed = grade && trimWhiteSpace(grade.toLowerCase());
  const isFont = loweredAndTrimmed && loweredAndTrimmed.startsWith('{fb}');

  if (isFont) {
    grade = trimWhiteSpace(loweredAndTrimmed).split('{fb}')[1];
    gradecontext = 'font';
  }

  return { gradecontext, grade };
}

async function fetchAndFormatRoute(href) {
  const broken = href.split('/');
  const id = broken[broken.length - 1];
  const region = broken[2];
  const area = broken[3];

  debug(`scraping route id ${id} from the crag`);
  const res = await fetch(`${baseUrl}/${href}`);
  const html = await res.text();
  debug(`FINISHED scraping route id ${id} from the crag. Now parsing html.`);

  const $ = cheerio.load(html);
  const name = $('span[itemprop=name]').text();
  const originalGrade = $('span.grade').text();

  const style = $('.style-band').text().trim().toLowerCase();

  const latLongEl = trimWhiteSpace($('.areaInfo').text());

  const [latitude, longitude] =
    latLongEl && latLongEl.substring(latLongEl.indexOf(':') + 1).split(',');

  const stats: {
    height: unknown;
    bolts: string;
    gradecontext: string;
  } = Array.from($('ul.stats > li')).reduce(
    (memo, current) => {
      const [key, value] = $(current).text().trim().split(':');

      memo[trimWhiteSpace(key.toLowerCase())] = trimWhiteSpace(
        value.toLowerCase(),
      );
      return memo;
    },
    { height: '', bolts: '', gradecontext: '' },
  );

  const { height, bolts } = stats;
  let { gradecontext } = stats;

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
  const cragName = $(cragNameEl).text().trim();
  const cragHref = cragNameEl.attribs && cragNameEl.attribs.href;
  const externalCragId = cragHref.substring(cragHref.lastIndexOf('/') + 1);
  const boltsVal = /^-{0,1}\d+$/.test(bolts) && parseInt(bolts);

  const location = [latitude, longitude];

  return {
    externalId: id,
    externalCragId,
    name,
    cragName,
    region,
    area,
    grade,
    location,
    height,
    bolts: boltsVal || null,
    style,
  };
}

async function scrapeSingleRoute(href) {
  const data = await fetchAndFormatRoute(href);
  debug(`FINISHED scraping and creating route: ${href}`);
  return data;
}

export const processTheCrag = async (job) => {
  const { href } = job.data;
  debug('Scraper received job to scrape single route', { href, job });
  job.log('starting scraping');
  try {
    await scrapeSingleRoute(href);
    Promise.resolve();
  } catch (error) {
    debug('FAILED ROUTE JOB', { error, job });
    throw new Error(JSON.stringify(error));
  }
};
