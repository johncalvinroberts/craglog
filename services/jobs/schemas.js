'use strict';

const addSchema = {
  tags: ['job'],
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

const listSchema = {
  tags: ['job'],
  querystring: {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['route', 'list'], default: 'route' },
      skip: { type: 'number', default: 0 },
      limit: { type: 'number', default: 100 },
      status: {
        type: 'string',
        enum: ['waiting', 'active', 'completed', 'failed', 'delayed'],
        default: 'active'
      }
    },
    additionalProperties: false
  }
};

const countSchema = {
  tags: ['job']
};

const commandQueueSchema = {
  tags: ['job'],
  querystring: {
    type: 'object',
    required: ['type', 'command'],
    properties: {
      type: { type: 'string', enum: ['route', 'list'], default: 'route' },
      command: { type: 'string', enum: ['pause', 'resume'] }
    }
  }
};

module.exports = {
  addSchema,
  listSchema,
  countSchema,
  commandQueueSchema
};
