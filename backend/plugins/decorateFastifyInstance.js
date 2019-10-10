'use strict';
const fp = require('fastify-plugin');
const UserService = require('../services/user/service');
const RouteService = require('../services/route/service');
const SearchService = require('../services/search/service');
const JobService = require('../services/jobs/service');
const errors = require('../errors');

module.exports = fp(async function(fastify) {
  const db = fastify.mongo.db;

  function transformStringIntoObjectId(str) {
    return new this.mongo.ObjectId(str);
  }

  const userCollection = await db.createCollection('users');
  const routeCollection = await db.createCollection('routes');
  const userService = new UserService(userCollection);
  const routeService = new RouteService(routeCollection);
  const searchService = new SearchService(fastify.redis);
  const jobService = new JobService(fastify.redis);

  await userService.ensureIndexes(db);
  await routeService.ensureIndexes(db);

  fastify.decorate('jobService', jobService);
  fastify.decorate('userService', userService);
  fastify.decorate('routeService', routeService);
  fastify.decorate('searchService', searchService);

  fastify.decorate('authPreHandler', async function auth(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorate('aclPreHandler', async function acl(
    request,
    reply,
    rolesNeeded
  ) {
    try {
      const hasRoles = rolesNeeded.every(role =>
        request.user.roles.includes(role)
      );

      if (!hasRoles) {
        throw new Error('FORBIDDEN');
      }
    } catch (error) {
      reply.code(errors[error.message].code);
      reply.send(error);
    }
  });

  fastify.decorate('transformStringIntoObjectId', transformStringIntoObjectId);

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
