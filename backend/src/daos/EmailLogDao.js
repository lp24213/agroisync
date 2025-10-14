import d1Client from '../db/d1Client.js';
import Model from '../models/EmailLog.js';

const USE_D1 = process.env.USE_D1 === 'true';

const asId = id => (d1Client ? d1Client.asObjectId(id) : id);

export default {
  async findById(id) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      return db.collection('emaillog').findOne({ id: asId(id) });
    }
    return Model.findById(id);
  },

  async findOne(filter = {}) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      return db.collection('emaillog').findOne(filter);
    }
    return Model.findOne(filter);
  },

  async find(filter = {}, opts = {}) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      const cursor = db.collection('emaillog').find(filter);
      if (opts.sort) cursor.sort(opts.sort);
      if (opts.skip) cursor.skip(opts.skip);
      if (opts.limit) cursor.limit(opts.limit);
      return cursor.toArray();
    }
    return Model.find(filter).setOptions(opts).lean();
  },

  async count(filter = {}) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      return db.collection('emaillog').countDocuments(filter);
    }
    return Model.countDocuments(filter);
  },

  async create(data) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      const res = await db.collection('emaillog').insertOne(data);
      return res;
    }
    return Model.create(data);
  },

  async update(filter, update, opts = {}) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      return db.collection('emaillog').updateOne(filter, update, opts);
    }
    return Model.updateOne(filter, update, opts);
  },

  async delete(filter) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      return db.collection('emaillog').deleteOne(filter);
    }
    return Model.deleteOne(filter);
  }
};
