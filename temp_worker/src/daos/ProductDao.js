import d1 from '../db/d1Client.js';

const COLLECTION = 'products';

function applySortSkipLimit(items, opts = {}) {
  let arr = Array.isArray(items) ? items.slice() : [];
  if (opts.sort) {
    const [[key, dir]] = Object.entries(opts.sort).map(([k, v]) => [k, v]);
    arr.sort((a, b) => {
      if (a[key] < b[key]) return dir === -1 ? 1 : -1;
      if (a[key] > b[key]) return dir === -1 ? -1 : 1;
      return 0;
    });
  }
  const skip = parseInt(opts.skip || 0, 10) || 0;
  const limit = parseInt(opts.limit || 0, 10) || 0;
  if (skip) arr = arr.slice(skip);
  if (limit) arr = arr.slice(0, limit);
  return arr;
}

export async function find(filter = {}, opts = {}) {
  const db = d1.db();
  const cursor = db.collection(COLLECTION).find(filter || {});
  const items = await (cursor.toArray ? cursor.toArray() : cursor);
  return applySortSkipLimit(items, opts);
}

export async function count(filter = {}) {
  const db = d1.db();
  if (typeof db.collection(COLLECTION).countDocuments === 'function') {
    return db.collection(COLLECTION).countDocuments(filter || {});
  }
  // fallback
  const items = await db
    .collection(COLLECTION)
    .find(filter || {})
    .toArray();
  return (items || []).length;
}

export async function findById(id) {
  const db = d1.db();
  return db.collection(COLLECTION).findOne({ _id: id });
}

export default { findById, find, count };
