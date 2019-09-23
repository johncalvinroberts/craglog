'use strict';
const fp = require('fastify-plugin');
const UserService = require('../services/user/service');
const RouteService = require('../services/route/service');
const SearchService = require('../services/search/service');
const JobService = require('../services/jobs/service');

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

  fastify.decorate('userService', userService);
  fastify.decorate('routeService', routeService);
  fastify.decorate('searchService', searchService);
  fastify.decorate('jobService', jobService);

  fastify.decorate('authPreHandler', async function auth(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorate('transformStringIntoObjectId', transformStringIntoObjectId);

  fastify.ready(err => {
    if (err) throw err;
    fastify.jobService.initScraperJobs();
  });
});
