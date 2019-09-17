'use strict';

const {
  getRoute: getRouteSchema,
  getRoutes: getRoutesSchema,
  createRoute: createRouteSchema
} = require('./schemas');

module.exports = async function(fastify) {
  fastify.get('/:id', { schema: getRouteSchema }, routeByIdHandler);
  fastify.get('/', { schema: getRoutesSchema }, getRoutesList);
  fastify.post('/', { schema: createRouteSchema }, createRoute);
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

async function createRoute(req) {
  const res = await this.routeService.createRoute(req.body);
  if (req.query.term) {
    await this.searchService.appendIdToTerm(req.query.term, res._id);
  }
  return res;
}
