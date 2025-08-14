import { useState, useEffect } from 'react';

interface YieldPrediction {
  id: string;
  poolId: string;
  poolName: string;
  currentAPY: number;
  predictedAPY: number;
  confidence: number; // 0-100
  factors: {
    marketTrend: number;
    liquidity: number;
    demand: number;
    seasonality: number;
    risk: number;
  };
  predictionDate: Date;
  validityPeriod: number; // days
}

interface YieldTrend {
  period: string;
  currentAPY: number;
  predictedAPY: number;
  change: number;
  confidence: number;
}

interface UseYieldPredictionReturn {
  predictions: YieldPrediction[];
  trends: YieldTrend[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getPredictionByPool: (poolId: string) => YieldPrediction | undefined;
  getYieldTrend: (poolId: string, period: '7d' | '30d' | '90d') => YieldTrend[];
  predictYield: (poolId: string, period: '7d' | '30d' | '90d') => Promise<number>;
}

export const useYieldPrediction = (): UseYieldPredictionReturn => {
  const [predictions, setPredictions] = useState<YieldPrediction[]>([]);
  const [trends, setTrends] = useState<YieldTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchYieldPredictions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data for yield predictions
      const mockPredictions: YieldPrediction[] = [
        {
          id: 'pred_1',
          poolId: 'pool_1',
          poolName: 'AGRO Farm Pool',
          currentAPY: 12.5,
          predictedAPY: 13.2,
          confidence: 85,
          factors: {
            marketTrend: 0.8,
            liquidity: 0.9,
            demand: 0.7,
            seasonality: 0.6,
            risk: 0.3
          },
          predictionDate: new Date(),
          validityPeriod: 30
        },
        {
          id: 'pred_2',
          poolId: 'pool_2',
          poolName: 'Crop Token Pool',
          currentAPY: 8.2,
          predictedAPY: 8.8,
          confidence: 78,
          factors: {
            marketTrend: 0.6,
            liquidity: 0.8,
            demand: 0.9,
            seasonality: 0.7,
            risk: 0.4
          },
          predictionDate: new Date(),
          validityPeriod: 30
        }
      ];

      // Mock yield trends
      const mockTrends: YieldTrend[] = [
        {
          period: '7d',
          currentAPY: 12.5,
          predictedAPY: 12.8,
          change: 0.3,
          confidence: 90
        },
        {
          period: '30d',
          currentAPY: 12.5,
          predictedAPY: 13.2,
          change: 0.7,
          confidence: 85
        },
        {
          period: '90d',
          currentAPY: 12.5,
          predictedAPY: 14.1,
          change: 1.6,
          confidence: 75
        }
      ];

      setPredictions(mockPredictions);
      setTrends(mockTrends);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar previsões de yield');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYieldPredictions();
    
    // Update predictions every hour
    const interval = setInterval(fetchYieldPredictions, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const refetch = () => {
    fetchYieldPredictions();
  };

  const getPredictionByPool = (poolId: string): YieldPrediction | undefined => {
    return predictions.find(pred => pred.poolId === poolId);
  };

  const getYieldTrend = (poolId: string, period: '7d' | '30d' | '90d'): YieldTrend[] => {
    // Filter trends by period and pool
    return trends.filter(trend => {
      const periodMatch = trend.period === period;
      // In a real implementation, you'd filter by poolId as well
      return periodMatch;
    });
  };

  const predictYield = async (poolId: string, period: '7d' | '30d' | '90d'): Promise<number> => {
    // Simulate AI/ML yield prediction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const prediction = getPredictionByPool(poolId);
    if (!prediction) return 0;
    
    const baseAPY = prediction.currentAPY;
    const periodFactors = {
      '7d': 0.02,   // ±2% for 7 days
      '30d': 0.08,  // ±8% for 30 days
      '90d': 0.15   // ±15% for 90 days
    };
    
    const variation = (Math.random() - 0.5) * 2 * periodFactors[period];
    return Math.max(0, baseAPY * (1 + variation)); // APY cannot be negative
  };

  return {
    predictions,
    trends,
    loading,
    error,
    refetch,
    getPredictionByPool,
    getYieldTrend,
    predictYield
  };
};
