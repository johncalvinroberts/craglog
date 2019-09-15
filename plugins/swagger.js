'use strict';
const fp = require('fastify-plugin');

module.exports = fp(async function(fastify) {
  fastify.register(require('fastify-swagger'), {
    routePrefix: '/documentation',
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Test swagger',
        description: 'testing the fastify swagger api',
        version: '0.1.0'
      },
      host: 'localhost',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [{ name: 'user', description: 'User related end-points' }]
    }
  });

  fastify.ready(err => {
    if (err) throw err;
    fastify.swagger();
  });
});
