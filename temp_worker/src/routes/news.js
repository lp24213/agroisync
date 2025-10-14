import express from 'express';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { getClientIP } from '../utils/ipUtils.js';
import axios from 'axios';
import logger from '../utils/logger.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// Simulated news data (in production, this would come from a database or external API)
const mockNews = [
  {
    id: 1,
    title: 'Safra de soja 2024/25 deve crescer 5% no Brasil',
    summary: 'Estimativas apontam para produÃ§Ã£o recorde de 158 milhÃµes de toneladas',
    content:
      'A safra de soja 2024/25 no Brasil deve crescer 5% em relaÃ§Ã£o Ã  temporada anterior, atingindo 158 milhÃµes de toneladas, segundo estimativas da Companhia Nacional de Abastecimento (Conab). O aumento Ã© impulsionado pela expansÃ£o da Ã¡rea plantada e melhores condiÃ§Ãµes climÃ¡ticas.',
    category: 'grains',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
    source: 'AgroNews',
    publishedAt: '2024-01-15T10:00:00Z',
    isActive: true,
    tags: ['soja', 'safra', 'conab', 'produÃ§Ã£o']
  },
  {
    id: 2,
    title: 'Tecnologia de irrigaÃ§Ã£o inteligente reduz consumo de Ã¡gua em 30%',
    summary: 'Sistema automatizado monitora umidade do solo e otimiza uso de recursos hÃ­dricos',
    content:
      'Novas tecnologias de irrigaÃ§Ã£o inteligente estÃ£o revolucionando a agricultura brasileira, permitindo reduÃ§Ã£o de atÃ© 30% no consumo de Ã¡gua. Sensores IoT monitoram a umidade do solo em tempo real, ajustando automaticamente a irrigaÃ§Ã£o conforme as necessidades das plantas.',
    category: 'technology',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    source: 'TechAgro',
    publishedAt: '2024-01-14T14:30:00Z',
    isActive: true,
    tags: ['irrigaÃ§Ã£o', 'tecnologia', 'IoT', 'sustentabilidade']
  },
  {
    id: 3,
    title: 'ExportaÃ§Ãµes de carne bovina batem recorde em dezembro',
    summary: 'Volume exportado supera 200 mil toneladas, maior marca para o mÃªs',
    content:
      'As exportaÃ§Ãµes brasileiras de carne bovina em dezembro de 2023 atingiram 203 mil toneladas, representando um crescimento de 12% em relaÃ§Ã£o ao mesmo perÃ­odo do ano anterior. A China continua sendo o principal destino, seguida pelos Estados Unidos e UniÃ£o Europeia.',
    category: 'livestock',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
    source: 'AgroBusiness',
    publishedAt: '2024-01-13T16:45:00Z',
    isActive: true,
    tags: ['carne bovina', 'exportaÃ§Ã£o', 'china', 'mercado']
  },
  {
    id: 4,
    title: 'Fertilizantes orgÃ¢nicos ganham espaÃ§o no mercado brasileiro',
    summary: 'Produtores buscam alternativas sustentÃ¡veis aos fertilizantes quÃ­micos',
    content:
      'O mercado de fertilizantes orgÃ¢nicos no Brasil estÃ¡ em expansÃ£o, impulsionado pela busca por prÃ¡ticas agrÃ­colas mais sustentÃ¡veis. Produtores estÃ£o investindo em compostagem, biofertilizantes e outras alternativas naturais para reduzir dependÃªncia de insumos quÃ­micos.',
    category: 'fertilizers',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
    source: 'SustentAgro',
    publishedAt: '2024-01-12T09:15:00Z',
    isActive: true,
    tags: ['fertilizantes orgÃ¢nicos', 'sustentabilidade', 'agricultura orgÃ¢nica']
  },
  {
    id: 5,
    title: 'PreÃ§os do milho se estabilizam apÃ³s perÃ­odo de alta',
    summary: 'Oferta adequada e demanda estÃ¡vel levam Ã  estabilizaÃ§Ã£o dos preÃ§os',
    content:
      'Os preÃ§os do milho no mercado brasileiro se estabilizaram apÃ³s um perÃ­odo de alta significativa. A oferta adequada do grÃ£o e a demanda estÃ¡vel por parte dos produtores de raÃ§Ã£o animal contribuÃ­ram para a estabilizaÃ§Ã£o dos preÃ§os nas principais praÃ§as do paÃ­s.',
    category: 'grains',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
    source: 'MercadoAgro',
    publishedAt: '2024-01-11T11:20:00Z',
    isActive: true,
    tags: ['milho', 'preÃ§os', 'mercado', 'oferta']
  }
];

// GET /api/v1/news - Get latest news
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    let filteredNews = [...mockNews];

    // Filter by category
    if (category) {
      filteredNews = filteredNews.filter(news => news.category === category && news.isActive);
    }

    // Filter by search term
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filteredNews = filteredNews.filter(
        news =>
          news.isActive &&
          (searchRegex.test(news.title) ||
            searchRegex.test(news.summary) ||
            searchRegex.test(news.content) ||
            news.tags.some(tag => searchRegex.test(tag)))
      );
    }

    // Sort news
    filteredNews.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'publishedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Pagination
    const skip = (parseInt(page, 10, 10) - 1) * parseInt(limit, 10, 10);
    const paginatedNews = filteredNews.slice(skip, skip + parseInt(limit, 10, 10));

    // Calculate pagination info
    const total = filteredNews.length;
    const totalPages = Math.ceil(total / parseInt(limit, 10, 10));

    res.json({
      success: true,
      data: {
        news: paginatedNews,
        pagination: {
          currentPage: parseInt(page, 10, 10),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit, 10, 10),
          hasNextPage: parseInt(page, 10, 10) < totalPages,
          hasPrevPage: parseInt(page, 10, 10) > 1
        }
      }
    });
  } catch (error) {
    logger.error('Get news error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter notÃ­cias'
    });
  }
});

// GET /api/v1/news/categories - Get news categories
router.get('/categories', (req, res) => {
  try {
    const categories = [
      {
        id: 'grains',
        name: 'GrÃ£os',
        count: mockNews.filter(n => n.category === 'grains' && n.isActive).length
      },
      {
        id: 'technology',
        name: 'Tecnologia',
        count: mockNews.filter(n => n.category === 'technology' && n.isActive).length
      },
      {
        id: 'livestock',
        name: 'PecuÃ¡ria',
        count: mockNews.filter(n => n.category === 'livestock' && n.isActive).length
      },
      {
        id: 'fertilizers',
        name: 'Fertilizantes',
        count: mockNews.filter(n => n.category === 'fertilizers' && n.isActive).length
      },
      {
        id: 'machinery',
        name: 'MaquinÃ¡rio',
        count: mockNews.filter(n => n.category === 'machinery' && n.isActive).length
      },
      {
        id: 'market',
        name: 'Mercado',
        count: mockNews.filter(n => n.category === 'market' && n.isActive).length
      }
    ];

    res.json({
      success: true,
      data: {
        categories,
        totalCategories: categories.length
      }
    });
  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter categorias'
    });
  }
});

// GET /api/v1/news/:id - Get news article by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const news = mockNews.find(n => n.id === parseInt(id, 10, 10) && n.isActive);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'NotÃ­cia nÃ£o encontrada'
      });
    }

    // Get related news (same category, excluding current)
    const relatedNews = mockNews
      .filter(n => n.id !== parseInt(id, 10, 10) && n.category === news.category && n.isActive)
      .slice(0, 3);

    res.json({
      success: true,
      data: {
        news,
        relatedNews
      }
    });
  } catch (error) {
    logger.error('Get news by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter notÃ­cia'
    });
  }
});

// GET /api/v1/news/rss/agribusiness - Get agribusiness RSS feed
router.get('/rss/agribusiness', (req, res) => {
  try {
    // Filter agribusiness related news
    const agribusinessNews = mockNews
      .filter(
        news =>
          news.isActive &&
          (news.category === 'grains' ||
            news.category === 'livestock' ||
            news.category === 'fertilizers' ||
            news.category === 'machinery')
      )
      .slice(0, 10);

    // Create RSS feed
    const items = agribusinessNews
      .map(
        n => `
    <item>
      <title><![CDATA[${n.title}]]></title>
      <link>https://agrotm.com.br/news/${n.id}</link>
      <description><![CDATA[${n.summary}]]></description>
      <category>${n.category}</category>
      <pubDate>${new Date(n.publishedAt).toUTCString()}</pubDate>
      <guid>https://agrotm.com.br/news/${n.id}</guid>
    </item>`
      )
      .join('');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>AGROTM - Notícias do Agronegócio</title>\n    <link>https://agrotm.com.br/news</link>\n    <description>Últimas notícias e atualizações do setor agrícola brasileiro</description>\n    <language>pt-BR</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n    <atom:link href="https://agrotm.com.br/api/v1/news/rss/agribusiness" rel="self" type="application/rss+xml" />\n${items}\n  </channel>\n</rss>`;

    res.set('Content-Type', 'application/xml');
    res.send(rssFeed);
  } catch (error) {
    logger.error('RSS feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar feed RSS'
    });
  }
});

// GET /api/v1/news/featured - Get featured news
router.get('/featured', (req, res) => {
  try {
    const featuredNews = mockNews
      .filter(news => news.isActive)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        featuredNews,
        totalFeatured: featuredNews.length
      }
    });
  } catch (error) {
    logger.error('Get featured news error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter notÃ­cias em destaque'
    });
  }
});

// ConfiguraÃ§Ãµes
const RSS_URLS = {
  'globo-rural': 'https://g1.globo.com/rss/g1/economia/agronegocios/',
  agrolink: 'https://www.agrolink.com.br/rss/noticias',
  'canal-rural': 'https://www.canalrural.com.br/rss/noticias'
};

// GET /api/news/globo-rural - Obter notÃ­cias do Globo Rural
router.get(
  '/globo-rural',
  apiLimiter, // Use the existing apiLimiter
  async (req, res) => {
    try {
      const rssUrl = RSS_URLS['globo-rural'];

      // Fazer requisiÃ§Ã£o para o RSS
      const response = await axios.get(rssUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'AgroSync-News/1.0'
        }
      });

      // Parsear o XML RSS (simplificado)
      const rssData = parseRSSXML(response.data);

      res.json({
        success: true,
        source: 'Globo Rural',
        lastUpdated: new Date().toISOString(),
        items: rssData.items || []
      });
    } catch (error) {
      logger.error('Erro ao obter notícias do Globo Rural:', error);
      // Retornar dados de fallback
      res.json({
        success: true,
        source: 'Globo Rural (Fallback)',
        lastUpdated: new Date().toISOString(),
        items: getFallbackNews()
      });
    }
  }
);

// GET /api/news/agrolink - Obter notÃ­cias do Agrolink
router.get(
  '/agrolink',
  apiLimiter, // Use the existing apiLimiter
  async (req, res) => {
    try {
      const rssUrl = RSS_URLS['agrolink'];

      const response = await axios.get(rssUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'AgroSync-News/1.0'
        }
      });

      const rssData = parseRSSXML(response.data);

      res.json({
        success: true,
        source: 'Agrolink',
        lastUpdated: new Date().toISOString(),
        items: rssData.items || []
      });
    } catch (error) {
      logger.error('Erro ao obter notícias do Agrolink:', error);
      res.json({
        success: true,
        source: 'Agrolink (Fallback)',
        lastUpdated: new Date().toISOString(),
        items: getFallbackNews()
      });
    }
  }
);

// GET /api/news/canal-rural - Obter notÃ­cias do Canal Rural
router.get(
  '/canal-rural',
  apiLimiter, // Use the existing apiLimiter
  async (req, res) => {
    try {
      const rssUrl = RSS_URLS['canal-rural'];

      const response = await axios.get(rssUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'AgroSync-News/1.0'
        }
      });

      const rssData = parseRSSXML(response.data);

      res.json({
        success: true,
        source: 'Canal Rural',
        lastUpdated: new Date().toISOString(),
        items: rssData.items || []
      });
    } catch (error) {
      logger.error('Erro ao obter notícias do Canal Rural:', error);
      res.json({
        success: true,
        source: 'Canal Rural (Fallback)',
        lastUpdated: new Date().toISOString(),
        items: getFallbackNews()
      });
    }
  }
);

// GET /api/news/all - Obter notÃ­cias de todas as fontes
router.get(
  '/all',
  apiLimiter, // Use the existing apiLimiter
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit, 10, 10) || 20;
      const sources = Object.keys(RSS_URLS);
      const allNews = [];

      // Obter notÃ­cias de todas as fontes
      for (const source of sources) {
        try {
          const response = await axios.get(RSS_URLS[source], {
            timeout: 5000,
            headers: {
              'User-Agent': 'AgroSync-News/1.0'
            }
          });

          const rssData = parseRSSXML(response.data);
          if (rssData.items && rssData.items.length > 0) {
            allNews.push(...rssData.items.slice(0, Math.ceil(limit / sources.length)));
          }
        } catch (error) {
          logger.warn(`Erro ao obter notícias de ${source}:`, error.message);
        }
      }

      // Ordenar por data e limitar
      const sortedNews = allNews
        .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
        .slice(0, limit);

      res.json({
        success: true,
        sources,
        lastUpdated: new Date().toISOString(),
        totalItems: sortedNews.length,
        items: sortedNews
      });
    } catch (error) {
      logger.error('Erro ao obter notícias de todas as fontes:', error);
      res.json({
        success: true,
        sources: ['Fallback'],
        lastUpdated: new Date().toISOString(),
        totalItems: 10,
        items: getFallbackNews(10)
      });
    }
  }
);

// FunÃ§Ã£o para parsear XML RSS (simplificada)
function parseRSSXML(xmlString) {
  try {
    // Parse bÃ¡sico do XML RSS
    const items = [];

    // Extrair itens do RSS
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlString)) !== null) {
      const itemContent = match[1];

      const title = extractTag(itemContent, 'title');
      const description = extractTag(itemContent, 'description');
      const link = extractTag(itemContent, 'link');
      const pubDate = extractTag(itemContent, 'pubDate');
      const guid = extractTag(itemContent, 'guid');

      if (title && link) {
        items.push({
          title: decodeXMLEntities(title),
          description: decodeXMLEntities(description || ''),
          link: decodeXMLEntities(link),
          pubDate: pubDate || new Date().toISOString(),
          guid: guid || link
        });
      }
    }

    return { items };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao parsear XML RSS:', error);
    }
    return { items: [] };
  }
}

// FunÃ§Ã£o para extrair conteÃºdo de tags XML
function extractTag(content, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

// FunÃ§Ã£o para decodificar entidades XML
function decodeXMLEntities(text) {
  if (!text) {
    return '';
  }

  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// FunÃ§Ã£o para gerar notÃ­cias de fallback
function getFallbackNews(limit = 10) {
  const fallbackNews = [
    {
      title: 'Mercado agrÃ­cola em alta com forte demanda internacional',
      description:
        'Commodities agrÃ­colas brasileiras registram alta expressiva com forte demanda de paÃ­ses asiÃ¡ticos.',
      link: 'https://g1.globo.com/economia/agronegocios/',
      pubDate: new Date().toISOString(),
      guid: 'fallback-1'
    },
    {
      title: 'Tecnologia revoluciona agricultura brasileira',
      description:
        'Novas tecnologias como drones e IoT aumentam produtividade no campo brasileiro.',
      link: 'https://g1.globo.com/economia/agronegocios/',
      pubDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      guid: 'fallback-2'
    },
    {
      title: 'Clima favorÃ¡vel para safra de grÃ£os 2024',
      description:
        'PrevisÃµes climÃ¡ticas indicam condiÃ§Ãµes favorÃ¡veis para a prÃ³xima safra de grÃ£os.',
      link: 'https://g1.globo.com/economia/agronegocios/',
      pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      guid: 'fallback-3'
    },
    {
      title: 'ExportaÃ§Ã£o de carne bovina atinge recorde',
      description:
        'Setor de carne bovina brasileiro registra recorde de exportaÃ§Ãµes para mercados internacionais.',
      link: 'https://g1.globo.com/economia/agronegocios/',
      pubDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      guid: 'fallback-4'
    },
    {
      title: 'Investimentos em agricultura sustentÃ¡vel crescem',
      description:
        'Produtores rurais investem cada vez mais em prÃ¡ticas sustentÃ¡veis e certificaÃ§Ãµes ambientais.',
      link: 'https://g1.globo.com/economia/agronegocios/',
      pubDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      guid: 'fallback-5'
    }
  ];

  return fallbackNews.slice(0, limit);
}

export default router;
