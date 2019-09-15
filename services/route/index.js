'use strict';

const { getRoute: getRouteSchema } = require('./schemas');

module.exports = async function(fastify) {
  fastify.get('/:id', { schema: getRouteSchema }, routeByIdHandler);
};

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: ['authPreHandler', 'transformStringIntoObjectId']
  }
};

module.exports.autoPrefix = '/route';

async function routeByIdHandler(req) {
  console.log({ req });
  return {};
}
