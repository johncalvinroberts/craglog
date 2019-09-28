'use strict';
const fp = require('fastify-plugin');

module.exports = fp(async function(fastify) {
  fastify
    // JWT is used to identify the user
    // See https://github.com/fastify/fastify-jwt
    .register(require('fastify-jwt'), {
      secret: process.env.JWT_SECRET,
      algorithms: ['RS256']
    });
});
