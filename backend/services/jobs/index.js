'use strict';

const {
  addSchema: addJobSchema,
  listSchema: jobListSchema,
  countSchema: jobCountSchema,
  queueCommandSchema,
  jobCommandSchema,
  findJobSchema
} = require('./schemas');

module.exports = async function(fastify) {
  fastify.register(async function(fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler);
    fastify.addHook('preHandler', async function(request, reply) {
      fastify.aclPreHandler(request, reply, ['admin']);
    });
    fastify.get('/', { schema: jobListSchema }, jobListHandler);
    fastify.post('/', { schema: addJobSchema }, addHandler);
    fastify.get('/:jobId', { schema: findJobSchema }, findJobHandler);
    fastify.patch('/:jobId', { schema: jobCommandSchema }, jobCommandHandler);
    fastify.get('/count', { schema: jobCountSchema }, jobCountHandler);
    fastify.patch(
      '/queue',
      { schema: queueCommandSchema },
      queueCommandHandler
    );
  });
};

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: ['authPreHandler', 'aclPreHandler', 'transformStringIntoObjectId']
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

function queueCommandHandler({ body }) {
  return this.jobService.commandQueue(body);
}

function jobCommandHandler({ body, params }) {
  const { jobId } = params;
  return this.jobService.commandJob({ ...body, jobId });
}

function findJobHandler({ params, query }) {
  const { type } = query;
  return this.jobService.findJob({ jobId: params.id, type });
}
