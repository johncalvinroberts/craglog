'use strict';

const DUPLICATE_KEY_ERROR_CODE = 11000;

const errors = require('../../errors');

class RouteService {
  constructor(routeCollection) {
    this.routeCollection = routeCollection;
  }

  async createRoute(payload) {
    let writeResult;
    try {
      writeResult = await this.routeCollection.insertOne(payload);
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR_CODE) {
        throw new Error(errors.ROUTE_EXISTS);
      }
      throw e;
    }

    return writeResult.insertedId;
  }

  async createRoutes(payload) {
    let writeResult;
    try {
      writeResult = await this.routeCollection.insertMany(payload);
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR_CODE) {
        throw new Error(errors.ROUTE_EXISTS);
      }
      throw e;
    }
    return writeResult.insertedIds;
  }

  getRoute(_id) {
    return this.routeCollection.findOne({ _id });
  }

  getRoutes(ids) {
    return this.routeCollection.find({
      _id: { $in: ids }
    });
  }

  getRouteByExternalId(externalId) {
    return this.routeCollection.findOne({ externalId });
  }

  async ensureIndexes(db) {
    await db.command({
      collMod: this.routeCollection.collectionName,
      validator: {}
    });
    await this.routeCollection.createIndex({ externalId: 1 }, { unique: true });
  }
}

module.exports = RouteService;
