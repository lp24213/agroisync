import { useState, useEffect } from 'react';

interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  changePercentage24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

interface PriceHistory {
  timestamp: Date;
  price: number;
  volume: number;
}

interface UseAgroTokenPriceReturn {
  currentPrice: TokenPrice | null;
  priceHistory: PriceHistory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getPriceChange: (period: '1h' | '24h' | '7d' | '30d') => number;
  getPricePrediction: (period: '1d' | '7d' | '30d') => Promise<number>;
}

export const useAgroTokenPrice = (): UseAgroTokenPriceReturn => {
  const [currentPrice, setCurrentPrice] = useState<TokenPrice | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenPrice = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data for AGRO token
      const mockPrice: TokenPrice = {
        symbol: 'AGRO',
        price: 0.85,
        change24h: 0.12,
        changePercentage24h: 16.44,
        volume24h: 1250000,
        marketCap: 85000000,
        lastUpdated: new Date().toISOString()
      };

      // Mock price history (last 30 days)
      const mockHistory: PriceHistory[] = [];
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const basePrice = 0.85;
        const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
        mockHistory.push({
          timestamp: date,
          price: basePrice + variation,
          volume: Math.random() * 2000000 + 500000
        });
      }

      setCurrentPrice(mockPrice);
      setPriceHistory(mockHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar preço do token AGRO');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenPrice();
    
    // Update price every 5 minutes
    const interval = setInterval(fetchTokenPrice, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const refetch = () => {
    fetchTokenPrice();
  };

  const getPriceChange = (period: '1h' | '24h' | '7d' | '30d'): number => {
    if (!currentPrice || priceHistory.length === 0) return 0;

    const now = new Date();
    let targetDate: Date;

    switch (period) {
      case '1h':
        targetDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        targetDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        targetDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        targetDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return 0;
    }

    const historicalPrice = priceHistory.find(h => h.timestamp >= targetDate);
    if (!historicalPrice) return 0;

    return currentPrice.price - historicalPrice.price;
  };

  const getPricePrediction = async (period: '1d' | '7d' | '30d'): Promise<number> => {
    // Simulate AI/ML price prediction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const basePrice = currentPrice?.price || 0.85;
    const predictionFactors = {
      '1d': 0.02,   // ±2% for 1 day
      '7d': 0.08,   // ±8% for 7 days
      '30d': 0.25   // ±25% for 30 days
    };
    
    const variation = (Math.random() - 0.5) * 2 * predictionFactors[period];
    return basePrice * (1 + variation);
  };

  return {
    currentPrice,
    priceHistory,
    loading,
    error,
    refetch,
    getPriceChange,
    getPricePrediction
  };
};
