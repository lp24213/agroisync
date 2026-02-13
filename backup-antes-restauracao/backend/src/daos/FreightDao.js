import d1 from '../db/d1Client.js';

const COLLECTION = 'shipments';

export async function findById(id) {
  const db = d1.db();
  return db.collection(COLLECTION).findOne({ _id: id });
}

export default { findById };
