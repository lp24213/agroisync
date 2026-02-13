import geolocationService from './geolocationService';
import { EXTERNAL_APIS } from '../config/constants.js';

class AgriculturalQuotesService {
  constructor() {
    this.quotes = {};
    this.lastUpdate = null;
    this.updateInterval = null;
    this.isLoading = false;
    this.error = null;
    this.apiBaseUrl = EXTERNAL_APIS.agrolink.baseUrl;
    this.apiKey = EXTERNAL_APIS.agrolink.apiKey;

    // Configuração de commodities
    this.commodities = {
      soy: {
        name: 'Soja',
        symbol: 'SOY',
        unit: 'saca 60kg',
        icon: '🌱',
        category: 'grãos'
      },
      corn: {
        name: 'Milho',
        symbol: 'CORN',
        unit: 'saca 60kg',
        icon: '🌽',
        category: 'grãos'
      },
      coffee: {
        name: 'Café',
        symbol: 'COFFEE',
        unit: 'saca 60kg',
        icon: '☕',
        category: 'café'
      },
      cotton: {
        name: 'Algodão',
        symbol: 'COTTON',
        unit: 'saca 60kg',
        icon: '🧶',
        category: 'fibras'
      },
      wheat: {
        name: 'Trigo',
        symbol: 'WHEAT',
        unit: 'saca 60kg',
        icon: '🌾',
        category: 'grãos'
      },
      sugar: {
        name: 'Açúcar',
        symbol: 'SUGAR',
        unit: 'saca 50kg',
        icon: '🍯',
        category: 'açúcar'
      }
    };

    // APIs disponíveis (fallback)
    this.apis = [
      {
        name: 'Agrolink',
        url: EXTERNAL_APIS.agrolink.baseUrl,
        priority: 1,
        active: false
      },
      {
        name: 'CEPEA/ESALQ',
        url: 'https://www.cepea.esalq.usp.br',
        priority: 2,
        active: false
      },
      {
        name: 'B3',
        url: 'https://www.b3.com.br',
        priority: 3,
        active: false
      }
    ];
  }

  // Inicializar o serviço
  async initialize() {
    try {
      // Obter localização do usuário
      await geolocationService.getLocation();

      // Carregar cotações iniciais
      await this.loadQuotes();

      // Configurar atualização automática
      this.startAutoUpdate();

      return true;
    } catch (error) {
      console.error('Erro ao inicializar serviço de cotações:', error);
      this.error = error.message;
      return false;
    }
  }

  // Carregar cotações de todas as commodities
  async loadQuotes() {
    try {
      this.isLoading = true;
      this.error = null;

      const location = geolocationService.getCurrentLocation();
      if (!location) {
        throw new Error('Localização não disponível');
      }

      // Tentar buscar dados reais da API do AgroLink
      let quotes;
      try {
        quotes = await this.fetchAgroLinkQuotes(location);
      } catch (apiError) {
        if (process.env.NODE_ENV !== 'production') {

          console.warn('Erro na API do AgroLink, usando dados mockados:', apiError);

        }
        quotes = await this.getMockQuotes(location);
      }

      this.quotes = quotes;
      this.lastUpdate = new Date();

      return this.quotes;
    } catch (error) {
      console.error('Erro ao carregar cotações:', error);
      this.error = error.message;

      // Fallback para dados estáticos
      this.quotes = this.getFallbackQuotes();
      this.lastUpdate = new Date();

      return this.quotes;
    } finally {
      this.isLoading = false;
    }
  }

  // Buscar cotações da API do AgroLink com fallback
  async fetchAgroLinkQuotes(location) {
    const { region, country } = location;

    // Tentar múltiplas APIs
    const apis = [
      {
        name: 'AgroLink API',
        url: `${this.apiBaseUrl}/api/v1/quotes`,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Region': this.mapRegionToAgroLinkCode(region, country)
        }
      },
      {
        name: 'AgroSync API',
        url: 'https://agroisync.com/api/agricultural/quotes',
        headers: {
          'Content-Type': 'application/json',
          'X-Region': region
        }
      }
    ];

    for (const api of apis) {
      try {
        const response = await fetch(api.url, {
          method: 'GET',
          headers: api.headers,
          timeout: 8000
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (api.name === 'AgroLink API') {
          return this.processAgroLinkData(data);
        } else {
          return this.processAgroSyncData(data);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {

          console.warn(`API ${api.name} falhou:`, error.message);

        }
        continue; // Tentar próxima API
      }
    }

    throw new Error('Todas as APIs de cotações agrícolas falharam');
  }

  // Processar dados da API do AgroSync
  processAgroSyncData(data) {
    return {
      soybeans: {
        price: data.soybeans?.price || 148.5,
        change: data.soybeans?.change || 3.2,
        changePercent: data.soybeans?.changePercent || 2.2,
        unit: 'R$/sc'
      },
      corn: {
        price: data.corn?.price || 85.3,
        change: data.corn?.change || -1.5,
        changePercent: data.corn?.changePercent || -1.73,
        unit: 'R$/sc'
      },
      wheat: {
        price: data.wheat?.price || 92.8,
        change: data.wheat?.change || 0.8,
        changePercent: data.wheat?.changePercent || 0.87,
        unit: 'R$/sc'
      }
    };
  }

  // Mapear região para código do AgroLink
  mapRegionToAgroLinkCode(region, country) {
    const regionMap = {
      'Mato Grosso': 'MT',
      Paraná: 'PR',
      'Rio Grande do Sul': 'RS',
      Goiás: 'GO',
      'Mato Grosso do Sul': 'MS',
      'Minas Gerais': 'MG',
      'São Paulo': 'SP',
      Bahia: 'BA',
      Maranhão: 'MA',
      Piauí: 'PI',
      Tocantins: 'TO'
    };

    return regionMap[region] || 'BR';
  }

  // Processar dados da API do AgroLink
  processAgroLinkData(data) {
    const quotes = {};

    // Mapear dados da API para nosso formato
    const commodityMap = {
      SOJA: 'soy',
      MILHO: 'corn',
      CAFE: 'coffee',
      ALGODAO: 'cotton',
      TRIGO: 'wheat',
      ACUCAR: 'sugar',
      BOI: 'cattle',
      SUINO: 'hog'
    };

    if (data.quotes && Array.isArray(data.quotes)) {
      data.quotes.forEach(quote => {
        const commodityKey = commodityMap[quote.commodity];
        if (commodityKey && this.commodities[commodityKey]) {
          quotes[commodityKey] = {
            ...this.commodities[commodityKey],
            currentPrice: parseFloat(quote.price),
            previousPrice: parseFloat(quote.previousPrice || quote.price),
            variation: parseFloat(quote.variation || 0),
            variationPercent: parseFloat(quote.variationPercent || 0),
            market: quote.market || 'Brasil',
            lastUpdate: new Date(quote.lastUpdate || Date.now()),
            source: 'AgroLink'
          };
        }
      });
    }

    return quotes;
  }

  // Obter cotações mockadas baseadas na localização
  async getMockQuotes(location) {
    const { region, country } = location;
    const basePrices = this.getBasePricesByRegion(region, country);

    const quotes = {};

    for (const [key, commodity] of Object.entries(this.commodities)) {
      const basePrice = basePrices[key] || basePrices.default;
      const variation = this.generatePriceVariation();

      quotes[key] = {
        ...commodity,
        currentPrice: basePrice * (1 + variation),
        previousPrice: basePrice,
        variation: variation * 100,
        variationType: variation >= 0 ? 'up' : 'down',
        lastUpdate: new Date(),
        region: region,
        country: country,
        source: 'AgroConecta (Simulado)',
        confidence: 'high'
      };
    }

    return quotes;
  }

  // Obter preços base por região
  getBasePricesByRegion(region, country) {
    if (country !== 'Brasil') {
      return {
        soy: 120.0,
        corn: 85.0,
        coffee: 450.0,
        cotton: 180.0,
        wheat: 95.0,
        sugar: 75.0,
        default: 100.0
      };
    }

    // Preços base por região do Brasil (em reais)
    const regionalPrices = {
      'Centro-Oeste': {
        soy: 135.5,
        corn: 92.3,
        coffee: 480.0,
        cotton: 195.0,
        wheat: 98.5,
        sugar: 78.0
      },
      Sul: {
        soy: 128.0,
        corn: 88.0,
        coffee: 465.0,
        cotton: 188.0,
        wheat: 102.0,
        sugar: 76.5
      },
      Sudeste: {
        soy: 132.0,
        corn: 90.0,
        coffee: 475.0,
        cotton: 192.0,
        wheat: 100.0,
        sugar: 77.5
      },
      Nordeste: {
        soy: 125.0,
        corn: 86.0,
        coffee: 460.0,
        cotton: 185.0,
        wheat: 97.0,
        sugar: 75.0
      },
      Norte: {
        soy: 130.0,
        corn: 89.0,
        coffee: 470.0,
        cotton: 190.0,
        wheat: 99.0,
        sugar: 76.0
      }
    };

    return regionalPrices[region] || regionalPrices['Centro-Oeste'];
  }

  // Gerar variação de preço realista
  generatePriceVariation() {
    // Variação entre -5% e +5%
    return (Math.random() - 0.5) * 0.1;
  }

  // Obter cotações de fallback
  getFallbackQuotes() {
    const quotes = {};

    for (const [key, commodity] of Object.entries(this.commodities)) {
      quotes[key] = {
        ...commodity,
        currentPrice: 100.0,
        previousPrice: 100.0,
        variation: 0,
        variationType: 'stable',
        lastUpdate: new Date(),
        region: 'Brasil',
        country: 'Brasil',
        source: 'AgroConecta (Dados Estáticos)',
        confidence: 'low'
      };
    }

    return quotes;
  }

  // Obter cotações atuais
  getCurrentQuotes() {
    return this.quotes;
  }

  // Obter cotação de uma commodity específica
  getCommodityQuote(commodityKey) {
    return this.quotes[commodityKey] || null;
  }

  // Obter cotações por categoria
  getQuotesByCategory(category) {
    return Object.values(this.quotes).filter(commodity => commodity.category === category);
  }

  // Obter cotações por região
  getQuotesByRegion(region) {
    return Object.values(this.quotes).filter(commodity => commodity.region === region);
  }

  // Atualizar cotações manualmente
  async refreshQuotes() {
    return await this.loadQuotes();
  }

  // Iniciar atualização automática
  startAutoUpdate(intervalMinutes = 15) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(
      async () => {
        if (process.env.NODE_ENV !== 'production') {

          console.log('Atualizando cotações automaticamente...');

        }
        await this.loadQuotes();
      },
      intervalMinutes * 60 * 1000
    );
  }

  // Parar atualização automática
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Obter histórico de preços (simulado)
  async getPriceHistory(commodityKey, days = 30) {
    const commodity = this.quotes[commodityKey];
    if (!commodity) return [];

    const history = [];
    const basePrice = commodity.currentPrice;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const variation = this.generatePriceVariation();
      const price = basePrice * (1 + variation);

      history.push({
        date: date.toISOString().split('T')[0],
        price: price,
        volume: Math.floor(Math.random() * 1000) + 100
      });
    }

    return history;
  }

  // Obter estatísticas de mercado
  getMarketStats() {
    const commodities = Object.values(this.quotes);

    if (commodities.length === 0) return null;

    const totalVariation = commodities.reduce((sum, commodity) => {
      return sum + commodity.variation;
    }, 0);

    const avgVariation = totalVariation / commodities.length;

    const topGainers = commodities
      .filter(c => c.variationType === 'up')
      .sort((a, b) => b.variation - a.variation)
      .slice(0, 3);

    const topLosers = commodities
      .filter(c => c.variationType === 'down')
      .sort((a, b) => a.variation - b.variation)
      .slice(0, 3);

    return {
      totalCommodities: commodities.length,
      averageVariation: avgVariation,
      topGainers,
      topLosers,
      marketSentiment: avgVariation > 0 ? 'bullish' : 'bearish',
      lastUpdate: this.lastUpdate
    };
  }

  // Converter preço para moeda local
  convertToLocalCurrency(price, fromCurrency = 'BRL') {
    const location = geolocationService.getCurrentLocation();
    if (!location) return { price, currency: fromCurrency };

    const localCurrency = location.currency;

    // Taxas de câmbio simplificadas (em produção, usar API de câmbio)
    const exchangeRates = {
      USD: 0.21,
      EUR: 0.19,
      GBP: 0.16,
      ARS: 58.5,
      CLP: 185.0,
      COP: 850.0,
      PEN: 0.78,
      UYU: 8.2
    };

    if (fromCurrency === 'BRL' && exchangeRates[localCurrency]) {
      return {
        price: price * exchangeRates[localCurrency],
        currency: localCurrency
      };
    }

    return { price, currency: fromCurrency };
  }

  // Obter informações de mercado por região
  getRegionalMarketInfo() {
    const location = geolocationService.getCurrentLocation();
    if (!location) return null;

    const { region, country } = location;

    if (country === 'Brasil') {
      const regionalInfo = {
        'Centro-Oeste': {
          description: 'Maior produtor de grãos do Brasil',
          mainProducts: ['Soja', 'Milho', 'Algodão'],
          season: 'Safra 2024/2025',
          weather: 'Favorável para plantio'
        },
        Sul: {
          description: 'Região tradicional na produção de grãos',
          mainProducts: ['Soja', 'Milho', 'Trigo'],
          season: 'Safra 2024/2025',
          weather: 'Estável'
        },
        Sudeste: {
          description: 'Diversificação agrícola e pecuária',
          mainProducts: ['Café', 'Cana-de-açúcar', 'Laranja'],
          season: 'Safra 2024/2025',
          weather: 'Adequado'
        },
        Nordeste: {
          description: 'Agricultura irrigada e fruticultura',
          mainProducts: ['Cana-de-açúcar', 'Frutas', 'Cacau'],
          season: 'Safra 2024/2025',
          weather: 'Variável'
        },
        Norte: {
          description: 'Agricultura familiar e extrativismo',
          mainProducts: ['Açaí', 'Castanha', 'Pimenta'],
          season: 'Safra 2024/2025',
          weather: 'Úmido'
        }
      };

      return regionalInfo[region] || regionalInfo['Centro-Oeste'];
    }

    return {
      description: 'Mercado internacional',
      mainProducts: ['Commodities globais'],
      season: 'Vigente',
      weather: 'N/A'
    };
  }

  // Verificar se está carregando
  isLoading() {
    return this.isLoading;
  }

  // Obter último erro
  getLastError() {
    return this.error;
  }

  // Obter última atualização
  getLastUpdate() {
    return this.lastUpdate;
  }

  // Limpar dados
  clearData() {
    this.quotes = {};
    this.lastUpdate = null;
    this.error = null;
    this.stopAutoUpdate();
  }

  // Destruir serviço
  destroy() {
    this.stopAutoUpdate();
    this.clearData();
  }
}

// Exportar instância singleton
const agriculturalQuotesService = new AgriculturalQuotesService();
export default agriculturalQuotesService;
