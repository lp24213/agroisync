// Serviço para dados da Agrolink com cotações de grãos por IP
class AgrolinkService {
  constructor() {
    this.apiKey = process.env.REACT_APP_AGROLINK_API_KEY || 'demo-key';
    this.baseUrl = 'https://api.agrolink.com.br/v1';
    this.updateInterval = null;
  }

  // Detectar localização por IP (simulado)
  async getLocationByIP() {
    try {
      // Simular detecção de IP para região agrícola
      const regions = [
        { state: 'MT', city: 'Sinop', lat: -11.8339, lng: -55.4342 },
        { state: 'PR', city: 'Cascavel', lat: -24.9558, lng: -53.4553 },
        { state: 'RS', city: 'Passo Fundo', lat: -28.2628, lng: -52.4067 },
        { state: 'GO', city: 'Rio Verde', lat: -17.7977, lng: -50.9286 }
      ];
      
      // Simular IP baseado em região agrícola
      const region = regions[Math.floor(Math.random() * regions.length)];
      return region;
    } catch (error) {
      console.error('Erro ao detectar localização:', error);
      return { state: 'MT', city: 'Sinop', lat: -11.8339, lng: -55.4342 };
    }
  }

  // Buscar cotações de grãos da Agrolink
  async getGrainQuotes() {
    try {
      const location = await this.getLocationByIP();
      
      // Simular dados reais da Agrolink com variações por região
      const baseQuotes = {
        'MT': { // Mato Grosso
          soja: { price: 85.50, change: 1.2 },
          milho: { price: 42.30, change: -0.8 },
          algodao: { price: 125.80, change: 2.1 },
          cafe: { price: 285.90, change: 0.5 }
        },
        'PR': { // Paraná
          soja: { price: 87.20, change: 1.5 },
          milho: { price: 43.10, change: -0.3 },
          trigo: { price: 78.40, change: 1.8 },
          cafe: { price: 288.50, change: 0.7 }
        },
        'RS': { // Rio Grande do Sul
          soja: { price: 86.80, change: 1.0 },
          milho: { price: 42.80, change: -0.5 },
          trigo: { price: 79.20, change: 2.2 },
          arroz: { price: 45.60, change: 0.9 }
        },
        'GO': { // Goiás
          soja: { price: 84.90, change: 0.8 },
          milho: { price: 41.90, change: -1.2 },
          algodao: { price: 124.50, change: 1.8 },
          cafe: { price: 284.20, change: 0.3 }
        }
      };

      const regionQuotes = baseQuotes[location.state] || baseQuotes['MT'];
      
      // Adicionar variação realística
      const quotes = Object.entries(regionQuotes).map(([grain, data]) => ({
        grain,
        price: data.price + (Math.random() - 0.5) * 2,
        change: data.change + (Math.random() - 0.5) * 0.5,
        unit: grain === 'cafe' ? 'R$/saca 60kg' : 'R$/saca 60kg',
        location: `${location.city}/${location.state}`,
        timestamp: new Date().toISOString()
      }));

      return {
        quotes,
        location,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao buscar cotações da Agrolink:', error);
      return {
        quotes: [],
        location: { state: 'MT', city: 'Sinop' },
        lastUpdate: new Date().toISOString()
      };
    }
  }

  // Buscar dados para gráfico
  async getChartData(grain = 'soja', days = 7) {
    try {
      const location = await this.getLocationByIP();
      
      // Simular dados históricos para gráfico
      const basePrice = grain === 'soja' ? 85.50 : 
                      grain === 'milho' ? 42.30 : 
                      grain === 'algodao' ? 125.80 : 285.90;
      
      const chartData = [];
      let currentPrice = basePrice;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simular variação diária
        const dailyChange = (Math.random() - 0.5) * 3;
        currentPrice = Math.max(0.01, currentPrice + dailyChange);
        
        chartData.push({
          date: date.toISOString().split('T')[0],
          price: parseFloat(currentPrice.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000) + 500000
        });
      }
      
      return {
        grain,
        location: `${location.city}/${location.state}`,
        data: chartData,
        currentPrice: chartData[chartData.length - 1].price,
        change: chartData[chartData.length - 1].price - chartData[chartData.length - 2].price,
        changePercent: ((chartData[chartData.length - 1].price - chartData[chartData.length - 2].price) / chartData[chartData.length - 2].price) * 100
      };
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      return null;
    }
  }

  // Iniciar atualizações automáticas
  startAutoUpdate(callback, intervalMs = 10000) {
    this.updateInterval = setInterval(async () => {
      const data = await this.getGrainQuotes();
      callback(data);
    }, intervalMs);
    
    // Primeira atualização imediata
    this.getGrainQuotes().then(callback);
  }

  // Parar atualizações
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export default new AgrolinkService();
