/* eslint-disable no-console */
// Função para hash de senha usando Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Função para verificar senha
async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Função para sanitizar entrada
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Função para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Rate limiting simples
const rateLimitMap = new Map();

function checkRateLimit(ip, endpoint) {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const windowMs = 60000; // 1 minuto
  const maxRequests = 100; // 100 requests por minuto para API

  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const data = rateLimitMap.get(key);
  if (now > data.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (data.count >= maxRequests) {
    return false;
  }

  data.count++;
  return true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const clientIP = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    // CORS headers - Segurança restrita
    const allowedOrigins = [
      'https://agroisync.com',
      'https://www.agroisync.com',
      'https://b72aba08.agroisync.pages.dev',
      'http://localhost:3000',
      'http://localhost:3001'
    ];

    const origin = request.headers.get('Origin');
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin)
        ? origin
        : 'https://agroisync.com',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          service: 'AGROISYNC API Worker',
          version: '2.3.1'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Freight Orders API
    if (url.pathname.startsWith('/api/freight-orders')) {
      if (request.method === 'GET' && url.pathname === '/api/freight-orders') {
        // Listar pedidos de frete
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              freightOrders: []
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (request.method === 'POST' && url.pathname === '/api/freight-orders') {
        // Criar pedido de frete
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Pedido de frete criado com sucesso',
            data: {
              freightOrder: {
                id: 'mock-id',
                orderNumber: 'FR-001',
                status: 'pending'
              }
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (request.method === 'POST' && url.pathname.includes('/ai-closure')) {
        // Fechamento assistido por IA
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Fechamento assistido por IA iniciado',
            data: {
              freightOrder: {
                id: 'mock-id',
                orderNumber: 'FR-001',
                aiClosure: {
                  summary: 'Análise de IA gerada com sucesso!',
                  recommendations: ['Recomendação 1', 'Recomendação 2'],
                  score: 95
                }
              }
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (request.method === 'POST' && url.pathname.includes('/complete-closure')) {
        // Completar fechamento
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Fechamento completado com sucesso',
            data: {
              freightOrder: {
                id: 'mock-id',
                orderNumber: 'FR-001',
                status: 'closed'
              }
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Rota não encontrada
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Rota não encontrada'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Plans API
    if (url.pathname.startsWith('/api/plans')) {
      if (request.method === 'GET' && url.pathname === '/api/plans') {
        // Listar planos
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              plans: [
                {
                  id: 'basic',
                  name: 'Básico',
                  price: 0,
                  features: ['Recursos básicos', 'Suporte por email']
                },
                {
                  id: 'premium',
                  name: 'Premium',
                  price: 99,
                  features: ['Recursos avançados', 'Suporte prioritário', 'Analytics']
                }
              ]
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Rota não encontrada
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Rota não encontrada'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Marketplace API
    if (url.pathname.startsWith('/api/marketplace')) {
      if (request.method === 'GET' && url.pathname === '/api/marketplace/products') {
        // Listar produtos
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              products: []
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Rota não encontrada
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Rota não encontrada'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Crypto API
    if (url.pathname.startsWith('/api/crypto')) {
      if (request.method === 'GET' && url.pathname === '/api/crypto/prices') {
        // Preços de crypto
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              prices: [
                { symbol: 'BTC', price: 45000, change: 2.5 },
                { symbol: 'ETH', price: 3000, change: -1.2 }
              ]
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Rota não encontrada
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Rota não encontrada'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Weather API
    if (url.pathname.startsWith('/api/weather')) {
      if (request.method === 'GET' && url.pathname === '/api/weather/current') {
        // Dados do clima
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              temperature: 32,
              condition: 'Ensolarado',
              humidity: 45,
              windSpeed: 8
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Rota não encontrada
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Rota não encontrada'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // News API
    if (url.pathname.startsWith('/api/news')) {
      if (request.method === 'GET' && url.pathname === '/api/news/agribusiness') {
        // Notícias do agronegócio
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              news: [
                {
                  id: 1,
                  category: 'COMMODITIES',
                  title: 'Soja atinge maior preço em 3 meses com alta da demanda chinesa',
                  time: '3h atrás'
                },
                {
                  id: 2,
                  category: 'TECNOLOGIA',
                  title: 'Tecnologia SG revoluciona monitoramento de safras no Brasil',
                  time: '3h atrás'
                },
                {
                  id: 3,
                  category: 'CLIMA',
                  title: 'Chuva em excesso preocupa produtores de milho no Centro-Oeste',
                  time: '3h atrás'
                }
              ]
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Rota não encontrada
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Rota não encontrada'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 404 - Rota não encontrada
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Rota não encontrada',
        availableRoutes: [
          'GET /api/health',
          'GET /api/freight-orders',
          'POST /api/freight-orders',
          'POST /api/freight-orders/:id/ai-closure',
          'POST /api/freight-orders/:id/complete-closure',
          'GET /api/plans',
          'GET /api/marketplace/products',
          'GET /api/crypto/prices',
          'GET /api/weather/current',
          'GET /api/news/agribusiness'
        ]
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};
