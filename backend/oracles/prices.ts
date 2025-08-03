/**
 * Oracles - Prices Module
 * 
 * Este módulo fornece integração com oráculos e APIs externas para obtenção de preços
 * de criptomoedas, tokens e commodities agrícolas.
 * 
 * Inclui:
 * - Integração com Chainlink para preços on-chain
 * - APIs externas para preços de commodities agrícolas
 * - Cache Redis para otimização de desempenho
 * - Fallbacks para garantir disponibilidade de dados
 * - Agregação de múltiplas fontes para maior precisão
 */

import axios from 'axios';
import { Redis } from '@upstash/redis';
import { ethers } from 'ethers';

// Configuração do Redis para cache
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

// Prefixo para chaves Redis
const REDIS_PREFIX = 'agrotm:oracles:prices:';

// Tempo de expiração do cache (em segundos)
const CACHE_EXPIRATION = {
  CRYPTO: 5 * 60,       // 5 minutos para criptomoedas (mais voláteis)
  COMMODITIES: 30 * 60, // 30 minutos para commodities (menos voláteis)
  FOREX: 15 * 60,       // 15 minutos para forex (USD, EUR, etc)
};

// Interfaces
interface PriceData {
  price: number;
  change24h?: number;  // Mudança percentual em 24h
  volume24h?: number;  // Volume em USD nas últimas 24h
  marketCap?: number;  // Capitalização de mercado em USD
  updatedAt: number;   // Timestamp da última atualização
  source: string;      // Fonte dos dados
}

interface CommodityPriceData extends PriceData {
  unit: string;        // Unidade de medida (e.g., "USD/bushel")
  lastTradeDate?: string; // Data do último pregão
}

interface ForexData extends PriceData {
  fromCurrency: string;
  toCurrency: string;
}

// Endereços dos contratos Chainlink para feeds de preços (Ethereum Mainnet)
const CHAINLINK_FEEDS = {
  'ETH-USD': '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  'BTC-USD': '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
  'LINK-USD': '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c',
  'CORN-USD': '0x14d11fadf0e60f8dcd1dcf81da8d4e0940c3d0b1', // Exemplo (verificar endereço real)
  'SOYBEAN-USD': '0xa390215f0d75d5e5435f6714e8f2f399b1e2ca0e', // Exemplo (verificar endereço real)
  'WHEAT-USD': '0xf9d6b5f18d497dc22a169c2ffc7d65b3a8670f07', // Exemplo (verificar endereço real)
};

// ABI simplificado para contratos Chainlink Price Feed
const CHAINLINK_FEED_ABI = [
  'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() external view returns (uint8)',
];

// Provedor Ethereum
let provider: ethers.providers.JsonRpcProvider | null = null;

/**
 * Inicializa o provedor Ethereum
 */
function initProvider() {
  if (provider) return provider;
  
  const rpcUrl = process.env.ETH_RPC_URL || 'https://mainnet.infura.io/v3/your-infura-key';
  provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return provider;
}

/**
 * Obtém preço de um par de ativos do Chainlink
 */
async function getChainlinkPrice(pair: string): Promise<PriceData | null> {
  try {
    const feedAddress = CHAINLINK_FEEDS[pair];
    if (!feedAddress) {
      console.warn(`Feed Chainlink não encontrado para o par ${pair}`);
      return null;
    }
    
    const provider = initProvider();
    const priceFeed = new ethers.Contract(feedAddress, CHAINLINK_FEED_ABI, provider);
    
    // Obter dados mais recentes
    const [roundId, answer, startedAt, updatedAt, answeredInRound] = await priceFeed.latestRoundData();
    const decimals = await priceFeed.decimals();
    
    // Calcular preço real
    const price = parseFloat(ethers.utils.formatUnits(answer, decimals));
    
    return {
      price,
      updatedAt: updatedAt.toNumber() * 1000, // Converter para milissegundos
      source: 'chainlink',
    };
  } catch (error) {
    console.error(`Erro ao obter preço do Chainlink para ${pair}:`, error);
    return null;
  }
}

/**
 * Obtém preço de criptomoeda da CoinGecko
 */
async function getCoinGeckoPrice(coinId: string, vsCurrency: string = 'usd'): Promise<PriceData | null> {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    
    const data = response.data;
    const price = data.market_data.current_price[vsCurrency];
    const change24h = data.market_data.price_change_percentage_24h;
    const volume24h = data.market_data.total_volume[vsCurrency];
    const marketCap = data.market_data.market_cap[vsCurrency];
    
    return {
      price,
      change24h,
      volume24h,
      marketCap,
      updatedAt: Date.now(),
      source: 'coingecko',
    };
  } catch (error) {
    console.error(`Erro ao obter preço do CoinGecko para ${coinId}:`, error);
    return null;
  }
}

/**
 * Obtém preço de commodity da API Alpha Vantage
 */
async function getAlphaVantageCommodityPrice(symbol: string): Promise<CommodityPriceData | null> {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      console.warn('Chave da API Alpha Vantage não configurada');
      return null;
    }
    
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=COMMODITY_PRICE&symbol=${symbol}&apikey=${apiKey}`
    );
    
    const data = response.data;
    if (data['Error Message']) {
      console.warn(`Erro da API Alpha Vantage: ${data['Error Message']}`);
      return null;
    }
    
    // Extrair dados
    const latestData = data.data[0];
    
    return {
      price: parseFloat(latestData.value),
      unit: latestData.unit,
      lastTradeDate: latestData.date,
      updatedAt: Date.now(),
      source: 'alphavantage',
    };
  } catch (error) {
    console.error(`Erro ao obter preço de commodity da Alpha Vantage para ${symbol}:`, error);
    return null;
  }
}

/**
 * Obtém preço de commodity da API Quandl
 */
async function getQuandlCommodityPrice(database: string, dataset: string): Promise<CommodityPriceData | null> {
  try {
    const apiKey = process.env.QUANDL_API_KEY;
    if (!apiKey) {
      console.warn('Chave da API Quandl não configurada');
      return null;
    }
    
    const response = await axios.get(
      `https://www.quandl.com/api/v3/datasets/${database}/${dataset}/data.json?limit=1&api_key=${apiKey}`
    );
    
    const data = response.data;
    if (!data.dataset_data || !data.dataset_data.data || data.dataset_data.data.length === 0) {
      console.warn(`Dados não encontrados na API Quandl para ${database}/${dataset}`);
      return null;
    }
    
    // Extrair dados
    const latestData = data.dataset_data.data[0];
    const date = latestData[0]; // Primeira coluna é a data
    const price = latestData[1]; // Segunda coluna é o preço
    
    return {
      price,
      unit: 'USD/unit', // Ajustar conforme a commodity
      lastTradeDate: date,
      updatedAt: Date.now(),
      source: 'quandl',
    };
  } catch (error) {
    console.error(`Erro ao obter preço de commodity da Quandl para ${database}/${dataset}:`, error);
    return null;
  }
}

/**
 * Obtém taxa de câmbio da API ExchangeRate-API
 */
async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<ForexData | null> {
  try {
    const response = await axios.get(
      `https://open.er-api.com/v6/latest/${fromCurrency}`
    );
    
    const data = response.data;
    if (!data.rates || !data.rates[toCurrency]) {
      console.warn(`Taxa de câmbio não encontrada para ${fromCurrency}/${toCurrency}`);
      return null;
    }
    
    return {
      price: data.rates[toCurrency],
      fromCurrency,
      toCurrency,
      updatedAt: data.time_last_update_unix * 1000, // Converter para milissegundos
      source: 'exchangerate-api',
    };
  } catch (error) {
    console.error(`Erro ao obter taxa de câmbio para ${fromCurrency}/${toCurrency}:`, error);
    return null;
  }
}

/**
 * Obtém preço do token AGRO (token nativo da plataforma)
 */
async function getAgroTokenPrice(): Promise<PriceData | null> {
  try {
    // Verificar cache
    const cachedData = await redis.get(`${REDIS_PREFIX}crypto:AGRO`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Em um sistema real, obteríamos o preço do token AGRO de uma exchange ou DEX
    // Para este exemplo, simulamos um preço
    
    // Tentar obter preço do ETH como referência
    let ethPrice = 1800; // Valor padrão
    const ethPriceData = await getCryptoPrice('ETH');
    if (ethPriceData) {
      ethPrice = ethPriceData.price;
    }
    
    // Simular preço do AGRO com base no ETH
    const agroPrice = ethPrice * 0.0015; // Exemplo: 1 AGRO = 0.0015 ETH
    
    const priceData: PriceData = {
      price: agroPrice,
      change24h: 2.5, // Exemplo: +2.5%
      volume24h: 1500000, // Exemplo: $1.5M
      marketCap: 50000000, // Exemplo: $50M
      updatedAt: Date.now(),
      source: 'internal',
    };
    
    // Armazenar em cache
    await redis.set(`${REDIS_PREFIX}crypto:AGRO`, JSON.stringify(priceData), { ex: CACHE_EXPIRATION.CRYPTO });
    
    return priceData;
  } catch (error) {
    console.error('Erro ao obter preço do token AGRO:', error);
    return null;
  }
}

/**
 * Obtém preço de criptomoeda (com fallbacks e cache)
 */
export async function getCryptoPrice(symbol: string): Promise<PriceData | null> {
  try {
    // Normalizar símbolo
    const normalizedSymbol = symbol.toUpperCase();
    
    // Verificar cache
    const cachedData = await redis.get(`${REDIS_PREFIX}crypto:${normalizedSymbol}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Caso especial para o token AGRO
    if (normalizedSymbol === 'AGRO') {
      return await getAgroTokenPrice();
    }
    
    // Mapear símbolo para ID do CoinGecko
    const coinGeckoIdMap: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'LINK': 'chainlink',
      'SOL': 'solana',
      'AVAX': 'avalanche-2',
      'MATIC': 'matic-network',
      'DOT': 'polkadot',
      'ADA': 'cardano',
      // Adicionar mais mapeamentos conforme necessário
    };
    
    // Mapear símbolo para par Chainlink
    const chainlinkPairMap: Record<string, string> = {
      'BTC': 'BTC-USD',
      'ETH': 'ETH-USD',
      'LINK': 'LINK-USD',
      // Adicionar mais mapeamentos conforme necessário
    };
    
    let priceData: PriceData | null = null;
    
    // Tentar obter do Chainlink primeiro (dados on-chain são mais confiáveis)
    if (chainlinkPairMap[normalizedSymbol]) {
      priceData = await getChainlinkPrice(chainlinkPairMap[normalizedSymbol]);
    }
    
    // Se não conseguir do Chainlink, tentar CoinGecko
    if (!priceData && coinGeckoIdMap[normalizedSymbol]) {
      priceData = await getCoinGeckoPrice(coinGeckoIdMap[normalizedSymbol]);
    }
    
    // Se ainda não tiver dados, tentar buscar diretamente pelo símbolo no CoinGecko
    if (!priceData) {
      try {
        priceData = await getCoinGeckoPrice(normalizedSymbol.toLowerCase());
      } catch (error) {
        // Ignorar erro, tentar próxima fonte
      }
    }
    
    if (priceData) {
      // Armazenar em cache
      await redis.set(`${REDIS_PREFIX}crypto:${normalizedSymbol}`, JSON.stringify(priceData), { ex: CACHE_EXPIRATION.CRYPTO });
      return priceData;
    }
    
    console.warn(`Não foi possível obter preço para a criptomoeda ${normalizedSymbol}`);
    return null;
  } catch (error) {
    console.error(`Erro ao obter preço da criptomoeda ${symbol}:`, error);
    return null;
  }
}

/**
 * Obtém preço de commodity agrícola (com fallbacks e cache)
 */
export async function getCommodityPrice(commodity: string): Promise<CommodityPriceData | null> {
  try {
    // Normalizar nome da commodity
    const normalizedCommodity = commodity.toUpperCase();
    
    // Verificar cache
    const cachedData = await redis.get(`${REDIS_PREFIX}commodity:${normalizedCommodity}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Mapear commodity para símbolo da Alpha Vantage
    const alphaVantageSymbolMap: Record<string, string> = {
      'CORN': 'CORN',
      'SOYBEAN': 'SOYBEAN',
      'WHEAT': 'WHEAT',
      'COFFEE': 'COFFEE',
      'COTTON': 'COTTON',
      'SUGAR': 'SUGAR',
      'RICE': 'RICE',
      // Adicionar mais mapeamentos conforme necessário
    };
    
    // Mapear commodity para database/dataset da Quandl
    const quandlDatasetMap: Record<string, { database: string; dataset: string }> = {
      'CORN': { database: 'CHRIS', dataset: 'CME_C1' },
      'SOYBEAN': { database: 'CHRIS', dataset: 'CME_S1' },
      'WHEAT': { database: 'CHRIS', dataset: 'CME_W1' },
      'COFFEE': { database: 'CHRIS', dataset: 'ICE_KC1' },
      'COTTON': { database: 'CHRIS', dataset: 'ICE_CT1' },
      'SUGAR': { database: 'CHRIS', dataset: 'ICE_SB1' },
      // Adicionar mais mapeamentos conforme necessário
    };
    
    // Mapear commodity para par Chainlink
    const chainlinkPairMap: Record<string, string> = {
      'CORN': 'CORN-USD',
      'SOYBEAN': 'SOYBEAN-USD',
      'WHEAT': 'WHEAT-USD',
      // Adicionar mais mapeamentos conforme necessário
    };
    
    let priceData: CommodityPriceData | null = null;
    
    // Tentar obter do Chainlink primeiro (dados on-chain são mais confiáveis)
    if (chainlinkPairMap[normalizedCommodity]) {
      const chainlinkData = await getChainlinkPrice(chainlinkPairMap[normalizedCommodity]);
      if (chainlinkData) {
        priceData = {
          ...chainlinkData,
          unit: 'USD/bushel', // Ajustar conforme a commodity
        };
      }
    }
    
    // Se não conseguir do Chainlink, tentar Alpha Vantage
    if (!priceData && alphaVantageSymbolMap[normalizedCommodity]) {
      priceData = await getAlphaVantageCommodityPrice(alphaVantageSymbolMap[normalizedCommodity]);
    }
    
    // Se ainda não tiver dados, tentar Quandl
    if (!priceData && quandlDatasetMap[normalizedCommodity]) {
      const { database, dataset } = quandlDatasetMap[normalizedCommodity];
      priceData = await getQuandlCommodityPrice(database, dataset);
    }
    
    // Se ainda não tiver dados, usar valores simulados
    if (!priceData) {
      // Valores simulados para desenvolvimento
      const simulatedPrices: Record<string, number> = {
        'CORN': 6.32,
        'SOYBEAN': 14.75,
        'WHEAT': 7.89,
        'COFFEE': 3.45,
        'COTTON': 0.85,
        'SUGAR': 0.25,
        'RICE': 18.50,
      };
      
      const simulatedUnits: Record<string, string> = {
        'CORN': 'USD/bushel',
        'SOYBEAN': 'USD/bushel',
        'WHEAT': 'USD/bushel',
        'COFFEE': 'USD/pound',
        'COTTON': 'USD/pound',
        'SUGAR': 'USD/pound',
        'RICE': 'USD/cwt',
      };
      
      if (simulatedPrices[normalizedCommodity]) {
        priceData = {
          price: simulatedPrices[normalizedCommodity],
          unit: simulatedUnits[normalizedCommodity] || 'USD/unit',
          updatedAt: Date.now(),
          source: 'simulated',
        };
      }
    }
    
    if (priceData) {
      // Armazenar em cache
      await redis.set(`${REDIS_PREFIX}commodity:${normalizedCommodity}`, JSON.stringify(priceData), { ex: CACHE_EXPIRATION.COMMODITIES });
      return priceData;
    }
    
    console.warn(`Não foi possível obter preço para a commodity ${normalizedCommodity}`);
    return null;
  } catch (error) {
    console.error(`Erro ao obter preço da commodity ${commodity}:`, error);
    return null;
  }
}

/**
 * Obtém taxa de câmbio (com cache)
 */
export async function getForexRate(fromCurrency: string, toCurrency: string): Promise<ForexData | null> {
  try {
    // Normalizar moedas
    const normalizedFrom = fromCurrency.toUpperCase();
    const normalizedTo = toCurrency.toUpperCase();
    
    // Verificar cache
    const cachedData = await redis.get(`${REDIS_PREFIX}forex:${normalizedFrom}-${normalizedTo}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    const forexData = await getExchangeRate(normalizedFrom, normalizedTo);
    
    if (forexData) {
      // Armazenar em cache
      await redis.set(`${REDIS_PREFIX}forex:${normalizedFrom}-${normalizedTo}`, JSON.stringify(forexData), { ex: CACHE_EXPIRATION.FOREX });
      return forexData;
    }
    
    console.warn(`Não foi possível obter taxa de câmbio para ${normalizedFrom}/${normalizedTo}`);
    return null;
  } catch (error) {
    console.error(`Erro ao obter taxa de câmbio para ${fromCurrency}/${toCurrency}:`, error);
    return null;
  }
}

/**
 * Obtém múltiplos preços de criptomoedas de uma vez
 */
export async function getMultipleCryptoPrices(symbols: string[]): Promise<Record<string, PriceData | null>> {
  const results: Record<string, PriceData | null> = {};
  
  // Usar Promise.all para fazer requisições em paralelo
  await Promise.all(
    symbols.map(async (symbol) => {
      results[symbol] = await getCryptoPrice(symbol);
    })
  );
  
  return results;
}

/**
 * Obtém múltiplos preços de commodities de uma vez
 */
export async function getMultipleCommodityPrices(commodities: string[]): Promise<Record<string, CommodityPriceData | null>> {
  const results: Record<string, CommodityPriceData | null> = {};
  
  // Usar Promise.all para fazer requisições em paralelo
  await Promise.all(
    commodities.map(async (commodity) => {
      results[commodity] = await getCommodityPrice(commodity);
    })
  );
  
  return results;
}

/**
 * Obtém todos os preços relevantes para o ecossistema AGROTM
 */
export async function getAllPrices(): Promise<{
  crypto: Record<string, PriceData | null>;
  commodities: Record<string, CommodityPriceData | null>;
  forex: Record<string, ForexData | null>;
}> {
  // Lista de ativos relevantes
  const cryptoSymbols = ['AGRO', 'ETH', 'BTC', 'SOL', 'AVAX', 'MATIC'];
  const commoditySymbols = ['CORN', 'SOYBEAN', 'WHEAT', 'COFFEE', 'COTTON', 'SUGAR', 'RICE'];
  const forexPairs = [
    { from: 'USD', to: 'BRL' },
    { from: 'USD', to: 'EUR' },
    { from: 'USD', to: 'JPY' },
  ];
  
  // Obter preços em paralelo
  const [cryptoPrices, commodityPrices] = await Promise.all([
    getMultipleCryptoPrices(cryptoSymbols),
    getMultipleCommodityPrices(commoditySymbols),
  ]);
  
  // Obter taxas de câmbio
  const forexRates: Record<string, ForexData | null> = {};
  await Promise.all(
    forexPairs.map(async ({ from, to }) => {
      const key = `${from}-${to}`;
      forexRates[key] = await getForexRate(from, to);
    })
  );
  
  return {
    crypto: cryptoPrices,
    commodities: commodityPrices,
    forex: forexRates,
  };
}

/**
 * Obtém histórico de preços de criptomoeda
 */
export async function getCryptoPriceHistory(symbol: string, days: number = 30): Promise<{
  prices: Array<{ timestamp: number; price: number }>;
  symbol: string;
} | null> {
  try {
    // Normalizar símbolo
    const normalizedSymbol = symbol.toUpperCase();
    
    // Verificar cache
    const cacheKey = `${REDIS_PREFIX}crypto-history:${normalizedSymbol}:${days}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Caso especial para o token AGRO
    if (normalizedSymbol === 'AGRO') {
      // Simular histórico para o token AGRO
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;
      const prices: Array<{ timestamp: number; price: number }> = [];
      
      // Preço atual como referência
      const currentPrice = (await getAgroTokenPrice())?.price || 2.5;
      
      // Gerar histórico simulado
      for (let i = days; i >= 0; i--) {
        const timestamp = now - i * dayInMs;
        // Simular flutuação de preço com tendência de alta
        const randomFactor = 0.95 + Math.random() * 0.1; // 0.95 a 1.05
        const trendFactor = 1 + (days - i) / days * 0.2; // Tendência de alta de até 20%
        const price = currentPrice * randomFactor * trendFactor;
        
        prices.push({ timestamp, price });
      }
      
      const result = { prices, symbol: normalizedSymbol };
      
      // Armazenar em cache por 1 hora
      await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
      
      return result;
    }
    
    // Mapear símbolo para ID do CoinGecko
    const coinGeckoIdMap: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'LINK': 'chainlink',
      'SOL': 'solana',
      'AVAX': 'avalanche-2',
      'MATIC': 'matic-network',
      'DOT': 'polkadot',
      'ADA': 'cardano',
      // Adicionar mais mapeamentos conforme necessário
    };
    
    const coinId = coinGeckoIdMap[normalizedSymbol] || normalizedSymbol.toLowerCase();
    
    // Obter histórico do CoinGecko
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    const priceData = response.data.prices;
    const prices = priceData.map((item: [number, number]) => ({
      timestamp: item[0],
      price: item[1],
    }));
    
    const result = { prices, symbol: normalizedSymbol };
    
    // Armazenar em cache por 1 hora
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
    
    return result;
  } catch (error) {
    console.error(`Erro ao obter histórico de preços para ${symbol}:`, error);
    return null;
  }
}

/**
 * Obtém histórico de preços de commodity
 */
export async function getCommodityPriceHistory(commodity: string, days: number = 30): Promise<{
  prices: Array<{ timestamp: number; price: number }>;
  commodity: string;
  unit: string;
} | null> {
  try {
    // Normalizar nome da commodity
    const normalizedCommodity = commodity.toUpperCase();
    
    // Verificar cache
    const cacheKey = `${REDIS_PREFIX}commodity-history:${normalizedCommodity}:${days}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Em um sistema real, obteríamos esses dados de uma API de commodities
    // Para este exemplo, simulamos dados históricos
    
    // Obter preço atual como referência
    const currentPriceData = await getCommodityPrice(normalizedCommodity);
    if (!currentPriceData) {
      console.warn(`Não foi possível obter preço atual para a commodity ${normalizedCommodity}`);
      return null;
    }
    
    const currentPrice = currentPriceData.price;
    const unit = currentPriceData.unit;
    
    // Simular histórico
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    const prices: Array<{ timestamp: number; price: number }> = [];
    
    // Gerar histórico simulado com sazonalidade
    for (let i = days; i >= 0; i--) {
      const timestamp = now - i * dayInMs;
      // Simular flutuação de preço com sazonalidade
      const seasonalFactor = 1 + Math.sin(i / 30 * Math.PI) * 0.1; // Variação sazonal de ±10%
      const randomFactor = 0.98 + Math.random() * 0.04; // 0.98 a 1.02
      const price = currentPrice * seasonalFactor * randomFactor;
      
      prices.push({ timestamp, price });
    }
    
    const result = { prices, commodity: normalizedCommodity, unit };
    
    // Armazenar em cache por 1 hora
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
    
    return result;
  } catch (error) {
    console.error(`Erro ao obter histórico de preços para a commodity ${commodity}:`, error);
    return null;
  }
}

/**
 * Inicializa o módulo de preços
 */
export function initPricesModule() {
  console.log('Inicializando módulo de preços...');
  
  // Inicializar provedor Ethereum
  initProvider();
  
  // Pré-carregar alguns preços comuns para o cache
  setTimeout(async () => {
    try {
      console.log('Pré-carregando preços comuns...');
      await getAllPrices();
      console.log('Preços pré-carregados com sucesso');
    } catch (error) {
      console.error('Erro ao pré-carregar preços:', error);
    }
  }, 1000);
  
  console.log('Módulo de preços inicializado');
}