'use strict';

const routeOutput = {
  type: 'object',
  required: ['_id', 'externalId', 'grade'],
  properties: {
    _id: { type: 'string' },
    externalId: { type: 'string' },
    cragId: { type: 'string' },
    grade: { type: 'string' },
    bolts: { type: 'number' },
    height: { type: 'string' },
    latitude: { type: 'string' },
    longitude: { type: 'string' },
    name: { type: 'string' }
  }
};

const getRoutes = {
  tags: ['route'],
  querystring: {
    type: 'object',
    properties: {
      skip: { type: 'number', default: 0 },
      limit: { type: 'number', default: 20 }
    },
    additionalProperties: false
  },
  response: {
    200: {
      type: 'array',
      items: routeOutput
    }
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
  getRoute,
  getRoutes,
  routeOutput
};
