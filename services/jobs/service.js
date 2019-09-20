'use strict';

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
  }

  async getScraperPage() {
    const currentPage = await execRedis(this.redisClient, 'get', [
      'scrape-page'
    ]);
    return currentPage || 1;
  }

  async getScraperJobs() {}

  async getFailedJobs() {}
}

module.exports = JobService;
