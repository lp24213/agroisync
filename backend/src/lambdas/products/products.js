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
  const email = decodedToken.email;

  if (!cognitoSub || !email) {
    return { error: 'INVALID_TOKEN_DATA', message: 'Dados do token inválidos' };
  }

  return { cognitoSub, email };
};

// Função para verificar limites do plano
const checkPlanLimits = async (db, cognitoSub, operation) => {
  const user = await db.collection('users').findOne({ cognitoSub });
  if (!user) {
    return { error: 'USER_NOT_FOUND', message: 'Usuário não encontrado' };
  }

  const { plan } = user;

  if (operation === 'create') {
    // Verificar se pode criar mais produtos
    if (plan.status !== 'active') {
      return {
        error: 'PLAN_INACTIVE',
        message: 'Plano inativo. Ative um plano para criar produtos.'
      };
    }

    if (plan.type === 'loja') {
      // Plano Loja: máximo 3 anúncios
      const currentProducts = await db.collection('products').countDocuments({
        ownerId: cognitoSub,
        status: 'active'
      });

      if (currentProducts >= 3) {
        return {
          error: 'LIMIT_EXCEEDED',
          message: 'Limite de 3 anúncios atingido para o plano Loja.'
        };
      }
    }
    // Planos pagos: ilimitado
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

    // GET /products/public - Lista pública de produtos
    if (event.httpMethod === 'GET' && event.path.includes('/public')) {
      const { queryStringParameters } = event;
      const page = parseInt(queryStringParameters?.page) || 1;
      const limit = parseInt(queryStringParameters?.limit) || 20;
      const search = queryStringParameters?.search || '';
      const category = queryStringParameters?.category;

      let filter = { status: 'active' };

      if (search) {
        filter.$text = { $search: search };
      }

      if (category) {
        filter.category = category;
      }

      const skip = (page - 1) * limit;

      const products = await db
        .collection('products')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('products').countDocuments(filter);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          products,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        })
      };
    }

    // GET /products - Produtos do usuário ou por ID
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
        // Buscar produto específico por ID
        if (!ObjectId.isValid(id)) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
              error: { code: 'INVALID_ID', message: 'ID inválido' }
            })
          };
        }

        const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
        if (!product) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({
              error: { code: 'PRODUCT_NOT_FOUND', message: 'Produto não encontrado' }
            })
          };
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ product })
        };
      }

      // Buscar produtos do usuário
      const filter = owner === 'me' ? { ownerId: auth.cognitoSub } : {};
      const products = await db
        .collection('products')
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ products })
      };
    }

    // POST /products - Criar produto
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
      const planCheck = await checkPlanLimits(db, auth.cognitoSub, 'create');
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
      const { name, specs, images, priceBRL } = requestBody;

      if (!name || !specs || !priceBRL) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: {
              code: 'MISSING_FIELDS',
              message: 'Nome, especificações e preço são obrigatórios'
            }
          })
        };
      }

      // Criar produto
      const newProduct = {
        ownerId: auth.cognitoSub,
        name: name.trim(),
        specs: specs.trim(),
        images: Array.isArray(images) ? images : [],
        priceBRL: parseFloat(priceBRL),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('products').insertOne(newProduct);

      // Criar índices se não existirem
      await db.collection('products').createIndex({ ownerId: 1 });
      await db.collection('products').createIndex({ name: 'text', specs: 'text' });

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Produto criado com sucesso',
          product: {
            id: result.insertedId,
            ...newProduct
          }
        })
      };
    }

    // PUT /products/:id - Atualizar produto
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

      // Verificar se o produto existe e pertence ao usuário
      const existingProduct = await db.collection('products').findOne({
        _id: new ObjectId(id),
        ownerId: auth.cognitoSub
      });

      if (!existingProduct) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'PRODUCT_NOT_FOUND', message: 'Produto não encontrado' }
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

      if (requestBody.name) updateData.name = requestBody.name.trim();
      if (requestBody.specs) updateData.specs = requestBody.specs.trim();
      if (requestBody.images)
        updateData.images = Array.isArray(requestBody.images) ? requestBody.images : [];
      if (requestBody.priceBRL) updateData.priceBRL = parseFloat(requestBody.priceBRL);
      if (requestBody.status) updateData.status = requestBody.status;

      // Atualizar produto
      const result = await db
        .collection('products')
        .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

      if (result.matchedCount === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'PRODUCT_NOT_FOUND', message: 'Produto não encontrado' }
          })
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Produto atualizado com sucesso'
        })
      };
    }

    // DELETE /products/:id - Deletar produto
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

      // Verificar se o produto existe e pertence ao usuário
      const existingProduct = await db.collection('products').findOne({
        _id: new ObjectId(id),
        ownerId: auth.cognitoSub
      });

      if (!existingProduct) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'PRODUCT_NOT_FOUND', message: 'Produto não encontrado' }
          })
        };
      }

      // Deletar produto
      const result = await db.collection('products').deleteOne({
        _id: new ObjectId(id)
      });

      if (result.deletedCount === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'PRODUCT_NOT_FOUND', message: 'Produto não encontrado' }
          })
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Produto deletado com sucesso'
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
    console.error('Erro no gerenciamento de produtos:', error);

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
