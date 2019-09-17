'use strict';

const { search: searchSchema } = require('./schemas');

module.exports = async function(fastify) {
  fastify.get('/', { schema: searchSchema }, searchHandler);
};

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: ['authPreHandler', 'transformStringIntoObjectId']
  }
};

module.exports.autoPrefix = '/search';

async function searchHandler(req, reply) {
  const { term, type, skip = 0, limit = 20 } = req.query;
  const searchRes = await this.searchService.findTermIds(term, type);

  if (!searchRes || searchRes.length < 1) {
    await this.addScrapeTask({ term, type });
    reply.code(202);
    return {};
  }

  if (type === 'route') {
    return this.routeService.getRoutes({
      skip,
      limit,
      _id: {
        $in: searchRes.map(item => this.transformStringIntoObjectId(item))
      }
    });
  }

  if (type === 'crag') {
    return this.cragService.getCrags({
      skip,
      limit,
      _id: {
        $in: searchRes.map(item => this.transformStringIntoObjectId(item))
      }
    });
  }
  // 1. check if redis has this search term
  // 2. if has, use the ids returned from redis and find each by id
  // 3. if not has, or is still processsing, return 202 "accepted"
  return {};
}
