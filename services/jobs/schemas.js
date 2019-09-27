'use strict';

const addSchema = {
  tags: ['route'],
  body: {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['route', 'list'] },
      data: { type: ['array', 'string', 'number'] }
    }
  },
  response: {
    200: {
      type: 'object'
    }
  }
};

module.exports = {
  addSchema
};
