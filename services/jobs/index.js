'use strict';

const { addSchema: addJobSchema } = require('./schemas');

module.exports = async function(fastify) {
  fastify.get('/', jobListHandler);
  fastify.get('/failed', failedJobListHandler);
  fastify.post('/add', { schema: addJobSchema }, addHandler);
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

async function addHandler(req) {
  return this.jobService.addJob(req.body);
}
