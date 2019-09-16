'use strict';

const {
  getRoute: getRouteSchema,
  getRoutes: getRoutesSchema
} = require('./schemas');

module.exports = async function(fastify) {
  fastify.get('/:id', { schema: getRouteSchema }, routeByIdHandler);
  fastify.get('/', { schema: getRoutesSchema }, getRoutesList);
};

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: ['authPreHandler', 'transformStringIntoObjectId']
  }
};

module.exports.autoPrefix = '/routes';

async function routeByIdHandler(req) {
  return this.routeService.getRoute(
    this.transformStringIntoObjectId(req.params.id)
  );
}

async function getRoutesList({ query }) {
  return this.routeService.getRoutes(query);
}
