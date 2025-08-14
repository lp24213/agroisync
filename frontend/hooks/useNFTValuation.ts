import { useState, useEffect, useCallback } from 'react';

interface NFTValuation {
  id: string;
  nftId: string;
  nftName: string;
  nftType: string;
  currentValue: number;
  previousValue: number;
  changePercentage: number;
  changeAmount: number;
  valuationDate: string;
  factors: {
    commodityPrices: number;
    weatherConditions: number;
    marketDemand: number;
    locationPremium: number;
    certificationBonus: number;
  };
  predictions: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
  };
  riskScore: number;
  recommendation: 'buy' | 'hold' | 'sell';
}

interface UseNFTValuationReturn {
  valuations: NFTValuation[];
  loading: boolean;
  error: string | null;
  refreshValuations: () => void;
  getValuationByNFT: (nftId: string) => NFTValuation | undefined;
  getTopPerformers: (limit?: number) => NFTValuation[];
  getRiskAnalysis: () => Array<{ risk: string; count: number; percentage: number }>;
}

const useNFTValuation = (): UseNFTValuationReturn => {
  const [valuations, setValuations] = useState<NFTValuation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gerar dados mock de valorização
  const generateMockValuations = (): NFTValuation[] => {
    const mockValuations: NFTValuation[] = [
      {
        id: 'val_1',
        nftId: '1',
        nftName: 'Fazenda Santa Maria',
        nftType: 'Fazenda',
        currentValue: 50000000,
        previousValue: 48000000,
        changePercentage: 4.17,
        changeAmount: 2000000,
        valuationDate: '2024-12-15',
        factors: {
          commodityPrices: 0.8,
          weatherConditions: 0.9,
          marketDemand: 0.85,
          locationPremium: 0.95,
          certificationBonus: 0.9
        },
        predictions: {
          nextMonth: 52000000,
          nextQuarter: 55000000,
          nextYear: 60000000
        },
        riskScore: 0.2,
        recommendation: 'buy'
      },
      {
        id: 'val_2',
        nftId: '2',
        nftName: 'Trator John Deere 5075E',
        nftType: 'Maquinário',
        currentValue: 15000000,
        previousValue: 15500000,
        changePercentage: -3.23,
        changeAmount: -500000,
        valuationDate: '2024-12-14',
        factors: {
          commodityPrices: 0.7,
          weatherConditions: 0.6,
          marketDemand: 0.75,
          locationPremium: 0.8,
          certificationBonus: 0.85
        },
        predictions: {
          nextMonth: 14800000,
          nextQuarter: 14500000,
          nextYear: 14000000
        },
        riskScore: 0.4,
        recommendation: 'hold'
      },
      {
        id: 'val_3',
        nftId: '3',
        nftName: 'Lote de Soja Premium',
        nftType: 'Lote de Grãos',
        currentValue: 8000000,
        previousValue: 7500000,
        changePercentage: 6.67,
        changeAmount: 500000,
        valuationDate: '2024-12-13',
        factors: {
          commodityPrices: 0.95,
          weatherConditions: 0.85,
          marketDemand: 0.9,
          locationPremium: 0.75,
          certificationBonus: 0.8
        },
        predictions: {
          nextMonth: 8500000,
          nextQuarter: 9000000,
          nextYear: 10000000
        },
        riskScore: 0.3,
        recommendation: 'buy'
      },
      {
        id: 'val_4',
        nftId: '4',
        nftName: 'Certificado de Sustentabilidade',
        nftType: 'Certificado',
        currentValue: 2000000,
        previousValue: 1900000,
        changePercentage: 5.26,
        changeAmount: 100000,
        valuationDate: '2024-12-12',
        factors: {
          commodityPrices: 0.6,
          weatherConditions: 0.7,
          marketDemand: 0.95,
          locationPremium: 0.8,
          certificationBonus: 1.0
        },
        predictions: {
          nextMonth: 2100000,
          nextQuarter: 2200000,
          nextYear: 2500000
        },
        riskScore: 0.1,
        recommendation: 'buy'
      },
      {
        id: 'val_5',
        nftId: '5',
        nftName: 'Fazenda Boa Vista',
        nftType: 'Fazenda',
        currentValue: 35000000,
        previousValue: 36000000,
        changePercentage: -2.78,
        changeAmount: -1000000,
        valuationDate: '2024-12-11',
        factors: {
          commodityPrices: 0.75,
          weatherConditions: 0.6,
          marketDemand: 0.8,
          locationPremium: 0.85,
          certificationBonus: 0.9
        },
        predictions: {
          nextMonth: 34500000,
          nextQuarter: 34000000,
          nextYear: 35000000
        },
        riskScore: 0.5,
        recommendation: 'hold'
      }
    ];

    return mockValuations;
  };

  // Carregar valorizações
  const loadValuations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Em produção, aqui seria uma chamada real para a API
      // const response = await fetch('/api/nft/valuations');
      // const data = await response.json();

      const mockValuations = generateMockValuations();
      setValuations(mockValuations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar valorizações');
      console.error('Erro ao carregar valorizações:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter valorização por NFT
  const getValuationByNFT = useCallback((nftId: string): NFTValuation | undefined => {
    return valuations.find(val => val.nftId === nftId);
  }, [valuations]);

  // Obter top performers
  const getTopPerformers = useCallback((limit: number = 5): NFTValuation[] => {
    return [...valuations]
      .sort((a, b) => b.changePercentage - a.changePercentage)
      .slice(0, limit);
  }, [valuations]);

  // Análise de risco
  const getRiskAnalysis = useCallback(() => {
    const riskLevels = {
      'Baixo': 0,
      'Médio': 0,
      'Alto': 0
    };

    valuations.forEach(val => {
      if (val.riskScore <= 0.3) {
        riskLevels['Baixo']++;
      } else if (val.riskScore <= 0.6) {
        riskLevels['Médio']++;
      } else {
        riskLevels['Alto']++;
      }
    });

    const total = valuations.length;
    
    return Object.entries(riskLevels).map(([risk, count]) => ({
      risk,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));
  }, [valuations]);

  // Função para atualizar valorizações
  const refreshValuations = useCallback(() => {
    loadValuations();
  }, [loadValuations]);

  // Carregar dados iniciais
  useEffect(() => {
    loadValuations();
  }, [loadValuations]);

  // Simular atualizações em tempo real (a cada 10 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && valuations.length > 0) {
        // Simular pequenas variações nos valores
        setValuations(prev => prev.map(val => {
          const volatility = 0.02; // 2% de volatilidade
          const randomFactor = 1 + (Math.random() - 0.5) * volatility * 2;
          
          const newCurrentValue = Math.round(val.currentValue * randomFactor);
          const newChangeAmount = newCurrentValue - val.previousValue;
          const newChangePercentage = (newChangeAmount / val.previousValue) * 100;

          return {
            ...val,
            currentValue: newCurrentValue,
            changeAmount: newChangeAmount,
            changePercentage: Math.round(newChangePercentage * 100) / 100,
            valuationDate: new Date().toISOString().split('T')[0]
          };
        }));
      }
    }, 600000); // 10 minutos

    return () => clearInterval(interval);
  }, [loading, valuations]);

  return {
    valuations,
    loading,
    error,
    refreshValuations,
    getValuationByNFT,
    getTopPerformers,
    getRiskAnalysis
  };
};

export default useNFTValuation;