'use strict';
const path = require('path');
const Queue = require('bull');
const debug = require('debug')('app:service:jobs');

const CURRENT_SCRAPE_PAGE_KEY = 'scrape-page';
const INITIAL_PAGE = parseInt(process.env.INITIAL_PAGE);
const MAX_PAGE = parseInt(process.env.MAX_PAGE);
const LIST_SCRAPE_CONCURRENCY = parseInt(process.env.LIST_SCRAPE_CONCURRENCY);
const ROUTE_SCRAPE_CONCURRENCY = parseInt(process.env.ROUTE_SCRAPE_CONCURRENCY);

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

    listQueue.process(LIST_SCRAPE_CONCURRENCY, listProcessor);
    routeQueue.process(ROUTE_SCRAPE_CONCURRENCY, routeProcessor);

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
      await execRedis(this.redisClient, 'set', [
        CURRENT_SCRAPE_PAGE_KEY,
        INITIAL_PAGE
      ]);
      return this.getScraperPage();
    }

    return currentPage;
  }

  async addListJob(data) {
    if (parseInt(data) >= MAX_PAGE) {
      debug('ALREADY REACHED MAX PAGE! YOU ARE DONE SCRAPING PAGES!', {
        MAX_PAGE,
        currentPage: data
      });
      return { success: true };
    }
    if (Array.isArray(data)) {
      for (const item of data) {
        await this.addListJob(item);
      }
      return { success: true };
    }

    if (!data) {
      await execRedis(this.redisClient, 'incr', [CURRENT_SCRAPE_PAGE_KEY]);
      await this.initNextPageScrape();
    } else {
      this.listQueue.add({ page: data }, { jobId: data });
    }
    return { success: true };
  }

  async addRouteJob(data) {
    if (Array.isArray(data)) {
      for (const item of data) {
        await this.addRouteJob(item);
      }
      return { success: true };
    }
    const jobId = data.substring(data.lastIndexOf('/') + 1);
    this.routeQueue.add({ href: data }, { jobId });
    return { success: true };
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

  async commandQueue({ type, command }) {
    if (type === 'route') {
      await this.routeQueue[command]();
    }

    if (type === 'list') {
      await this.listQueue[command]();
    }
    return { success: true };
  }

  async commandJob({ type, command, jobId }) {
    if (type === 'route') {
      const job = await this.routeQueue.getJob(jobId);
      await job[command]();
    }

    if (type === 'list') {
      const job = await this.listQueue.getJob(jobId);
      await job[command]();
    }
    return { success: true };
  }

  async findJob({ jobId, type }) {
    const works = [];
    if (type === 'route') {
      works.push(this.routeQueue.getJob(jobId));
      works.push(this.routeQueue.getJobLogs(jobId));
    }

    if (type === 'list') {
      works.push(this.listQueue.getJob(jobId));
      works.push(this.listQueue.getJobLogs(jobId));
    }
    const [job, logs] = await Promise.all(works);
    return { ...job, logs };
  }
}

module.exports = JobService;
