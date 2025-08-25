import express from 'express';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { getClientIP } from '../utils/ipUtils.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// Simulated news data (in production, this would come from a database or external API)
const mockNews = [
  {
    id: 1,
    title: 'Safra de soja 2024/25 deve crescer 5% no Brasil',
    summary: 'Estimativas apontam para produção recorde de 158 milhões de toneladas',
    content:
      'A safra de soja 2024/25 no Brasil deve crescer 5% em relação à temporada anterior, atingindo 158 milhões de toneladas, segundo estimativas da Companhia Nacional de Abastecimento (Conab). O aumento é impulsionado pela expansão da área plantada e melhores condições climáticas.',
    category: 'grains',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
    source: 'AgroNews',
    publishedAt: '2024-01-15T10:00:00Z',
    isActive: true,
    tags: ['soja', 'safra', 'conab', 'produção']
  },
  {
    id: 2,
    title: 'Tecnologia de irrigação inteligente reduz consumo de água em 30%',
    summary: 'Sistema automatizado monitora umidade do solo e otimiza uso de recursos hídricos',
    content:
      'Novas tecnologias de irrigação inteligente estão revolucionando a agricultura brasileira, permitindo redução de até 30% no consumo de água. Sensores IoT monitoram a umidade do solo em tempo real, ajustando automaticamente a irrigação conforme as necessidades das plantas.',
    category: 'technology',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    source: 'TechAgro',
    publishedAt: '2024-01-14T14:30:00Z',
    isActive: true,
    tags: ['irrigação', 'tecnologia', 'IoT', 'sustentabilidade']
  },
  {
    id: 3,
    title: 'Exportações de carne bovina batem recorde em dezembro',
    summary: 'Volume exportado supera 200 mil toneladas, maior marca para o mês',
    content:
      'As exportações brasileiras de carne bovina em dezembro de 2023 atingiram 203 mil toneladas, representando um crescimento de 12% em relação ao mesmo período do ano anterior. A China continua sendo o principal destino, seguida pelos Estados Unidos e União Europeia.',
    category: 'livestock',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
    source: 'AgroBusiness',
    publishedAt: '2024-01-13T16:45:00Z',
    isActive: true,
    tags: ['carne bovina', 'exportação', 'china', 'mercado']
  },
  {
    id: 4,
    title: 'Fertilizantes orgânicos ganham espaço no mercado brasileiro',
    summary: 'Produtores buscam alternativas sustentáveis aos fertilizantes químicos',
    content:
      'O mercado de fertilizantes orgânicos no Brasil está em expansão, impulsionado pela busca por práticas agrícolas mais sustentáveis. Produtores estão investindo em compostagem, biofertilizantes e outras alternativas naturais para reduzir dependência de insumos químicos.',
    category: 'fertilizers',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
    source: 'SustentAgro',
    publishedAt: '2024-01-12T09:15:00Z',
    isActive: true,
    tags: ['fertilizantes orgânicos', 'sustentabilidade', 'agricultura orgânica']
  },
  {
    id: 5,
    title: 'Preços do milho se estabilizam após período de alta',
    summary: 'Oferta adequada e demanda estável levam à estabilização dos preços',
    content:
      'Os preços do milho no mercado brasileiro se estabilizaram após um período de alta significativa. A oferta adequada do grão e a demanda estável por parte dos produtores de ração animal contribuíram para a estabilização dos preços nas principais praças do país.',
    category: 'grains',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
    source: 'MercadoAgro',
    publishedAt: '2024-01-11T11:20:00Z',
    isActive: true,
    tags: ['milho', 'preços', 'mercado', 'oferta']
  }
];

// GET /api/v1/news - Get latest news
router.get('/', async (req, res) => {
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
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedNews = filteredNews.slice(skip, skip + parseInt(limit));

    // Calculate pagination info
    const total = filteredNews.length;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        news: paginatedNews,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter notícias'
    });
  }
});

// GET /api/v1/news/categories - Get news categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      {
        id: 'grains',
        name: 'Grãos',
        count: mockNews.filter(n => n.category === 'grains' && n.isActive).length
      },
      {
        id: 'technology',
        name: 'Tecnologia',
        count: mockNews.filter(n => n.category === 'technology' && n.isActive).length
      },
      {
        id: 'livestock',
        name: 'Pecuária',
        count: mockNews.filter(n => n.category === 'livestock' && n.isActive).length
      },
      {
        id: 'fertilizers',
        name: 'Fertilizantes',
        count: mockNews.filter(n => n.category === 'fertilizers' && n.isActive).length
      },
      {
        id: 'machinery',
        name: 'Maquinário',
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
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter categorias'
    });
  }
});

// GET /api/v1/news/:id - Get news article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const news = mockNews.find(n => n.id === parseInt(id) && n.isActive);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Notícia não encontrada'
      });
    }

    // Get related news (same category, excluding current)
    const relatedNews = mockNews
      .filter(n => n.id !== parseInt(id) && n.category === news.category && n.isActive)
      .slice(0, 3);

    res.json({
      success: true,
      data: {
        news,
        relatedNews
      }
    });
  } catch (error) {
    console.error('Get news by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter notícia'
    });
  }
});

// GET /api/v1/news/rss/agribusiness - Get agribusiness RSS feed
router.get('/rss/agribusiness', async (req, res) => {
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
    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AGROTM - Notícias do Agronegócio</title>
    <link>https://agrotm.com.br/news</link>
    <description>Últimas notícias e atualizações do setor agrícola brasileiro</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://agrotm.com.br/api/v1/news/rss/agribusiness" rel="self" type="application/rss+xml" />
    ${agribusinessNews
      .map(
        news => `
    <item>
      <title><![CDATA[${news.title}]]></title>
      <link>https://agrotm.com.br/news/${news.id}</link>
      <description><![CDATA[${news.summary}]]></description>
      <category>${news.category}</category>
      <pubDate>${new Date(news.publishedAt).toUTCString()}</pubDate>
      <guid>https://agrotm.com.br/news/${news.id}</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

    res.set('Content-Type', 'application/xml');
    res.send(rssFeed);
  } catch (error) {
    console.error('RSS feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar feed RSS'
    });
  }
});

// GET /api/v1/news/featured - Get featured news
router.get('/featured', async (req, res) => {
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
    console.error('Get featured news error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter notícias em destaque'
    });
  }
});

export default router;
