'use strict';
const path = require('path');
const Queue = require('bull');
const debug = require('debug')('app:service:jobs');

const CURRENT_SCRAPE_PAGE_KEY = 'scrape-page';
const maxPage = parseInt(process.env.MAX_PAGE);

const listProcessor = path.resolve(
  __dirname,
  '../../processors/scrapeRouteListPage.js'
);
const routeProcessor = path.resolve(
  __dirname,
  '../../processors/scrapeRoute.js'
);

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
    const listQueue = new Queue('list', {
      redis: { url: process.env.REDIS_URL }
    });

    const routeQueue = new Queue('route', {
      redis: { url: process.env.REDIS_URL }
    });

    listQueue.process(listProcessor);
    routeQueue.process(routeProcessor);

    this.redisClient = redisClient;
    this.listQueue = listQueue;
    this.routeQueue = routeQueue;
  }

  async initNextPageScrape() {
    const page = await this.getScraperPage();
    debug(`Initalizing scraper jobs, page: ${page}`);
    this.addListJob(page);
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

  async addListJob(data) {
    if (parseInt(data) >= maxPage) {
      debug('ALREADY REACHED MAX PAGE! YOU ARE DONE SCRAPING PAGES!', {
        maxPage,
        currentPage: data
      });
      return {};
    }
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
    debug('Adding scraper job', { type, data, length: data && data.length });
    if (type === 'route') {
      return this.addRouteJob(data);
    }

    if (type === 'list') {
      return this.addListJob(data);
    }
  }

  async getJobCounts() {
    const [route, list] = await Promise.all([
      this.routeQueue.getJobCounts(),
      this.listQueue.getJobCounts()
    ]);

    return { list, route };
  }

  getScraperJobs({ type, status, skip, limit }) {
    const start = parseInt(skip);
    const end = parseInt(limit) + skip - 1;
    if (type === 'route') {
      return this.routeQueue.getJobs([status], start, end);
    }

    if (type === 'list') {
      return this.listQueue.getJobs([status], start, end);
    }
  }
}

module.exports = JobService;
