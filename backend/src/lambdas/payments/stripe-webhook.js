const { MongoClient } = require('mongodb');
const Stripe = require('stripe');
const crypto = require('crypto');
const logger = require('../../utils/logger');

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.WEBHOOK_SECRET;

exports.handler = async event => {
  try {
    // Configurar CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type,Stripe-Signature',
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
          error: { code: 'METHOD_NOT_ALLOWED', message: 'MÃ©todo nÃ£o permitido' }
        })
      };
    }

    // Verificar assinatura do webhook
    const signature = event.headers['Stripe-Signature'] || event.headers['stripe-signature'];
    if (!signature) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: { code: 'MISSING_SIGNATURE', message: 'Assinatura do webhook nÃ£o fornecida' }
        })
      };
    }

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, signature, webhookSecret);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Erro na verificaÃ§Ã£o da assinatura:', err.message);
      }
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: { code: 'INVALID_SIGNATURE', message: 'Assinatura invÃ¡lida' }
        })
      };
    }

    // Conectar ao MongoDB
    await mongoClient.connect();
    const db = mongoClient.db();

    // Verificar idempotÃªncia - evitar processamento duplicado
    const eventId = stripeEvent.id;
    const existingEvent = await db.collection('webhook_events').findOne({ eventId });

    if (existingEvent) {
      if (process.env.NODE_ENV !== 'production') {
        logger.log(`Evento jÃ¡ processado: ${eventId}`);
      }
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ received: true, message: 'Event already processed' })
      };
    }

    // Registrar evento para idempotÃªncia
    await db.collection('webhook_events').insertOne({
      eventId,
      type: stripeEvent.type,
      processedAt: new Date(),
      data: stripeEvent.data.object
    });

    // Processar eventos do Stripe
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(db, stripeEvent.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(db, stripeEvent.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(db, stripeEvent.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(db, stripeEvent.data.object);
        break;

      default:
        if (process.env.NODE_ENV !== 'production') {
          logger.log(`Evento nÃ£o processado: ${stripeEvent.type}`);
        }
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro no webhook do Stripe:', error);
    }
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type,Stripe-Signature',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
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

// FunÃ§Ã£o para processar checkout.session.completed
async function handleCheckoutSessionCompleted(db, session) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      logger.log('Processando checkout.session.completed:', session.id);
    }
    const { cognitoSub, planType } = session.metadata;
    if (!cognitoSub || !planType) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Metadados ausentes na sessÃ£o:', session.id);
      }
      return;
    }

    // Buscar usuÃ¡rio
    const user = await db.collection('users').findOne({ cognitoSub });
    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('UsuÃ¡rio nÃ£o encontrado:', cognitoSub);
      }
      return;
    }

    // Verificar se o pagamento jÃ¡ foi processado
    const existingPayment = await db.collection('payments').findOne({
      'providerRef.stripeSessionId': session.id,
      status: 'succeeded'
    });

    if (existingPayment) {
      if (process.env.NODE_ENV !== 'production') {
        logger.log(`Pagamento jÃ¡ processado para sessÃ£o: ${session.id}`);
      }
      return;
    }

    // ConfiguraÃ§Ãµes dos planos
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
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Plano invÃ¡lido:', planType);
      }
      return;
    }

    // Calcular data de expiraÃ§Ã£o
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // Atualizar usuÃ¡rio com plano ativo
    await db.collection('users').updateOne(
      { cognitoSub },
      {
        $set: {
          'plan.type': planType,
          'plan.status': 'active',
          'plan.limitAds': plan.limitAds,
          'plan.limitShipments': plan.limitShipments,
          'plan.expiresAt': expiresAt,
          updatedAt: new Date()
        }
      }
    );

    // Atualizar status do pagamento
    await db.collection('payments').updateOne(
      { 'providerRef.stripeSessionId': session.id },
      {
        $set: {
          status: 'succeeded',
          'providerRef.stripePaymentIntentId': session.payment_intent,
          processedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    // Registrar log de sucesso
    await db.collection('payment_logs').insertOne({
      userId: cognitoSub,
      sessionId: session.id,
      planType,
      status: 'succeeded',
      amount: session.amount_total / 100,
      currency: session.currency,
      processedAt: new Date(),
      eventType: 'checkout.session.completed'
    });

    if (process.env.NODE_ENV !== 'production') {
      logger.log(`Plano ${planType} ativado para usuÃ¡rio ${cognitoSub} - SessÃ£o: ${session.id}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao processar checkout.session.completed:', error);
    }
    // Registrar erro
    await db.collection('payment_logs').insertOne({
      userId: cognitoSub,
      sessionId: session.id,
      planType,
      status: 'error',
      error: error.message,
      processedAt: new Date(),
      eventType: 'checkout.session.completed'
    });
  }
}

// FunÃ§Ã£o para processar invoice.payment_succeeded
async function handleInvoicePaymentSucceeded(db, invoice) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      logger.log('Processando invoice.payment_succeeded:', invoice.id);
    }
    // Buscar assinatura
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    if (!subscription) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Assinatura nÃ£o encontrada:', invoice.subscription);
      }
      return;
    }

    // Buscar usuÃ¡rio pelo customer ID ou metadata
    const user = await db.collection('users').findOne({
      $or: [
        { 'stripe.customerId': invoice.customer },
        { 'stripe.subscriptionId': invoice.subscription }
      ]
    });

    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('UsuÃ¡rio nÃ£o encontrado para invoice:', invoice.id);
      }
      return;
    }

    // Renovar plano
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          'plan.expiresAt': expiresAt,
          updatedAt: new Date()
        }
      }
    );

    if (process.env.NODE_ENV !== 'production') {
      logger.log(`Plano renovado para usuÃ¡rio ${user.cognitoSub}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao processar invoice.payment_succeeded:', error);
    }
  }
}

// FunÃ§Ã£o para processar invoice.payment_failed
async function handleInvoicePaymentFailed(db, invoice) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      logger.log('Processando invoice.payment_failed:', invoice.id);
    }
    // Buscar usuÃ¡rio
    const user = await db.collection('users').findOne({
      $or: [
        { 'stripe.customerId': invoice.customer },
        { 'stripe.subscriptionId': invoice.subscription }
      ]
    });

    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('UsuÃ¡rio nÃ£o encontrado para invoice failed:', invoice.id);
      }
      return;
    }

    // Marcar plano como expirado
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          'plan.status': 'expired',
          updatedAt: new Date()
        }
      }
    );

    if (process.env.NODE_ENV !== 'production') {
      logger.log(`Plano marcado como expirado para usuÃ¡rio ${user.cognitoSub}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao processar invoice.payment_failed:', error);
    }
  }
}

// FunÃ§Ã£o para processar customer.subscription.deleted
async function handleSubscriptionDeleted(db, subscription) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      logger.log('Processando customer.subscription.deleted:', subscription.id);
    }
    // Buscar usuÃ¡rio
    const user = await db.collection('users').findOne({
      'stripe.subscriptionId': subscription.id
    });

    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        logger.error('UsuÃ¡rio nÃ£o encontrado para subscription deleted:', subscription.id);
      }
      return;
    }

    // Marcar plano como expirado
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          'plan.status': 'expired',
          updatedAt: new Date()
        }
      }
    );

    if (process.env.NODE_ENV !== 'production') {
      logger.log(`Plano marcado como expirado para usuÃ¡rio ${user.cognitoSub}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao processar customer.subscription.deleted:', error);
    }
  }
}
