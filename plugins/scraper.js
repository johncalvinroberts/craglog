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
    console.log('FINISHED scraping job', { term, type, results });
  }

  queue.on('completed', handleComplete);
  queue.on('error', function(error) {
    console.log(error);
  });
  fastify.decorate('addScrapeTask', addScrapeTask);
});
