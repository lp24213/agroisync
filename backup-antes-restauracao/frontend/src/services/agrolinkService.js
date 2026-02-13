// Serviço para dados da Agrolink com cotações de grãos por IP
class AgrolinkService {
  constructor() {
    this.apiKey = process.env.REACT_APP_AGROLINK_API_KEY || 'demo-key';
    this.baseUrl = 'https://api.agrolink.com.br/v1';
    this.updateInterval = null;
  }

  // Detectar localização real por IP
  async getLocationByIP() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Erro ao buscar localização');
      const data = await response.json();
      return {
        state: data.region_code,
        city: data.city,
        lat: data.latitude,
        lng: data.longitude
      };
    } catch (error) {
      console.error('Erro ao detectar localização:', error);
      return { state: 'MT', city: 'Sinop', lat: -11.8339, lng: -55.4342 };
    }
  }

  // Buscar cotações de grãos da Agrolink
  async getGrainQuotes() {
    try {
      const location = await this.getLocationByIP();
      // Buscar dados reais da Agrolink
      const response = await fetch(`${this.baseUrl}/cotacoes/granos?estado=${location.state}&cidade=${location.city}&apikey=${this.apiKey}`);
      if (!response.ok) throw new Error('Erro ao buscar cotações reais da Agrolink');
      const data = await response.json();
      // Formatar para o padrão do frontend
      const quotes = (data.cotacoes || []).map(q => ({
        grain: q.produto,
        price: q.preco,
        change: q.variacao,
        unit: q.unidade,
        location: `${location.city}/${location.state}`,
        timestamp: q.data
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
      const basePrice = grain === 'soja' ? 85.5 : grain === 'milho' ? 42.3 : grain === 'algodao' ? 125.8 : 285.9;

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
        changePercent:
          ((chartData[chartData.length - 1].price - chartData[chartData.length - 2].price) /
            chartData[chartData.length - 2].price) *
          100
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
