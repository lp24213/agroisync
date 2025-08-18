/**
 * Oracles - Commodities Module
 * 
 * Este módulo fornece integração com oráculos e APIs externas para obtenção de dados
 * de commodities agrícolas relevantes para o ecossistema AGROTM.
 * 
 * Inclui:
 * - Integração com Chainlink para preços de commodities on-chain
 * - APIs externas para preços atuais e históricos de commodities
 * - Cache Redis para otimização de desempenho
 * - Análise de tendências de preços
 * - Alertas de variações significativas
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
const REDIS_PREFIX = 'agrotm:oracles:commodities:';

// Tempo de expiração do cache (em segundos)
const CACHE_EXPIRATION = {
  CURRENT: 15 * 60,      // 15 minutos para preços atuais
  HISTORICAL: 24 * 60 * 60, // 24 horas para dados históricos
};

// Interfaces
interface CommodityPrice {
  symbol: string;           // Símbolo da commodity
  name: string;             // Nome da commodity
  price: number;            // Preço atual
  currency: string;         // Moeda (USD, BRL, etc.)
  unit: string;             // Unidade (bushel, ton, etc.)
  timestamp: number;        // Timestamp da última atualização
  change: number;           // Variação percentual em 24h
  source: string;           // Fonte dos dados
}

interface HistoricalPrice {
  date: string;             // Data no formato YYYY-MM-DD
  price: number;            // Preço
  open?: number;            // Preço de abertura (opcional)
  high?: number;            // Preço máximo (opcional)
  low?: number;             // Preço mínimo (opcional)
  volume?: number;          // Volume negociado (opcional)
  source?: string;          // Fonte dos dados (opcional)
}

interface CommodityPriceHistory {
  symbol: string;           // Símbolo da commodity
  name: string;             // Nome da commodity
  currency: string;         // Moeda (USD, BRL, etc.)
  unit: string;             // Unidade (bushel, ton, etc.)
  data: HistoricalPrice[];  // Dados históricos
  source: string;           // Fonte dos dados
}

interface PriceTrend {
  symbol: string;           // Símbolo da commodity
  name: string;             // Nome da commodity
  currentPrice: number;     // Preço atual
  currency: string;         // Moeda (USD, BRL, etc.)
  unit: string;             // Unidade (bushel, ton, etc.)
  trends: {
    daily: number;          // Variação percentual em 24h
    weekly: number;         // Variação percentual em 7 dias
    monthly: number;        // Variação percentual em 30 dias
    quarterly: number;      // Variação percentual em 90 dias
  };
  direction: 'up' | 'down' | 'stable'; // Direção da tendência
  strength: 'strong' | 'moderate' | 'weak'; // Força da tendência
  source: string;           // Fonte dos dados
}

// Endereços dos contratos Chainlink para feeds de preços de commodities (Ethereum Mainnet)
const CHAINLINK_COMMODITY_FEEDS = {
  // Feeds oficiais da Chainlink
  'CORN_USD': '0xb6f10be0728a64d52cf05d72b3c1c1bc7fd577b6', // Milho/USD
  'WHEAT_USD': '0xf9f6c86877b8fd9cd9f2c66438a443586ee36f1c', // Trigo/USD
  'SOYBEAN_USD': '0xa0bcff86c3970d4a9e7e3ed95a22bf2c3d4c5d5d', // Soja/USD (exemplo)
  'COFFEE_USD': '0x8c110b94c5f1d347facf5e1e938ab2db60e3c9a8', // Café/USD (exemplo)
  'COTTON_USD': '0x5c8809a7b2e8ee2513c8c3f7e8925196f8d38c71', // Algodão/USD (exemplo)
  'SUGAR_USD': '0x1a602d4928facc7c91eac4f5b4ab2b4ed0f7c9d8', // Açúcar/USD (exemplo)
};

// ABI simplificado para contratos Chainlink Price Feed
const CHAINLINK_PRICE_FEED_ABI = [
  'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() external view returns (uint8)',
  'function description() external view returns (string)',
];

// Provedor Ethereum
let provider: ethers.JsonRpcProvider | null = null;

/**
 * Inicializa o provedor Ethereum
 */
function initProvider() {
  if (provider) return provider;
  
  const rpcUrl = process.env.ETH_RPC_URL || 'https://mainnet.infura.io/v3/your-infura-key';
  provider = new ethers.JsonRpcProvider(rpcUrl);
  return provider;
}

/**
 * Obtém preço de commodity do Chainlink
 */
async function getChainlinkCommodityPrice(symbol: string): Promise<CommodityPrice | null> {
  try {
    const feedAddress = CHAINLINK_COMMODITY_FEEDS[symbol];
    if (!feedAddress) {
      console.warn(`Feed Chainlink não encontrado para ${symbol}`);
      return null;
    }
    
    const provider = initProvider();
    const priceFeed = new ethers.Contract(feedAddress, CHAINLINK_PRICE_FEED_ABI, provider);
    
    // Obter dados mais recentes
    const [roundId, answer, startedAt, updatedAt, answeredInRound] = await priceFeed.latestRoundData();
    const decimals = await priceFeed.decimals();
    const description = await priceFeed.description();
    
    // Calcular preço real
    const price = parseFloat(ethers.formatUnits(answer, decimals));
    
    // Obter dados anteriores para calcular a variação
    let change = 0;
    try {
      // Tentar obter dados de 24h atrás (aproximadamente)
      const oneDayAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
      const historicalData = await getPriceHistoryFromChainlink(symbol, oneDayAgo);
      if (historicalData && historicalData.length > 0) {
        const oldPrice = historicalData[0].price;
        change = ((price - oldPrice) / oldPrice) * 100;
      }
    } catch (error) {
      console.warn(`Não foi possível calcular a variação para ${symbol}:`, error);
    }
    
    // Mapear símbolo para nome e unidade
    const commodityInfo = getCommodityInfo(symbol);
    
    return {
      symbol,
      name: commodityInfo.name,
      price,
      currency: 'USD',
      unit: commodityInfo.unit,
      timestamp: updatedAt.toNumber() * 1000, // Converter para milissegundos
      change,
      source: 'chainlink',
    };
  } catch (error) {
    console.error(`Erro ao obter preço de ${symbol} do Chainlink:`, error);
    return null;
  }
}

/**
 * Obtém histórico de preços do Chainlink
 */
async function getPriceHistoryFromChainlink(symbol: string, startTime: number): Promise<HistoricalPrice[]> {
  // Nota: Esta é uma implementação simplificada, pois o Chainlink não fornece diretamente um histórico completo.
  // Em um ambiente real, seria necessário consultar eventos emitidos pelo contrato ou usar um serviço como o Chainlink Market Data.
  
  try {
    // Simulação de dados históricos
    // Em um ambiente real, esses dados viriam de eventos on-chain ou de um serviço como o Chainlink Market Data
    const now = Math.floor(Date.now() / 1000);
    const days = Math.floor((now - startTime) / (24 * 60 * 60));
    
    const feedAddress = CHAINLINK_COMMODITY_FEEDS[symbol];
    if (!feedAddress) {
      console.warn(`Feed Chainlink não encontrado para ${symbol}`);
      return [];
    }
    
    const provider = initProvider();
    const priceFeed = new ethers.Contract(feedAddress, CHAINLINK_PRICE_FEED_ABI, provider);
    
    // Obter preço atual
    const [roundId, answer, started, updatedAt, answeredInRound] = await priceFeed.latestRoundData();
    const decimals = await priceFeed.decimals();
    const currentPrice = parseFloat(ethers.formatUnits(answer, decimals));
    
    // Simular histórico com variação aleatória
    const history: HistoricalPrice[] = [];
    let price = currentPrice;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now * 1000 - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      // Adicionar variação aleatória (-2% a +2%)
      const variation = (Math.random() * 4 - 2) / 100;
      price = price / (1 + variation);
      
      // Simular preços de abertura, máximo e mínimo
      const open = price * (1 + (Math.random() * 0.01 - 0.005));
      const high = price * (1 + Math.random() * 0.02);
      const low = price * (1 - Math.random() * 0.02);
      const volume = Math.floor(Math.random() * 10000) + 5000;
      
      history.push({
        date: dateStr,
        price,
        open,
        high,
        low,
        volume,
      });
    }
    
    // Ordenar por data (mais recente primeiro)
    history.sort((a, b) => b.date.localeCompare(a.date));
    
    return history;
  } catch (error) {
    console.error(`Erro ao obter histórico de preços do Chainlink para ${symbol}:`, error);
    return [];
  }
}

/**
 * Obtém preços de commodities da API Alpha Vantage
 */
async function getAlphaVantageCommodityPrice(symbol: string): Promise<CommodityPrice | null> {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      console.warn('Chave da API Alpha Vantage não configurada');
      return null;
    }
    
    // Mapear símbolo interno para símbolo da Alpha Vantage
    const alphaSymbol = mapToAlphaVantageSymbol(symbol);
    if (!alphaSymbol) {
      console.warn(`Símbolo ${symbol} não mapeado para Alpha Vantage`);
      return null;
    }
    
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=COMMODITY_PRICE&symbol=${alphaSymbol}&apikey=${apiKey}`
    );
    
    const data = response.data;
    
    if (data['Error Message']) {
      console.warn(`Erro da Alpha Vantage: ${data['Error Message']}`);
      return null;
    }
    
    // Extrair dados
    const lastRefreshed = data['Last Refreshed'];
    const price = parseFloat(data['Price']);
    const change = parseFloat(data['Change Percent'].replace('%', ''));
    
    // Mapear símbolo para nome e unidade
    const commodityInfo = getCommodityInfo(symbol);
    
    return {
      symbol,
      name: commodityInfo.name,
      price,
      currency: 'USD',
      unit: commodityInfo.unit,
      timestamp: new Date(lastRefreshed).getTime(),
      change,
      source: 'alphavantage',
    };
  } catch (error) {
    console.error(`Erro ao obter preço de ${symbol} da Alpha Vantage:`, error);
    return null;
  }
}

/**
 * Obtém histórico de preços da API Alpha Vantage
 */
async function getAlphaVantageHistoricalPrices(symbol: string, interval: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<HistoricalPrice[]> {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      console.warn('Chave da API Alpha Vantage não configurada');
      return [];
    }
    
    // Mapear símbolo interno para símbolo da Alpha Vantage
    const alphaSymbol = mapToAlphaVantageSymbol(symbol);
    if (!alphaSymbol) {
      console.warn(`Símbolo ${symbol} não mapeado para Alpha Vantage`);
      return [];
    }
    
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_${interval.toUpperCase()}&symbol=${alphaSymbol}&apikey=${apiKey}`
    );
    
    const data = response.data;
    
    if (data['Error Message']) {
      console.warn(`Erro da Alpha Vantage: ${data['Error Message']}`);
      return [];
    }
    
    // Extrair dados históricos
    const timeSeriesKey = `Time Series (${interval.charAt(0).toUpperCase() + interval.slice(1)})`;
    const timeSeries = data[timeSeriesKey];
    
    if (!timeSeries) {
      console.warn(`Dados históricos não encontrados para ${symbol}`);
      return [];
    }
    
    const history: HistoricalPrice[] = [];
    
    for (const date in timeSeries) {
      const entry = timeSeries[date];
      history.push({
        date,
        price: parseFloat(entry['4. close']),
        open: parseFloat(entry['1. open']),
        high: parseFloat(entry['2. high']),
        low: parseFloat(entry['3. low']),
        volume: parseFloat(entry['5. volume']),
      });
    }
    
    // Ordenar por data (mais recente primeiro)
    history.sort((a, b) => b.date.localeCompare(a.date));
    
    return history;
  } catch (error) {
    console.error(`Erro ao obter histórico de preços da Alpha Vantage para ${symbol}:`, error);
    return [];
  }
}

/**
 * Obtém preços de commodities da API Quandl
 */
async function getQuandlCommodityPrice(symbol: string): Promise<CommodityPrice | null> {
  try {
    const apiKey = process.env.QUANDL_API_KEY;
    if (!apiKey) {
      console.warn('Chave da API Quandl não configurada');
      return null;
    }
    
    // Mapear símbolo interno para símbolo da Quandl
    const quandlSymbol = mapToQuandlSymbol(symbol);
    if (!quandlSymbol) {
      console.warn(`Símbolo ${symbol} não mapeado para Quandl`);
      return null;
    }
    
    const response = await axios.get(
      `https://www.quandl.com/api/v3/datasets/${quandlSymbol}/data.json?api_key=${apiKey}&limit=2`
    );
    
    const data = response.data;
    
    if (!data.dataset_data || !data.dataset_data.data || data.dataset_data.data.length === 0) {
      console.warn(`Dados não encontrados para ${symbol} na Quandl`);
      return null;
    }
    
    // Extrair dados mais recentes
    const latestData = data.dataset_data.data[0];
    const previousData = data.dataset_data.data.length > 1 ? data.dataset_data.data[1] : null;
    
    const date = latestData[0]; // Primeira coluna é a data
    const price = latestData[1]; // Segunda coluna é o preço
    
    // Calcular variação percentual
    let change = 0;
    if (previousData) {
      const previousPrice = previousData[1];
      change = ((price - previousPrice) / previousPrice) * 100;
    }
    
    // Mapear símbolo para nome e unidade
    const commodityInfo = getCommodityInfo(symbol);
    
    return {
      symbol,
      name: commodityInfo.name,
      price,
      currency: 'USD',
      unit: commodityInfo.unit,
      timestamp: new Date(date).getTime(),
      change,
      source: 'quandl',
    };
  } catch (error) {
    console.error(`Erro ao obter preço de ${symbol} da Quandl:`, error);
    return null;
  }
}

/**
 * Obtém histórico de preços da API Quandl
 */
async function getQuandlHistoricalPrices(symbol: string, limit: number = 100): Promise<HistoricalPrice[]> {
  try {
    const apiKey = process.env.QUANDL_API_KEY;
    if (!apiKey) {
      console.warn('Chave da API Quandl não configurada');
      return [];
    }
    
    // Mapear símbolo interno para símbolo da Quandl
    const quandlSymbol = mapToQuandlSymbol(symbol);
    if (!quandlSymbol) {
      console.warn(`Símbolo ${symbol} não mapeado para Quandl`);
      return [];
    }
    
    const response = await axios.get(
      `https://www.quandl.com/api/v3/datasets/${quandlSymbol}/data.json?api_key=${apiKey}&limit=${limit}`
    );
    
    const data = response.data;
    
    if (!data.dataset_data || !data.dataset_data.data || data.dataset_data.data.length === 0) {
      console.warn(`Dados históricos não encontrados para ${symbol} na Quandl`);
      return [];
    }
    
    // Extrair dados históricos
    const history: HistoricalPrice[] = [];
    
    for (const entry of data.dataset_data.data) {
      const date = entry[0]; // Primeira coluna é a data
      const price = entry[1]; // Segunda coluna é o preço
      
      // Algumas APIs da Quandl fornecem mais dados
      const hasExtendedData = entry.length >= 5;
      
      history.push({
        date,
        price,
        ...(hasExtendedData ? {
          open: entry[1],
          high: entry[2],
          low: entry[3],
          volume: entry[4],
        } : {}),
      });
    }
    
    // Ordenar por data (mais recente primeiro)
    history.sort((a, b) => b.date.localeCompare(a.date));
    
    return history;
  } catch (error) {
    console.error(`Erro ao obter histórico de preços da Quandl para ${symbol}:`, error);
    return [];
  }
}

/**
 * Simula preços de commodities para desenvolvimento e testes
 */
function simulateCommodityPrice(symbol: string): CommodityPrice {
  // Preços base para simulação
  const basePrices: Record<string, number> = {
    'CORN_USD': 5.75,    // USD por bushel
    'WHEAT_USD': 7.25,   // USD por bushel
    'SOYBEAN_USD': 14.50, // USD por bushel
    'COFFEE_USD': 1.85,  // USD por libra
    'COTTON_USD': 0.85,  // USD por libra
    'SUGAR_USD': 0.18,   // USD por libra
    'RICE_USD': 17.50,   // USD por cwt (100 libras)
    'CATTLE_USD': 1.75,  // USD por libra
    'COCOA_USD': 3.25,   // USD por tonelada
    'ORANGE_USD': 2.15,  // USD por libra
  };
  
  // Variação aleatória de -5% a +5%
  const variation = (Math.random() * 10 - 5) / 100;
  const basePrice = basePrices[symbol] || 10.0;
  const price = basePrice * (1 + variation);
  
  // Variação diária aleatória de -3% a +3%
  const change = (Math.random() * 6 - 3);
  
  // Mapear símbolo para nome e unidade
  const commodityInfo = getCommodityInfo(symbol);
  
  return {
    symbol,
    name: commodityInfo.name,
    price,
    currency: 'USD',
    unit: commodityInfo.unit,
    timestamp: Date.now(),
    change,
    source: 'simulation',
  };
}

/**
 * Simula histórico de preços para desenvolvimento e testes
 */
function simulateHistoricalPrices(symbol: string, days: number = 90): HistoricalPrice[] {
  // Preço base para simulação
  const commodityInfo = getCommodityInfo(symbol);
  const basePrices: Record<string, number> = {
    'CORN_USD': 5.75,    // USD por bushel
    'WHEAT_USD': 7.25,   // USD por bushel
    'SOYBEAN_USD': 14.50, // USD por bushel
    'COFFEE_USD': 1.85,  // USD por libra
    'COTTON_USD': 0.85,  // USD por libra
    'SUGAR_USD': 0.18,   // USD por libra
    'RICE_USD': 17.50,   // USD por cwt (100 libras)
    'CATTLE_USD': 1.75,  // USD por libra
    'COCOA_USD': 3.25,   // USD por tonelada
    'ORANGE_USD': 2.15,  // USD por libra
  };
  
  const basePrice = basePrices[symbol] || 10.0;
  const history: HistoricalPrice[] = [];
  
  // Gerar tendência geral (subida, descida ou estável)
  const trendType = Math.floor(Math.random() * 3); // 0: subida, 1: descida, 2: estável
  const trendStrength = Math.random() * 0.0005 + 0.0001; // Força da tendência
  
  // Gerar ciclos de mercado
  const cycles = Math.floor(days / 30) + 1; // Aproximadamente um ciclo por mês
  const cyclePoints: number[] = [];
  
  for (let i = 0; i <= cycles; i++) {
    // Gerar pontos de inflexão para os ciclos
    cyclePoints.push(Math.random() * 0.2 - 0.1); // -10% a +10%
  }
  
  let price = basePrice;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    // Aplicar tendência geral
    if (trendType === 0) {
      // Tendência de subida
      price *= (1 + trendStrength);
    } else if (trendType === 1) {
      // Tendência de descida
      price *= (1 - trendStrength);
    }
    
    // Aplicar ciclo de mercado
    const cycleIndex = Math.floor(i / (days / cycles));
    const cyclePosition = (i % (days / cycles)) / (days / cycles); // 0 a 1 dentro do ciclo
    const cycleFactor = Math.sin(cyclePosition * Math.PI * 2) * cyclePoints[cycleIndex];
    price *= (1 + cycleFactor / 100);
    
    // Adicionar ruído diário (-1% a +1%)
    const dailyNoise = (Math.random() * 2 - 1) / 100;
    price *= (1 + dailyNoise);
    
    // Simular preços de abertura, máximo e mínimo
    const open = price * (1 + (Math.random() * 0.01 - 0.005));
    const high = Math.max(price, open) * (1 + Math.random() * 0.01);
    const low = Math.min(price, open) * (1 - Math.random() * 0.01);
    const volume = Math.floor(Math.random() * 10000) + 5000;
    
    history.push({
      date: dateStr,
      price,
      open,
      high,
      low,
      volume,
    });
  }
  
  // Ordenar por data (mais recente primeiro)
  history.sort((a, b) => b.date.localeCompare(a.date));
  
  return history;
}

/**
 * Mapeia símbolo interno para símbolo da Alpha Vantage
 */
function mapToAlphaVantageSymbol(symbol: string): string | null {
  const mapping: Record<string, string> = {
    'CORN_USD': 'CORN',
    'WHEAT_USD': 'WHEAT',
    'SOYBEAN_USD': 'SOYBEAN',
    'COFFEE_USD': 'KC',
    'COTTON_USD': 'CT',
    'SUGAR_USD': 'SB',
    'RICE_USD': 'RR',
    'CATTLE_USD': 'LE',
    'COCOA_USD': 'CC',
    'ORANGE_USD': 'OJ',
  };
  
  return mapping[symbol] || null;
}

/**
 * Mapeia símbolo interno para símbolo da Quandl
 */
function mapToQuandlSymbol(symbol: string): string | null {
  const mapping: Record<string, string> = {
    'CORN_USD': 'CHRIS/CME_C1',
    'WHEAT_USD': 'CHRIS/CME_W1',
    'SOYBEAN_USD': 'CHRIS/CME_S1',
    'COFFEE_USD': 'CHRIS/ICE_KC1',
    'COTTON_USD': 'CHRIS/ICE_CT1',
    'SUGAR_USD': 'CHRIS/ICE_SB1',
    'RICE_USD': 'CHRIS/CME_RR1',
    'CATTLE_USD': 'CHRIS/CME_LC1',
    'COCOA_USD': 'CHRIS/ICE_CC1',
    'ORANGE_USD': 'CHRIS/ICE_OJ1',
  };
  
  return mapping[symbol] || null;
}

/**
 * Obtém informações básicas sobre uma commodity
 */
function getCommodityInfo(symbol: string): { name: string; unit: string } {
  const info: Record<string, { name: string; unit: string }> = {
    'CORN_USD': { name: 'Milho', unit: 'bushel' },
    'WHEAT_USD': { name: 'Trigo', unit: 'bushel' },
    'SOYBEAN_USD': { name: 'Soja', unit: 'bushel' },
    'COFFEE_USD': { name: 'Café', unit: 'libra' },
    'COTTON_USD': { name: 'Algodão', unit: 'libra' },
    'SUGAR_USD': { name: 'Açúcar', unit: 'libra' },
    'RICE_USD': { name: 'Arroz', unit: 'cwt' },
    'CATTLE_USD': { name: 'Gado', unit: 'libra' },
    'COCOA_USD': { name: 'Cacau', unit: 'tonelada' },
    'ORANGE_USD': { name: 'Laranja', unit: 'libra' },
  };
  
  return info[symbol] || { name: symbol, unit: 'unidade' };
}

/**
 * Analisa tendência de preço com base no histórico
 */
function analyzePriceTrend(symbol: string, currentPrice: number, history: HistoricalPrice[]): PriceTrend {
  // Verificar se há dados suficientes
  if (history.length < 90) {
    console.warn(`Dados históricos insuficientes para análise completa de tendência de ${symbol}`);
  }
  
  // Encontrar preços de referência
  const findPriceAtDay = (days: number): number | null => {
    if (history.length <= days) return null;
    return history[days].price;
  };
  
  const dayPrice = findPriceAtDay(1) || currentPrice;
  const weekPrice = findPriceAtDay(7) || currentPrice;
  const monthPrice = findPriceAtDay(30) || currentPrice;
  const quarterPrice = findPriceAtDay(90) || currentPrice;
  
  // Calcular variações percentuais
  const calcChange = (oldPrice: number): number => {
    return ((currentPrice - oldPrice) / oldPrice) * 100;
  };
  
  const trends = {
    daily: calcChange(dayPrice),
    weekly: calcChange(weekPrice),
    monthly: calcChange(monthPrice),
    quarterly: calcChange(quarterPrice),
  };
  
  // Determinar direção da tendência
  let direction: 'up' | 'down' | 'stable' = 'stable';
  const recentTrend = (trends.daily + trends.weekly) / 2;
  
  if (recentTrend > 1) {
    direction = 'up';
  } else if (recentTrend < -1) {
    direction = 'down';
  }
  
  // Determinar força da tendência
  let strength: 'strong' | 'moderate' | 'weak' = 'weak';
  const trendConsistency = Math.sign(trends.daily) === Math.sign(trends.weekly) && 
                           Math.sign(trends.weekly) === Math.sign(trends.monthly);
  
  const trendMagnitude = Math.abs((trends.daily + trends.weekly + trends.monthly) / 3);
  
  if (trendConsistency && trendMagnitude > 5) {
    strength = 'strong';
  } else if (trendMagnitude > 2) {
    strength = 'moderate';
  }
  
  // Mapear símbolo para nome e unidade
  const commodityInfo = getCommodityInfo(symbol);
  
  return {
    symbol,
    name: commodityInfo.name,
    currentPrice,
    currency: 'USD',
    unit: commodityInfo.unit,
    trends,
    direction,
    strength,
    source: 'analysis',
  };
}

/**
 * Obtém preço atual de uma commodity (com fallbacks e cache)
 */
export async function getCommodityPrice(symbol: string): Promise<CommodityPrice | null> {
  try {
    // Verificar cache
    const cacheKey = `${REDIS_PREFIX}price:${symbol}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Tentar obter preço do Chainlink
    let price = await getChainlinkCommodityPrice(symbol);
    
    // Se falhar, tentar Alpha Vantage
    if (!price) {
      price = await getAlphaVantageCommodityPrice(symbol);
    }
    
    // Se falhar, tentar Quandl
    if (!price) {
      price = await getQuandlCommodityPrice(symbol);
    }
    
    // Se todas as fontes falharem, usar simulação
    if (!price) {
      console.warn(`Usando preço simulado para ${symbol} devido a falhas nas APIs externas`);
      price = simulateCommodityPrice(symbol);
    }
    
    // Armazenar em cache
    await redis.set(cacheKey, JSON.stringify(price), { ex: CACHE_EXPIRATION.CURRENT });
    
    return price;
  } catch (error) {
    console.error(`Erro ao obter preço de ${symbol}:`, error);
    
    // Em caso de erro, retornar preço simulado
    console.warn(`Usando preço simulado para ${symbol} devido a erro`);
    return simulateCommodityPrice(symbol);
  }
}

/**
 * Obtém preços de múltiplas commodities
 */
export async function getMultipleCommodityPrices(symbols: string[]): Promise<Record<string, CommodityPrice | null>> {
  const results: Record<string, CommodityPrice | null> = {};
  
  // Obter preços em paralelo
  const promises = symbols.map(async (symbol) => {
    results[symbol] = await getCommodityPrice(symbol);
  });
  
  await Promise.all(promises);
  
  return results;
}

/**
 * Obtém histórico de preços de uma commodity
 */
export async function getCommodityPriceHistory(symbol: string, days: number = 90): Promise<CommodityPriceHistory | null> {
  try {
    // Verificar cache
    const cacheKey = `${REDIS_PREFIX}history:${symbol}:${days}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Tentar obter histórico da Alpha Vantage
    let history: HistoricalPrice[] = [];
    
    if (days <= 100) {
      // Para períodos curtos, tentar Alpha Vantage
      history = await getAlphaVantageHistoricalPrices(symbol, 'daily');
    }
    
    // Se falhar ou for um período longo, tentar Quandl
    if (history.length === 0) {
      history = await getQuandlHistoricalPrices(symbol, days);
    }
    
    // Se todas as fontes falharem, usar simulação
    if (history.length === 0) {
      console.warn(`Usando histórico simulado para ${symbol} devido a falhas nas APIs externas`);
      history = simulateHistoricalPrices(symbol, days);
    }
    
    // Limitar ao número de dias solicitado
    history = history.slice(0, days);
    
    // Mapear símbolo para nome e unidade
    const commodityInfo = getCommodityInfo(symbol);
    
    const result: CommodityPriceHistory = {
      symbol,
      name: commodityInfo.name,
      currency: 'USD',
      unit: commodityInfo.unit,
      data: history,
      source: history[0]?.source || 'simulation',
    };
    
    // Armazenar em cache
    await redis.set(cacheKey, JSON.stringify(result), { ex: CACHE_EXPIRATION.HISTORICAL });
    
    return result;
  } catch (error) {
    console.error(`Erro ao obter histórico de preços de ${symbol}:`, error);
    
    // Em caso de erro, retornar histórico simulado
    console.warn(`Usando histórico simulado para ${symbol} devido a erro`);
    const history = simulateHistoricalPrices(symbol, days);
    
    // Mapear símbolo para nome e unidade
    const commodityInfo = getCommodityInfo(symbol);
    
    return {
      symbol,
      name: commodityInfo.name,
      currency: 'USD',
      unit: commodityInfo.unit,
      data: history,
      source: 'simulation',
    };
  }
}

/**
 * Analisa tendência de preço de uma commodity
 */
export async function analyzeCommodityTrend(symbol: string): Promise<PriceTrend | null> {
  try {
    // Obter preço atual e histórico
    const [price, history] = await Promise.all([
      getCommodityPrice(symbol),
      getCommodityPriceHistory(symbol, 90),
    ]);
    
    if (!price || !history) {
      console.warn(`Dados insuficientes para análise de tendência de ${symbol}`);
      return null;
    }
    
    // Analisar tendência
    return analyzePriceTrend(symbol, price.price, history.data);
  } catch (error) {
    console.error(`Erro ao analisar tendência de ${symbol}:`, error);
    return null;
  }
}

/**
 * Obtém preços de commodities agrícolas relevantes para o AGROTM
 */
export async function getAgroRelevantCommodities(): Promise<CommodityPrice[]> {
  // Lista de commodities relevantes para o ecossistema AGROTM
  const relevantSymbols = [
    'CORN_USD',
    'WHEAT_USD',
    'SOYBEAN_USD',
    'COFFEE_USD',
    'COTTON_USD',
    'SUGAR_USD',
    'RICE_USD',
  ];
  
  const results = await getMultipleCommodityPrices(relevantSymbols);
  
  // Filtrar resultados nulos
  return Object.values(results).filter((price): price is CommodityPrice => price !== null);
}

/**
 * Obtém correlação entre preço de commodity e token AGRO
 */
export async function getCommodityTokenCorrelation(symbol: string): Promise<{
  symbol: string;
  name: string;
  correlation: number; // -1 a 1, onde 1 é correlação perfeita
  description: string;
} | null> {
  try {
    // Obter histórico de preços da commodity
    const commodityHistory = await getCommodityPriceHistory(symbol, 90);
    if (!commodityHistory) return null;
    
    // Obter histórico de preços do token AGRO (simulado)
    const agroHistory = simulateHistoricalPrices('AGRO_USD', 90);
    
    // Verificar se há dados suficientes
    if (commodityHistory.data.length < 30 || agroHistory.length < 30) {
      console.warn(`Dados históricos insuficientes para análise de correlação de ${symbol} com AGRO`);
      return null;
    }
    
    // Mapear datas para facilitar a comparação
    const commodityPriceByDate: Record<string, number> = {};
    for (const entry of commodityHistory.data) {
      commodityPriceByDate[entry.date] = entry.price;
    }
    
    const agroPriceByDate: Record<string, number> = {};
    for (const entry of agroHistory) {
      agroPriceByDate[entry.date] = entry.price;
    }
    
    // Encontrar datas em comum
    const commonDates = Object.keys(commodityPriceByDate).filter(date => agroPriceByDate[date] !== undefined);
    
    if (commonDates.length < 30) {
      console.warn(`Datas em comum insuficientes para análise de correlação de ${symbol} com AGRO`);
      return null;
    }
    
    // Calcular correlação de Pearson
    const commodityPrices = commonDates.map(date => commodityPriceByDate[date]);
    const agroPrices = commonDates.map(date => agroPriceByDate[date]);
    
    const correlation = calculatePearsonCorrelation(commodityPrices, agroPrices);
    
    // Gerar descrição
    let description = '';
    if (correlation > 0.7) {
      description = `Forte correlação positiva entre ${commodityHistory.name} e token AGRO.`;
    } else if (correlation > 0.3) {
      description = `Correlação positiva moderada entre ${commodityHistory.name} e token AGRO.`;
    } else if (correlation > -0.3) {
      description = `Correlação fraca ou inexistente entre ${commodityHistory.name} e token AGRO.`;
    } else if (correlation > -0.7) {
      description = `Correlação negativa moderada entre ${commodityHistory.name} e token AGRO.`;
    } else {
      description = `Forte correlação negativa entre ${commodityHistory.name} e token AGRO.`;
    }
    
    return {
      symbol,
      name: commodityHistory.name,
      correlation,
      description,
    };
  } catch (error) {
    console.error(`Erro ao calcular correlação entre ${symbol} e AGRO:`, error);
    return null;
  }
}

/**
 * Calcula correlação de Pearson entre dois conjuntos de dados
 */
function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  
  // Calcular médias
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calcular desvios e produtos
  let ssX = 0;
  let ssY = 0;
  let ssXY = 0;
  
  for (let i = 0; i < n; i++) {
    const xDev = x[i] - xMean;
    const yDev = y[i] - yMean;
    
    ssX += xDev * xDev;
    ssY += yDev * yDev;
    ssXY += xDev * yDev;
  }
  
  // Calcular correlação
  const correlation = ssXY / (Math.sqrt(ssX * ssY));
  
  return correlation;
}

/**
 * Inicializa o módulo de dados de commodities
 */
export function initCommoditiesModule() {
  console.log('Inicializando módulo de dados de commodities...');
  
  // Inicializar provedor Ethereum
  initProvider();
  
  console.log('Módulo de dados de commodities inicializado');
}