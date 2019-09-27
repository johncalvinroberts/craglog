'use strict';

module.exports = async function(fastify) {
  fastify.get('/', jobListHandler);
  fastify.get('/failed', failedJobListHandler);
  fastify.post('/clear', clearJobHandler);
};

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: ['authPreHandler', 'transformStringIntoObjectId']
  }
};

module.exports.autoPrefix = '/jobs';

async function jobListHandler() {
  return this.jobService.getScraperJobs();
}

async function failedJobListHandler() {
  return this.jobService.getFailedJobs();
}

async function clearJobHandler() {
  return this.jobService.clearJobs();
}
