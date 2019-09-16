'use strict';
const { routeOutput } = require('../route/schemas');

const search = {
  tags: ['search'],
  querystring: {
    type: 'object',
    required: ['term', 'type'],
    properties: {
      term: { type: 'string' },
      type: { type: 'string', enum: ['crag', 'route'] }
    },
    additionalProperties: false
  },
  response: {
    200: {
      type: 'array',
      items: routeOutput
    },
    202: {
      type: 'object'
    }
  }
};

module.exports = {
  search
};
