'use strict';

const DUPLICATE_KEY_ERROR_CODE = 11000;

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
        throw new Error('ROUTE_EXISTS');
      }
      throw e;
    }
    return writeResult.ops[0];
  }

  getRoute(_id) {
    return this.routeCollection.findOne({ _id });
  }

  getRoutes({ skip, limit, ...query }) {
    return this.routeCollection.find({ ...query }, { skip, limit }).toArray();
  }

  async getRoutesCount({ ...query }) {
    return this.routeCollection.count({ ...query });
  }

  getRouteByExternalId(externalId) {
    return this.routeCollection.findOne({ externalId });
  }

  async ensureIndexes(db) {
    await db.command({
      collMod: this.routeCollection.collectionName,
      validator: {}
    });
    await this.routeCollection.createIndex({ externalId: 1, name: 1 });
  }
}

module.exports = RouteService;
