const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const Stripe = require('stripe');
const { ethers } = require('ethers');

const logger = require('../../utils/logger.js');
const d1Client = require('../../db/d1Client.js');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const ADMIN_EMAIL = 'luispaulodeoliveira@agrotm.com.br';

// ConfiguraÃ§Ãµes dos planos
const PLANS = {
  loja: {
    name: 'Loja',
    price: 25.0,
    limitAds: 3,
    limitShipments: null,
    features: ['AtÃ© 3 anÃºncios', 'Suporte bÃ¡sico']
  },
  agroconecta_basico: {
    name: 'AgroConecta BÃ¡sico',
    price: 50.0,
    limitAds: null, // ilimitado
    limitShipments: null, // ilimitado
    features: ['AnÃºncios ilimitados', 'Fretes ilimitados', 'Chat privado (GPT completo)']
  },
  fretes_avancado: {
    name: 'Fretes AvanÃ§ado',
    price: 149.0,
    limitAds: null, // ilimitado
    limitShipments: 30, // mÃ¡ximo 30/mÃªs
    features: [
      'AnÃºncios ilimitados',
      'AtÃ© 30 fretes/mÃªs',
      'Chat privado (GPT completo)',
      'Analytics avanÃ§ados'
    ]
  }
};

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
  const email = decodedToken.email;

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
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
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

    // Conectar via d1Client wrapper (D1 PoC ou MongoDB fallback)
    await d1Client.connect();
    const db = d1Client.db();

    // GET /plans - Lista de planos disponÃ­veis (pÃºblica)
    if (event.httpMethod === 'GET') {
      const plansList = Object.entries(PLANS).map(([key, plan]) => ({
        id: key,
        ...plan,
        priceFormatted: `R$ ${plan.price.toFixed(2).replace('.', ',')}`
      }));

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ plans: plansList })
      };
    }

    // POST /payments/stripe/checkout - Criar sessÃ£o de checkout do Stripe
    if (event.httpMethod === 'POST' && event.path.includes('/stripe/checkout')) {
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

      const { planType } = requestBody;

      if (!planType || !PLANS[planType]) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'INVALID_PLAN', message: 'Tipo de plano invÃ¡lido' }
          })
        };
      }

      const plan = PLANS[planType];
      const siteUrl = process.env.SITE_URL || 'https://main.d3nvjszcpksd6p.amplifyapp.com';

      try {
        // Criar sessÃ£o de checkout do Stripe
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
          })
        };
      } catch (stripeError) {
        if (process.env.NODE_ENV !== 'production') {
          logger.error('Erro do Stripe:', stripeError);
        }
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'STRIPE_ERROR', message: 'Erro ao criar sessÃ£o de pagamento' }
          })
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

      const { txHash, planType } = requestBody;

      if (!txHash || !planType || !PLANS[planType]) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            error: {
              code: 'INVALID_DATA',
              message: 'Hash da transaÃ§Ã£o e tipo de plano sÃ£o obrigatÃ³rios'
            }
          })
        };
      }

      // Verificar se jÃ¡ existe pagamento com este hash
      const existingPayment = await db.collection('payments').findOne({
        'providerRef.txHash': txHash
      });

      if (existingPayment) {
        return {
          statusCode: 409,
          headers: corsHeaders,
          body: JSON.stringify({
            error: { code: 'DUPLICATE_TRANSACTION', message: 'TransaÃ§Ã£o jÃ¡ processada' }
          })
        };
      }

      try {
        // Validar transaÃ§Ã£o on-chain
        const provider = new ethers.JsonRpcProvider(process.env.CHAIN_RPC_URL);
        const tx = await provider.getTransaction(txHash);
        const receipt = await provider.getTransactionReceipt(txHash);

        if (!tx || !receipt) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
              error: {
                code: 'TRANSACTION_NOT_FOUND',
                message: 'TransaÃ§Ã£o nÃ£o encontrada na blockchain'
              }
            })
          };
        }

        // Verificar se a transaÃ§Ã£o foi confirmada
        if (receipt.status !== 1) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
              error: { code: 'TRANSACTION_FAILED', message: 'TransaÃ§Ã£o falhou na blockchain' }
            })
          };
        }

        // Verificar se foi enviada para a carteira do admin
        const adminWallet = process.env.ADMIN_WALLET?.toLowerCase();
        if (tx.to?.toLowerCase() !== adminWallet) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
              error: {
                code: 'INVALID_RECIPIENT',
                message: 'TransaÃ§Ã£o enviada para carteira incorreta'
              }
            })
          };
        }

        // Verificar valor da transaÃ§Ã£o (em ETH)
        const plan = PLANS[planType];
        const expectedValue = ethers.parseEther(plan.price.toString()); // Converter para wei

        // Permitir margem de erro de 10%
        // create a tolerance of 10% using BigNumber arithmetic
        const expectedBN = expectedValue;
        const toleranceBN = expectedBN.mul(10).div(100); // 10%

        const txValueBN = ethers.BigNumber.from(tx.value.toString());
        const diff = txValueBN.gte(expectedBN)
          ? txValueBN.sub(expectedBN)
          : expectedBN.sub(txValueBN);
        if (diff.gt(toleranceBN)) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
              error: {
                code: 'INVALID_AMOUNT',
                message: 'Valor da transaÃ§Ã£o nÃ£o corresponde ao plano'
              }
            })
          };
        }

        // Verificar confirmaÃ§Ãµes (mÃ­nimo 1)
        const currentBlock = await provider.getBlockNumber();
        const confirmations = currentBlock - receipt.blockNumber;

        if (confirmations < 1) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
              error: {
                code: 'INSUFFICIENT_CONFIRMATIONS',
                message: 'TransaÃ§Ã£o precisa de pelo menos 1 confirmaÃ§Ã£o'
              }
            })
          };
        }

        // Ativar plano do usuÃ¡rio
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
          })
        };
      } catch (blockchainError) {
        if (process.env.NODE_ENV !== 'production') {
          logger.error('Erro na validaÃ§Ã£o blockchain:', blockchainError);
        }
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({
            error: {
              code: 'BLOCKCHAIN_ERROR',
              message: 'Erro ao validar transaÃ§Ã£o na blockchain'
            }
          })
        };
      }
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
      logger.error('Erro no gerenciamento de planos e pagamentos:', error);
    }
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': process.env.AMPLIFY_DOMAIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' }
      })
    };
  }
};
