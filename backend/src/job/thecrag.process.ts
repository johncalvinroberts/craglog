import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import climbingGrade from 'climbing-grade';
import { Logger } from '@nestjs/common';

const logger = new Logger('jobs:33:thecrag.process');

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

async function fetchAndFormatRoute(url, job) {
  const broken = url.split('/');
  const id = broken[broken.length - 1];

  const msg1 = `id: ${id}, FULLURL: ${url}`;
  job.log(msg1);
  logger.debug(msg1);
  const res = await fetch(url);
  const html = await res.text();
  const msg2 = `FINISHED scraping route id ${id} from the crag. Now parsing html.`;
  logger.debug(msg2);
  job.log(msg2);

  const $ = cheerio.load(html);

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

  const breadCrumbs = $('#breadCrumbs > div > li');
  const name = $(breadCrumbs[breadCrumbs.length - 1])
    .text()
    .trim();
  const cragName = $(breadCrumbs[breadCrumbs.length - 2])
    .text()
    .trim();
  const region = $(breadCrumbs[breadCrumbs.length - 3])
    .text()
    .trim();
  const area = $(breadCrumbs[breadCrumbs.length - 4])
    .text()
    .trim();

  const boltsVal = /^-{0,1}\d+$/.test(bolts) && parseInt(bolts);

  const location = [latitude, longitude];

  return {
    externalId: id,
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

export const processTheCrag = async (job) => {
  try {
    const { url } = job.data;
    logger.debug('Scraper received job to scrape single route');
    logger.debug(JSON.stringify({ job }));
    job.log('starting scraping');
    const data = await fetchAndFormatRoute(url, job);
    logger.debug(`FINISHED scraping and creating route: ${url}`);
    logger.debug(JSON.stringify(data));
    return data;
  } catch (error) {
    logger.debug('FAILED ROUTE JOB');
    logger.debug(JSON.stringify({ error, job }));
    throw new Error(JSON.stringify(error));
  }
};
