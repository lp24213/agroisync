// Simple D1 client wrapper. Uses existing d1Adapter PoC when USE_D1=true,
// otherwise falls back to MongoDB client (kept for compatibility during migration).
import { MongoClient, ObjectId } from 'mongodb';
import logger from '../utils/logger.js';

// Não criar o MongoClient no tempo de import para evitar erros quando
// MONGODB_URI estiver vazio ou inválido. Inicializamos preguiçosamente
// na função connect().
let mongoClient = null;
let adapter = null;
let useD1 = false;

try {
  if (process.env.USE_D1 === 'true') {
    // dynamic import for PoC adapter
     
    // require used in CJS contexts; but keep dynamic import fallback
    // Use commonjs-style require via eval to avoid bundler issues
     
    adapter = eval("require('../../db/d1Adapter.js')");
    useD1 = !!adapter;
    if (useD1) logger.info('Using D1 adapter (PoC)');
  }
} catch (e) {
  logger.warn('D1 adapter not available: ' + e.message);
  adapter = null;
  useD1 = false;
}

export async function connect() {
  if (useD1 && adapter) return adapter.connect();

  // Validar MONGODB_URI antes de criar cliente
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    logger.warn('MONGODB_URI não configurada; pulando conexão com MongoDB (modo dev/fallback).');
    return null;
  }

  // Aceitar apenas esquemas válidos
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    logger.warn('MONGODB_URI parece inválida, esperando esquema mongodb:// ou mongodb+srv://. Valor: ' + uri);
    return null;
  }

  try {
    if (!mongoClient) mongoClient = new MongoClient(uri);
    return mongoClient.connect();
  } catch (err) {
    logger.error('Erro ao conectar MongoClient:', err.message || err);
    return null;
  }
}

export function db() {
  if (useD1 && adapter) return adapter.db();
  if (!mongoClient) {
    throw new Error('MongoClient not connected - MONGODB_URI não configurada ou conexão falhou');
  }
  return mongoClient.db();
}

export function asObjectId(id) {
  try {
    if (!id) return id;
    if (useD1) return id; // d1 PoC uses string ids (uuid)
    return new ObjectId(id);
  } catch (e) {
    return id;
  }
}

export default { connect, db, asObjectId };
