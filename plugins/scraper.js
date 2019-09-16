'use strict';
const path = require('path');
const fp = require('fastify-plugin');
const Queue = require('bull');

module.exports = fp(async function(fastify) {
  const queue = new Queue('scraper', {
    redis: { url: process.env.REDIS_URL }
  });

  queue.process(path.resolve(__dirname, '../jobs/scrape.js'));

  async function addScrapeTask(args) {
    await queue.add(args);
  }

  async function handleComplete(job, results) {
    const { term, type } = job.data;
    let ids;

    if (type === 'route') {
      ids = await fastify.routeService.createRoutes(results);
    }
    console.log({ ids });
    await fastify.searchService.setTermIds(term, ids);
  }

  queue.on('completed', handleComplete);
  queue.on('error', function(error) {
    console.log(error);
  });
  fastify.decorate('addScrapeTask', addScrapeTask);
});
