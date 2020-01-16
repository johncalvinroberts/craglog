'use strict';

const {
  getRoute: getRouteSchema,
  getRoutes: getRoutesSchema,
  createRoute: createRouteSchema,
  getCount: getRoutesCountSchema
} = require('./schemas');

module.exports = async function(fastify) {
  fastify.register(async function(fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler);
    fastify.get('/:id', { schema: getRouteSchema }, routeByIdHandler);
    fastify.get('/', { schema: getRoutesSchema }, getRoutesList);
    fastify.get('/count', { schema: getRoutesCountSchema }, getRoutesCount);
    fastify.post('/', { schema: createRouteSchema }, createRoute);
  });
};

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: ['authPreHandler', 'aclPreHandler', 'transformStringIntoObjectId']
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

async function getRoutesCount({ query }) {
  return { count: await this.routeService.getRoutesCount(query) };
}

async function createRoute(req) {
  const res = await this.routeService.createRoute(req.body);
  return res;
}
