'use strict';

const { createClimbSchema, climbListSchema } = require('./schemas');

module.exports = async function(fastify) {
  fastify.register(async function(fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler);
    fastify.get('/', { schema: climbListSchema }, climbListHandler);
    fastify.post('/', { schema: createClimbSchema }, createClimbHandler);
    fastify.patch('/', { schema: createClimbSchema }, updateClimbHandler);
    fastify.delete('/', { schema: createClimbSchema }, deleteClimbHandler);
  });
};

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: ['authPreHandler', 'aclPreHandler', 'transformStringIntoObjectId']
  }
};

module.exports.autoPrefix = '/climbs';

const createClimbHandler = () => {};

const climbListHandler = () => {};

const updateClimbHandler = () => {};

const deleteClimbHandler = () => {};
