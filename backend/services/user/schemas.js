'use strict';

const emailRegex =
  '/[a-z0-9._%+!$&*=^|~#%{}/-]+@([a-z0-9-]+.){1,}([a-z]{2,22})/';

const userProfileOutput = {
  type: 'object',
  required: ['_id', 'username'],
  properties: {
    _id: { type: 'string' },
    username: { type: 'string' },
    email: {
      type: 'string',
      pattern: emailRegex
    }
  }
};

const registration = {
  // This jsonschema will be used for data validation
  tags: ['user'],
  body: {
    type: 'object',
    required: ['username', 'password', 'email'],
    properties: {
      email: {
        type: 'string',
        pattern: emailRegex,
        minLength: 5,
        maxLength: 250
      },
      username: {
        type: 'string',
        minLength: 6,
        maxLength: 250
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 20
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
      username: { type: 'string', minLength: 6, maxLength: 250 },
      password: { type: 'string', minLength: 8, maxLength: 20 }
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
