'use strict';

const {
  login: loginSchema,
  registration: registrationSchema,
  getProfile: getProfileSchema,
  search: searchSchema,
  me: meSchema
} = require('./schemas');

const errors = require('../../errors');

module.exports = async function(fastify) {
  // Route registration
  // fastify.<method>(<path>, <schema>, <handler>)
  // schema is used to validate the input and serialize the output

  // Unlogged APIs
  fastify.post('/login', { schema: loginSchema }, loginHandler);
  fastify.post('/register', { schema: registrationSchema }, registerHandler);
  // Logged APIs
  fastify.register(async function(fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler);
    fastify.get('/me', { schema: meSchema }, meHandler);
    fastify.get('/:userId', { schema: getProfileSchema }, userHandler);
    fastify.get('/search', { schema: searchSchema }, searchHandler);
  });
};

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: [
      'authPreHandler',
      'userService',
      'jwt',
      'transformStringIntoObjectId'
    ]
  }
};

module.exports.autoPrefix = '/users';

async function loginHandler(req) {
  const { username, password } = req.body;
  const user = await this.userService.login(username, password);
  delete user.password;
  return { jwt: this.jwt.sign(user) };
}

async function registerHandler(req) {
  const { username, password } = req.body;
  const userId = await this.userService.register(username, password);
  return { userId };
}

async function meHandler(req) {
  const userId = req.user._id;
  return this.userService.getProfile(this.transformStringIntoObjectId(userId));
}

async function userHandler(req) {
  return this.userService.getProfile(
    this.transformStringIntoObjectId(req.params.userId)
  );
}

async function searchHandler(req) {
  const { search } = req.query;
  return this.userService.search(search);
}
