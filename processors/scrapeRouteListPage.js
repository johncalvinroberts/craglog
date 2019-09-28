'use strict';
const cheerio = require('cheerio');
const got = require('got');
const fetch = require('node-fetch');
const baseUrl = 'https://thecrag.com';
const debug = require('debug')('scraper:page');
const apiUrl = process.env.API_URL;

async function scrapeRouteListPage(page) {
  try {
    debug(`Scraping page number ${page}`);
    const res = await got(
      `${baseUrl}/climbing/world/routes/search/?page=${page}`
    );
    debug(`Scraped page number ${page}`);
    const $ = cheerio.load(res.body);
    const routeEls = Array.from($('span.route > a'));
    debug({ routeEls: routeEls.length });
    const routeHrefs = routeEls
      .map(el => {
        return el.attribs && el.attribs.href;
      })
      .filter(item => !!item);
    debug({ routeHrefs: routeHrefs.length });
    const url = `${apiUrl}/jobs/add`;

    const works = [];
    works.push(
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({ type: 'route', data: routeHrefs }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );

    works.push(
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({ type: 'list' }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );

    await Promise.all(works);
    return;
  } catch (error) {
    Promise.reject(error);
  }
}

module.exports = function(job) {
  const { page } = job.data;
  debug('Scraper received job to scrape single page of routes', { page, job });
  return scrapeRouteListPage(page);
};
