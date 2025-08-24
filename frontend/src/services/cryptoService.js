// Serviço para API de criptomoedas usando CoinGecko
class CryptoService {
  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3';
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minuto
  }

  // Obter dados das principais criptomoedas
  async getTopCryptos(limit = 10) {
    try {
      const cacheKey = `top-${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&locale=pt`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedData = data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        priceChange24h: coin.price_change_24h,
        priceChangePercentage24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        image: coin.image,
        lastUpdated: coin.last_updated
      }));

      this.setCachedData(cacheKey, formattedData);
      return formattedData;
    } catch (error) {
      console.error('Erro ao obter dados de criptomoedas:', error);
      return this.getFallbackData();
    }
  }

  // Obter dados específicos de uma criptomoeda
  async getCryptoData(coinId) {
    try {
      const cacheKey = `coin-${coinId}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await fetch(
        `${this.baseUrl}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedData = {
        id: data.id,
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        price: data.market_data.current_price.usd,
        priceChange24h: data.market_data.price_change_24h,
        priceChangePercentage24h: data.market_data.price_change_percentage_24h,
        marketCap: data.market_data.market_cap.usd,
        volume24h: data.market_data.total_volume.usd,
        image: data.image.large,
        description: data.description.pt || data.description.en,
        lastUpdated: data.last_updated
      };

      this.setCachedData(cacheKey, formattedData);
      return formattedData;
    } catch (error) {
      console.error(`Erro ao obter dados de ${coinId}:`, error);
      return null;
    }
  }

  // Obter dados de mercado em tempo real
  async getMarketData() {
    try {
      const cacheKey = 'market-data';
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await fetch(`${this.baseUrl}/global`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const marketData = {
        totalMarketCap: data.data.total_market_cap.usd,
        totalVolume: data.data.total_volume.usd,
        marketCapChangePercentage24h: data.data.market_cap_change_percentage_24h_usd,
        activeCryptocurrencies: data.data.active_cryptocurrencies,
        lastUpdated: new Date().toISOString()
      };

      this.setCachedData(cacheKey, marketData);
      return marketData;
    } catch (error) {
      console.error('Erro ao obter dados de mercado:', error);
      return this.getFallbackMarketData();
    }
  }

  // Obter dados de tendências
  async getTrendingCoins() {
    try {
      const cacheKey = 'trending';
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const response = await fetch(`${this.baseUrl}/search/trending`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const trendingData = data.coins.slice(0, 7).map(coin => ({
        id: coin.item.id,
        symbol: coin.item.symbol.toUpperCase(),
        name: coin.item.name,
        price: coin.item.price_btc,
        marketCapRank: coin.item.market_cap_rank,
        image: coin.item.large,
        score: coin.item.score
      }));

      this.setCachedData(cacheKey, trendingData);
      return trendingData;
    } catch (error) {
      console.error('Erro ao obter tendências:', error);
      return [];
    }
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

  // Dados de fallback em caso de erro
  getFallbackData() {
    return [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 45000,
        priceChange24h: 1200,
        priceChangePercentage24h: 2.7,
        marketCap: 850000000000,
        volume24h: 28000000000,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3200,
        priceChange24h: 85,
        priceChangePercentage24h: 2.7,
        marketCap: 380000000000,
        volume24h: 15000000000,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'binancecoin',
        symbol: 'BNB',
        name: 'Binance Coin',
        price: 320,
        priceChange24h: 8.5,
        priceChangePercentage24h: 2.7,
        marketCap: 48000000000,
        volume24h: 1200000000,
        image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  getFallbackMarketData() {
    return {
      totalMarketCap: 2000000000000,
      totalVolume: 80000000000,
      marketCapChangePercentage24h: 2.5,
      activeCryptocurrencies: 2500,
      lastUpdated: new Date().toISOString()
    };
  }

  // Limpar cache
  clearCache() {
    this.cache.clear();
  }
}

const cryptoService = new CryptoService();
export default cryptoService;
