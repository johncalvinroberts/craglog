'use strict';

const routeOutput = {
  type: 'object',
  required: ['_id', 'externalId', 'grade'],
  properties: {
    _id: { type: 'string' },
    externalId: { type: 'string' },
    cragId: { type: 'string' },
    grade: { type: 'string' }
  }
};

const getRoute = {
  tags: ['route'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}'
      }
    }
  },
  response: {
    200: routeOutput
  }
};

module.exports = {
  getRoute
};
