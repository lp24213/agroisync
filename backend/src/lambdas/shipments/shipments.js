const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const mongoClient = new MongoClient(process.env.MONGODB_URI);

// Função auxiliar para verificar autorização
const verifyAuth = event => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'UNAUTHORIZED', message: 'Token de autorização não fornecido' };
  }

  const token = authHeader.substring(7);
  let decodedToken;

  try {
    decodedToken = jwt.decode(token);
    if (!decodedToken) {
      return { error: 'INVALID_TOKEN', message: 'Token inválido' };
    }
  } catch (error) {
    return { error: 'INVALID_TOKEN', message: 'Token inválido' };
  }

  const cognitoSub = decodedToken.sub;
  const { email } = decodedToken;

  if (!cognitoSub || !email) {
    return { error: 'INVALID_TOKEN_DATA', message: 'Dados do token inválidos' };
  }

  return { cognitoSub, email };
};

// Função para verificar limites do plano para fretes
const checkFreightLimits = async (db, cognitoSub, operation) => {
  const user = await db.collection('users').findOne({ cognitoSub });
  if (!user) {
    return { error: 'USER_NOT_FOUND', message: 'Usuário não encontrado' };
  }

  const { plan } = user;

  if (operation === 'create') {
    // Verificar se pode criar mais fretes
    if (plan.status !== 'active') {
      return {
        error: 'PLAN_INACTIVE',
        message: 'Plano inativo. Ative um plano para criar fretes.'
      };
    }

    if (plan.type === 'fretes_avancado') {
      // Plano Fretes Avançado: máximo 30 fretes/mês
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const currentFreights = await db.collection('shipments').countDocuments({
        ownerId: cognitoSub,
        createdAt: { $gte: currentMonth }
      });

      if (currentFreights >= 30) {
        return {
          error: 'LIMIT_EXCEEDED',
          message: 'Limite de 30 fretes/mês atingido para o plano Fretes Avançado.'
        };
      }
    }
    // Planos básicos: ilimitado
  }

  return { user, plan };
};

exports.handler = async event => {
  try {
    // Configurar CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
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

    // Conectar ao MongoDB
    await mongoClient.connect();
    const db = mongoClient.db();

    // GET /shipments - Fretes do usuário
    if (event.httpMethod === 'GET') {
      const auth = verifyAuth(event);
      if (auth.error) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: auth.error, message: auth.message }
          })
        };
      }

      const { queryStringParameters } = event;
      const { owner, id } = queryStringParameters || {};

      if (id) {
        // Buscar frete específico por ID
        if (!ObjectId.isValid(id)) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
              error: { code: 'INVALID_ID', message: 'ID inválido' }
            })
          };
        }

        const shipment = await db.collection('shipments').findOne({ _id: new ObjectId(id) });
        if (!shipment) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({
              error: { code: 'SHIPMENT_NOT_FOUND', message: 'Frete não encontrado' }
            })
          };
        }

        // Se não for o dono, retornar apenas dados públicos
        if (shipment.ownerId !== auth.cognitoSub) {
          const publicShipment = {
            _id: shipment._id,
            public: shipment.public,
            createdAt: shipment.createdAt,
            updatedAt: shipment.updatedAt
          };
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ shipment: publicShipment })
          };
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ shipment })
        };
      }

      // Buscar fretes do usuário
      const filter = owner === 'me' ? { ownerId: auth.cognitoSub } : {};
      const shipments = await db
        .collection('shipments')
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ shipments })
      };
    }

    // POST /shipments - Criar frete
    if (event.httpMethod === 'POST') {
      const auth = verifyAuth(event);
      if (auth.error) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: auth.error, message: auth.message }
          })
        };
      }

      // Verificar limites do plano
      const planCheck = await checkFreightLimits(db, auth.cognitoSub, 'create');
      if (planCheck.error) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: planCheck.error, message: planCheck.message }
          })
        };
      }

      // Parse do body
      let requestBody;
      try {
        requestBody = JSON.parse(event.body);
      } catch (error) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'INVALID_JSON', message: 'JSON inválido' }
          })
        };
      }

      // Validar dados obrigatórios
      const { public: publicData, private: privateData } = requestBody;

      if (
        !publicData ||
        !publicData.routeFrom ||
        !publicData.routeTo ||
        !publicData.estimatedDays
      ) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: {
              code: 'MISSING_FIELDS',
              message: 'Dados públicos obrigatórios: rota de origem, destino e dias estimados'
            }
          })
        };
      }

      if (!privateData || !privateData.freightPrice || !privateData.weightKg) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: {
              code: 'MISSING_FIELDS',
              message: 'Dados privados obrigatórios: preço do frete e peso'
            }
          })
        };
      }

      // Criar frete
      const newShipment = {
        ownerId: auth.cognitoSub,
        public: {
          routeFrom: publicData.routeFrom.trim(),
          routeTo: publicData.routeTo.trim(),
          estimatedDays: parseInt(publicData.estimatedDays, 10)
        },
        private: {
          freightPrice: parseFloat(privateData.freightPrice),
          weightKg: parseFloat(privateData.weightKg),
          nfNumber: privateData.nfNumber ? privateData.nfNumber.trim() : '',
          notes: privateData.notes ? privateData.notes.trim() : ''
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('shipments').insertOne(newShipment);

      // Criar índices se não existirem
      await db.collection('shipments').createIndex({ ownerId: 1 });

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Frete criado com sucesso',
          shipment: {
            id: result.insertedId,
            ...newShipment
          }
        })
      };
    }

    // PUT /shipments/:id - Atualizar frete
    if (event.httpMethod === 'PUT') {
      const auth = verifyAuth(event);
      if (auth.error) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: auth.error, message: auth.message }
          })
        };
      }

      // Extrair ID da URL
      const pathParts = event.path.split('/');
      const id = pathParts[pathParts.length - 1];

      if (!ObjectId.isValid(id)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'INVALID_ID', message: 'ID inválido' }
          })
        };
      }

      // Verificar se o frete existe e pertence ao usuário
      const existingShipment = await db.collection('shipments').findOne({
        _id: new ObjectId(id),
        ownerId: auth.cognitoSub
      });

      if (!existingShipment) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'SHIPMENT_NOT_FOUND', message: 'Frete não encontrado' }
          })
        };
      }

      // Parse do body
      let requestBody;
      try {
        requestBody = JSON.parse(event.body);
      } catch (error) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'INVALID_JSON', message: 'JSON inválido' }
          })
        };
      }

      // Preparar dados para atualização
      const updateData = {
        updatedAt: new Date()
      };

      if (requestBody.public) {
        if (requestBody.public.routeFrom) {
        {updateData['public.routeFrom'] = requestBody.public.routeFrom.trim();}
        if (requestBody.public.routeTo) {
        {updateData['public.routeTo'] = requestBody.public.routeTo.trim();}
        if (requestBody.public.estimatedDays) {
        {updateData['public.estimatedDays'] = parseInt(requestBody.public.estimatedDays, 10);}
      }

      if (requestBody.private) {
        if (requestBody.private.freightPrice) {
        {updateData['private.freightPrice'] = parseFloat(requestBody.private.freightPrice);}
        if (requestBody.private.weightKg) {
        {updateData['private.weightKg'] = parseFloat(requestBody.private.weightKg);}
        if (requestBody.private.nfNumber !== undefined) {
        {updateData['private.nfNumber'] = requestBody.private.nfNumber
          ? requestBody.private.nfNumber.trim()
          : '';
        }
        if (requestBody.private.notes !== undefined) {
        {updateData['private.notes'] = requestBody.private.notes
          ? requestBody.private.notes.trim()
          : '';
        }
      }

      // Atualizar frete
      const result = await db
        .collection('shipments')
        .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

      if (result.matchedCount === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'SHIPMENT_NOT_FOUND', message: 'Frete não encontrado' }
          })
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Frete atualizado com sucesso'
        })
      };
    }

    // DELETE /shipments/:id - Deletar frete
    if (event.httpMethod === 'DELETE') {
      const auth = verifyAuth(event);
      if (auth.error) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: auth.error, message: auth.message }
          })
        };
      }

      // Extrair ID da URL
      const pathParts = event.path.split('/');
      const id = pathParts[pathParts.length - 1];

      if (!ObjectId.isValid(id)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'INVALID_ID', message: 'ID inválido' }
          })
        };
      }

      // Verificar se o frete existe e pertence ao usuário
      const existingShipment = await db.collection('shipments').findOne({
        _id: new ObjectId(id),
        ownerId: auth.cognitoSub
      });

      if (!existingShipment) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'SHIPMENT_NOT_FOUND', message: 'Frete não encontrado' }
          })
        };
      }

      // Deletar frete
      const result = await db.collection('shipments').deleteOne({
        _id: new ObjectId(id)
      });

      if (result.deletedCount === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'SHIPMENT_NOT_FOUND', message: 'Frete não encontrado' }
          })
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Frete deletado com sucesso'
        })
      };
    }

    // Método não suportado
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({
        error: { code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido' }
      })
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro no gerenciamento de fretes:', error);
    }
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' }
      })
    };
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
};
