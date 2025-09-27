// Serviço para dados de criptomoedas em tempo real + Rotas Criptografadas
import axios from 'axios';

class CryptoService {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
    this.cryptoAPI = 'https://agroisync.contato-00d.workers.dev/api/crypto';
    this.cache = new Map();
    this.cacheTimeout = 2 * 60 * 1000; // 2 minutos
  }

  // Buscar preços das principais criptomoedas
  async getCryptoPrices() {
    const cacheKey = 'crypto-prices';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${this.baseURL}/simple/price`, {
        params: {
          ids: 'bitcoin,ethereum,binancecoin,cardano,solana,polkadot,chainlink,avalanche-2,polygon,cosmos',
          vs_currencies: 'usd,brl',
          include_24hr_change: true,
          include_24hr_vol: true,
          include_market_cap: true
        }
      });

      const cryptoData = Object.entries(response.data).map(([id, data]) => ({
        id,
        symbol: this.getSymbol(id),
        name: this.getName(id),
        priceUSD: data.usd,
        priceBRL: data.brl,
        change24h: data.usd_24h_change,
        volume24h: data.usd_24h_vol,
        marketCap: data.usd_market_cap,
        timestamp: Date.now()
      }));

      // Cache dos resultados
      this.cache.set(cacheKey, {
        data: cryptoData,
        timestamp: Date.now()
      });

      return cryptoData;
    } catch (error) {
      console.error('Erro ao buscar preços de criptomoedas:', error);
      return this.getFallbackCryptoData();
    }
  }

  // Buscar dados históricos para gráfico
  async getHistoricalData(coinId = 'bitcoin', days = 7) {
    const cacheKey = `historical-${coinId}-${days}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${this.baseURL}/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days,
          interval: days <= 1 ? 'hourly' : 'daily'
        }
      });

      const historicalData = response.data.prices.map(([timestamp, price]) => ({
        timestamp,
        price,
        date: new Date(timestamp)
      }));

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

  // Buscar tendências do mercado
  async getMarketTrends() {
    const cacheKey = 'market-trends';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${this.baseURL}/global`);

      const trends = {
        totalMarketCap: response.data.data.total_market_cap.usd,
        totalVolume: response.data.data.total_volume.usd,
        marketCapChange: response.data.data.market_cap_change_percentage_24h_usd,
        activeCryptocurrencies: response.data.data.active_cryptocurrencies,
        markets: response.data.data.markets,
        timestamp: Date.now()
      };

      // Cache dos resultados
      this.cache.set(cacheKey, {
        data: trends,
        timestamp: Date.now()
      });

      return trends;
    } catch (error) {
      console.error('Erro ao buscar tendências do mercado:', error);
      return this.getFallbackTrends();
    }
  }

  // Obter símbolo da moeda
  getSymbol(id) {
    const symbols = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'binancecoin': 'BNB',
      'cardano': 'ADA',
      'solana': 'SOL',
      'polkadot': 'DOT',
      'chainlink': 'LINK',
      'avalanche-2': 'AVAX',
      'polygon': 'MATIC',
      'cosmos': 'ATOM'
    };
    return symbols[id] || id.toUpperCase();
  }

  // Obter nome da moeda
  getName(id) {
    const names = {
      'bitcoin': 'Bitcoin',
      'ethereum': 'Ethereum',
      'binancecoin': 'Binance Coin',
      'cardano': 'Cardano',
      'solana': 'Solana',
      'polkadot': 'Polkadot',
      'chainlink': 'Chainlink',
      'avalanche-2': 'Avalanche',
      'polygon': 'Polygon',
      'cosmos': 'Cosmos'
    };
    return names[id] || id;
  }

  // Dados de fallback
  getFallbackCryptoData() {
    return [
          {
            id: 'bitcoin',
            symbol: 'BTC',
            name: 'Bitcoin',
        priceUSD: 45000,
        priceBRL: 225000,
        change24h: 2.5,
        volume24h: 25000000000,
        marketCap: 850000000000,
        timestamp: Date.now()
          },
          {
            id: 'ethereum',
            symbol: 'ETH',
            name: 'Ethereum',
        priceUSD: 3200,
        priceBRL: 16000,
        change24h: -1.2,
        volume24h: 15000000000,
        marketCap: 380000000000,
        timestamp: Date.now()
      }
    ];
  }

  getFallbackHistoricalData() {
    const data = [];
    const now = Date.now();
    for (let i = 7; i >= 0; i--) {
      data.push({
        timestamp: now - (i * 24 * 60 * 60 * 1000),
        price: 45000 + (Math.random() - 0.5) * 5000,
        date: new Date(now - (i * 24 * 60 * 60 * 1000))
      });
    }
    return data;
  }

  getFallbackTrends() {
    return {
      totalMarketCap: 2000000000000,
      totalVolume: 100000000000,
      marketCapChange: 1.5,
      activeCryptocurrencies: 8500,
      markets: 500,
      timestamp: Date.now()
    };
  }

  // Obter cor baseada na variação
  getChangeColor(change) {
    if (change > 0) return '#39FF14'; // Verde neon para alta
    if (change < 0) return '#FF4500'; // Vermelho para baixa
    return '#EDEDED'; // Branco para neutro
  }

  // Formatar número
  formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  }

  // ===== ROTAS CRIPTOGRAFADAS =====

  // Verificar status das rotas criptografadas
  async getCryptoRoutesStatus() {
    try {
      const response = await axios.get(`${this.cryptoAPI}/status`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status das rotas criptografadas:', error);
      return { success: false, message: 'Erro ao conectar com rotas criptografadas' };
    }
  }

  // Gerar chaves de criptografia
  async generateKeys(algorithm = 'aes-256-gcm') {
    try {
      const response = await axios.post(`${this.cryptoAPI}/generate-keys`, { algorithm });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar chaves:', error);
      return { success: false, message: 'Erro ao gerar chaves de criptografia' };
    }
  }

  // Criptografar dados
  async encryptData(data, key) {
    try {
      const response = await axios.post(`${this.cryptoAPI}/encrypt`, { data, key });
      return response.data;
    } catch (error) {
      console.error('Erro ao criptografar dados:', error);
      return { success: false, message: 'Erro ao criptografar dados' };
    }
  }

  // Descriptografar dados
  async decryptData(encryptedData, key) {
    try {
      const response = await axios.post(`${this.cryptoAPI}/decrypt`, { encryptedData, key });
      return response.data;
    } catch (error) {
      console.error('Erro ao descriptografar dados:', error);
      return { success: false, message: 'Erro ao descriptografar dados' };
    }
  }

  // Gerar hash
  async generateHash(data, algorithm = 'sha256') {
    try {
      const response = await axios.post(`${this.cryptoAPI}/hash`, { data, algorithm });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar hash:', error);
      return { success: false, message: 'Erro ao gerar hash' };
    }
  }

  // Gerar nonce
  async generateNonce(length = 32) {
    try {
      const response = await axios.post(`${this.cryptoAPI}/generate-nonce`, { length });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar nonce:', error);
      return { success: false, message: 'Erro ao gerar nonce' };
    }
  }

  // Criptografar dados sensíveis do usuário
  async encryptUserData(userData) {
    try {
      // Gerar chaves
      const keysResult = await this.generateKeys();
      if (!keysResult.success) {
        return { success: false, message: 'Erro ao gerar chaves' };
      }

      // Criptografar dados
      const encryptResult = await this.encryptData(userData, keysResult.data.symmetricKey);
      if (!encryptResult.success) {
        return { success: false, message: 'Erro ao criptografar dados' };
      }

      return {
        success: true,
        data: {
          encrypted: encryptResult.data,
          key: keysResult.data.symmetricKey,
          algorithm: keysResult.data.algorithm
        }
      };
    } catch (error) {
      console.error('Erro ao criptografar dados do usuário:', error);
      return { success: false, message: 'Erro ao criptografar dados do usuário' };
    }
  }

  // Descriptografar dados sensíveis do usuário
  async decryptUserData(encryptedData, key) {
    try {
      const result = await this.decryptData(encryptedData, key);
      return result;
    } catch (error) {
      console.error('Erro ao descriptografar dados do usuário:', error);
      return { success: false, message: 'Erro ao descriptografar dados do usuário' };
    }
  }

  // Verificar integridade de dados
  async verifyDataIntegrity(data, hash) {
    try {
      const response = await axios.post(`${this.cryptoAPI}/verify-integrity`, { data, hash });
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar integridade:', error);
      return { success: false, message: 'Erro ao verificar integridade' };
    }
  }

  // Assinar dados digitalmente
  async signData(data, privateKey) {
    try {
      const response = await axios.post(`${this.cryptoAPI}/sign`, { data, privateKey });
      return response.data;
    } catch (error) {
      console.error('Erro ao assinar dados:', error);
      return { success: false, message: 'Erro ao assinar dados' };
    }
  }

  // Verificar assinatura digital
  async verifySignature(data, signature, publicKey) {
    try {
      const response = await axios.post(`${this.cryptoAPI}/verify-signature`, { data, signature, publicKey });
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      return { success: false, message: 'Erro ao verificar assinatura' };
    }
  }
}

const cryptoService = new CryptoService();
export default cryptoService;
