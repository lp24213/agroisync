import fs from 'fs';
import path from 'path';

const modelsDir = path.resolve(process.cwd(), 'backend', 'src', 'models');
const daosDir = path.resolve(process.cwd(), 'backend', 'src', 'daos');

if (!fs.existsSync(modelsDir)) {
  console.error('models directory not found:', modelsDir);
  process.exit(1);
}

if (!fs.existsSync(daosDir)) {
  fs.mkdirSync(daosDir, { recursive: true });
}

const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));
if (files.length === 0) {
  console.log('No model files found in', modelsDir);
  process.exit(0);
}

const makeDao = modelFile => {
  const base = path.basename(modelFile, '.js');
  const daoName = `${base}Dao`;
  const collection = base.toLowerCase();

  return `import d1Client from '../db/d1Client.js';
import Model from '../models/${base}.js';

const USE_D1 = process.env.USE_D1 === 'true';

const asId = id => d1Client ? d1Client.asObjectId(id) : id;

export default {
  async findById(id) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      return db.collection('${collection}').findOne({ id: asId(id) });
    }
    return Model.findById(id);
  },

  async findOne(filter = {}) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      return db.collection('${collection}').findOne(filter);
    }
    return Model.findOne(filter);
  },

  async find(filter = {}, opts = {}) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      const cursor = db.collection('${collection}').find(filter);
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
      return db.collection('${collection}').countDocuments(filter);
    }
    return Model.countDocuments(filter);
  },

  async create(data) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      const res = await db.collection('${collection}').insertOne(data);
      return res;
    }
    return Model.create(data);
  },

  async update(filter, update, opts = {}) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      return db.collection('${collection}').updateOne(filter, update, opts);
    }
    return Model.updateOne(filter, update, opts);
  },

  async delete(filter) {
    if (USE_D1) {
      const client = await d1Client.connect();
      const db = client.db();
      return db.collection('${collection}').deleteOne(filter);
    }
    return Model.deleteOne(filter);
  }
};
`;
};

let created = 0;
for (const f of files) {
  const content = makeDao(f);
  const base = path.basename(f, '.js');
  const out = path.join(daosDir, `${base}Dao.js`);
  if (fs.existsSync(out)) {
    console.log('Skipping existing DAO:', out);
    continue;
  }
  fs.writeFileSync(out, content, 'utf8');
  console.log('Created DAO:', out);
  created++;
}

console.log(`DAOs created: ${created}`);
