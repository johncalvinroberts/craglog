'use strict';
const path = require('path');
const Queue = require('bull');
const debug = require('debug')('app:service:jobs');

const CURRENT_SCRAPE_PAGE_KEY = 'scrape-page';
const FAILED_LIST_KEY = 'failed-pages';
const FAILED_ROUTES_KEY = 'failed-routes';

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
    function handleListComplete(...args) {
      return this.handleCompleteList(args);
    }
    listQueue.on('completed', handleListComplete);
    listQueue.on('error', this.handleListError);
    routeQueue.on('completed', this.handleCompleteRoute);
    routeQueue.on('error', this.handleRouteError);

    this.listQueue = listQueue;
    this.routeQueue = routeQueue;
  }
  async initScraperJobs() {
    const page = await this.getScraperPage();
    debug(`Initalizing scraper jobs, page: ${page}`);
    this.listQueue.add({ page });
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
      this.listQueue.getJobs(),
      this.routeQueue.getJobs()
    ]);
    return { listJobs, routeJobs };
  }

  async handleCompleteList(job, result) {
    debug('Completed scraper list job', { job });
    for (const href of result) {
      this.routeQueue.add({ href });
    }
    const currentPage = await this.getScraperPage();
    const newPage = currentPage + 1;
    await execRedis(this.redisClient, 'set', [
      CURRENT_SCRAPE_PAGE_KEY,
      newPage
    ]);

    this.listQueue.add({ page: newPage });
  }

  async handleListError(error) {
    debug('Failed list job', { error });
  }

  async handleCompleteRoute(job, result) {
    debug('Completed scraper route job', { job, result });
  }

  async handleRouteError(error) {
    debug('Failed route job', { error });
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
