'use strict';

const cheerio = require('cheerio');
const got = require('got');
const baseUrl = 'https://thecrag.com';

function trimWhiteSpace(string) {
  return string && string.replace(/\s+/g, '');
}

async function scrapeSingleRoute(id) {
  const res = await got(`${baseUrl}/route/${id}`);
  const $ = cheerio.load(res.body);
  const name = $('span[itemprop=name]').text();
  const grade = $('span.grade').text();
  const latLongEl = trimWhiteSpace($('.areaInfo').text());
  const [latitude, longitude] =
    latLongEl && latLongEl.split('Lat/Long:').split(',');

  const stats = Array.from($('ul.stats > li')).reduce((memo, current) => {
    const [key, value] = $(current)
      .text()
      .split(':');
    memo[key.toLowerCase()] = value;
    return memo;
  }, {});
  const { height, bolts } = stats;
  return { id, name, grade, latitude, longitude, height, bolts };
}

async function scrapeRouteSearch(term) {
  try {
    const res = await got(`${baseUrl}/climbing/world/routes/search/${term}`);
    const $ = cheerio.load(res.body);
    const ids = Array.from($('span.route > a')).map(element => {
      return element.attribs.href;
    });
    console.log(ids);
    const results = {};

    for (const id of ids) {
      const data = await scrapeSingleRoute(id);
      results[id] = data;
    }

    return Object.keys(results).map(id => results[id]);
  } catch (error) {
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
  switch (type) {
    case 'crag':
      return scrapeCragSearch(term);
    case 'route':
      return scrapeRouteSearch(term);
    default:
      break;
  }
};
