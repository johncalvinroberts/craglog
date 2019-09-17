'use strict';

const cheerio = require('cheerio');
const got = require('got');
const fetch = require('node-fetch');
const baseUrl = 'https://thecrag.com';
const apiUrl = process.env.API_URL;
const debug = require('debug')('scraper');

function trimWhiteSpace(string) {
  return string && string.replace(/\s+/g, '');
}

async function scrapeSingleRoute(id) {
  debug(`scraping route id ${id} from the crag`);
  const res = await got(`${baseUrl}/route/${id}`);
  debug(`FINISHED scraping route id ${id} from the crag. Now parsing html.`);
  const $ = cheerio.load(res.body);
  const name = $('span[itemprop=name]').text();
  const grade = $('span.grade').text();
  const latLongEl = trimWhiteSpace($('.areaInfo').text());

  const [latitude, longitude] =
    latLongEl && latLongEl.substring(latLongEl.indexOf(':') + 1).split(',');

  const stats = Array.from($('ul.stats > li')).reduce((memo, current) => {
    const [key, value] = $(current)
      .text()
      .split(':');
    memo[key.toLowerCase()] = value;
    return memo;
  }, {});
  const { height, bolts } = stats;
  const boltsVal = /^-{0,1}\d+$/.test(bolts) && parseInt(bolts);

  return {
    externalId: id,
    name,
    grade,
    latitude,
    longitude,
    height,
    bolts: boltsVal || null
  };
}

async function scrapeRouteSearch(term) {
  debug('scraping search for route', { term });
  try {
    const res = await got(`${baseUrl}/climbing/world/routes/search/${term}`);
    const $ = cheerio.load(res.body);
    const ids = Array.from($('span.route > a')).map(element => {
      const href = element.attribs.href;
      return href.substring(href.lastIndexOf('/') + 1);
    });

    debug(
      `FINISHED scraping search term for route, found ${ids.length} results`,
      {
        term,
        ids
      }
    );

    for (const id of ids) {
      try {
        const data = await scrapeSingleRoute(id);
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
    return ids;
  } catch (error) {
    debug(error);
    Promise.reject(error);
  }
}

async function scrapeCragSearch(term) {
  try {
    const res = await got(`/climbing/world/search?S=${term}&only=areas`);
    console.log({ res });
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
