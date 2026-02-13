/**
 * Cloudflare Worker - AgroSync Backend Simplificado
 * Teste mínimo para rotas básicas
 */

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  try {
    // Health
    if (path === '/api/health') {
      return jsonResponse({ success: true, message: 'Worker is running' });
    }

    // Cotações - VERSÃO ULTRA SIMPLES
    if (path === '/api/cotacoes' && method === 'GET') {
      return jsonResponse({
        success: true,
        data: {
          soja: { preco: 89.50, variacao: 2.5, fonte: 'cepea', moeda: 'R$' },
          milho: { preco: 87.80, variacao: 1.8, fonte: 'cepea', moeda: 'R$' },
          cafe: { preco: 425.50, variacao: -0.5, fonte: 'cepea', moeda: 'R$' }
        },
        timestamp: new Date().toISOString()
      });
    }

    // Notícias - VERSÃO ULTRA SIMPLES
    if (path === '/api/news' && method === 'GET') {
      return jsonResponse({
        success: true,
        data: [
          {
            title: 'Soja sobe 2,5% em Chicago',
            description: 'Preços aumentaram nos mercados futuros de Chicago',
            url: 'https://agroisync.com',
            source: 'G1 Economia',
            imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=400&fit=crop',
            publishedAt: new Date().toISOString()
          },
          {
            title: 'Milho alcança maior preço do ano',
            description: 'O milho atingiu patamares acima de R$ 85/saca',
            url: 'https://agroisync.com',
            source: 'Canal Rural',
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop',
            publishedAt: new Date().toISOString()
          }
        ],
        count: 2
      });
    }

    // 404
    return jsonResponse({ error: 'Not found' }, 404);

  } catch (error) {
    console.error('Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

export default {
  fetch: handleRequest
};
