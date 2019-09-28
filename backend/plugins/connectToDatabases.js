'use strict';
const fp = require('fastify-plugin');

module.exports = fp(async function(fastify) {
  fastify
    // `fastify-mongodb` makes this connection and store the database instance into `fastify.mongo.db`
    // See https://github.com/fastify/fastify-mongodb
    .register(require('fastify-mongodb'), {
      url: process.env.MONGODB_URL,
      useNewUrlParser: true
    })
    // `fastify-redis` makes this connection and store the database instance into `fastify.redis`
    // See https://github.com/fastify/fastify-redis
    .register(require('fastify-redis'), { url: process.env.REDIS_URL });
});
