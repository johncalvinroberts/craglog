import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

const logger = new Logger('jobs:33:27crags.process');

const fetchAndFormatRoute = async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  logger.debug(
    `FINISHED scraping route id ${url} from mountain project. Now parsing html.`,
  );
  const $ = cheerio.load(html);
  const name = $('#route-page > div > div.col-md-9.float-md-right.mb-1 > h1')
    .text()
    .trim();
  const breadCrumbs = $(
    '#route-page > div > div.col-md-9.float-md-right.mb-1 > div.mb-half.small.text-warm > a',
  );

  const cragName = $(breadCrumbs[breadCrumbs.length - 2])
    .text()
    .trim();
  const area = $(breadCrumbs[breadCrumbs.length - 3])
    .text()
    .trim();
  const region = $(breadCrumbs[breadCrumbs.length - 4])
    .text()
    .trim();
  const grade = $(
    '#route-page > div > div.col-md-9.float-md-right.mb-1 > h2 > span',
  )
    .text()
    .trim();

  const style = $(
    '#route-page > div > div.col-md-9.main-content.float-md-right > div.row > div.col-lg-7.col-md-6 > div.small.mb-1 > table > tbody > tr:nth-child(1) > td:nth-child(2)',
  )
    .text()
    .trim()
    .split(',')[0];
  return {
    externalUrl: url,
    name,
    cragName,
    region,
    area,
    grade,
    location: '',
    height: '',
    bolts: 0,
    style,
  };
};

export const processMountainProject = async (job: Job) => {
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
