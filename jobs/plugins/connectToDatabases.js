'use strict';
const fp = require('fastify-plugin');

module.exports = fp(async function(fastify) {
  fastify
    // `fastify-redis` makes this connection and store the database instance into `fastify.redis`
    // See https://github.com/fastify/fastify-redis
    .register(require('fastify-redis'), { url: process.env.REDIS_URL });
});
