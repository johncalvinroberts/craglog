import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import climbingGrade from 'climbing-grade';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

const logger = new Logger('jobs:33:27crags.process');

function trimWhiteSpace(string) {
  return string && string.replace(/\s+/g, '');
}

//https://27crags.com/crags/10771/routes/142408
const fetchAndFormatRoute = async (url: string) => {
  const res = await fetch(url);
  const html = await res.text();
  logger.debug(
    `FINISHED scraping route id ${url} from 27crags. Now parsing html.`,
  );

  const $ = cheerio.load(html);
  const rawTitle = $('div.route-name').text().trim().toLowerCase();
  const [name, grade] = rawTitle.split(', ');
  const [cragName, region] = Array.from($('.craglocation a')).map((item) =>
    $(item).text().trim().replace(',', ''),
  );
  const style = $('.craglocation').text().trim().toLowerCase().split(',')[0];

  return {
    externalUrl: url,
    name,
    cragName,
    region,
    area: '',
    grade,
    location: '',
    height: '',
    bolts: '',
    style,
  };
};

export const process27Crags = async (job: Job) => {
  try {
    const { url } = job.data;
    logger.debug(
      { url },
      'Scraper received job to scrape single route from 27crags',
    );
    logger.debug(JSON.stringify({ job }));
    job.log('starting scraping');
    const data = await fetchAndFormatRoute(url);
    logger.debug(`FINISHED scraping and creating route: ${url}`);
    logger.debug(JSON.stringify(data));
    return data;
  } catch (error) {
    logger.debug('FAILED ROUTE JOB');
    logger.debug(JSON.stringify({ error, job }));
    throw new Error(JSON.stringify(error));
  }
};
