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
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
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

    // Conectar ao MongoDB
    await mongoClient.connect();
    const db = mongoClient.db();

    // POST /partners/submit - Submissão de parceria (pública)
    if (event.httpMethod === 'POST' && event.path.includes('/partners/submit')) {
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

      // Validar dados obrigatórios
      const { fromName, fromEmail, message, attachments } = requestBody;
      
      if (!fromName || !fromEmail || !message) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'MISSING_FIELDS', message: 'Nome, e-mail e mensagem são obrigatórios' } 
          }),
        };
      }

      // Validar formato do e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fromEmail)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'INVALID_EMAIL', message: 'Formato de e-mail inválido' } 
          }),
        };
      }

      // Criar submissão de parceria
      const partnerSubmission = {
        fromName: fromName.trim(),
        fromEmail: fromEmail.toLowerCase().trim(),
        message: message.trim(),
        attachments: Array.isArray(attachments) ? attachments : [],
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('partnerSubmissions').insertOne(partnerSubmission);

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Submissão de parceria enviada com sucesso',
          id: result.insertedId
        }),
      };
    }

    // POST /contact/submit - Submissão de contato (pública)
    if (event.httpMethod === 'POST' && event.path.includes('/contact/submit')) {
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

      // Validar dados obrigatórios
      const { fromName, fromEmail, subject, message, attachments } = requestBody;
      
      if (!fromName || !fromEmail || !subject || !message) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'MISSING_FIELDS', message: 'Nome, e-mail, assunto e mensagem são obrigatórios' } 
          }),
        };
      }

      // Validar formato do e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fromEmail)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'INVALID_EMAIL', message: 'Formato de e-mail inválido' } 
          }),
        };
      }

      // Criar mensagem de contato
      const contactMessage = {
        fromName: fromName.trim(),
        fromEmail: fromEmail.toLowerCase().trim(),
        subject: subject.trim(),
        message: message.trim(),
        attachments: Array.isArray(attachments) ? attachments : [],
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('contactMessages').insertOne(contactMessage);

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Mensagem de contato enviada com sucesso',
          id: result.insertedId
        }),
      };
    }

    // GET /admin/partners - Listar submissões de parceria (admin)
    if (event.httpMethod === 'GET' && event.path.includes('/admin/partners')) {
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

      const { queryStringParameters } = event;
      const page = parseInt(queryStringParameters?.page) || 1;
      const limit = parseInt(queryStringParameters?.limit) || 20;
      const status = queryStringParameters?.status;

      let filter = {};
      if (status) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;
      
      const submissions = await db.collection('partnerSubmissions')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('partnerSubmissions').countDocuments(filter);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          submissions,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }),
      };
    }

    // GET /admin/contacts - Listar mensagens de contato (admin)
    if (event.httpMethod === 'GET' && event.path.includes('/admin/contacts')) {
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

      const { queryStringParameters } = event;
      const page = parseInt(queryStringParameters?.page) || 1;
      const limit = parseInt(queryStringParameters?.limit) || 20;
      const status = queryStringParameters?.status;

      let filter = {};
      if (status) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;
      
      const messages = await db.collection('contactMessages')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection('contactMessages').countDocuments(filter);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          messages,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }),
      };
    }

    // PUT /admin/partners/:id - Atualizar status de parceria (admin)
    if (event.httpMethod === 'PUT' && event.path.includes('/admin/partners/')) {
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

      const { status } = requestBody;
      
      if (!status || !['new', 'read', 'archived'].includes(status)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'INVALID_STATUS', message: 'Status deve ser: new, read ou archived' } 
          }),
        };
      }

      // Atualizar status
      const result = await db.collection('partnerSubmissions').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            status: status,
            updatedAt: new Date()
          } 
        }
      );

      if (result.matchedCount === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'SUBMISSION_NOT_FOUND', message: 'Submissão não encontrada' } 
          }),
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Status atualizado com sucesso'
        }),
      };
    }

    // PUT /admin/contacts/:id - Atualizar status de contato (admin)
    if (event.httpMethod === 'PUT' && event.path.includes('/admin/contacts/')) {
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

      const { status } = requestBody;
      
      if (!status || !['new', 'read', 'archived'].includes(status)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'INVALID_STATUS', message: 'Status deve ser: new, read ou archived' } 
          }),
        };
      }

      // Atualizar status
      const result = await db.collection('contactMessages').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            status: status,
            updatedAt: new Date()
          } 
        }
      );

      if (result.matchedCount === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'MESSAGE_NOT_FOUND', message: 'Mensagem não encontrada' } 
          }),
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Status atualizado com sucesso'
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
    console.error('Erro na mensageria:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
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
