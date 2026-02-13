import axios from 'axios';

const CANAL_RURAL_API_URL = 'https://www.canalrural.com.br/wp-json/wp/v2/posts';

export const getAgriNews = async () => {
  try {
    const response = await axios.get(CANAL_RURAL_API_URL, {
      params: {
        per_page: 5,
        categories: '4,7,12', // IDs das categorias de mercado, agricultura e pecuária
        _fields: 'id,title,link,date,excerpt,_embedded',
        _embed: 'wp:featuredmedia'
      }
    });

    return response.data.map(post => ({
      id: post.id,
      title: post.title.rendered,
      link: post.link,
      date: new Date(post.date).toLocaleDateString('pt-BR'),
      excerpt: post.excerpt.rendered,
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url
    }));
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
};

// Função de backup usando a API do Google News
export const getGoogleAgriNews = async () => {
  const GOOGLE_NEWS_API_URL = 'https://newsapi.org/v2/everything';
  const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

  try {
    const response = await axios.get(GOOGLE_NEWS_API_URL, {
      params: {
        q: 'agronegócio OR agricultura OR commodities',
        language: 'pt',
        sortBy: 'publishedAt',
        pageSize: 5,
        apiKey: API_KEY
      }
    });

    return response.data.articles.map(article => ({
      id: article.url,
      title: article.title,
      link: article.url,
      date: new Date(article.publishedAt).toLocaleDateString('pt-BR'),
      excerpt: article.description,
      image: article.urlToImage
    }));
  } catch (error) {
    console.error('Erro ao buscar notícias do Google:', error);
    return [];
  }
};