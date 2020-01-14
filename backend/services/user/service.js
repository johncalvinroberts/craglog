'use strict';

const bcrypt = require('bcryptjs');

const DUPLICATE_KEY_ERROR_CODE = 11000;

class UserService {
  constructor(userCollection) {
    this.userCollection = userCollection;
  }

  async register(username, givenPass) {
    let writeResult;
    try {
      const password = await bcrypt.hash(givenPass, 10);

      writeResult = await this.userCollection.insertOne({
        username,
        password,
        roles: ['user']
      });
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR_CODE) {
        throw new Error('USERNAME_IS_NOT_AVAILABLE');
      }
      throw e;
    }

    return writeResult.insertedId;
  }

  async login(username, password) {
    try {
      const users = await this.userCollection.find({ username }).toArray();
      const user = users[0];
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw null;
      }
      return user;
    } catch (error) {
      throw new Error('WRONG_CREDENTIAL');
    }
  }

  getProfile(_id) {
    return this.userCollection.findOne(
      { _id },
      { projection: { password: 0 } }
    );
  }

  async search(searchString) {
    const query = {
      username: { $regex: searchString }
    };
    const users = await this.userCollection
      .find(query, { projection: { password: 0 } })
      .limit(5)
      .toArray();
    return users;
  }

  getUsers({ skip, limit, ...query }) {
    return this.userCollection.find({ ...query }, { skip, limit }).toArray();
  }

  countUsers({ skip, limit, ...query }) {
    return this.userCollection.count({ ...query }, { skip, limit });
  }

  async ensureIndexes(db) {
    await db.command({
      collMod: this.userCollection.collectionName,
      validator: {
        username: { $type: 'string' },
        password: { $type: 'string' }
      }
    });
    await this.userCollection.createIndex({ username: 1 }, { unique: true });
  }
}

module.exports = UserService;
