const { DynamoDB } = require('aws-sdk');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const dynamodb = new DynamoDB.DocumentClient();
const mongoClient = new MongoClient(process.env.MONGODB_URI);

const ADMIN_EMAIL = 'luispaulodeoliveira@agrotm.com.br';

exports.handler = async event => {
  try {
    // Verificar se é uma requisição HTTP
    if (!event.httpMethod) {
      throw new Error('Método HTTP não especificado');
    }

    // Configurar CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Credentials': true
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'OK' })
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: 'Método não permitido'
          }
        })
      };
    }

    // Verificar autorização
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Token de autorização não fornecido'
          }
        })
      };
    }

    const token = authHeader.substring(7);

    // Verificar JWT do Cognito
    let decodedToken;
    try {
      decodedToken = jwt.decode(token);
      if (!decodedToken) {
        throw new Error('Token inválido');
      }
    } catch (error) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          error: {
            code: 'INVALID_TOKEN',
            message: 'Token inválido'
          }
        })
      };
    }

    const cognitoSub = decodedToken.sub;
    const { email } = decodedToken;

    if (!cognitoSub || !email) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: {
            code: 'INVALID_TOKEN_DATA',
            message: 'Dados do token inválidos'
          }
        })
      };
    }

    // Conectar ao MongoDB
    await mongoClient.connect();
    const db = mongoClient.db();

    // Verificar se usuário já existe
    const existingUser = await db.collection('users').findOne({
      $or: [{ cognitoSub }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      return {
        statusCode: 409,
        headers: corsHeaders,
        body: JSON.stringify({
          error: {
            code: 'USER_ALREADY_EXISTS',
            message: 'Usuário já existe'
          }
        })
      };
    }

    // Determinar role baseado no email
    const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

    // Criar usuário
    const newUser = {
      cognitoSub,
      email: email.toLowerCase(),
      role,
      profile: {
        name: decodedToken.name || '',
        company: '',
        phone: ''
      },
      plan: {
        type: null,
        status: 'inactive',
        limitAds: 0,
        limitShipments: null,
        expiresAt: null
      },
      wallets: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Inserir usuário
    const result = await db.collection('users').insertOne(newUser);

    // Criar índices se não existirem
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ cognitoSub: 1 }, { unique: true });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Usuário criado com sucesso',
        user: {
          id: result.insertedId,
          email: newUser.email,
          role: newUser.role,
          plan: newUser.plan
        }
      })
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro no bootstrap:', error);
    }
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro interno do servidor'
        }
      })
    };
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
};
