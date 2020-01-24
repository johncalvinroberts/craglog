'use strict';
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const baseUrl = 'https://thecrag.com';
const debug = require('debug')('scraper:page');
const apiUrl = process.env.API_URL;
const WORKER_ACCESS_TOKEN = process.env.WORKER_ACCESS_TOKEN;

async function scrapeRouteListPage(page) {
  debug(`Scraping page number ${page}`);
  const res = await fetch(
    `${baseUrl}/climbing/world/routes/search/?page=${page}`
  );
  const html = await res.text();
  debug(`Scraped page number ${page}`);
  const $ = cheerio.load(html);
  const routeEls = Array.from($('span.route > a'));
  debug({ routeEls: routeEls.length });
  const routeHrefs = routeEls
    .map(el => {
      return el.attribs && el.attribs.href;
    })
    .filter(item => !!item);
  debug({ routeHrefs: routeHrefs.length });
  const url = `${apiUrl}/jobs`;

  const works = [];
  works.push(
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ type: 'route', data: routeHrefs }),
      headers: {
        'Content-Type': 'application/json',
        authorization: WORKER_ACCESS_TOKEN
      }
    })
  );

  works.push(
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ type: 'list' }),
      headers: {
        'Content-Type': 'application/json',
        authorization: WORKER_ACCESS_TOKEN
      }
    })
  );

  const responses = await Promise.all(works);
  for (const res of responses) {
    if (!res.ok) {
      const error = await res.json();
      throw error;
    }
  }
  return;
}

module.exports = async function(job) {
  const { page } = job.data;
  debug('Scraper received job to scrape single page of routes', { page, job });
  try {
    await scrapeRouteListPage(page);
    Promise.resolve();
  } catch (error) {
    debug('FAILED LIST JOB', { error, job });
    Promise.reject(error);
  }
};
