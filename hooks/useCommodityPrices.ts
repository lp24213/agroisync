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
}

interface CommodityHistory {
  date: string;
  price: number;
}

interface UseCommodityPricesReturn {
  prices: CommodityPrice[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getPriceBySymbol: (symbol: string) => CommodityPrice | undefined;
  getHistoryBySymbol: (symbol: string) => CommodityHistory[];
}

// Mock commodity prices data
const mockCommodityPrices: CommodityPrice[] = [
  {
    symbol: 'SOYBEAN',
    name: 'Soja',
    price: 1485.50,
    currency: 'USD',
    change: 23.75,
    changePercentage: 1.62,
    lastUpdated: new Date().toISOString(),
    unit: 'por bushel',
    market: 'CBOT'
  },
  {
    symbol: 'CORN',
    name: 'Milho',
    price: 675.25,
    currency: 'USD',
    change: -8.50,
    changePercentage: -1.24,
    lastUpdated: new Date().toISOString(),
    unit: 'por bushel',
    market: 'CBOT'
  },
  {
    symbol: 'WHEAT',
    name: 'Trigo',
    price: 825.75,
    currency: 'USD',
    change: 12.25,
    changePercentage: 1.51,
    lastUpdated: new Date().toISOString(),
    unit: 'por bushel',
    market: 'CBOT'
  },
  {
    symbol: 'COTTON',
    name: 'Algodão',
    price: 78.45,
    currency: 'USD',
    change: -1.20,
    changePercentage: -1.51,
    lastUpdated: new Date().toISOString(),
    unit: 'por libra',
    market: 'ICE'
  },
  {
    symbol: 'SUGAR',
    name: 'Açúcar',
    price: 23.85,
    currency: 'USD',
    change: 0.45,
    changePercentage: 1.92,
    lastUpdated: new Date().toISOString(),
    unit: 'por libra',
    market: 'ICE'
  },
  {
    symbol: 'COFFEE',
    name: 'Café',
    price: 185.30,
    currency: 'USD',
    change: 5.80,
    changePercentage: 3.23,
    lastUpdated: new Date().toISOString(),
    unit: 'por libra',
    market: 'ICE'
  },
  {
    symbol: 'CATTLE',
    name: 'Gado',
    price: 175.25,
    currency: 'USD',
    change: 2.15,
    changePercentage: 1.24,
    lastUpdated: new Date().toISOString(),
    unit: 'por libra',
    market: 'CME'
  },
  {
    symbol: 'HOGS',
    name: 'Suínos',
    price: 82.40,
    currency: 'USD',
    change: -1.85,
    changePercentage: -2.19,
    lastUpdated: new Date().toISOString(),
    unit: 'por libra',
    market: 'CME'
  }
];

// Generate mock historical data
const generateMockHistory = (basePrice: number): CommodityHistory[] => {
  const history: CommodityHistory[] = [];
  let currentPrice = basePrice;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    currentPrice = currentPrice * (1 + variation);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice * 100) / 100
    });
  }
  
  return history;
};

export const useCommodityPrices = (): UseCommodityPricesReturn => {
  const [prices, setPrices] = useState<CommodityPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<Record<string, CommodityHistory[]>>({});

  const fetchCommodityPrices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // In a real implementation, you would fetch from commodity price APIs
      // like Alpha Vantage, Quandl, or Bloomberg API
      // For now, we'll use mock data with some randomization
      const updatedPrices = mockCommodityPrices.map(commodity => ({
        ...commodity,
        price: commodity.price + (Math.random() * 20 - 10),
        change: (Math.random() * 40 - 20),
        changePercentage: (Math.random() * 6 - 3),
        lastUpdated: new Date().toISOString()
      }));
      
      setPrices(updatedPrices);
      
      // Generate historical data for each commodity
      const histData: Record<string, CommodityHistory[]> = {};
      updatedPrices.forEach(commodity => {
        histData[commodity.symbol] = generateMockHistory(commodity.price);
      });
      setHistoricalData(histData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar preços de commodities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommodityPrices();
    
    // Set up interval to update prices every 5 minutes
    const interval = setInterval(fetchCommodityPrices, 5 * 60 * 1000);
    
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

  return {
    prices,
    loading,
    error,
    refetch,
    getPriceBySymbol,
    getHistoryBySymbol
  };
};

/**
 * Função para obter preços de commodities (para uso em summary-export)
 * @returns Promise com array de preços de commodities
 */
export const getCommodityPrices = async (): Promise<CommodityPrice[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return mockCommodityPrices.map(commodity => ({
    ...commodity,
    price: commodity.price + (Math.random() * 20 - 10),
    change: (Math.random() * 40 - 20),
    changePercentage: (Math.random() * 6 - 3),
    lastUpdated: new Date().toISOString()
  }));
};