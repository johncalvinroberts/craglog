'use strict';
const { routeOutput } = require('../route/schemas');

const search = {
  tags: ['search'],
  querystring: {
    type: 'object',
    required: ['term'],
    properties: {
      term: { type: 'string' }
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
