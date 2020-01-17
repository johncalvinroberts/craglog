'use strict';

module.exports = async function(fastify) {
  fastify.get('/health', () => {
    return { success: true };
  });
};
