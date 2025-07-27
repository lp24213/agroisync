import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!uri) {
    return res.status(500).json({
      status: 'error',
      message: 'MONGODB_URI não definida em .env.local. Crie o arquivo e reinicie o servidor.',
      hint: 'Exemplo de uso: MONGODB_URI=mongodb://localhost:27017/'
    });
  }
  if (!dbName) {
    return res.status(500).json({
      status: 'error',
      message: 'MONGODB_DB não definida em .env.local. Crie o arquivo e reinicie o servidor.',
      hint: 'Exemplo de uso: MONGODB_DB=agrotm'
    });
  }
  try {
    const { db } = await connectToDatabase();
    const collections = await db.listCollections().toArray();
    res.status(200).json({
      status: 'ok',
      message: 'Conexão com MongoDB bem-sucedida!',
      collections,
      env: {
        MONGODB_URI: uri ? 'definida' : 'não definida',
        MONGODB_DB: dbName ? 'definida' : 'não definida',
      }
    });
  } catch (error) {
    // Log detalhado no console do servidor
    // eslint-disable-next-line no-console
    console.error('Erro ao conectar no MongoDB:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao conectar no MongoDB.',
      error: (error as Error).message,
      env: {
        MONGODB_URI: uri ? 'definida' : 'não definida',
        MONGODB_DB: dbName ? 'definida' : 'não definida',
      }
    });
  }
}
