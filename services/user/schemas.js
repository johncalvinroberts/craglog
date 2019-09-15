'use strict';

const userProfileOutput = {
  type: 'object',
  required: ['_id', 'username'],
  properties: {
    _id: { type: 'string' },
    username: { type: 'string' }
  }
};

const registration = {
  // This jsonschema will be used for data validation
  tags: ['user'],
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    additionalProperties: false
  },
  response: {
    // The 200 body response is described
    // by the following schema
    200: {
      type: 'object',
      required: ['userId'],
      properties: {
        userId: { type: 'string' }
      },
      additionalProperties: false
    }
  }
};

const login = {
  tags: ['user'],
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    },
    additionalProperties: false
  },
  response: {
    200: {
      type: 'object',
      require: ['jwt'],
      properties: {
        jwt: { type: 'string' }
      },
      additionalProperties: false
    }
  }
};

const search = {
  tags: ['user'],
  querystring: {
    type: 'object',
    required: ['search'],
    properties: {
      search: { type: 'string' }
    },
    additionalProperties: false
  },
  response: {
    200: {
      type: 'array',
      items: userProfileOutput
    }
  }
};

const me = {
  tags: ['user'],
  response: {
    200: userProfileOutput
  }
};

const getProfile = {
  tags: ['user'],
  params: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}'
      }
    }
  },
  response: {
    200: userProfileOutput
  }
};

module.exports = {
  registration,
  login,
  search,
  me,
  getProfile
};
