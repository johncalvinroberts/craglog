'use strict';

const cheerio = require('cheerio');
const fetch = require('node-fetch');
const baseUrl = 'https://thecrag.com';
const climbingGrade = require('climbing-grade');
const debug = require('debug')('scraper:route');
const apiUrl = process.env.API_URL;
const WORKER_ACCESS_TOKEN = process.env.WORKER_ACCESS_TOKEN;

function trimWhiteSpace(string) {
  return string && string.replace(/\s+/g, '');
}

const gradeMappings = {
  au: 'australian',
  us: 'yds',
  fr: 'french',
  font: 'font',
  uk: 'british'
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
      value.toLowerCase()
    );
    return memo;
  }, {});

  let { height, bolts, gradecontext } = stats;

  let grade;
  try {
    if (style !== 'boulder' && gradeMappings[gradecontext]) {
      const conversion = new climbingGrade(
        originalGrade.toLowerCase(),
        gradeMappings[gradecontext]
      );
      grade = conversion.format('yds');
    }

    if (style === 'boulder' && gradeMappings[gradecontext]) {
      ({ grade, gradecontext } = convertFont({
        grade: originalGrade,
        gradecontext
      }));

      const conversion = new climbingGrade(
        grade.toLowerCase(),
        gradeMappings[gradecontext]
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
  return {
    externalId: id,
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
    style
  };
}

async function scrapeSingleRoute(href) {
  try {
    const data = await fetchAndFormatRoute(href);
    debug(
      'completed scrape of single route, gonna, um, write it down now',
      data
    );

    const url = `${apiUrl}/routes`;

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        authorization: WORKER_ACCESS_TOKEN
      }
    });

    if (!res.ok) {
      const error = await res.json();
      throw error;
    }

    debug(`FINISHED scraping and creating route: ${href}`);
    return;
  } catch (error) {
    debug('Failed to scrape route', error);
    Promise.reject(error);
  }
}

module.exports = function(job) {
  const { href } = job.data;
  debug('Scraper received job to scrape single route', { href, job });
  return scrapeSingleRoute(href);
};
