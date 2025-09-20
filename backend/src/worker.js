// Cloudflare Worker simplificado para AgroSync
export default {
  async fetch(request, env) {
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
        return new Response(
          JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            environment: env.NODE_ENV || 'production'
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }

      // API Routes
      if (path.startsWith('/api/')) {
        return await handleApiRequest(request, env, corsHeaders);
      }

      // Serve frontend files for root requests
      if (path === '/' || path === '/index.html') {
        // Serve the React app index.html with proper configuration
        const frontendHtml = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="theme-color" content="#2F4F2F"/>
  <meta name="description" content="Agroisync - A plataforma de agronegócio mais futurista do mundo. Conecte-se ao futuro do agronegócio com tecnologia blockchain, IA e marketplace inteligente."/>
  <meta name="keywords" content="agronegócio, marketplace, fretes, cripto, blockchain, IA, agricultura, produtos agrícolas"/>
  <meta name="author" content="Agroisync Team"/>
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="https://agroisync.com/"/>
  <meta property="og:title" content="AGROISYNC - Futuro do Agronegócio"/>
  <meta property="og:description" content="A plataforma de agronegócio mais futurista do mundo. Conecte-se ao futuro do agronegócio com tecnologia blockchain, IA e marketplace inteligente."/>
  <meta property="og:image" content="/og-image.png"/>
  <meta property="twitter:card" content="summary_large_image"/>
  <meta property="twitter:url" content="https://agroisync.com/"/>
  <meta property="twitter:title" content="AGROISYNC - Futuro do Agronegócio"/>
  <meta property="twitter:description" content="A plataforma de agronegócio mais futurista do mundo. Conecte-se ao futuro do agronegócio com tecnologia blockchain, IA e marketplace inteligente."/>
  <meta property="twitter:image" content="/og-image.png"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="apple-touch-icon" href="/logo192.png"/>
  <link rel="manifest" href="/manifest.json"/>
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Agroisync">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-Frame-Options" content="DENY">
  <meta http-equiv="X-XSS-Protection" content="1; mode=block">
  <title>AGROISYNC - Futuro do Agronegócio</title>
  <style>
    .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0f0f23 0, #1a1a2e 50%, #16213e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .loading-logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(45deg, #00d4ff, #8b5cf6, #0f8);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s ease-in-out infinite;
    }
    .loading-logo::before {
      content: "⚡";
      font-size: 40px;
      color: #fff;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    .loading-text {
      position: absolute;
      bottom: 30%;
      color: #fff;
      font-family: Inter, sans-serif;
      font-size: 24px;
      font-weight: 600;
      text-align: center;
    }
    .app-loaded .loading-screen {
      display: none;
    }
  </style>
</head>
<body>
  <noscript>
    <div style="text-align:center;padding:50px;font-family:Arial,sans-serif">
      <h1>JavaScript Necessário</h1>
      <p>O Agroisync requer JavaScript para funcionar. Por favor, habilite JavaScript em seu navegador.</p>
    </div>
  </noscript>
  <div class="loading-screen">
    <div class="loading-logo"></div>
    <div class="loading-text">Agroisync</div>
  </div>
  <div id="root"></div>
  <script>
    window.addEventListener("load", function() {
      setTimeout(function() {
        document.body.classList.add("app-loaded");
      }, 1000);
    });
  </script>
  <script>
    // Configuração da API para o frontend
    window.REACT_APP_API_URL = 'https://agroisync-prod.luispaulooliveira767.workers.dev/api';
  </script>
</body>
</html>`;

        return new Response(frontendHtml, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
            ...corsHeaders
          }
        });
      }

      // Serve static assets (CSS, JS, images, etc.)
      if (
        path.startsWith('/static/') ||
        path.endsWith('.css') ||
        path.endsWith('.js') ||
        path.endsWith('.png') ||
        path.endsWith('.jpg') ||
        path.endsWith('.jpeg') ||
        path.endsWith('.gif') ||
        path.endsWith('.svg') ||
        path.endsWith('.ico') ||
        path.endsWith('.woff') ||
        path.endsWith('.woff2') ||
        path.endsWith('.ttf') ||
        path.endsWith('.eot') ||
        path === '/manifest.json' ||
        path === '/favicon.svg' ||
        path === '/ui-txc-final-behaviors.js' ||
        path === '/force-reload-images.js'
      ) {
        // For static assets, we'll return a simple response indicating they should be served from CDN
        // In production, these would be served from Cloudflare Pages or a CDN
        return new Response('Static asset not found', {
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400'
          }
        });
      }

      // Default response
      return new Response(
        JSON.stringify({
          error: 'Not Found',
          message: 'Endpoint não encontrado',
          availableEndpoints: [
            '/health',
            '/api/auth/login',
            '/api/auth/register',
            '/api/auth/forgot-password',
            '/api/auth/reset-password',
            '/api/payments/stripe/webhook',
            '/api/payments/stripe/create-payment-intent',
            '/api/payments/plans',
            '/api/plans',
            '/api/products',
            '/api/freight-orders',
            '/api/chat/send',
            '/api/register',
            '/api/admin/stats',
            '/api/admin/users',
            '/api/blockchain/wallet',
            '/api/blockchain/prices',
            '/api/ai/recommendations',
            '/api/notifications/subscribe',
            '/api/address/countries',
            '/api/audit-logs/stats',
            '/api/feature-flags'
          ]
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    } catch {
      // console.error('Worker error:', error);

      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: 'Erro interno do servidor',
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
  }
};

// Handle API requests
function handleApiRequest(request, env, corsHeaders) {
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

  // Products routes
  if (path.startsWith('/api/products')) {
    return handleProductsRoutes(request, env, corsHeaders);
  }

  // Freight orders routes
  if (path.startsWith('/api/freight-orders')) {
    return handleFreightRoutes(request, env, corsHeaders);
  }

  // Chat routes
  if (path.startsWith('/api/chat/')) {
    return handleChatRoutes(request, env, corsHeaders);
  }

  // Registration routes
  if (path.startsWith('/api/register')) {
    return handleRegisterRoutes(request, env, corsHeaders);
  }

  // Admin routes
  if (path.startsWith('/api/admin/')) {
    return handleAdminRoutes(request, env, corsHeaders);
  }

  // Blockchain routes
  if (path.startsWith('/api/blockchain/')) {
    return handleBlockchainRoutes(request, env, corsHeaders);
  }

  // AI routes
  if (path.startsWith('/api/ai/')) {
    return handleAIRoutes(request, env, corsHeaders);
  }

  // Payment routes (additional)
  if (path.startsWith('/api/payments/')) {
    return handlePaymentRoutes(request, env, corsHeaders);
  }

  // Notification routes
  if (path.startsWith('/api/notifications/')) {
    return handleNotificationRoutes(request, env, corsHeaders);
  }

  // Address routes
  if (path.startsWith('/api/address/')) {
    return handleAddressRoutes(request, env, corsHeaders);
  }

  // Audit logs routes
  if (path.startsWith('/api/audit-logs/')) {
    return handleAuditRoutes(request, env, corsHeaders);
  }

  // Feature flags routes
  if (path.startsWith('/api/feature-flags')) {
    return handleFeatureFlagsRoutes(request, env, corsHeaders);
  }

  // Health check
  if (path === '/api/health') {
    return new Response(
      JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: env.NODE_ENV || 'production'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }

  // Default API response
  return new Response(
    JSON.stringify({
      success: true,
      message: 'API AgroSync funcionando',
      endpoints: {
        auth: '/api/auth/login, /api/auth/register, /api/auth/forgot-password, /api/auth/reset-password',
        payments:
          '/api/payments/stripe/webhook, /api/payments/stripe/create-payment-intent, /api/payments/plans',
        plans: '/api/plans',
        products: '/api/products',
        freight: '/api/freight-orders',
        chat: '/api/chat/send',
        register: '/api/register',
        admin: '/api/admin/stats, /api/admin/users',
        blockchain: '/api/blockchain/wallet, /api/blockchain/prices',
        ai: '/api/ai/recommendations, /api/ai/price-prediction',
        notifications: '/api/notifications/subscribe',
        address: '/api/address/countries, /api/address/validate',
        audit: '/api/audit-logs/stats, /api/audit-logs/export',
        features: '/api/feature-flags',
        health: '/api/health'
      }
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    }
  );
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
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Email e senha são obrigatórios'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }

      // Simular login (em produção, conectar com MongoDB)
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Login realizado com sucesso',
          data: {
            token: 'jwt_token_here',
            user: {
              id: 'user_id',
              email,
              name: 'Usuário Teste'
            }
          }
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Erro ao processar login'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
  }

  if (path === '/api/auth/register' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { name, email, password } = body;

      // Validação básica
      if (!name || !email || !password) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Nome, email e senha são obrigatórios'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }

      // Simular registro (em produção, conectar com MongoDB)
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Usuário registrado com sucesso',
          data: {
            token: 'jwt_token_here',
            user: {
              id: 'user_id',
              name,
              email
            }
          }
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Erro ao processar registro'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
  }

  if (path === '/api/auth/forgot-password' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { email } = body;

      if (!email) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Email é obrigatório'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }

      // Simular envio de email de recuperação
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email de recuperação enviado com sucesso'
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Erro ao processar solicitação'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
  }

  if (path === '/api/auth/reset-password' && request.method === 'POST') {
    try {
      const body = await request.json();
      const { token, password, confirmPassword } = body;

      if (!token || !password || !confirmPassword) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Token, senha e confirmação são obrigatórios'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }

      if (password !== confirmPassword) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Senhas não coincidem'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }

      // Simular reset de senha
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Senha redefinida com sucesso'
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Erro ao redefinir senha'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de autenticação não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle payment routes
function handlePaymentRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/payments/stripe/webhook' && request.method === 'POST') {
    try {
      const signature = request.headers.get('stripe-signature');

      if (!signature) {
        return new Response(
          JSON.stringify({
            error: 'Missing signature'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }

      // Em produção, verificar assinatura do Stripe
      // console.log('Stripe webhook received:', body);

      return new Response(
        JSON.stringify({
          received: true,
          message: 'Webhook processado com sucesso'
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    } catch {
      return new Response(
        JSON.stringify({
          error: 'Webhook processing failed'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de pagamento não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle plans routes
function handlePlansRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/plans' && request.method === 'GET') {
    const plans = {
      basic: {
        id: 'basic',
        name: 'Básico',
        price: 29.9,
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
        price: 99.9,
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
        price: 499.9,
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

    return new Response(
      JSON.stringify({
        success: true,
        data: Object.values(plans),
        annualDiscount: 0.15
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de planos não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle products routes
async function handleProductsRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/products' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: [],
        message: 'Lista de produtos (vazia - produtos serão cadastrados pelos clientes)'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path.startsWith('/api/products/') && request.method === 'GET') {
    const productId = path.split('/')[3];
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: productId,
          name: 'Produto Exemplo',
          price: 0,
          description: 'Produto cadastrado pelo cliente'
        }
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path === '/api/products' && request.method === 'POST') {
    try {
      const body = await request.json();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Produto criado com sucesso',
          data: { id: Date.now(), ...body }
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Erro ao criar produto'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de produtos não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle freight routes
async function handleFreightRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/freight-orders' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: [],
        message: 'Lista de fretes (vazia - fretes serão cadastrados pelos clientes)'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path === '/api/freight-orders' && request.method === 'POST') {
    try {
      const body = await request.json();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Frete criado com sucesso',
          data: { id: Date.now(), ...body }
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Erro ao criar frete'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
  }

  if (path.includes('/ai-closure') && request.method === 'POST') {
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          freightOrder: {
            aiClosure: {
              summary: 'Análise de IA gerada com sucesso',
              performanceMetrics: {
                onTimeDelivery: true,
                damageReport: 'Nenhum dano reportado',
                overallScore: 5
              }
            }
          }
        }
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path.includes('/complete-closure') && request.method === 'POST') {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Frete finalizado com sucesso'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de fretes não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle chat routes
async function handleChatRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/chat/send' && request.method === 'POST') {
    try {
      const formData = await request.formData();
      formData.get('message'); // Processar mensagem se necessário

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            conversationId: Date.now(),
            aiResponse: {
              text: 'Olá! Como posso ajudá-lo hoje?',
              timestamp: new Date().toISOString()
            }
          }
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Erro ao processar mensagem'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
  }

  if (path.startsWith('/api/chat/') && request.method === 'GET') {
    const conversationId = path.split('/')[3];
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          conversationId,
          messages: []
        }
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de chat não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle registration routes
async function handleRegisterRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/register' && request.method === 'POST') {
    try {
      const body = await request.json();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Registro realizado com sucesso',
          data: { id: Date.now(), ...body }
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Erro ao processar registro'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de registro não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle admin routes
function handleAdminRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/admin/stats' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          activeUsers: 0
        }
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path === '/api/admin/users' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: []
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de admin não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle blockchain routes
function handleBlockchainRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/blockchain/wallet' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          address: '0x0000000000000000000000000000000000000000',
          balance: '0',
          network: 'mainnet'
        }
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path === '/api/blockchain/prices' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          BTC: 50000,
          ETH: 3000,
          BNB: 300
        }
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path === '/api/blockchain/transactions' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: []
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de blockchain não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle AI routes
function handleAIRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/ai/recommendations' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: []
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path === '/api/ai/price-prediction' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          predictions: []
        }
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de AI não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle notification routes
function handleNotificationRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/notifications/subscribe' && request.method === 'POST') {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notificações ativadas com sucesso'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path === '/api/notifications/unsubscribe' && request.method === 'POST') {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notificações desativadas com sucesso'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de notificações não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle address routes
function handleAddressRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/address/countries' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: [
          { code: 'BR', name: 'Brasil' },
          { code: 'US', name: 'Estados Unidos' },
          { code: 'AR', name: 'Argentina' }
        ]
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path === '/api/address/validate' && request.method === 'POST') {
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          valid: true,
          formatted: 'Endereço válido'
        }
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de endereço não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle audit routes
function handleAuditRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/audit-logs/stats' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          totalLogs: 0,
          todayLogs: 0
        }
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path === '/api/audit-logs/export' && request.method === 'POST') {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Logs exportados com sucesso'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path === '/api/audit-logs/cleanup' && request.method === 'DELETE') {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Logs limpos com sucesso'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de auditoria não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

// Handle feature flags routes
function handleFeatureFlagsRoutes(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/feature-flags' && request.method === 'GET') {
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          enableChat: true,
          enableNotifications: true,
          enableAnalytics: true,
          enablePWA: true
        }
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  if (path === '/api/feature-flags' && request.method === 'POST') {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Feature flags atualizadas com sucesso'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Endpoint de feature flags não encontrado'
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}
