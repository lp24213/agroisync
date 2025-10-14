import d1 from '../db/d1Client.js';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION = 'conversations';

export async function findByUser(userId, options = {}) {
  const db = d1.db();
  const filter = { participants: userId };
  if (options.type) filter.type = options.type;
  if (options.status) filter.status = options.status;
  const items = await db.collection(COLLECTION).find(filter).toArray();
  return items;
}

export async function count(filter = {}) {
  const db = d1.db();
  return db.collection(COLLECTION).countDocuments(filter);
}

export async function findBetweenUsers(a, b, type = null) {
  const db = d1.db();
  const filter = { participants: { $in: [a, b] } };
  if (type) filter.type = type;
  return db.collection(COLLECTION).findOne(filter);
}

export async function createConversation(participants, serviceId, serviceType, title) {
  const db = d1.db();
  const id = uuidv4();
  const doc = {
    _id: id,
    type: serviceType === 'product' ? 'product' : 'freight',
    participants,
    title: title || null,
    product: serviceType === 'product' ? serviceId : null,
    freight: serviceType === 'freight' ? serviceId : null,
    messages: [],
    status: 'active',
    lastMessageAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await db.collection(COLLECTION).insertOne(doc);
  return doc;
}

export async function find(query = {}, options = {}) {
  const db = d1.db();
  const items = await db.collection(COLLECTION).find(query).toArray();
  return items;
}

export async function findOne(filter = {}) {
  const db = d1.db();
  return db.collection(COLLECTION).findOne(filter);
}

export async function findById(id) {
  const db = d1.db();
  return db.collection(COLLECTION).findOne({ _id: id });
}

export async function create(doc) {
  // doc is expected to be a conversation-like object
  const db = d1.db();
  const id = doc._id || uuidv4();
  const payload = Object.assign({}, doc, {
    _id: id,
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date()
  });
  await db.collection(COLLECTION).insertOne(payload);
  return payload;
}

export async function update(id, updateObj = {}) {
  const db = d1.db();
  const setObj = Object.assign({}, updateObj, { updatedAt: new Date() });
  await db.collection(COLLECTION).updateOne({ _id: id }, { $set: setObj });
  return findById(id);
}

export async function incrementUnread(id, delta = 1) {
  const db = d1.db();
  await db
    .collection(COLLECTION)
    .updateOne({ _id: id }, { $inc: { unreadCount: delta }, $set: { updatedAt: new Date() } });
  return findById(id);
}

export default {
  findByUser,
  count,
  findBetweenUsers,
  createConversation,
  find,
  findOne,
  findById,
  create,
  update,
  incrementUnread
};
