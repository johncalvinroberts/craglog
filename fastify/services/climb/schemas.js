'use strict';

const climbOutput = {
  type: 'object',
  required: ['userId', 'type'],
  properties: {
    _id: { type: 'string' },
    routeId: { type: 'string' },
    type: {
      type: 'string',
      enum: [
        'redpoint',
        'pinkpoint',
        'flash',
        'onsight',
        'ropedogging',
        'projecting',
        'toprope',
        'boulder',
        'hangboard',
        'gym'
      ]
    },
    isOutdoor: { type: 'boolean' },
    isTrad: { type: 'boolean' },
    isMultipitch: { type: 'boolean' },
    multipitchRouteIds: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    userId: { type: 'string' },
    notes: { type: 'string' }
  },
  additionalProperties: true
};

const createClimbSchema = {
  tags: ['climb'],
  body: climbOutput,
  response: {
    200: climbOutput
  }
};

const climbListHandler = {
  tags: ['climb'],
  response: {
    200: {
      type: 'array',
      items: climbOutput
    }
  }
};

module.exports = {
  createClimbSchema,
  climbListHandler
};
