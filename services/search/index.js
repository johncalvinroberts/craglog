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
  const { term, skip = 0, limit = 20 } = req.query;
  const searchRes = await this.searchService.findTermIds(term);

  if (!searchRes || searchRes.length < 1) {
    await this.addScrapeTask({ term });
    reply.code(202);
    return {};
  }

  return this.routeService.getRoutes({
    skip,
    limit,
    _id: {
      $in: searchRes.map(item => this.transformStringIntoObjectId(item))
    }
  });
}
