'use strict';
const fp = require('fastify-plugin');
const JobService = require('../services/jobs/service');
const errors = require('../errors');

module.exports = fp(async function(fastify) {
  const jobService = new JobService(fastify.redis);

  fastify.decorate('jobService', jobService);

  fastify.setErrorHandler(function(error, request, reply) {
    const message = error.message;
    if (errors[message]) {
      reply.code(errors[message].code);
    }
    reply.send(error);
  });

  fastify.ready(err => {
    if (err) throw err;
    fastify.jobService.initNextPageScrape();
  });
});
