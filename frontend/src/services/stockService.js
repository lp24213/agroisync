// Serviço para dados da bolsa de valores em tempo real
import axios from 'axios';

class StockService {
  constructor() {
    this.baseURL = 'https://www.alphavantage.co/query';
    this.apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  // Buscar cotações das principais ações brasileiras
  async getBrazilianStocks() {
    const cacheKey = 'brazilian-stocks';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Principais ações brasileiras
      const stocks = [
        'VALE3.SAO', // Vale
        'PETR4.SAO', // Petrobras
        'ITUB4.SAO', // Itaú
        'BBDC4.SAO', // Bradesco
        'ABEV3.SAO', // Ambev
        'WEGE3.SAO', // WEG
        'MGLU3.SAO', // Magazine Luiza
        'SUZB3.SAO', // Suzano
        'JBSS3.SAO', // JBS
        'RENT3.SAO'  // Localiza
      ];

      const promises = stocks.map(symbol => this.getStockQuote(symbol));
      const results = await Promise.allSettled(promises);
      
      const stockData = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(stock => stock);

      // Cache dos resultados
      this.cache.set(cacheKey, {
        data: stockData,
        timestamp: Date.now()
      });

      return stockData;
    } catch (error) {
      console.error('Erro ao buscar ações brasileiras:', error);
      return this.getFallbackBrazilianStocks();
    }
  }

  // Buscar cotação de uma ação específica
  async getStockQuote(symbol) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: this.apiKey
        }
      });

      const quote = response.data['Global Quote'];
      if (!quote) return null;

      return {
        symbol: symbol.split('.')[0],
        name: this.getStockName(symbol),
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        previousClose: parseFloat(quote['08. previous close']),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Erro ao buscar cotação de ${symbol}:`, error);
      return null;
    }
  }

  // Buscar dados históricos para gráfico
  async getHistoricalData(symbol, interval = 'daily') {
    const cacheKey = `historical-${symbol}-${interval}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: interval === 'daily' ? 'TIME_SERIES_DAILY' : 'TIME_SERIES_INTRADAY',
          symbol,
          interval: interval === 'intraday' ? '5min' : undefined,
          outputsize: 'compact',
          apikey: this.apiKey
        }
      });

      const timeSeries = response.data[interval === 'daily' ? 'Time Series (Daily)' : 'Time Series (5min)'];
      if (!timeSeries) return null;

      const historicalData = Object.entries(timeSeries).map(([date, data]) => ({
        date: new Date(date),
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume'])
      })).reverse();

      // Cache dos resultados
      this.cache.set(cacheKey, {
        data: historicalData,
        timestamp: Date.now()
      });

      return historicalData;
    } catch (error) {
      console.error('Erro ao buscar dados históricos:', error);
      return this.getFallbackHistoricalData();
    }
  }

  // Buscar índice Bovespa
  async getBovespaIndex() {
    const cacheKey = 'bovespa-index';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: '^BVSP',
          apikey: this.apiKey
        }
      });

      const quote = response.data['Global Quote'];
      if (!quote) return this.getFallbackBovespaIndex();

      const indexData = {
        symbol: 'BVSP',
        name: 'Bovespa',
        value: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        timestamp: Date.now()
      };

      // Cache dos resultados
      this.cache.set(cacheKey, {
        data: indexData,
        timestamp: Date.now()
      });

      return indexData;
    } catch (error) {
      console.error('Erro ao buscar índice Bovespa:', error);
      return this.getFallbackBovespaIndex();
    }
  }

  // Obter nome da ação
  getStockName(symbol) {
    const names = {
      'VALE3.SAO': 'Vale',
      'PETR4.SAO': 'Petrobras',
      'ITUB4.SAO': 'Itaú Unibanco',
      'BBDC4.SAO': 'Bradesco',
      'ABEV3.SAO': 'Ambev',
      'WEGE3.SAO': 'WEG',
      'MGLU3.SAO': 'Magazine Luiza',
      'SUZB3.SAO': 'Suzano',
      'JBSS3.SAO': 'JBS',
      'RENT3.SAO': 'Localiza'
    };
    return names[symbol] || symbol;
  }

  // Dados de fallback
  getFallbackBrazilianStocks() {
    return [
      {
        symbol: 'VALE3',
        name: 'Vale',
        price: 65.50,
        change: 1.20,
        changePercent: 1.87,
        volume: 45000000,
        high: 66.00,
        low: 64.30,
        open: 64.50,
        previousClose: 64.30,
        timestamp: Date.now()
      },
      {
        symbol: 'PETR4',
        name: 'Petrobras',
        price: 32.80,
        change: -0.45,
        changePercent: -1.35,
        volume: 38000000,
        high: 33.20,
        low: 32.50,
        open: 33.25,
        previousClose: 33.25,
        timestamp: Date.now()
      }
    ];
  }

  getFallbackBovespaIndex() {
    return {
      symbol: 'BVSP',
      name: 'Bovespa',
      value: 125000,
      change: 850,
      changePercent: 0.68,
      volume: 0,
      high: 125500,
      low: 124200,
      timestamp: Date.now()
    };
  }

  getFallbackHistoricalData() {
    const data = [];
    const now = Date.now();
    for (let i = 30; i >= 0; i--) {
      data.push({
        date: new Date(now - (i * 24 * 60 * 60 * 1000)),
        open: 65 + (Math.random() - 0.5) * 5,
        high: 66 + (Math.random() - 0.5) * 3,
        low: 64 + (Math.random() - 0.5) * 3,
        close: 65 + (Math.random() - 0.5) * 4,
        volume: Math.floor(Math.random() * 10000000) + 1000000
      });
    }
    return data;
  }

  // Obter cor baseada na variação
  getChangeColor(change) {
    if (change > 0) return '#39FF14'; // Verde neon para alta
    if (change < 0) return '#FF4500'; // Vermelho para baixa
    return '#EDEDED'; // Branco para neutro
  }

  // Formatar número
  formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  }
}

const stockService = new StockService();
export default stockService;