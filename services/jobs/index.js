'use strict';

module.exports = async function(fastify) {
  fastify.get('/', jobListHandler);
};

module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: ['authPreHandler', 'transformStringIntoObjectId']
  }
};

module.exports.autoPrefix = '/jobs';

async function jobListHandler(req) {
  console.log(req);
}
