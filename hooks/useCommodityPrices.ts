import { useState, useEffect } from 'react';

interface CommodityPrice {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  change: number;
  changePercentage: number;
  lastUpdated: string;
  unit: string;
  market: string;
  volume24h: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  previousClose: number;
  bid: number;
  ask: number;
  spread: number;
  exchange: string;
  contractMonth?: string;
  settlementDate?: string;
}

interface CommodityHistory {
  date: string;
  price: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface UseCommodityPricesReturn {
  prices: CommodityPrice[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getPriceBySymbol: (symbol: string) => CommodityPrice | undefined;
  getHistoryBySymbol: (symbol: string) => CommodityHistory[];
  getRealTimePrice: (symbol: string) => Promise<CommodityPrice>;
}

/**
 * AGROTM Premium Commodity Prices Service
 * Enterprise-grade commodity price integration with multi-exchange support
 */
class PremiumCommodityService {
  private priceCache: Map<string, { data: any; timestamp: number }> = new Map();
  private historyCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheTTL = 2 * 60 * 1000; // 2 minutes for real-time data

  private exchanges = [
    {
      name: 'Alpha Vantage',
      apiKey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,
      baseUrl: 'https://www.alphavantage.co/query'
    },
    {
      name: 'Quandl',
      apiKey: process.env.NEXT_PUBLIC_QUANDL_API_KEY,
      baseUrl: 'https://www.quandl.com/api/v3'
    },
    {
      name: 'Yahoo Finance',
      apiKey: process.env.NEXT_PUBLIC_YAHOO_FINANCE_API_KEY,
      baseUrl: 'https://query1.finance.yahoo.com/v8/finance'
    },
    {
      name: 'Finnhub',
      apiKey: process.env.NEXT_PUBLIC_FINNHUB_API_KEY,
      baseUrl: 'https://finnhub.io/api/v1'
    }
  ];

  private commoditySymbols = [
    { symbol: 'SOYBEAN', name: 'Soja', exchange: 'CBOT', unit: 'por bushel' },
    { symbol: 'CORN', name: 'Milho', exchange: 'CBOT', unit: 'por bushel' },
    { symbol: 'WHEAT', name: 'Trigo', exchange: 'CBOT', unit: 'por bushel' },
    { symbol: 'COTTON', name: 'Algodão', exchange: 'ICE', unit: 'por libra' },
    { symbol: 'SUGAR', name: 'Açúcar', exchange: 'ICE', unit: 'por libra' },
    { symbol: 'COFFEE', name: 'Café', exchange: 'ICE', unit: 'por libra' },
    { symbol: 'CATTLE', name: 'Gado', exchange: 'CME', unit: 'por libra' },
    { symbol: 'HOGS', name: 'Suínos', exchange: 'CME', unit: 'por libra' },
    { symbol: 'ORANGE_JUICE', name: 'Suco de Laranja', exchange: 'ICE', unit: 'por libra' },
    { symbol: 'COCOA', name: 'Cacau', exchange: 'ICE', unit: 'por tonelada' }
  ];

  async getCommodityPrices(): Promise<CommodityPrice[]> {
    const allPrices: CommodityPrice[] = [];

    for (const commodity of this.commoditySymbols) {
      try {
        const price = await this.getCommodityPrice(commodity.symbol);
        if (price) {
          allPrices.push(price);
        }
      } catch (error) {
        console.error(`Failed to fetch price for ${commodity.symbol}:`, error);
      }
    }

    return allPrices;
  }

  async getCommodityPrice(symbol: string): Promise<CommodityPrice | null> {
    const cacheKey = `price_${symbol}`;
    const cached = this.priceCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    for (const exchange of this.exchanges) {
      if (!exchange.apiKey) continue;
      
      try {
        const priceData = await this.fetchFromExchange(exchange, symbol);
        if (priceData) {
          this.priceCache.set(cacheKey, { data: priceData, timestamp: Date.now() });
          return priceData;
        }
      } catch (error) {
        console.error(`Failed to fetch from ${exchange.name}:`, error);
        continue;
      }
    }

    return null;
  }

  async getCommodityHistory(symbol: string, days: number = 30): Promise<CommodityHistory[]> {
    const cacheKey = `history_${symbol}_${days}`;
    const cached = this.historyCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL * 10) { // Longer cache for history
      return cached.data;
    }

    for (const exchange of this.exchanges) {
      if (!exchange.apiKey) continue;
      
      try {
        const historyData = await this.fetchHistoryFromExchange(exchange, symbol, days);
        if (historyData && historyData.length > 0) {
          this.historyCache.set(cacheKey, { data: historyData, timestamp: Date.now() });
          return historyData;
        }
      } catch (error) {
        console.error(`Failed to fetch history from ${exchange.name}:`, error);
        continue;
      }
    }

    return [];
  }

  private async fetchFromExchange(exchange: any, symbol: string): Promise<CommodityPrice | null> {
    let url: string;
    let response: Response;

    switch (exchange.name) {
      case 'Alpha Vantage':
        url = `${exchange.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${exchange.apiKey}`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`Alpha Vantage: ${response.statusText}`);
        
        const avData = await response.json();
        return this.transformAlphaVantageData(avData, symbol);

      case 'Yahoo Finance':
        url = `${exchange.baseUrl}/chart/${symbol}?interval=1d&range=1d`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`Yahoo Finance: ${response.statusText}`);
        
        const yfData = await response.json();
        return this.transformYahooFinanceData(yfData, symbol);

      case 'Finnhub':
        url = `${exchange.baseUrl}/quote?symbol=${symbol}&token=${exchange.apiKey}`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`Finnhub: ${response.statusText}`);
        
        const fhData = await response.json();
        return this.transformFinnhubData(fhData, symbol);

      case 'Quandl':
        // Quandl requires specific database codes for commodities
        const quandlCode = this.getQuandlCode(symbol);
        if (!quandlCode) return null;
        
        url = `${exchange.baseUrl}/datasets/${quandlCode}/data.json?api_key=${exchange.apiKey}&limit=1`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`Quandl: ${response.statusText}`);
        
        const qData = await response.json();
        return this.transformQuandlData(qData, symbol);

      default:
        return null;
    }
  }

  private async fetchHistoryFromExchange(exchange: any, symbol: string, days: number): Promise<CommodityHistory[]> {
    let url: string;
    let response: Response;

    switch (exchange.name) {
      case 'Alpha Vantage':
        url = `${exchange.baseUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${exchange.apiKey}`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`Alpha Vantage history: ${response.statusText}`);
        
        const avData = await response.json();
        return this.transformAlphaVantageHistory(avData);

      case 'Yahoo Finance':
        url = `${exchange.baseUrl}/chart/${symbol}?interval=1d&range=${days}d`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`Yahoo Finance history: ${response.statusText}`);
        
        const yfData = await response.json();
        return this.transformYahooFinanceHistory(yfData);

      case 'Finnhub':
        const endDate = Math.floor(Date.now() / 1000);
        const startDate = endDate - (days * 24 * 60 * 60);
        url = `${exchange.baseUrl}/stock/candle?symbol=${symbol}&resolution=D&from=${startDate}&to=${endDate}&token=${exchange.apiKey}`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`Finnhub history: ${response.statusText}`);
        
        const fhData = await response.json();
        return this.transformFinnhubHistory(fhData);

      default:
        return [];
    }
  }

  private transformAlphaVantageData(data: any, symbol: string): CommodityPrice | null {
    if (!data['Global Quote']) return null;
    
    const quote = data['Global Quote'];
    const commodity = this.commoditySymbols.find(c => c.symbol === symbol);
    
    return {
      symbol,
      name: commodity?.name || symbol,
      price: parseFloat(quote['05. price']),
      currency: 'USD',
      change: parseFloat(quote['09. change']),
      changePercentage: parseFloat(quote['10. change percent'].replace('%', '')),
      lastUpdated: new Date().toISOString(),
      unit: commodity?.unit || 'unit',
      market: commodity?.exchange || 'Unknown',
      volume24h: parseFloat(quote['06. volume']),
      openPrice: parseFloat(quote['02. open']),
      highPrice: parseFloat(quote['03. high']),
      lowPrice: parseFloat(quote['04. low']),
      previousClose: parseFloat(quote['08. previous close']),
      bid: parseFloat(quote['05. price']), // Approximate
      ask: parseFloat(quote['05. price']), // Approximate
      spread: 0,
      exchange: 'Alpha Vantage'
    };
  }

  private transformYahooFinanceData(data: any, symbol: string): CommodityPrice | null {
    if (!data.chart?.result?.[0]) return null;
    
    const result = data.chart.result[0];
    const quote = result.indicators.quote[0];
    const meta = result.meta;
    const commodity = this.commoditySymbols.find(c => c.symbol === symbol);
    
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.previousClose;
    const change = currentPrice - previousClose;
    const changePercentage = (change / previousClose) * 100;
    
    return {
      symbol,
      name: commodity?.name || symbol,
      price: currentPrice,
      currency: 'USD',
      change,
      changePercentage,
      lastUpdated: new Date(meta.regularMarketTime * 1000).toISOString(),
      unit: commodity?.unit || 'unit',
      market: commodity?.exchange || 'Unknown',
      volume24h: quote.volume?.[quote.volume.length - 1] || 0,
      openPrice: quote.open?.[quote.open.length - 1] || currentPrice,
      highPrice: quote.high?.[quote.high.length - 1] || currentPrice,
      lowPrice: quote.low?.[quote.low.length - 1] || currentPrice,
      previousClose,
      bid: currentPrice,
      ask: currentPrice,
      spread: 0,
      exchange: 'Yahoo Finance'
    };
  }

  private transformFinnhubData(data: any, symbol: string): CommodityPrice | null {
    if (!data.c || data.c === 0) return null;
    
    const commodity = this.commoditySymbols.find(c => c.symbol === symbol);
    const currentPrice = data.c;
    const previousClose = data.pc;
    const change = currentPrice - previousClose;
    const changePercentage = (change / previousClose) * 100;
    
    return {
      symbol,
      name: commodity?.name || symbol,
      price: currentPrice,
      currency: 'USD',
      change,
      changePercentage,
      lastUpdated: new Date(data.t * 1000).toISOString(),
      unit: commodity?.unit || 'unit',
      market: commodity?.exchange || 'Unknown',
      volume24h: data.v || 0,
      openPrice: data.o || currentPrice,
      highPrice: data.h || currentPrice,
      lowPrice: data.l || currentPrice,
      previousClose,
      bid: data.b || currentPrice,
      ask: data.a || currentPrice,
      spread: (data.a || currentPrice) - (data.b || currentPrice),
      exchange: 'Finnhub'
    };
  }

  private transformQuandlData(data: any, symbol: string): CommodityPrice | null {
    if (!data.dataset_data?.data?.[0]) return null;
    
    const row = data.dataset_data.data[0];
    const commodity = this.commoditySymbols.find(c => c.symbol === symbol);
    
    // Quandl data structure varies by dataset, this is a generic approach
    const currentPrice = parseFloat(row[1] || row[0]);
    const previousPrice = parseFloat(row[1] || row[0]); // Approximate
    const change = currentPrice - previousPrice;
    const changePercentage = (change / previousPrice) * 100;
    
    return {
      symbol,
      name: commodity?.name || symbol,
      price: currentPrice,
      currency: 'USD',
      change,
      changePercentage,
      lastUpdated: new Date().toISOString(),
      unit: commodity?.unit || 'unit',
      market: commodity?.exchange || 'Unknown',
      volume24h: 0,
      openPrice: currentPrice,
      highPrice: currentPrice,
      lowPrice: currentPrice,
      previousClose: previousPrice,
      bid: currentPrice,
      ask: currentPrice,
      spread: 0,
      exchange: 'Quandl'
    };
  }

  private transformAlphaVantageHistory(data: any): CommodityHistory[] {
    if (!data['Time Series (Daily)']) return [];
    
    const timeSeries = data['Time Series (Daily)'];
    const history: CommodityHistory[] = [];
    
    Object.entries(timeSeries).forEach(([date, values]: [string, any]) => {
      history.push({
        date,
        price: parseFloat(values['4. close']),
        volume: parseFloat(values['5. volume']),
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close'])
      });
    });
    
    return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private transformYahooFinanceHistory(data: any): CommodityHistory[] {
    if (!data.chart?.result?.[0]) return [];
    
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quote = result.indicators.quote[0];
    const history: CommodityHistory[] = [];
    
    timestamps.forEach((timestamp: number, index: number) => {
      history.push({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        price: quote.close?.[index] || 0,
        volume: quote.volume?.[index] || 0,
        open: quote.open?.[index] || 0,
        high: quote.high?.[index] || 0,
        low: quote.low?.[index] || 0,
        close: quote.close?.[index] || 0
      });
    });
    
    return history;
  }

  private transformFinnhubHistory(data: any): CommodityHistory[] {
    if (!data.s || data.s !== 'ok') return [];
    
    const history: CommodityHistory[] = [];
    
    data.t.forEach((timestamp: number, index: number) => {
      history.push({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        price: data.c[index] || 0,
        volume: data.v[index] || 0,
        open: data.o[index] || 0,
        high: data.h[index] || 0,
        low: data.l[index] || 0,
        close: data.c[index] || 0
      });
    });
    
    return history;
  }

  private getQuandlCode(symbol: string): string | null {
    // Map symbols to Quandl database codes
    const quandlCodes: Record<string, string> = {
      'SOYBEAN': 'CHRIS/CME_S1',
      'CORN': 'CHRIS/CME_C1',
      'WHEAT': 'CHRIS/CME_W1',
      'COTTON': 'CHRIS/ICE_CT1',
      'SUGAR': 'CHRIS/ICE_SB1',
      'COFFEE': 'CHRIS/ICE_KC1'
    };
    
    return quandlCodes[symbol] || null;
  }
}

const commodityService = new PremiumCommodityService();

export const useCommodityPrices = (): UseCommodityPricesReturn => {
  const [prices, setPrices] = useState<CommodityPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<Record<string, CommodityHistory[]>>({});

  const fetchCommodityPrices = async () => {
    try {
      setLoading(true);
      setError(null);

      const commodityPrices = await commodityService.getCommodityPrices();
      setPrices(commodityPrices);
      
      // Generate historical data for each commodity
      const histData: Record<string, CommodityHistory[]> = {};
      for (const commodity of commodityPrices) {
        try {
          const history = await commodityService.getCommodityHistory(commodity.symbol, 30);
          histData[commodity.symbol] = history;
        } catch (error) {
          console.error(`Failed to fetch history for ${commodity.symbol}:`, error);
          histData[commodity.symbol] = [];
        }
      }
      setHistoricalData(histData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading commodity prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommodityPrices();
    
    // Update prices every 2 minutes
    const interval = setInterval(fetchCommodityPrices, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const refetch = () => {
    fetchCommodityPrices();
  };

  const getPriceBySymbol = (symbol: string): CommodityPrice | undefined => {
    return prices.find(price => price.symbol === symbol);
  };

  const getHistoryBySymbol = (symbol: string): CommodityHistory[] => {
    return historicalData[symbol] || [];
  };

  const getRealTimePrice = async (symbol: string): Promise<CommodityPrice> => {
    const price = await commodityService.getCommodityPrice(symbol);
    if (!price) {
      throw new Error(`Price not available for ${symbol}`);
    }
    return price;
  };

  return {
    prices,
    loading,
    error,
    refetch,
    getPriceBySymbol,
    getHistoryBySymbol,
    getRealTimePrice
  };
};

/**
 * Function to get commodity prices (for use in summary-export)
 * @returns Promise with array of commodity prices
 */
export const getCommodityPrices = async (): Promise<CommodityPrice[]> => {
  return await commodityService.getCommodityPrices();
};