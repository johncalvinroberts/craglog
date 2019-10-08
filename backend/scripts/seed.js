'use strict';

require('dotenv').config();
const MongoDb = require('mongodb');
const bcrypt = require('bcryptjs');
const MongoClient = MongoDb.MongoClient;

const adminUser = {
  username: process.env.ADMIN_USER,
  email: process.env.ADMIN_EMAIL,
  roles: ['user', 'admin']
};

const url = process.env.MONGODB_URL;
const urlTokens = /\w\/([^?]*)/g.exec(url);
const databaseName = urlTokens && urlTokens[1];

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

(async () => {
  MongoClient.connect(url, options, async function onConnect(err, client) {
    try {
      if (err) {
        throw err;
      }
      const db = client.db(databaseName);
      const userCollection = await db.createCollection('users');
      const writePayload = {
        ...adminUser,
        password: await bcrypt.hash(process.env.ADMIN_PASS, 10)
      };
      const writeRes = await userCollection.insertOne(writePayload);
      const id = writeRes.insertedId;
      console.log('Inserted admin user', {
        id,
        password: process.env.ADMIN_PASS,
        ...adminUser
      });
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
})();
