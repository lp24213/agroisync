import d1 from '../db/d1Client.js';

const COLLECTION = 'users';

export async function findById(id) {
  const db = d1.db();
  return db.collection(COLLECTION).findOne({ _id: id });
}

export async function findByCognitoSub(cognitoSub) {
  const db = d1.db();
  return db.collection(COLLECTION).findOne({ cognitoSub });
}

export default { findById, findByCognitoSub };
