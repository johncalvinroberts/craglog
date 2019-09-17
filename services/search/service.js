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

async function getTermIds(redisClient, term) {
  return execRedis(redisClient, 'smembers', [term]);
}

async function appendIdToTerm(redisClient, term, id) {
  return execRedis(redisClient, 'sadd', [term, id]);
}

class SearchService {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  async findTermIds(term) {
    return getTermIds(this.redisClient, term);
  }

  async appendIdToTerm(term, id) {
    return appendIdToTerm(this.redisClient, term, id);
  }
}

module.exports = SearchService;
