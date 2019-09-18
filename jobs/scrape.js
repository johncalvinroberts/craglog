'use strict';

const cheerio = require('cheerio');
const got = require('got');
const fetch = require('node-fetch');
const baseUrl = 'https://thecrag.com';
const apiUrl = process.env.API_URL;
const climbingGrade = require('climbing-grade');
const debug = require('debug')('scraper');

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

async function scrapeSingleRoute(href) {
  const broken = href.split('/');

  const id = broken[broken.length - 1];
  const region = broken[2];
  const area = broken[3];
  debug(`scraping route id ${id} from the crag`);

  const res = await got(`${baseUrl}/${href}`);
  debug(`FINISHED scraping route id ${id} from the crag. Now parsing html.`);
  const $ = cheerio.load(res.body);
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

  const boltsVal = /^-{0,1}\d+$/.test(bolts) && parseInt(bolts);
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
  return {
    externalId: id,
    name,
    grade,
    latitude,
    longitude,
    height,
    bolts: boltsVal || null,
    style,
    region,
    area,
    cragName,
    externalCragId
  };
}

async function scrapeRouteSearch(term) {
  debug('scraping search for route', { term });
  try {
    const res = await got(`${baseUrl}/climbing/world/routes/search/${term}`);
    const $ = cheerio.load(res.body);
    const hrefs = Array.from($('span.route > a')).map(element => {
      return element.attribs.href;
    });

    debug(
      `FINISHED scraping search term for route, found ${hrefs.length} results`,
      {
        term,
        hrefs
      }
    );

    for (const href of hrefs) {
      try {
        const data = await scrapeSingleRoute(href);
        debug(data);
        const url = `${apiUrl}/routes?term=${term}`;
        await fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        debug(error);
      }
    }
    debug('FINISHED scraping and creating routes');
    return;
  } catch (error) {
    debug(error);
    Promise.reject(error);
  }
}

async function scrapeCragSearch(term) {
  try {
    const res = await got(`/climbing/world/search?S=${term}&only=areas`);
    return res;
  } catch (error) {
    Promise.reject(error);
  }
}

module.exports = function(job) {
  const { term, type } = job.data;
  debug('Scraper received job', { type, term, job });
  switch (type) {
    case 'crag':
      return scrapeCragSearch(term);
    case 'route':
      return scrapeRouteSearch(term);
    default:
      break;
  }
};
