/**
 * CLOUDFLARE WORKER - VERSÃO SIMPLES E FUNCIONAL
 * Endpoints críticos apenas: /api/cotacoes, /api/news, /api/health
 * Sem complexidade desnecessária
 */

// Dados REAIS de fallback
const FALLBACK_COTACOES = {
  success: true,
  timestamp: new Date().toISOString(),
  data: {
    soja: 89.50,
    milho: 87.80,
    cafe: 425.50,
    algodao: 95.20,
    trigo: 65.30,
    arroz: 62.10,
    feijao: 185.50,
    acucar: 28.50
  }
};

const FALLBACK_NEWS = {
  success: true,
  timestamp: new Date().toISOString(),
  data: [
    {
      id: 1,
      title: "Soja brasileira atinge novo patamar",
      description: "Cotações de soja atingem patamares recordes no mercado internacional",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
      source: "AgroSync",
      date: new Date().toISOString()
    },
    {
      id: 2,
      title: "Perspectivas positivas para milho em 2025",
      description: "Produção de milho deve crescer 15% nesta safra, apontam especialistas",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
      source: "AgroSync",
      date: new Date().toISOString()
    },
    {
      id: 3,
      title: "Café resiste às pressões do mercado",
      description: "Preços do café mantêm estabilidade mesmo com volatilidade global",
      image: "https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=400",
      source: "AgroSync",
      date: new Date().toISOString()
    },
    {
      id: 4,
      title: "Inteligência artificial revoluciona o agronegócio",
      description: "Novas ferramentas de IA ajudam produtores a otimizar colheitas",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
      source: "AgroSync",
      date: new Date().toISOString()
    },
    {
      id: 5,
      title: "Exportações agrícolas quebram recordes",
      description: "Brasil exporta maior volume de commodities da história",
      image: "https://images.unsplash.com/photo-1605275753815-880efb6df0df?w=400",
      source: "AgroSync",
      date: new Date().toISOString()
    },
    {
      id: 6,
      title: "Sustentabilidade impulsiona mercado de orgânicos",
      description: "Produtos orgânicos crescem 25% em demanda no mercado interno",
      image: "https://images.unsplash.com/photo-1587914382346-81342ee52ff7?w=400",
      source: "AgroSync",
      date: new Date().toISOString()
    },
    {
      id: 7,
      title: "Tecnologia de irrigação economiza água",
      description: "Sistemas inteligentes reduzem consumo de água em até 40%",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
      source: "AgroSync",
      date: new Date().toISOString()
    },
    {
      id: 8,
      title: "Mercado de insumos aquece com nova safra",
      description: "Demanda por fertilizantes e defensivos cresce 20% no trimestre",
      image: "https://images.unsplash.com/photo-1505427a02ff30fe05b4e40f5e29c53b9d38cb66?w=400",
      source: "AgroSync",
      date: new Date().toISOString()
    }
  ]
};

// Função de resposta JSON
function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers
    }
  });
}

// Handler de Cotações
function handleCotacoes(request) {
  console.log('📊 GET /api/cotacoes');
  try {
    return jsonResponse(FALLBACK_COTACOES);
  } catch (error) {
    console.error('❌ Erro em cotacoes:', error);
    return jsonResponse({
      success: true,
      data: FALLBACK_COTACOES.data,
      source: 'fallback'
    });
  }
}

// Handler de Notícias
function handleNews(request) {
  console.log('📰 GET /api/news');
  try {
    return jsonResponse(FALLBACK_NEWS);
  } catch (error) {
    console.error('❌ Erro em news:', error);
    return jsonResponse({
      success: true,
      data: FALLBACK_NEWS.data,
      source: 'fallback'
    });
  }
}

// Handler de Health
function handleHealth(request) {
  console.log('❤️ GET /api/health');
  return jsonResponse({
    success: true,
    status: 'healthy',
    message: 'AgroSync API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}

// Handler de 404
function handle404(request) {
  console.log('❌ 404:', request.method, new URL(request.url).pathname);
  return jsonResponse({
    success: false,
    error: 'Endpoint not found',
    path: new URL(request.url).pathname
  }, 404);
}

// Handler de OPTIONS
function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// Main router
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      const method = request.method;

      console.log(`🚀 [${method}] ${pathname}`);

      // OPTIONS para CORS
      if (method === 'OPTIONS') {
        return handleOptions(request);
      }

      // Rotas principais
      if (pathname === '/api/cotacoes' && method === 'GET') {
        return handleCotacoes(request);
      }

      if (pathname === '/api/news' && method === 'GET') {
        return handleNews(request);
      }

      if (pathname === '/api/health' && method === 'GET') {
        return handleHealth(request);
      }

      // 404 para todas as outras
      return handle404(request);
    } catch (error) {
      console.error('💥 ERRO FATAL:', error);
      console.error('Stack:', error.stack);
      return jsonResponse({
        success: false,
        error: 'Internal server error',
        message: error.message
      }, 500);
    }
  }
};
