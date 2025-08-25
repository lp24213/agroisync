const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');
const { ethers } = require('ethers');

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const ADMIN_EMAIL = 'luispaulodeoliveira@agrotm.com.br';

// Configurações dos planos
const PLANS = {
  loja: {
    name: 'Loja',
    price: 25.00,
    limitAds: 3,
    limitShipments: null,
    features: ['Até 3 anúncios', 'Suporte básico']
  },
  agroconecta_basico: {
    name: 'AgroConecta Básico',
    price: 50.00,
    limitAds: null, // ilimitado
    limitShipments: null, // ilimitado
    features: ['Anúncios ilimitados', 'Fretes ilimitados', 'Chat privado (GPT completo)']
  },
  fretes_avancado: {
    name: 'Fretes Avançado',
    price: 149.00,
    limitAds: null, // ilimitado
    limitShipments: 30, // máximo 30/mês
    features: ['Anúncios ilimitados', 'Até 30 fretes/mês', 'Chat privado (GPT completo)', 'Analytics avançados']
  }
};

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
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
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

    // GET /plans - Lista de planos disponíveis (pública)
    if (event.httpMethod === 'GET') {
      const plansList = Object.entries(PLANS).map(([key, plan]) => ({
        id: key,
        ...plan,
        priceFormatted: `R$ ${plan.price.toFixed(2).replace('.', ',')}`
      }));

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          plans: plansList
        }),
      };
    }

    // POST /payments/stripe/checkout - Criar sessão de checkout do Stripe
    if (event.httpMethod === 'POST' && event.path.includes('/stripe/checkout')) {
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

      const { planType } = requestBody;
      
      if (!planType || !PLANS[planType]) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'INVALID_PLAN', message: 'Tipo de plano inválido' } 
          }),
        };
      }

      const plan = PLANS[planType];
      const siteUrl = process.env.SITE_URL || 'https://main.d3nvjszcpksd6p.amplifyapp.com';

      try {
        // Criar sessão de checkout do Stripe
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'brl',
                product_data: {
                  name: plan.name,
                  description: plan.features.join(', ')
                },
                unit_amount: Math.round(plan.price * 100), // Stripe usa centavos
                recurring: {
                  interval: 'month'
                }
              },
              quantity: 1
            }
          ],
          mode: 'subscription',
          success_url: `${siteUrl}/login?ok=1&plan=${planType}`,
          cancel_url: `${siteUrl}/planos?cancel=1`,
          customer_email: auth.email,
          metadata: {
            cognitoSub: auth.cognitoSub,
            planType: planType
          }
        });

        // Registrar pagamento pendente no banco
        const payment = {
          userId: auth.cognitoSub,
          method: 'stripe',
          amountBRL: plan.price,
          planType: planType,
          status: 'pending',
          providerRef: {
            stripeSessionId: session.id
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await db.collection('payments').insertOne(payment);

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            sessionUrl: session.url,
            sessionId: session.id
          }),
        };

      } catch (stripeError) {
        console.error('Erro do Stripe:', stripeError);
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'STRIPE_ERROR', message: 'Erro ao criar sessão de pagamento' } 
          }),
        };
      }
    }

    // POST /payments/crypto/submit - Submeter pagamento em cripto
    if (event.httpMethod === 'POST' && event.path.includes('/crypto/submit')) {
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

      const { txHash, planType } = requestBody;
      
      if (!txHash || !planType || !PLANS[planType]) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'INVALID_DATA', message: 'Hash da transação e tipo de plano são obrigatórios' } 
          }),
        };
      }

      // Verificar se já existe pagamento com este hash
      const existingPayment = await db.collection('payments').findOne({
        'providerRef.txHash': txHash
      });

      if (existingPayment) {
        return {
          statusCode: 409,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'DUPLICATE_TRANSACTION', message: 'Transação já processada' } 
          }),
        };
      }

      try {
        // Validar transação on-chain
        const provider = new ethers.JsonRpcProvider(process.env.CHAIN_RPC_URL);
        const tx = await provider.getTransaction(txHash);
        const receipt = await provider.getTransactionReceipt(txHash);

        if (!tx || !receipt) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ 
              error: { code: 'TRANSACTION_NOT_FOUND', message: 'Transação não encontrada na blockchain' } 
            }),
          };
        }

        // Verificar se a transação foi confirmada
        if (receipt.status !== 1) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ 
              error: { code: 'TRANSACTION_FAILED', message: 'Transação falhou na blockchain' } 
            }),
          };
        }

        // Verificar se foi enviada para a carteira do admin
        const adminWallet = process.env.ADMIN_WALLET?.toLowerCase();
        if (tx.to?.toLowerCase() !== adminWallet) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ 
              error: { code: 'INVALID_RECIPIENT', message: 'Transação enviada para carteira incorreta' } 
            }),
          };
        }

        // Verificar valor da transação (em ETH)
        const plan = PLANS[planType];
        const expectedValue = ethers.parseEther(plan.price.toString()); // Converter para wei
        
        // Permitir margem de erro de 10%
        const tolerance = expectedValue * 0.1n;
        if (Math.abs(Number(tx.value - expectedValue)) > Number(tolerance)) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ 
              error: { code: 'INVALID_AMOUNT', message: 'Valor da transação não corresponde ao plano' } 
            }),
          };
        }

        // Verificar confirmações (mínimo 1)
        const currentBlock = await provider.getBlockNumber();
        const confirmations = currentBlock - receipt.blockNumber;
        
        if (confirmations < 1) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ 
              error: { code: 'INSUFFICIENT_CONFIRMATIONS', message: 'Transação precisa de pelo menos 1 confirmação' } 
            }),
          };
        }

        // Ativar plano do usuário
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        await db.collection('users').updateOne(
          { cognitoSub: auth.cognitoSub },
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

        // Registrar pagamento bem-sucedido
        const payment = {
          userId: auth.cognitoSub,
          method: 'crypto',
          amountBRL: plan.price,
          planType: planType,
          status: 'succeeded',
          providerRef: {
            txHash: txHash
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await db.collection('payments').insertOne(payment);

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            message: 'Pagamento em cripto processado com sucesso',
            plan: {
              type: planType,
              status: 'active',
              expiresAt: expiresAt
            }
          }),
        };

      } catch (blockchainError) {
        console.error('Erro na validação blockchain:', blockchainError);
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: { code: 'BLOCKCHAIN_ERROR', message: 'Erro ao validar transação na blockchain' } 
          }),
        };
      }
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
    console.error('Erro no gerenciamento de planos e pagamentos:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
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
