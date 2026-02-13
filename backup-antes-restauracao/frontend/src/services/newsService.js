import axios from 'axios';

class NewsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_NEWS_API_KEY;
    this.baseUrl = 'https://newsapi.org/v2';
    // Múltiplas fontes RSS do agronegócio
    this.rssFeeds = [
      'https://g1.globo.com/rss/g1/economia/agronegocios/',
      'https://www.canalrural.com.br/feed/',
      'https://www.agrolink.com.br/rss/noticias.xml',
      'https://www.noticiasagricolas.com.br/rss',
      'https://www.agroemdia.com.br/feed/',
      'https://www.agrosoft.com.br/feed/'
    ];
    this.isLoading = false;
    this.error = null;
    // Sem cache, sempre dados reais
  }

  // Buscar notícias do agronegócio de múltiplas fontes
  async getAgroNews(limit = 10) {
    try {
      this.isLoading = true;
      this.error = null;
      
      const allNews = [];
      
      // 1. Buscar do backend (evita CORS)
      try {
        const { getApiUrl } = await import('../utils/apiHelper');
        const apiUrl = getApiUrl('news');
        const response = await fetch(`${apiUrl}?limit=${limit}&t=${Date.now()}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            allNews.push(...data.data);
          }
        }
      } catch (err) {
        console.warn('Erro ao buscar do backend:', err);
      }
      
      // 2. Se não tiver notícias do backend, tentar NewsAPI (se tiver chave)
      if (allNews.length === 0 && this.apiKey) {
        try {
          const newsApiResults = await this.fetchNewsAPI(limit);
          allNews.push(...newsApiResults);
        } catch (err) {
          console.warn('Erro ao buscar NewsAPI:', err);
        }
      }
      
      // 3. Se ainda não tiver, tentar RSS feeds diretos (fallback)
      if (allNews.length === 0) {
        try {
          const rssResults = await this.fetchRSSFeeds(limit);
          allNews.push(...rssResults);
        } catch (err) {
          console.warn('Erro ao buscar RSS feeds:', err);
        }
      }
      
      // 4. Remover duplicatas e ordenar por data
      const uniqueNews = this.removeDuplicates(allNews);
      uniqueNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      
      return uniqueNews.slice(0, limit);
    } catch (error) {
      console.error('Erro ao obter notícias:', error);
      this.error = error.message;
      return [];
    } finally {
      this.isLoading = false;
    }
  }

  // Buscar notícias da NewsAPI
  async fetchNewsAPI(limit) {
    const response = await axios.get(`${this.baseUrl}/everything`, {
      params: {
        q: 'agronegócio OR agricultura OR commodities OR soja OR milho OR café OR pecuária',
        language: 'pt',
        sortBy: 'publishedAt',
        pageSize: limit,
        apiKey: this.apiKey
      }
    });

    return this.formatNewsData(response.data.articles);
  }

  // Formatar dados da NewsAPI
  formatNewsData(articles) {
    return articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: new Date(article.publishedAt),
      source: article.source.name,
      category: this.categorizeNews(article.title, article.description),
      imageUrl: article.urlToImage || this.getDefaultNewsImage(),
      author: article.author
    }));
  }

  // Categorizar notícias
  categorizeNews(title, description) {
    const text = `${title} ${description}`.toLowerCase();

    if (text.includes('soja') || text.includes('milho') || text.includes('grãos')) {
      return 'Grãos';
    } else if (text.includes('café') || text.includes('cafe')) {
      return 'Café';
    } else if (text.includes('pecuária') || text.includes('boi') || text.includes('gado')) {
      return 'Pecuária';
    } else if (text.includes('clima') || text.includes('tempo') || text.includes('chuva')) {
      return 'Clima';
    } else if (text.includes('preço') || text.includes('cotação') || text.includes('mercado')) {
      return 'Mercado';
    } else if (text.includes('tecnologia') || text.includes('digital') || text.includes('inovação')) {
      return 'Tecnologia';
    } else {
      return 'Agronegócio';
    }
  }

  // Buscar notícias de RSS feeds
  async fetchRSSFeeds(limit = 10) {
    const allNews = [];
    
    // Buscar de cada feed RSS
    for (const feedUrl of this.rssFeeds) {
      try {
        // Tentar primeiro com RSS2JSON (mais rápido)
        try {
          const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&api_key=${process.env.REACT_APP_RSS2JSON_API_KEY || 'public'}&count=${limit}`;
          const response = await fetch(rss2jsonUrl);
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
              const formatted = data.items.map(item => {
                // Extrair imagem de múltiplas fontes
                let imageUrl = item.enclosure?.link || item.thumbnail || null;
                
                // Se não tiver imagem, tentar extrair da descrição HTML
                if (!imageUrl && item.description) {
                  const imgMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
                  if (imgMatch) {
                    imageUrl = imgMatch[1];
                  }
                }
                
                // Se ainda não tiver, tentar do content
                if (!imageUrl && item.content) {
                  const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
                  if (imgMatch) {
                    imageUrl = imgMatch[1];
                  }
                }
                
                // Imagem padrão se não tiver nenhuma
                if (!imageUrl) {
                  imageUrl = this.getDefaultNewsImage();
                }
                
                return {
                  title: item.title,
                  description: item.description || item.content || '',
                  url: item.link,
                  publishedAt: new Date(item.pubDate),
                  source: data.feed?.title || 'Agronegócio',
                  category: this.categorizeNews(item.title, item.description || ''),
                  imageUrl: imageUrl,
                  author: item.author || null
                };
              });
              
              allNews.push(...formatted);
              continue; // Sucesso, ir para próximo feed
            }
          }
        } catch (rss2jsonError) {
          // Se RSS2JSON falhar, tentar parsing direto
        }
        
        // Fallback: parsing direto do RSS XML
        try {
          const response = await fetch(feedUrl, {
            headers: {
              'Accept': 'application/rss+xml, application/xml, text/xml'
            }
          });
          
          if (!response.ok) continue;
          
          const xmlText = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
          
          const items = xmlDoc.querySelectorAll('item');
          const feedTitle = xmlDoc.querySelector('title')?.textContent || 'Agronegócio';
          
          items.forEach((item, index) => {
            if (index >= limit) return;
            
            const title = item.querySelector('title')?.textContent || '';
            const description = item.querySelector('description')?.textContent || 
                               item.querySelector('content\\:encoded')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || 
                          item.querySelector('date')?.textContent || new Date().toISOString();
            const enclosure = item.querySelector('enclosure');
            let imageUrl = enclosure?.getAttribute('url') || null;
            
            // Se não tiver imagem no enclosure, tentar extrair da descrição HTML
            if (!imageUrl && description) {
              const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
              if (imgMatch) {
                imageUrl = imgMatch[1];
              }
            }
            
            // Se ainda não tiver, usar imagem padrão
            if (!imageUrl) {
              imageUrl = this.getDefaultNewsImage();
            }
            
            const author = item.querySelector('author')?.textContent || 
                         item.querySelector('dc\\:creator')?.textContent || null;
            
            if (title && link) {
              allNews.push({
                title: title.trim(),
                description: description.trim(),
                url: link.trim(),
                publishedAt: new Date(pubDate),
                source: feedTitle,
                category: this.categorizeNews(title, description),
                imageUrl: imageUrl,
                author: author
              });
            }
          });
        } catch (xmlError) {
          // Continuar para próximo feed se parsing XML falhar
          continue;
        }
      } catch (err) {
        // Continuar para próximo feed se tudo falhar
        continue;
      }
    }
    
    return allNews;
  }

  // Remover notícias duplicadas
  removeDuplicates(news) {
    if (!news || !Array.isArray(news)) {
      return [];
    }
    const seen = new Set();
    return news.filter(item => {
      if (!item || !item.title || !item.url) {
        return false;
      }
      const key = `${item.title}-${item.url}`;
      if (seen.has(key)) {
        return false;
      }
      if (seen && typeof seen.add === 'function') {
        seen.add(key);
      }
      return true;
    });
  }

  // Gerar notícias mockadas
  getMockNews(limit) {
    throw new Error('Mock/fallback desabilitado: apenas notícias reais disponíveis.');
  }

  // Imagem padrão para notícias sem imagem
  getDefaultNewsImage() {
    const images = [
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop'
    ];
    return images[Math.floor(Math.random() * images.length)];
  }
}

const newsService = new NewsService();
export default newsService;
