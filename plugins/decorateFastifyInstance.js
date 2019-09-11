'use strict';
const fp = require('fastify-plugin');
const UserService = require('../services/user/service');

module.exports = fp(async function(fastify) {
  const db = fastify.mongo.db;
  function transformStringIntoObjectId(str) {
    return new this.mongo.ObjectId(str);
  }
  const userCollection = await db.createCollection('users');
  const userService = new UserService(userCollection);
  await userService.ensureIndexes(db);
  fastify.decorate('userService', userService);

  fastify.decorate('authPreHandler', async function auth(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.decorate('transformStringIntoObjectId', transformStringIntoObjectId);
});
