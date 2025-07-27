import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const dbName = process.env.MONGODB_DB || 'agrotm';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 5000, // 5 segundos para timeout de conexão
};

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  try {
    const client = new MongoClient(uri, options);
    await client.connect();
    const db = client.db(dbName);
    cachedClient = client;
    cachedDb = db;
    // eslint-disable-next-line no-console
    console.log(`[MongoDB] Conectado com sucesso em ${uri} (DB: ${dbName})`);
    return { client, db };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[MongoDB] Falha ao conectar:', error);
    throw new Error('Não foi possível conectar ao MongoDB. Verifique a URI, status do serviço e variáveis de ambiente.');
  }
}
