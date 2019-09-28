'use strict';

const {
  addSchema: addJobSchema,
  listSchema: jobListSchema,
  countSchema: jobCountSchema,
  commandQueueSchema
} = require('./schemas');

module.exports = async function(fastify) {
  fastify.get('/', { schema: jobListSchema }, jobListHandler);
  fastify.get('/count', { schema: jobCountSchema }, jobCountHandler);
  fastify.post('/add', { schema: addJobSchema }, addHandler);
  fastify.post('/queue', { schema: commandQueueSchema }, queueCommandHandler);
  fastify.post('/:jobId/retry', retryHandler);
};

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: ['authPreHandler', 'transformStringIntoObjectId']
  }
};

module.exports.autoPrefix = '/jobs';

function jobListHandler({ query }) {
  return this.jobService.getScraperJobs(query);
}

function jobCountHandler() {
  return this.jobService.getJobCounts();
}

function addHandler(req) {
  return this.jobService.addJob(req.body);
}

function queueCommandHandler({ query }) {
  return this.jobService.commandQueue(query);
}

function retryHandler(req) {}
