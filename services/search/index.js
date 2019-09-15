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
  const { term, type } = req.query;
  const searchRes = await this.searchService.findTermIds(term, type);
  if (!searchRes) {
    await this.addScrapeTask({ term, type });
    reply.code(202);
    return {};
  }

  console.log({ searchRes });

  // 1. check if redis has this search term
  // 2. if has, use the ids returned from redis and find each by id
  // 3. if not has, or is still processsing, return 202 "accepted"
  return {};
}
