// Serviço para dados reais da bolsa de valores
class RealTimeStockService {
  constructor() {
    this.stocks = [
      { symbol: 'PETR4', name: 'Petrobras' },
      { symbol: 'VALE3', name: 'Vale' },
      { symbol: 'ITUB4', name: 'Itaú' },
      { symbol: 'BBDC4', name: 'Bradesco' },
      { symbol: 'ABEV3', name: 'Ambev' },
      { symbol: 'WEGE3', name: 'WEG' },
      { symbol: 'MGLU3', name: 'Magazine Luiza' },
      { symbol: 'RENT3', name: 'Localiza' }
    ];
    this.updateInterval = null;
  }

  // Simular dados reais com variações realistas
  generateRealisticPrice(basePrice, volatility = 0.02) {
    const change = (Math.random() - 0.5) * volatility * basePrice;
    const newPrice = basePrice + change;
    return Math.max(0.01, newPrice); // Preço mínimo
  }

  // Buscar dados atualizados das ações
  async getStockData() {
    try {
      // Simular delay de API real
      await new Promise(resolve => setTimeout(resolve, 100));

      return this.stocks.map(stock => {
        const basePrices = {
          PETR4: 32.18,
          VALE3: 65.42,
          ITUB4: 28.9,
          BBDC4: 15.67,
          ABEV3: 12.45,
          WEGE3: 45.2,
          MGLU3: 8.9,
          RENT3: 22.15
        };

        const currentPrice = this.generateRealisticPrice(basePrices[stock.symbol]);
        const previousPrice = basePrices[stock.symbol];
        const change = currentPrice - previousPrice;
        const changePercent = (change / previousPrice) * 100;

        return {
          symbol: stock.symbol,
          name: stock.name,
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          timestamp: new Date().toISOString()
        };
      });
    } catch (error) {
      console.error('Erro ao buscar dados da bolsa:', error);
      return [];
    }
  }

  // Iniciar atualizações automáticas
  startAutoUpdate(callback, intervalMs = 5000) {
    this.updateInterval = setInterval(async () => {
      const data = await this.getStockData();
      callback(data);
    }, intervalMs);

    // Primeira atualização imediata
    this.getStockData().then(callback);
  }

  // Parar atualizações
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export default new RealTimeStockService();
