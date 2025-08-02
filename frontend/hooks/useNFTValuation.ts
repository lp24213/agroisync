import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

interface NFTValuation {
  nftId: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  confidence: number; // 0-100
  lastUpdated: string;
  factors: {
    marketTrend: number;
    commodityPrices: number;
    weatherConditions: number;
    seasonality: number;
    location: number;
    condition: number;
  };
  predictions: {
    nextWeek: number;
    nextMonth: number;
    nextQuarter: number;
  };
}

interface MarketTrends {
  farmland: {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
  machinery: {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
  commodities: {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
  certificates: {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

interface UseNFTValuationReturn {
  valuations: NFTValuation[];
  marketTrends: MarketTrends;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getValuationByNFTId: (nftId: string) => NFTValuation | undefined;
}

// Mock market trends
const mockMarketTrends: MarketTrends = {
  farmland: {
    trend: 'up',
    percentage: 8.5
  },
  machinery: {
    trend: 'stable',
    percentage: 1.2
  },
  commodities: {
    trend: 'up',
    percentage: 12.3
  },
  certificates: {
    trend: 'up',
    percentage: 15.7
  }
};

// Generate mock valuations
const generateMockValuations = (): NFTValuation[] => {
  const valuations: NFTValuation[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const baseValue = Math.floor(Math.random() * 2000000) + 100000;
    const change = (Math.random() * 200000) - 100000;
    const changePercentage = (change / baseValue) * 100;
    
    valuations.push({
      nftId: `nft_${i}`,
      currentValue: baseValue + change,
      previousValue: baseValue,
      change,
      changePercentage,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
      lastUpdated: new Date().toISOString(),
      factors: {
        marketTrend: Math.random() * 20 - 10,
        commodityPrices: Math.random() * 15 - 7.5,
        weatherConditions: Math.random() * 10 - 5,
        seasonality: Math.random() * 8 - 4,
        location: Math.random() * 12 - 6,
        condition: Math.random() * 6 - 3
      },
      predictions: {
        nextWeek: baseValue + change + (Math.random() * 50000 - 25000),
        nextMonth: baseValue + change + (Math.random() * 150000 - 75000),
        nextQuarter: baseValue + change + (Math.random() * 300000 - 150000)
      }
    });
  }
  
  return valuations;
};

export const useNFTValuation = (): UseNFTValuationReturn => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [valuations, setValuations] = useState<NFTValuation[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrends>(mockMarketTrends);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTValuations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (connected && publicKey) {
        // Fetch real NFT valuations from AI/ML services and market data APIs
        const response = await fetch(`/api/nft/valuation?address=${publicKey.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch NFT valuations');
        }
        
        const data = await response.json();
        setValuations(data.valuations);
        setMarketTrends(data.marketTrends);
      } else {
        setValuations([]);
        setMarketTrends(mockMarketTrends);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTValuations();
  }, [connected, publicKey]);

  const refetch = () => {
    fetchNFTValuations();
  };

  const getValuationByNFTId = (nftId: string): NFTValuation | undefined => {
    return valuations.find(valuation => valuation.nftId === nftId);
  };

  return {
    valuations,
    marketTrends,
    loading,
    error,
    refetch,
    getValuationByNFTId
  };
};