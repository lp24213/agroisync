// Serviço avançado para cotações agropecuárias com localização por IP
class AdvancedAgroService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8787';
    this.location = null;
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutos
  }

  // Obter localização por IP
  async getLocationByIP() {
    if (this.location) return this.location;

    try {
      // Tentar via nosso backend primeiro (proxy)
      const response = await fetch('/api/geolocation');
      if (response.ok) {
        const data = await response.json();
        this.location = {
          city: data.city || 'São Paulo',
          state: data.region || 'SP',
          country: data.country_name || 'Brasil',
          region: data.region_code || 'SP'
        };
        return this.location;
      }
    } catch (error) {
      console.warn('Proxy de geolocalização falhou, usando padrão');
    }

    // Fallback para localização padrão
    this.location = {
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      region: 'SP'
    };
    return this.location;
  }

  // Obter cotações dos principais grãos
  async getMainGrainsPrices() {
    const cacheKey = 'mainGrains';
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const location = await this.getLocationByIP();

      // Simular dados reais baseados na localização
      const basePrices = {
        SP: { soja: 180, milho: 95, trigo: 120, algodao: 420 },
        MT: { soja: 175, milho: 92, trigo: 118, algodao: 415 },
        RS: { soja: 182, milho: 97, trigo: 125, algodao: 425 },
        PR: { soja: 178, milho: 94, trigo: 122, algodao: 418 },
        GO: { soja: 177, milho: 93, trigo: 121, algodao: 417 }
      };

      const regionPrices = basePrices[location.region] || basePrices['SP'];

      const grains = [
        {
          id: 'soja',
          name: 'Soja',
          unit: 'R$/sc 60kg',
          currentPrice: regionPrices.soja + (Math.random() - 0.5) * 10,
          change: (Math.random() - 0.5) * 5,
          changePercent: (Math.random() - 0.5) * 3,
          volume: Math.floor(Math.random() * 50000) + 100000,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          color: '#00ff88',
          icon: '🌱'
        },
        {
          id: 'milho',
          name: 'Milho',
          unit: 'R$/sc 60kg',
          currentPrice: regionPrices.milho + (Math.random() - 0.5) * 8,
          change: (Math.random() - 0.5) * 4,
          changePercent: (Math.random() - 0.5) * 2.5,
          volume: Math.floor(Math.random() * 40000) + 80000,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          color: '#ffff00',
          icon: '🌽'
        },
        {
          id: 'trigo',
          name: 'Trigo',
          unit: 'R$/sc 60kg',
          currentPrice: regionPrices.trigo + (Math.random() - 0.5) * 12,
          change: (Math.random() - 0.5) * 6,
          changePercent: (Math.random() - 0.5) * 4,
          volume: Math.floor(Math.random() * 30000) + 60000,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          color: '#ff8800',
          icon: '🌾'
        },
        {
          id: 'algodao',
          name: 'Algodão',
          unit: 'R$/@ 30kg',
          currentPrice: regionPrices.algodao + (Math.random() - 0.5) * 20,
          change: (Math.random() - 0.5) * 15,
          changePercent: (Math.random() - 0.5) * 5,
          volume: Math.floor(Math.random() * 20000) + 40000,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          color: '#ffffff',
          icon: '🧵'
        }
      ];

      const data = {
        grains,
        location,
        lastUpdate: new Date().toISOString(),
        marketStatus: 'Aberto'
      };

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Erro ao obter preços dos grãos:', error);
      return this.getFallbackData();
    }
  }

  // Obter preços pecuários (arroba do boi, etc.)
  async getLivestockPrices() {
    const cacheKey = 'livestock';
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const location = await this.getLocationByIP();

      const livestock = [
        {
          id: 'boi',
          name: 'Boi Gordo',
          unit: 'R$/@',
          currentPrice: 280 + (Math.random() - 0.5) * 20,
          change: (Math.random() - 0.5) * 10,
          changePercent: (Math.random() - 0.5) * 4,
          volume: Math.floor(Math.random() * 15000) + 25000,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          color: '#ff4444',
          icon: '🐄'
        },
        {
          id: 'suino',
          name: 'Suíno',
          unit: 'R$/@',
          currentPrice: 95 + (Math.random() - 0.5) * 10,
          change: (Math.random() - 0.5) * 5,
          changePercent: (Math.random() - 0.5) * 3,
          volume: Math.floor(Math.random() * 10000) + 15000,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          color: '#ff8800',
          icon: '🐷'
        },
        {
          id: 'frango',
          name: 'Frango',
          unit: 'R$/kg',
          currentPrice: 6.5 + (Math.random() - 0.5) * 1,
          change: (Math.random() - 0.5) * 0.5,
          changePercent: (Math.random() - 0.5) * 2,
          volume: Math.floor(Math.random() * 8000) + 12000,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          color: '#ffaa00',
          icon: '🐔'
        },
        {
          id: 'leite',
          name: 'Leite',
          unit: 'R$/L',
          currentPrice: 2.8 + (Math.random() - 0.5) * 0.4,
          change: (Math.random() - 0.5) * 0.2,
          changePercent: (Math.random() - 0.5) * 1.5,
          volume: Math.floor(Math.random() * 5000) + 8000,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          color: '#88ff88',
          icon: '🥛'
        }
      ];

      const data = {
        livestock,
        location,
        lastUpdate: new Date().toISOString(),
        marketStatus: 'Aberto'
      };

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Erro ao obter preços pecuários:', error);
      return this.getFallbackLivestockData();
    }
  }

  // Obter dados históricos para gráficos
  async getHistoricalData(commodity, days = 30) {
    const cacheKey = `historical_${commodity}_${days}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const data = [];
      const basePrice = this.getBasePrice(commodity);

      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const price = basePrice + (Math.random() - 0.5) * basePrice * 0.1;
        const volume = Math.floor(Math.random() * 10000) + 5000;

        data.push({
          date: date.toISOString().split('T')[0],
          price: Number(price.toFixed(2)),
          volume,
          high: price + Math.random() * 2,
          low: price - Math.random() * 2
        });
      }

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Erro ao obter dados históricos:', error);
      return [];
    }
  }

  getBasePrice(commodity) {
    const prices = {
      soja: 180,
      milho: 95,
      trigo: 120,
      algodao: 420,
      boi: 280,
      suino: 95,
      frango: 6.5,
      leite: 2.8
    };
    return prices[commodity] || 100;
  }

  getFallbackData() {
    return {
      grains: [
        {
          id: 'soja',
          name: 'Soja',
          unit: 'R$/sc 60kg',
          currentPrice: 180,
          change: 2.5,
          changePercent: 1.4,
          volume: 150000,
          trend: 'up',
          color: '#00ff88',
          icon: '🌱'
        }
      ],
      location: { city: 'São Paulo', state: 'SP', country: 'Brasil' },
      lastUpdate: new Date().toISOString(),
      marketStatus: 'Aberto'
    };
  }

  getFallbackLivestockData() {
    return {
      livestock: [
        {
          id: 'boi',
          name: 'Boi Gordo',
          unit: 'R$/@',
          currentPrice: 280,
          change: 5.0,
          changePercent: 1.8,
          volume: 25000,
          trend: 'up',
          color: '#ff4444',
          icon: '🐄'
        }
      ],
      location: { city: 'São Paulo', state: 'SP', country: 'Brasil' },
      lastUpdate: new Date().toISOString(),
      marketStatus: 'Aberto'
    };
  }

  // Limpar cache
  clearCache() {
    this.cache.clear();
  }
}

const advancedAgroService = new AdvancedAgroService();
export default advancedAgroService;
