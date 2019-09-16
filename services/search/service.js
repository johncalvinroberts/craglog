'use strict';

function execRedis(redisClient, method, args) {
  return new Promise(function(resolve, reject) {
    args.push(function(err, result) {
      if (err) return reject(err);
      resolve(result);
    });
    redisClient[method].apply(redisClient, args);
  });
}

function checkTermExists(redisClient, term) {
  return execRedis(redisClient, 'exists', [term]);
}

async function getTermIds(redisClient, term) {
  const res = await execRedis(redisClient, 'get', [term]);
  return res && res.split(',');
}

async function setTermIds(redisClient, term, ids) {
  return execRedis(redisClient, 'set', [term, ids]);
}

class SearchService {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  async findTermIds(term) {
    return getTermIds(this.redisClient, term);
  }

  async setTermIds(term, ids) {
    return setTermIds(this.redisClient, term, ids);
  }
}

module.exports = SearchService;
