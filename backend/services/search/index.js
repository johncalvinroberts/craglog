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

async function searchHandler() {}
