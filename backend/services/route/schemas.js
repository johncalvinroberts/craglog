'use strict';

const routeOutput = {
  type: 'object',
  required: ['name'],
  properties: {
    _id: { type: 'string' },
    externalId: { type: 'string' },
    bolts: { type: 'number', default: null },
    height: { type: 'string', default: null },
    latitude: { type: 'string', default: null },
    longitude: { type: 'string', default: null },
    grade: { type: 'string' },
    name: { type: 'string' },
    style: { type: 'string' },
    region: { type: 'string' },
    area: { type: 'string' },
    cragName: { type: 'string' },
    externalCragId: { type: 'string' }
  },
  additionalProperties: true
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

const getCount = {
  tags: ['route'],
  querystring: {
    type: 'object',
    properties: {},
    additionalProperties: true
  },
  response: {
    200: {
      type: 'object',
      properties: {
        count: { type: 'number' }
      }
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

const createRoute = {
  tags: ['route'],
  querystring: {
    type: 'object',
    properties: {
      term: { type: 'string' }
    },
    additionalProperties: false
  },
  body: routeOutput,
  response: {
    200: routeOutput
  }
};

module.exports = {
  getRoute,
  getRoutes,
  getCount,
  routeOutput,
  createRoute
};
