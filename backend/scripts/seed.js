'use strict';
const fastify = require('fastify')();
const app = require('../app');

const adminUser = {
  username: 'webmaster',
  password: 'ok*&Gh^%efay',
  email: 'john.calvin.roberts@gmail.com',
  roles: ['user', 'admin']
};

(async () => {
  await app(fastify, {}, () => {});
  await fastify.ready();
  console.loog(fastify.userCollection);
})();
