const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Simple file-backed adapter to simulate Cloudflare D1 for local PoC.
// Not intended as production-ready. Supports a minimal subset of operations
// used by the products lambda: find, findOne, insertOne, updateOne,
// deleteOne, countDocuments, createIndex (noop).

const DATA_DIR = path.resolve(__dirname, '../../data');
const FILES = {
  products: path.join(DATA_DIR, 'd1_products.json')
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readCollection(name) {
  ensureDataDir();
  const file = FILES[name];
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function writeCollection(name, data) {
  ensureDataDir();
  const file = FILES[name];
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function matchFilter(doc, filter) {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const key of Object.keys(filter)) {
    const val = filter[key];
    if (key === '$text' && typeof val === 'object') {
      // very small text search implementation
      const q = (val.$search || '').toLowerCase();
      if (!q) continue;
      const hay = (Object.values(doc).join(' ') || '').toLowerCase();
      if (!hay.includes(q)) return false;
      continue;
    }
    if (typeof val === 'object' && val !== null && '$in' in val) {
      if (!val.$in.includes(doc[key])) return false;
      continue;
    }
    if (doc[key] === undefined) return false;
    // simple equality
    if (doc[key] !== val) return false;
  }
  return true;
}

function collection(name) {
  return {
    find: filter => {
      const items = readCollection(name).filter(d => matchFilter(d, filter));
      return {
        sort: function () {
          return this;
        },
        skip: function () {
          return this;
        },
        limit: function () {
          return this;
        },
        toArray: async function () {
          return items;
        }
      };
    },
    findOne: async filter => {
      const items = readCollection(name);
      return items.find(d => matchFilter(d, filter)) || null;
    },
    insertOne: async doc => {
      const items = readCollection(name);
      const newDoc = Object.assign({}, doc);
      if (!newDoc._id) newDoc._id = uuidv4();
      items.unshift(newDoc);
      writeCollection(name, items);
      return { insertedId: newDoc._id };
    },
    updateOne: async (filter, update) => {
      const items = readCollection(name);
      const idx = items.findIndex(d => matchFilter(d, filter));
      if (idx === -1) return { matchedCount: 0, modifiedCount: 0 };
      if (update && update.$set) {
        items[idx] = Object.assign({}, items[idx], update.$set);
      }
      writeCollection(name, items);
      return { matchedCount: 1, modifiedCount: 1 };
    },
    deleteOne: async filter => {
      const items = readCollection(name);
      const idx = items.findIndex(d => matchFilter(d, filter));
      if (idx === -1) return { deletedCount: 0 };
      items.splice(idx, 1);
      writeCollection(name, items);
      return { deletedCount: 1 };
    },
    countDocuments: async filter => {
      const items = readCollection(name).filter(d => matchFilter(d, filter));
      return items.length;
    },
    createIndex: async () => {
      /* noop for PoC */
    }
  };
}

module.exports = {
  connect: async () => {
    /* noop */
  },
  db: () => ({ collection })
};
