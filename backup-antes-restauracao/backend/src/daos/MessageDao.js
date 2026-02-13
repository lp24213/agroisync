import d1 from '../db/d1Client.js';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION = 'messages';

export async function createMessage({ senderId, content, type = 'text', related }) {
  const db = d1.db();
  const id = uuidv4();
  const doc = {
    _id: id,
    senderId,
    conversationId: related || null,
    content,
    type,
    related: related || null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await db.collection(COLLECTION).insertOne(doc);
  return doc;
}

export async function find(filter = {}, options = {}) {
  const db = d1.db();
  const cursor = db.collection(COLLECTION).find(filter);
  if (options.sort) cursor.sort(options.sort);
  if (options.skip) cursor.skip(options.skip);
  if (options.limit) cursor.limit(options.limit);
  return cursor.toArray();
}

export async function count(filter = {}) {
  const db = d1.db();
  return db.collection(COLLECTION).countDocuments(filter);
}

export default { createMessage, find, count };
