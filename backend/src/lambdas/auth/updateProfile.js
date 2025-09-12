const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const mongoClient = new MongoClient(process.env.MONGODB_URI);

exports.handler = async event => {
  try {
    // Configurar CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'PUT,OPTIONS',
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

    if (event.httpMethod !== 'PUT') {
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

    // Verificar se usuário existe
    const existingUser = await db.collection('users').findOne({ cognitoSub });
    if (!existingUser) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuário não encontrado'
          }
        })
      };
    }

    // Parse do body da requisição
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: {
            code: 'INVALID_JSON',
            message: 'JSON inválido no body da requisição'
          }
        })
      };
    }

    // Validar dados de entrada
    const { profile, wallets } = requestBody;

    if (!profile && !wallets) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: {
            code: 'MISSING_DATA',
            message: 'Dados de perfil ou carteiras devem ser fornecidos'
          }
        })
      };
    }

    // Preparar dados para atualização
    const updateData = {
      updatedAt: new Date()
    };

    if (profile) {
      // Validar campos do perfil
      if (profile.name && typeof profile.name === 'string') {
        updateData['profile.name'] = profile.name.trim();
      }
      if (profile.company && typeof profile.company === 'string') {
        updateData['profile.company'] = profile.company.trim();
      }
      if (profile.phone && typeof profile.phone === 'string') {
        updateData['profile.phone'] = profile.phone.trim();
      }
    }

    if (wallets) {
      // Validar endereço EVM
      if (wallets.evmAddress && typeof wallets.evmAddress === 'string') {
        // Validar formato de endereço Ethereum
        const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!ethAddressRegex.test(wallets.evmAddress)) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
              error: {
                code: 'INVALID_ADDRESS',
                message: 'Endereço Ethereum inválido'
              }
            })
          };
        }
        updateData['wallets.evmAddress'] = wallets.evmAddress.toLowerCase();
      }
    }

    // Atualizar usuário
    const result = await db.collection('users').updateOne({ cognitoSub }, { $set: updateData });

    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuário não encontrado'
          }
        })
      };
    }

    // Buscar usuário atualizado
    const updatedUser = await db.collection('users').findOne({ cognitoSub });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Perfil atualizado com sucesso',
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          role: updatedUser.role,
          profile: updatedUser.profile,
          wallets: updatedUser.wallets,
          plan: updatedUser.plan
        }
      })
    };
  } catch (error) {
    console.error('Erro na atualização de perfil:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'PUT,OPTIONS',
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
