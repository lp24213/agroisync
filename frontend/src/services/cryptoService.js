import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

class CryptoService {
  constructor() {
    this.api = axios.create({
      baseURL: COINGECKO_API_URL,
      timeout: 10000,
    });
  }

  // Obter lista de criptomoedas com preços em tempo real
  async getCryptoQuotes(ids = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana', 'cardano', 'polkadot', 'chainlink']) {
    try {
      const response = await this.api.get('/simple/price', {
        params: {
          ids: ids.join(','),
          vs_currencies: 'usd,brl',
          include_24hr_change: true,
          include_24hr_vol: true,
          include_market_cap: true
        }
      });

      return this.formatCryptoData(response.data);
    } catch (error) {
      console.error('Erro ao obter cotações:', error);
      throw new Error('Erro ao obter dados de criptomoedas');
    }
  }

  // Obter dados históricos para gráficos
  async getCryptoHistory(coinId, days = 7, currency = 'usd') {
    try {
      const response = await this.api.get(`/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: currency,
          days: days,
          interval: days === 1 ? 'hourly' : 'daily'
        }
      });

      return this.formatChartData(response.data);
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      throw new Error('Erro ao obter dados históricos');
    }
  }

  // Obter informações detalhadas de uma criptomoeda
  async getCryptoDetails(coinId) {
    try {
      const response = await this.api.get(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false
        }
      });

      return this.formatDetailedData(response.data);
    } catch (error) {
      console.error('Erro ao obter detalhes:', error);
      throw new Error('Erro ao obter detalhes da criptomoeda');
    }
    }

  // Obter top criptomoedas por capitalização de mercado
  async getTopCryptos(limit = 20, currency = 'usd') {
    try {
      const response = await this.api.get('/coins/markets', {
        params: {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h,7d,30d'
        }
      });

      return response.data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        price_brl: coin.current_price * this.getUSDToBRLRate(),
        change_24h: coin.price_change_percentage_24h,
        change_7d: coin.price_change_percentage_7d_in_currency,
        change_30d: coin.price_change_percentage_30d_in_currency,
        volume_24h: coin.total_volume,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        image: coin.image
      }));
    } catch (error) {
      console.error('Erro ao obter top criptos:', error);
      throw new Error('Erro ao obter ranking de criptomoedas');
    }
  }

  // Obter taxa de conversão USD para BRL (simulado - em produção usar API real)
  getUSDToBRLRate() {
    // Em produção, integrar com API de câmbio
    return 5.0; // Taxa aproximada
  }

  // Formatar dados das cotações
  formatCryptoData(data) {
    const cryptoInfo = {
      bitcoin: { symbol: 'BTC', name: 'Bitcoin', description: 'Criptomoeda líder do mercado' },
      ethereum: { symbol: 'ETH', name: 'Ethereum', description: 'Plataforma de contratos inteligentes' },
      tether: { symbol: 'USDT', name: 'Tether', description: 'Stablecoin atrelada ao dólar' },
      binancecoin: { symbol: 'BNB', name: 'Binance Coin', description: 'Token nativo da Binance' },
      solana: { symbol: 'SOL', name: 'Solana', description: 'Blockchain de alta performance' },
      cardano: { symbol: 'ADA', name: 'Cardano', description: 'Plataforma de contratos inteligentes' },
      polkadot: { symbol: 'DOT', name: 'Polkadot', description: 'Protocolo de interoperabilidade' },
      chainlink: { symbol: 'LINK', name: 'Chainlink', description: 'Oracle descentralizado' }
    };

    return Object.keys(data).map(coinId => {
      const coin = data[coinId];
      const info = cryptoInfo[coinId] || { symbol: coinId.toUpperCase(), name: coinId, description: '' };

      return {
        id: coinId,
        symbol: info.symbol,
        name: info.name,
        price: coin.usd,
        price_brl: coin.brl || (coin.usd * this.getUSDToBRLRate()),
        change: coin.usd_24h_change || 0,
        volume_24h: coin.usd_24h_vol || 0,
        market_cap: coin.usd_market_cap || 0,
        description: info.description
      };
    });
  }

  // Formatar dados para gráficos
  formatChartData(data) {
    const { prices, market_caps, total_volumes } = data;
    
    return {
      prices: prices.map(([timestamp, price]) => ({
        timestamp,
        price,
        date: new Date(timestamp)
      })),
      marketCaps: market_caps.map(([timestamp, cap]) => ({
        timestamp,
        cap,
        date: new Date(timestamp)
      })),
      volumes: total_volumes.map(([timestamp, volume]) => ({
        timestamp,
        volume,
        date: new Date(timestamp)
      }))
    };
  }

  // Formatar dados detalhados
  formatDetailedData(data) {
    return {
      id: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      description: data.description.en,
      current_price: data.market_data.current_price,
      market_cap: data.market_data.market_cap,
      total_volume: data.market_data.total_volume,
      high_24h: data.market_data.high_24h,
      low_24h: data.market_data.low_24h,
      price_change_24h: data.market_data.price_change_24h,
      price_change_percentage_24h: data.market_data.price_change_percentage_24h,
      market_cap_rank: data.market_cap_rank,
      image: data.image.large
    };
  }

  // Obter dados em tempo real (WebSocket simulado)
  async getRealTimeData(coinIds, callback) {
    // Em produção, usar WebSocket real
    const interval = setInterval(async () => {
      try {
        const data = await this.getCryptoQuotes(coinIds);
        callback(data);
      } catch (error) {
        console.error('Erro ao obter dados em tempo real:', error);
      }
    }, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }

  // Converter valor entre criptomoedas
  async convertCrypto(fromCoin, toCoin, amount) {
    try {
      const response = await this.api.get('/simple/price', {
        params: {
          ids: `${fromCoin},${toCoin}`,
          vs_currencies: 'usd'
        }
      });

      const fromPrice = response.data[fromCoin].usd;
      const toPrice = response.data[toCoin].usd;
      const conversionRate = fromPrice / toPrice;

      return {
        from: { coin: fromCoin, amount, price: fromPrice },
        to: { coin: toCoin, amount: amount * conversionRate, price: toPrice },
        rate: conversionRate
      };
    } catch (error) {
      console.error('Erro na conversão:', error);
      throw new Error('Erro ao converter criptomoedas');
    }
  }
}

export default new CryptoService();
