'use strict';

const {
  addSchema: addJobSchema,
  listSchema: jobListSchema,
  countSchema: jobCountSchema
} = require('./schemas');

module.exports = async function(fastify) {
  fastify.get('/', { schema: jobListSchema }, jobListHandler);
  fastify.get('/count', { schema: jobCountSchema }, jobCountHandler);
  fastify.post('/add', { schema: addJobSchema }, addHandler);
};

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: ['authPreHandler', 'transformStringIntoObjectId']
  }
};

module.exports.autoPrefix = '/jobs';

async function jobListHandler({ query }) {
  return this.jobService.getScraperJobs(query);
}

async function jobCountHandler() {
  return this.jobService.getJobCounts();
}

async function addHandler(req) {
  return this.jobService.addJob(req.body);
}
