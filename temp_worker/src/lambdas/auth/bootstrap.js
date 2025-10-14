const { DynamoDB } = require('aws-sdk');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const logger = require('../../utils/logger.js');
const dynamodb = new DynamoDB.DocumentClient();
const d1Client = require('../../db/d1Client.js');

const ADMIN_EMAIL = 'luispaulodeoliveira@agrotm.com.br';

exports.handler = async event => {
  try {
    // Verificar se Ã© uma requisiÃ§Ã£o HTTP
    if (!event.httpMethod) {
      throw new Error('MÃ©todo HTTP nÃ£o especificado');
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
            message: 'MÃ©todo nÃ£o permitido'
          }
        })
      };
    }

    // Verificar autorizaÃ§Ã£o
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Token de autorizaÃ§Ã£o nÃ£o fornecido'
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
        throw new Error('Token invÃ¡lido');
      }
    } catch (error) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          error: {
            code: 'INVALID_TOKEN',
            message: 'Token invÃ¡lido'
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
            message: 'Dados do token invÃ¡lidos'
          }
        })
      };
    }

    // Conectar via d1Client wrapper
    await d1Client.connect();
    const db = d1Client.db();

    // Verificar se usuÃ¡rio jÃ¡ existe
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
            message: 'UsuÃ¡rio jÃ¡ existe'
          }
        })
      };
    }

    // Determinar role baseado no email
    const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

    // Criar usuÃ¡rio
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

    // Inserir usuÃ¡rio
    const result = await db.collection('users').insertOne(newUser);

    // Criar Ã­ndices se nÃ£o existirem
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ cognitoSub: 1 }, { unique: true });

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'UsuÃ¡rio criado com sucesso',
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
      logger.error('Erro no bootstrap:', error);
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
  }
};
