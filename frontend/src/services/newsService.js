// Serviço para notícias do agronegócio
class NewsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 1800000; // 30 minutos
    this.newsSources = [
      {
        name: 'Agrolink',
        url: 'https://www.agrolink.com.br/noticias',
        type: 'scrape'
      },
      {
        name: 'Canal Rural',
        url: 'https://www.canalrural.com.br/noticias',
        type: 'scrape'
      },
      {
        name: 'Notícias Agrícolas',
        url: 'https://www.noticiasagricolas.com.br/noticias',
        type: 'scrape'
      }
    ];
  }

  // Obter notícias principais do agronegócio
  async getMainNews(limit = 10) {
    try {
      const cacheKey = `main-news-${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      // Simular dados de notícias (em produção, usar APIs reais)
      const news = await this.getSimulatedNews(limit);
      
      this.setCachedData(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Erro ao obter notícias principais:', error);
      return this.getFallbackNews(limit);
    }
  }

  // Obter notícias por categoria
  async getNewsByCategory(category, limit = 10) {
    try {
      const cacheKey = `news-${category}-${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const news = await this.getSimulatedNewsByCategory(category, limit);
      
      this.setCachedData(cacheKey, news);
      return news;
    } catch (error) {
      console.error(`Erro ao obter notícias da categoria ${category}:`, error);
      return this.getFallbackNewsByCategory(category, limit);
    }
  }

  // Obter notícias em tempo real
  async getLiveNews(limit = 5) {
    try {
      const cacheKey = `live-news-${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const news = await this.getSimulatedLiveNews(limit);
      
      this.setCachedData(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Erro ao obter notícias em tempo real:', error);
      return this.getFallbackLiveNews(limit);
    }
  }

  // Buscar notícias por termo
  async searchNews(query, limit = 10) {
    try {
      const cacheKey = `search-${query}-${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const news = await this.getSimulatedSearchResults(query, limit);
      
      this.setCachedData(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      return this.getFallbackSearchResults(query, limit);
    }
  }

  // Simular notícias principais
  async getSimulatedNews(limit) {
    const categories = ['soja', 'milho', 'café', 'cana', 'gado', 'tecnologia', 'mercado', 'clima'];
    const news = [];

    for (let i = 0; i < limit; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      news.push({
        id: `news-${i + 1}`,
        title: this.getRandomTitle(category),
        summary: this.getRandomSummary(category),
        content: this.getRandomContent(category),
        category: category,
        source: this.getRandomSource(),
        author: this.getRandomAuthor(),
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
        imageUrl: this.getRandomImage(category),
        url: `#news-${i + 1}`,
        readTime: Math.floor(Math.random() * 5) + 2, // 2-7 minutos
        tags: this.getRandomTags(category),
        views: Math.floor(Math.random() * 10000) + 100,
        isBreaking: Math.random() > 0.8 // 20% chance de ser breaking
      });
    }

    // Ordenar por data de publicação
    return news.sort((a, b) => b.publishedAt - a.publishedAt);
  }

  // Simular notícias por categoria
  async getSimulatedNewsByCategory(category, limit) {
    const news = await this.getSimulatedNews(limit * 2);
    return news
      .filter(item => item.category === category)
      .slice(0, limit);
  }

  // Simular notícias em tempo real
  async getSimulatedLiveNews(limit) {
    const news = await this.getSimulatedNews(limit * 3);
    return news
      .filter(item => {
        const hoursAgo = (Date.now() - item.publishedAt.getTime()) / (1000 * 60 * 60);
        return hoursAgo <= 24; // Últimas 24 horas
      })
      .slice(0, limit);
  }

  // Simular resultados de busca
  async getSimulatedSearchResults(query, limit) {
    const allNews = await this.getSimulatedNews(limit * 3);
    const queryLower = query.toLowerCase();
    
    return allNews
      .filter(item => 
        item.title.toLowerCase().includes(queryLower) ||
        item.summary.toLowerCase().includes(queryLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(queryLower))
      )
      .slice(0, limit);
  }

  // Gerar títulos aleatórios por categoria
  getRandomTitle(category) {
    const titles = {
      soja: [
        'Preços da soja atingem máxima histórica no mercado brasileiro',
        'Exportação de soja cresce 15% no primeiro trimestre',
        'Nova tecnologia aumenta produtividade da soja em 20%',
        'Clima favorável impulsiona safra de soja 2024',
        'Soja brasileira conquista novos mercados internacionais'
      ],
      milho: [
        'Milho segunda safra supera expectativas de produtividade',
        'Preços do milho se estabilizam após alta histórica',
        'Tecnologia de irrigação aumenta produção de milho',
        'Exportação de milho atinge recorde mensal',
        'Milho transgênico mostra resultados promissores'
      ],
      café: [
        'Café arábica atinge melhor qualidade em 10 anos',
        'Exportação de café brasileiro cresce na Europa',
        'Nova variedade de café resiste à seca',
        'Café sustentável ganha mercado premium',
        'Produção de café orgânico aumenta 30%'
      ],
      cana: [
        'Safra de cana-de-açúcar supera expectativas',
        'Etanol de segunda geração revoluciona mercado',
        'Cana-de-açúcar se adapta às mudanças climáticas',
        'Produção de açúcar atinge máxima histórica',
        'Tecnologia reduz custos na produção de cana'
      ],
      gado: [
        'Pecuária sustentável ganha espaço no mercado',
        'Carne bovina brasileira conquista certificações internacionais',
        'Genética bovina melhora produtividade do rebanho',
        'Exportação de carne atinge novos recordes',
        'Tecnologia rastreia toda cadeia da carne'
      ],
      tecnologia: [
        'Agricultura 4.0 revoluciona produção no campo',
        'Drone mapeia lavouras com precisão milimétrica',
        'IA prevê produtividade com 95% de acerto',
        'Sensores IoT monitoram solo em tempo real',
        'Blockchain rastreia produtos do campo à mesa'
      ],
      mercado: [
        'Mercado futuro de commodities agrícolas cresce',
        'Investimentos em agronegócio batem recorde',
        'Fusões e aquisições movimentam setor agrícola',
        'Novos fundos investem em tecnologia agrícola',
        'Agronegócio representa 25% do PIB brasileiro'
      ],
      clima: [
        'Previsão climática favorece safra de grãos',
        'El Niño afeta produção agrícola no Sul',
        'Seca histórica impacta agricultura no Nordeste',
        'Chuvas regulares beneficiam lavouras',
        'Mudanças climáticas alteram calendário agrícola'
      ]
    };

    const categoryTitles = titles[category] || titles.tecnologia;
    return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
  }

  // Gerar resumos aleatórios
  getRandomSummary(category) {
    const summaries = [
      'Nova tecnologia promete revolucionar a produção agrícola brasileira, aumentando a produtividade e reduzindo custos.',
      'Mercado internacional demonstra forte interesse pelos produtos agrícolas brasileiros, impulsionando exportações.',
      'Pesquisas avançadas desenvolvem variedades mais resistentes às mudanças climáticas e pragas.',
      'Sistema de irrigação inteligente otimiza uso da água e aumenta eficiência na produção agrícola.',
      'Certificações internacionais abrem novos mercados para produtos agrícolas brasileiros.'
    ];

    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  // Gerar conteúdo aleatório
  getRandomContent(category) {
    const contents = [
      'A inovação tecnológica tem sido fundamental para o crescimento do agronegócio brasileiro. Com investimentos em pesquisa e desenvolvimento, o setor tem alcançado níveis recordes de produtividade, consolidando o Brasil como um dos principais produtores mundiais de alimentos.',
      'O mercado internacional reconhece cada vez mais a qualidade dos produtos agrícolas brasileiros. Certificações internacionais e sistemas de rastreabilidade garantem a origem e qualidade dos produtos, abrindo portas para novos mercados consumidores.',
      'A sustentabilidade tornou-se prioridade no agronegócio brasileiro. Práticas como agricultura de precisão, uso eficiente de recursos naturais e redução de emissões de carbono demonstram o compromisso do setor com o meio ambiente.',
      'A integração entre diferentes cadeias produtivas tem gerado sinergias importantes para o agronegócio. Desde a produção de insumos até a comercialização, cada elo da cadeia contribui para o sucesso do setor como um todo.',
      'O desenvolvimento de novas variedades de plantas e animais tem sido crucial para enfrentar os desafios climáticos e de produtividade. Pesquisas em genética e biotecnologia abrem novas possibilidades para o futuro da agricultura.'
    ];

    return contents[Math.floor(Math.random() * contents.length)];
  }

  // Gerar fontes aleatórias
  getRandomSource() {
    const sources = [
      'Agrolink',
      'Canal Rural',
      'Notícias Agrícolas',
      'Globo Rural',
      'Revista Agropecuária',
      'Portal do Agronegócio',
      'AgroRevista',
      'Cultivar'
    ];

    return sources[Math.floor(Math.random() * sources.length)];
  }

  // Gerar autores aleatórios
  getRandomAuthor() {
    const authors = [
      'Equipe AgroSync',
      'Redação Agrolink',
      'Especialista em Agronegócio',
      'Analista de Mercado',
      'Correspondente Rural',
      'Consultor Agrícola',
      'Pesquisador Agrícola',
      'Jornalista Especializado'
    ];

    return authors[Math.floor(Math.random() * authors.length)];
  }

  // Gerar imagens aleatórias
  getRandomImage(category) {
    const images = {
      soja: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'
      ],
      milho: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'
      ],
      café: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'
      ],
      cana: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'
      ],
      gado: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'
      ],
      tecnologia: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'
      ],
      mercado: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'
      ],
      clima: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'
      ]
    };

    const categoryImages = images[category] || images.tecnologia;
    return categoryImages[Math.floor(Math.random() * categoryImages.length)];
  }

  // Gerar tags aleatórias
  getRandomTags(category) {
    const allTags = [
      'agronegócio', 'agricultura', 'pecuária', 'tecnologia', 'inovação',
      'sustentabilidade', 'mercado', 'exportação', 'produtividade', 'clima',
      'pesquisa', 'desenvolvimento', 'certificação', 'qualidade', 'rastreabilidade'
    ];

    const categoryTags = [category, ...allTags.filter(tag => tag !== category)];
    const shuffled = categoryTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 5) + 3); // 3-7 tags
  }

  // Dados de fallback
  getFallbackNews(limit) {
    return Array.from({ length: limit }, (_, i) => ({
      id: `fallback-${i + 1}`,
      title: 'Notícias temporariamente indisponíveis',
      summary: 'Estamos trabalhando para restaurar o serviço de notícias.',
      content: 'Em breve você terá acesso às últimas notícias do agronegócio.',
      category: 'geral',
      source: 'AgroSync',
      author: 'Sistema',
      publishedAt: new Date(),
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
      url: '#',
      readTime: 1,
      tags: ['agronegócio', 'notícias'],
      views: 0,
      isBreaking: false
    }));
  }

  getFallbackNewsByCategory(category, limit) {
    return this.getFallbackNews(limit).map(news => ({
      ...news,
      category: category
    }));
  }

  getFallbackLiveNews(limit) {
    return this.getFallbackNews(limit).map(news => ({
      ...news,
      isBreaking: true
    }));
  }

  getFallbackSearchResults(query, limit) {
    return this.getFallbackNews(limit).map(news => ({
      ...news,
      title: `Resultados para: ${query}`,
      summary: 'Nenhum resultado encontrado para sua busca.'
    }));
  }

  // Gerenciamento de cache
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Limpar cache
  clearCache() {
    this.cache.clear();
  }

  // Formatar data de publicação
  formatPublishedDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Obter categoria em português
  getCategoryName(category) {
    const categories = {
      soja: 'Soja',
      milho: 'Milho',
      café: 'Café',
      cana: 'Cana-de-açúcar',
      gado: 'Pecuária',
      tecnologia: 'Tecnologia',
      mercado: 'Mercado',
      clima: 'Clima',
      geral: 'Geral'
    };

    return categories[category] || category;
  }
}

export default new NewsService();
