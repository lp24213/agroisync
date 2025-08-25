const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const ADMIN_EMAIL = 'luispaulodeoliveira@agrotm.com.br';

// Função auxiliar para verificar autorização
const verifyAuth = (event) => {
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

// Função para verificar se é admin
const verifyAdmin = (email) => {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

exports.handler = async (event) => {
  try {
    // Configurar CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Credentials': true,
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'OK' }),
      };
    }

    // Verificar autorização para todas as rotas admin
    const auth = verifyAuth(event);
    if (auth.error) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: { code: auth.error, message: auth.message } 
        }),
      };
    }

    // Verificar se é admin
    if (!verifyAdmin(auth.email)) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: { code: 'FORBIDDEN', message: 'Acesso negado. Apenas administradores.' } 
        }),
      };
    }

    // Conectar ao MongoDB
    await mongoClient.connect();
    const db = mongoClient.db();

    // GET /admin/dashboard - Dashboard com KPIs
    if (event.httpMethod === 'GET' && event.path.includes('/dashboard')) {
      try {
        // Contar usuários
        const totalUsers = await db.collection('users').countDocuments();
        const activeUsers = await db.collection('users').countDocuments({ 'plan.status': 'active' });
        const adminUsers = await db.collection('users').countDocuments({ role: 'admin' });

        // Contar produtos
        const totalProducts = await db.collection('products').countDocuments();
        const activeProducts = await db.collection('products').countDocuments({ status: 'active' });

        // Contar fretes
        const totalShipments = await db.collection('shipments').countDocuments();

        // Contar pagamentos
        const totalPayments = await db.collection('payments').countDocuments();
        const successfulPayments = await db.collection('payments').countDocuments({ status: 'succeeded' });
        const pendingPayments = await db.collection('payments').countDocuments({ status: 'pending' });

        // Contar mensagens
        const totalPartnerSubmissions = await db.collection('partnerSubmissions').countDocuments();
        const newPartnerSubmissions = await db.collection('partnerSubmissions').countDocuments({ status: 'new' });
        
        const totalContactMessages = await db.collection('contactMessages').countDocuments();
        const newContactMessages = await db.collection('contactMessages').countDocuments({ status: 'new' });

        // Estatísticas de planos
        const planStats = await db.collection('users').aggregate([
          { $match: { 'plan.status': 'active' } },
          { $group: { _id: '$plan.type', count: { $sum: 1 } } }
        ]).toArray();

        const planBreakdown = {};
        planStats.forEach(stat => {
          planBreakdown[stat._id] = stat.count;
        });

        // Receita mensal (aproximada)
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);

        const monthlyRevenue = await db.collection('payments').aggregate([
          { 
            $match: { 
              status: 'succeeded',
              createdAt: { $gte: currentMonth }
            } 
          },
          { $group: { _id: null, total: { $sum: '$amountBRL' } } }
        ]).toArray();

        const revenue = monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0;

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            dashboard: {
              users: {
                total: totalUsers,
                active: activeUsers,
                admin: adminUsers
              },
              products: {
                total: totalProducts,
                active: activeProducts
              },
              shipments: {
                total: totalShipments
              },
              payments: {
                total: totalPayments,
                successful: successfulPayments,
                pending: pendingPayments,
                monthlyRevenue: revenue
              },
              messages: {
                partners: {
                  total: totalPartnerSubmissions,
                  new: newPartnerSubmissions
                },
                contacts: {
                  total: totalContactMessages,
                  new: newContactMessages
                }
              },
              plans: planBreakdown
            }
          }),
        };
      } catch (error) {
        console.error('Erro ao gerar dashboard:', error);
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'DASHBOARD_ERROR', message: 'Erro ao gerar dashboard' } 
          }),
        };
      }
    }

    // GET /admin/users - Listar usuários
    if (event.httpMethod === 'GET' && event.path.includes('/users')) {
      const { queryStringParameters } = event;
      const page = parseInt(queryStringParameters?.page) || 1;
      const limit = parseInt(queryStringParameters?.limit) || 20;
      const search = queryStringParameters?.search || '';
      const role = queryStringParameters?.role;
      const planStatus = queryStringParameters?.planStatus;

      let filter = {};
      
      if (search) {
        filter.$or = [
          { email: { $regex: search, $options: 'i' } },
          { 'profile.name': { $regex: search, $options: 'i' } },
          { 'profile.company': { $regex: search, $options: 'i' } }
        ];
      }
      
      if (role) {
        filter.role = role;
      }
      
      if (planStatus) {
        filter['plan.status'] = planStatus;
      }

      const skip = (page - 1) * limit;
      
      const users = await db.collection('users')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('users').countDocuments(filter);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          users,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }),
      };
    }

    // PUT /admin/users/:id/plan - Atualizar plano do usuário
    if (event.httpMethod === 'PUT' && event.path.includes('/users/') && event.path.includes('/plan')) {
      // Extrair ID da URL
      const pathParts = event.path.split('/');
      const id = pathParts[pathParts.length - 2]; // /users/{id}/plan

      if (!ObjectId.isValid(id)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'INVALID_ID', message: 'ID inválido' } 
          }),
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
          }),
        };
      }

      const { planType, status, expiresAt } = requestBody;
      
      if (!planType || !status) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'MISSING_FIELDS', message: 'Tipo de plano e status são obrigatórios' } 
          }),
        };
      }

      // Configurações dos planos
      const PLANS = {
        loja: {
          limitAds: 3,
          limitShipments: null
        },
        agroconecta_basico: {
          limitAds: null,
          limitShipments: null
        },
        fretes_avancado: {
          limitAds: null,
          limitShipments: 30
        }
      };

      const plan = PLANS[planType];
      if (!plan) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'INVALID_PLAN', message: 'Tipo de plano inválido' } 
          }),
        };
      }

      // Preparar dados para atualização
      const updateData = {
        'plan.type': planType,
        'plan.status': status,
        'plan.limitAds': plan.limitAds,
        'plan.limitShipments': plan.limitShipments,
        updatedAt: new Date()
      };

      if (expiresAt) {
        updateData['plan.expiresAt'] = new Date(expiresAt);
      } else if (status === 'active') {
        // Se ativando sem data específica, definir para +30 dias
        const defaultExpiry = new Date();
        defaultExpiry.setMonth(defaultExpiry.getMonth() + 1);
        updateData['plan.expiresAt'] = defaultExpiry;
      }

      // Atualizar usuário
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'USER_NOT_FOUND', message: 'Usuário não encontrado' } 
          }),
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Plano do usuário atualizado com sucesso'
        }),
      };
    }

    // GET /admin/payments - Listar pagamentos
    if (event.httpMethod === 'GET' && event.path.includes('/payments')) {
      const { queryStringParameters } = event;
      const page = parseInt(queryStringParameters?.page) || 1;
      const limit = parseInt(queryStringParameters?.limit) || 20;
      const status = queryStringParameters?.status;
      const method = queryStringParameters?.method;

      let filter = {};
      
      if (status) {
        filter.status = status;
      }
      
      if (method) {
        filter.method = method;
      }

      const skip = (page - 1) * limit;
      
      const payments = await db.collection('payments')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('payments').countDocuments(filter);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          payments,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }),
      };
    }

    // GET /admin/products - Listar produtos
    if (event.httpMethod === 'GET' && event.path.includes('/products')) {
      const { queryStringParameters } = event;
      const page = parseInt(queryStringParameters?.page) || 1;
      const limit = parseInt(queryStringParameters?.limit) || 20;
      const status = queryStringParameters?.status;
      const search = queryStringParameters?.search || '';

      let filter = {};
      
      if (status) {
        filter.status = status;
      }
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { specs: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      
      const products = await db.collection('products')
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
        }),
      };
    }

    // DELETE /admin/products/:id - Deletar produto
    if (event.httpMethod === 'DELETE' && event.path.includes('/products/')) {
      // Extrair ID da URL
      const pathParts = event.path.split('/');
      const id = pathParts[pathParts.length - 1];

      if (!ObjectId.isValid(id)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'INVALID_ID', message: 'ID inválido' } 
          }),
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
          }),
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Produto deletado com sucesso'
        }),
      };
    }

    // GET /admin/shipments - Listar fretes
    if (event.httpMethod === 'GET' && event.path.includes('/shipments')) {
      const { queryStringParameters } = event;
      const page = parseInt(queryStringParameters?.page) || 1;
      const limit = parseInt(queryStringParameters?.limit) || 20;
      const search = queryStringParameters?.search || '';

      let filter = {};
      
      if (search) {
        filter.$or = [
          { 'public.routeFrom': { $regex: search, $options: 'i' } },
          { 'public.routeTo': { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      
      const shipments = await db.collection('shipments')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('shipments').countDocuments(filter);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          shipments,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }),
      };
    }

    // Método não suportado
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: { code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido' } 
      }),
    };

  } catch (error) {
    console.error('Erro no painel administrativo:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ 
        error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' } 
      }),
    };
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
};
