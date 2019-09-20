'use strict';

const cheerio = require('cheerio');
const got = require('got');
const baseUrl = 'https://thecrag.com';
const debug = require('debug')('scraper:page');

async function scrapeRouteListPage(page) {
  try {
    debug(`Scraping page number ${page}`);
    const res = await got(
      `${baseUrl}/climbing/world/routes/search/?page=${page}`
    );
    debug(`Scraped page number ${page}`);
    const $ = cheerio.load(res.body);
    const routeEls = $('span.route > a');
    const routeHrefs = routeEls
      .map(el => {
        return el.attribs && el.attribs.href;
      })
      .filter(item => !!item);
    return routeHrefs;
  } catch (error) {
    Promise.reject(error);
  }
}

module.exports = function(job) {
  const { page } = job.data;
  debug('Scraper received job to scrape single page of routes', { page, job });
  return scrapeRouteListPage(page);
};
