const { MongoClient } = require('mongodb');
const Stripe = require('stripe');
const crypto = require('crypto');

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.WEBHOOK_SECRET;

exports.handler = async (event) => {
  try {
    // Configurar CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type,Stripe-Signature',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
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

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: { code: 'METHOD_NOT_ALLOWED', message: 'Método não permitido' } 
        }),
      };
    }

    // Verificar assinatura do webhook
    const signature = event.headers['Stripe-Signature'] || event.headers['stripe-signature'];
    if (!signature) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: { code: 'MISSING_SIGNATURE', message: 'Assinatura do webhook não fornecida' } 
        }),
      };
    }

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, signature, webhookSecret);
    } catch (err) {
      console.error('Erro na verificação da assinatura:', err.message);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: { code: 'INVALID_SIGNATURE', message: 'Assinatura inválida' } 
        }),
      };
    }

    // Conectar ao MongoDB
    await mongoClient.connect();
    const db = mongoClient.db();

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
        console.log(`Evento não processado: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ received: true }),
    };

  } catch (error) {
    console.error('Erro no webhook do Stripe:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type,Stripe-Signature',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
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

// Função para processar checkout.session.completed
async function handleCheckoutSessionCompleted(db, session) {
  try {
    console.log('Processando checkout.session.completed:', session.id);
    
    const { cognitoSub, planType } = session.metadata;
    if (!cognitoSub || !planType) {
      console.error('Metadados ausentes na sessão:', session.id);
      return;
    }

    // Buscar usuário
    const user = await db.collection('users').findOne({ cognitoSub });
    if (!user) {
      console.error('Usuário não encontrado:', cognitoSub);
      return;
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
      console.error('Plano inválido:', planType);
      return;
    }

    // Calcular data de expiração
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // Atualizar usuário com plano ativo
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
          updatedAt: new Date()
        }
      }
    );

    console.log(`Plano ${planType} ativado para usuário ${cognitoSub}`);

  } catch (error) {
    console.error('Erro ao processar checkout.session.completed:', error);
  }
}

// Função para processar invoice.payment_succeeded
async function handleInvoicePaymentSucceeded(db, invoice) {
  try {
    console.log('Processando invoice.payment_succeeded:', invoice.id);
    
    // Buscar assinatura
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    if (!subscription) {
      console.error('Assinatura não encontrada:', invoice.subscription);
      return;
    }

    // Buscar usuário pelo customer ID ou metadata
    const user = await db.collection('users').findOne({
      $or: [
        { 'stripe.customerId': invoice.customer },
        { 'stripe.subscriptionId': invoice.subscription }
      ]
    });

    if (!user) {
      console.error('Usuário não encontrado para invoice:', invoice.id);
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

    console.log(`Plano renovado para usuário ${user.cognitoSub}`);

  } catch (error) {
    console.error('Erro ao processar invoice.payment_succeeded:', error);
  }
}

// Função para processar invoice.payment_failed
async function handleInvoicePaymentFailed(db, invoice) {
  try {
    console.log('Processando invoice.payment_failed:', invoice.id);
    
    // Buscar usuário
    const user = await db.collection('users').findOne({
      $or: [
        { 'stripe.customerId': invoice.customer },
        { 'stripe.subscriptionId': invoice.subscription }
      ]
    });

    if (!user) {
      console.error('Usuário não encontrado para invoice failed:', invoice.id);
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

    console.log(`Plano marcado como expirado para usuário ${user.cognitoSub}`);

  } catch (error) {
    console.error('Erro ao processar invoice.payment_failed:', error);
  }
}

// Função para processar customer.subscription.deleted
async function handleSubscriptionDeleted(db, subscription) {
  try {
    console.log('Processando customer.subscription.deleted:', subscription.id);
    
    // Buscar usuário
    const user = await db.collection('users').findOne({
      'stripe.subscriptionId': subscription.id
    });

    if (!user) {
      console.error('Usuário não encontrado para subscription deleted:', subscription.id);
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

    console.log(`Plano marcado como expirado para usuário ${user.cognitoSub}`);

  } catch (error) {
    console.error('Erro ao processar customer.subscription.deleted:', error);
  }
}
