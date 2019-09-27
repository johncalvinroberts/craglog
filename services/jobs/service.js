'use strict';
const path = require('path');
const Queue = require('bull');
const debug = require('debug')('app:service:jobs');

const CURRENT_SCRAPE_PAGE_KEY = 'scrape-page';

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
    const listQueue = new Queue('list pages', {
      redis: { url: process.env.REDIS_URL }
    });

    const routeQueue = new Queue('routes', {
      redis: { url: process.env.REDIS_URL }
    });

    listQueue.process(path.resolve(__dirname, './scrapeRouteListPage.js'));
    routeQueue.process(path.resolve(__dirname, './scrapeRoute.js'));

    this.listQueue = listQueue;
    this.routeQueue = routeQueue;
  }

  async initNextPageScrape() {
    const page = await this.getScraperPage();
    debug(`Initalizing scraper jobs, page: ${page}`);
    this.listQueue.add({ page }, { jobId: page });
  }

  async getScraperPage() {
    const currentPage = await execRedis(this.redisClient, 'get', [
      CURRENT_SCRAPE_PAGE_KEY
    ]);

    if (!currentPage) {
      await execRedis(this.redisClient, 'set', [CURRENT_SCRAPE_PAGE_KEY, 1]);
      return this.getScraperPage();
    }

    return currentPage;
  }

  async getScraperJobs() {
    const [listJobs, routeJobs] = await Promise.all([
      this.listQueue.getJobs(),
      this.routeQueue.getJobs()
    ]);
    return { listJobs, routeJobs };
  }

  async getFailedJobs() {
    const [listJobs, routeJobs] = await Promise.all([
      this.listQueue.getFailed(),
      this.routeQueue.getFailed()
    ]);
    return { listJobs, routeJobs };
  }

  async addListJob(data) {
    if (Array.isArray(data)) {
      for (const item of data) {
        await this.addListJob(item);
      }
      return {};
    }

    if (!data) {
      await execRedis(this.redisClient, 'incr', [CURRENT_SCRAPE_PAGE_KEY]);
      await this.initNextPageScrape();
    } else {
      this.listQueue.add({ page: data }, { jobId: data });
    }
    return {};
  }

  async addRouteJob(data) {
    if (Array.isArray(data)) {
      for (const item of data) {
        await this.addRouteJob(item);
      }
      return {};
    }
    const jobId = data.substring(data.lastIndexOf('/') + 1);
    this.routeQueue.add({ href: data }, { jobId });
    return {};
  }

  async addJob({ type, data }) {
    debug('Adding scraper job', { type });
    if (type === 'route') {
      return this.addRouteJob(data);
    }

    if (type === 'list') {
      return this.addListJob(data);
    }
  }

  async clearJobs() {
    await Promise.all([this.routeQueue.empty(), this.listQueue.empty()]);
    await Promise.all([
      this.routeQueue.clean(5000),
      this.listQueue.clean(5000)
    ]);
    return {};
  }
}

module.exports = JobService;
