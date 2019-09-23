'use strict';
const path = require('path');
const fp = require('fastify-plugin');
const Queue = require('bull');
const debug = require('debug');

module.exports = fp(async function(fastify) {
  const queue = new Queue('scraper', {
    redis: { url: process.env.REDIS_URL }
  });

  queue.process(
    'scrapeRoute',
    path.resolve(__dirname, '../jobs/scrapeRoute.js')
  );

  queue.process(
    'scrapeRouteListPage',
    path.resolve(__dirname, '../jobs/scrapeRouteListPage.js')
  );

  async function handleComplete(job, results) {
    debug('FINISHED scraping job', { job, results });
  }

  fastify.ready(err => {
    if (err) throw err;
    fastify.jobService.initScraperJobs();
  });
});
