'use strict';
const path = require('path');
const Queue = require('bull');
const debug = require('debug')('job service');

function execRedis(redisClient, method, args) {
  return new Promise(function(resolve, reject) {
    args.push(function(err, result) {
      if (err) return reject(err);
      resolve(result);
    });
    redisClient[method].apply(redisClient, args);
  });
}

class JobService {
  constructor(redisClient) {
    this.redisClient = redisClient;
    const queue = new Queue('scraper', {
      redis: { url: process.env.REDIS_URL }
    });
    this.queue = queue;
    queue.process(
      'scrapeRoute',
      path.resolve(__dirname, '../jobs/scrapeRoute.js')
    );

    queue.process(
      'scrapeRouteListPage',
      path.resolve(__dirname, '../jobs/scrapeRouteListPage.js')
    );

    queue.on('completed', this.handleComplete);

    queue.on('error', this.handleError);
  }
  async initScraperJobs() {
    const page = await this.getScraperPage();
  }

  async getScraperPage() {
    const currentPage = await execRedis(this.redisClient, 'get', [
      'scrape-page'
    ]);
    return currentPage || 1;
  }

  async getScraperJobs() {}

  async getFailedJobs() {}

  async handleError() {}

  async handleComplete() {}
}

module.exports = JobService;
