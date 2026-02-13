const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const logger = require('../../utils/logger.js');
const d1Client = require('../../db/d1Client.js');
const ADMIN_EMAIL = 'luispaulodeoliveira@agrotm.com.br';

// FunÃ§Ã£o auxiliar para verificar autorizaÃ§Ã£o
const verifyAuth = event => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'UNAUTHORIZED', message: 'Token de autorizaÃ§Ã£o nÃ£o fornecido' };
  }

  const token = authHeader.substring(7);
  let decodedToken;

  try {
    decodedToken = jwt.decode(token);
    if (!decodedToken) {
      return { error: 'INVALID_TOKEN', message: 'Token invÃ¡lido' };
    }
  } catch (error) {
    return { error: 'INVALID_TOKEN', message: 'Token invÃ¡lido' };
  }

  const cognitoSub = decodedToken.sub;
  const { email } = decodedToken;

  if (!cognitoSub || !email) {
    return { error: 'INVALID_TOKEN_DATA', message: 'Dados do token invÃ¡lidos' };
  }

  return { cognitoSub, email };
};

// FunÃ§Ã£o para verificar se Ã© admin
const verifyAdmin = email => {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

exports.handler = async event => {
  try {
    // Configurar CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
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

    // Conectar via d1Client wrapper
    await d1Client.connect();
    const db = d1Client.db();

    // POST /partners/submit - SubmissÃ£o de parceria (pÃºblica)
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
            error: { code: 'INVALID_JSON', message: 'JSON invÃ¡lido' }
          })
        };
      }

      // Validar dados obrigatÃ³rios
      const { fromName, fromEmail, message, attachments } = requestBody;

      if (!fromName || !fromEmail || !message) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'MISSING_FIELDS', message: 'Nome, e-mail e mensagem sÃ£o obrigatÃ³rios' }
          })
        };
      }

      // Validar formato do e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fromEmail)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'INVALID_EMAIL', message: 'Formato de e-mail invÃ¡lido' }
          })
        };
      }

      // Criar submissÃ£o de parceria
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
          message: 'SubmissÃ£o de parceria enviada com sucesso',
          id: result.insertedId
        })
      };
    }

    // POST /contact/submit - SubmissÃ£o de contato (pÃºblica)
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
            error: { code: 'INVALID_JSON', message: 'JSON invÃ¡lido' }
          })
        };
      }

      // Validar dados obrigatÃ³rios
      const { fromName, fromEmail, subject, message, attachments } = requestBody;

      if (!fromName || !fromEmail || !subject || !message) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: {
              code: 'MISSING_FIELDS',
              message: 'Nome, e-mail, assunto e mensagem sÃ£o obrigatÃ³rios'
            }
          })
        };
      }

      // Validar formato do e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fromEmail)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'INVALID_EMAIL', message: 'Formato de e-mail invÃ¡lido' }
          })
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
        })
      };
    }

    // GET /admin/partners - Listar submissÃµes de parceria (admin)
    if (event.httpMethod === 'GET' && event.path.includes('/admin/partners')) {
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

      // Verificar se Ã© admin
      if (!verifyAdmin(auth.email)) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'FORBIDDEN', message: 'Acesso negado. Apenas administradores.' }
          })
        };
      }

      const { queryStringParameters } = event;
      const page = parseInt(queryStringParameters?.page, 10, 10) || 1;
      const limit = parseInt(queryStringParameters?.limit, 10, 10) || 20;
      const status = queryStringParameters?.status;

      const filter = {};
      if (status) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;

      const submissions = await db
        .collection('partnerSubmissions')
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
        })
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
          })
        };
      }

      // Verificar se Ã© admin
      if (!verifyAdmin(auth.email)) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'FORBIDDEN', message: 'Acesso negado. Apenas administradores.' }
          })
        };
      }

      const { queryStringParameters } = event;
      const page = parseInt(queryStringParameters?.page, 10, 10) || 1;
      const limit = parseInt(queryStringParameters?.limit, 10, 10) || 20;
      const status = queryStringParameters?.status;

      const filter = {};
      if (status) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;

      const messages = await db
        .collection('contactMessages')
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
        })
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
          })
        };
      }

      // Verificar se Ã© admin
      if (!verifyAdmin(auth.email)) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'FORBIDDEN', message: 'Acesso negado. Apenas administradores.' }
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
            error: { code: 'INVALID_ID', message: 'ID invÃ¡lido' }
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
            error: { code: 'INVALID_JSON', message: 'JSON invÃ¡lido' }
          })
        };
      }

      const { status } = requestBody;

      if (!status || !['new', 'read', 'archived'].includes(status)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'INVALID_STATUS', message: 'Status deve ser: new, read ou archived' }
          })
        };
      }

      // Atualizar status
      const result = await db.collection('partnerSubmissions').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'SUBMISSION_NOT_FOUND', message: 'SubmissÃ£o nÃ£o encontrada' }
          })
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Status atualizado com sucesso'
        })
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
          })
        };
      }

      // Verificar se Ã© admin
      if (!verifyAdmin(auth.email)) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'FORBIDDEN', message: 'Acesso negado. Apenas administradores.' }
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
            error: { code: 'INVALID_ID', message: 'ID invÃ¡lido' }
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
            error: { code: 'INVALID_JSON', message: 'JSON invÃ¡lido' }
          })
        };
      }

      const { status } = requestBody;

      if (!status || !['new', 'read', 'archived'].includes(status)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'INVALID_STATUS', message: 'Status deve ser: new, read ou archived' }
          })
        };
      }

      // Atualizar status
      const result = await db.collection('contactMessages').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'MESSAGE_NOT_FOUND', message: 'Mensagem nÃ£o encontrada' }
          })
        };
      }

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Status atualizado com sucesso'
        })
      };
    }

    // MÃ©todo nÃ£o suportado
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({
        error: { code: 'METHOD_NOT_ALLOWED', message: 'MÃ©todo nÃ£o permitido' }
      })
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro na mensageria:', error);
    }
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
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
