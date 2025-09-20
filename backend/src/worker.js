// Cloudflare Worker simplificado para AgroSync
export default {
  async fetch(request, env, ctx) {
    // Headers CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Health check
      if (path === '/health') {
        return new Response(JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          environment: env.NODE_ENV || 'production'
        }), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // API Routes
      if (path.startsWith('/api/')) {
        return await handleApiRequest(request, env, corsHeaders);
      }

      // Default response
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: 'Endpoint não encontrado',
        availableEndpoints: [
          '/health',
          '/api/auth/login',
          '/api/auth/register',
          '/api/payments/stripe/webhook',
          '/api/plans'
        ]
      }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: 'Erro interno do servidor',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

// Handle API requests
async function handleApiRequest(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Auth routes
  if (path.startsWith('/api/auth/')) {
    return handleAuthRoutes(request, env, corsHeaders);
  }

  // Payment routes
  if (path.startsWith('/api/payments/')) {
    return handlePaymentRoutes(request, env, corsHeaders);
  }

  // Plans routes
  if (path.startsWith('/api/plans')) {
    return handlePlansRoutes(request, env, corsHeaders);
  }

  // Default API response
  return new Response(JSON.stringify({
    success: true,
    message: 'API AgroSync funcionando',
    endpoints: {
      auth: '/api/auth/login, /api/auth/register',
      payments: '/api/payments/stripe/webhook',
      plans: '/api/plans'
    }
  }), {
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Handle authentication routes
async function handleAuthRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/auth/login' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { email, password } = body;

      // Validação básica
      if (!email || !password) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Email e senha são obrigatórios'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Simular login (em produção, conectar com MongoDB)
      return new Response(JSON.stringify({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          token: 'jwt_token_here',
          user: {
            id: 'user_id',
            email: email,
            name: 'Usuário Teste'
          }
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Erro ao processar login'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  if (path === '/api/auth/register' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { name, email, password } = body;

      // Validação básica
      if (!name || !email || !password) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Nome, email e senha são obrigatórios'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Simular registro (em produção, conectar com MongoDB)
      return new Response(JSON.stringify({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: {
          token: 'jwt_token_here',
          user: {
            id: 'user_id',
            name: name,
            email: email
          }
        }
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Erro ao processar registro'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  return new Response(JSON.stringify({
    success: false,
    message: 'Endpoint de autenticação não encontrado'
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

// Handle payment routes
async function handlePaymentRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/payments/stripe/webhook' && request.method === 'POST') {
    try {
      const body = await request.text();
      const signature = request.headers.get('stripe-signature');

      if (!signature) {
        return new Response(JSON.stringify({
          error: 'Missing signature'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Em produção, verificar assinatura do Stripe
      console.log('Stripe webhook received:', body);

      return new Response(JSON.stringify({
        received: true,
        message: 'Webhook processado com sucesso'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Webhook processing failed'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  return new Response(JSON.stringify({
    success: false,
    message: 'Endpoint de pagamento não encontrado'
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

// Handle plans routes
async function handlePlansRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/plans' && request.method === 'GET') {
    const plans = {
      basic: {
        id: 'basic',
        name: 'Básico',
        price: 29.90,
        products: 1,
        description: '1 produto ou 1 frete',
        features: [
          '1 produto/frete',
          'Visibilidade básica',
          'Suporte por email',
          'Dashboard básico'
        ]
      },
      standard: {
        id: 'standard',
        name: 'Padrão',
        price: 99.90,
        products: 5,
        description: '5 produtos ou 5 fretes',
        features: [
          '5 produtos/fretes',
          'Visibilidade premium',
          'Suporte prioritário',
          'Analytics básico',
          'Chat em tempo real'
        ]
      },
      premium: {
        id: 'premium',
        name: 'Premium',
        price: 499.90,
        products: 25,
        description: '25 produtos ou 25 fretes',
        features: [
          '25 produtos/fretes',
          'Visibilidade máxima',
          'Suporte 24/7',
          'Analytics avançado',
          'API access',
          'Integração personalizada'
        ]
      }
    };

    return new Response(JSON.stringify({
      success: true,
      data: Object.values(plans),
      annualDiscount: 0.15
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  return new Response(JSON.stringify({
    success: false,
    message: 'Endpoint de planos não encontrado'
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}