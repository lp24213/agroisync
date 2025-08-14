import { useState, useEffect, useCallback } from 'react';

interface CommodityPrice {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  previousPrice: number;
  changePercentage: number;
  changeAmount: number;
  unit: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  volatility: number;
  forecast: {
    nextWeek: number;
    nextMonth: number;
    nextQuarter: number;
  };
}

interface UseCommodityPricesReturn {
  prices: CommodityPrice[];
  loading: boolean;
  error: string | null;
  refreshPrices: () => void;
  getPriceBySymbol: (symbol: string) => CommodityPrice | undefined;
  getTopMovers: (limit?: number) => CommodityPrice[];
  getPriceHistory: (symbol: string, period: '7d' | '30d' | '90d' | '1y') => Promise<Array<{date: string, price: number}>>;
}

const useCommodityPrices = (): UseCommodityPricesReturn => {
  const [prices, setPrices] = useState<CommodityPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gerar dados mock de preços de commodities
  const generateMockPrices = (): CommodityPrice[] => {
    const mockPrices: CommodityPrice[] = [
      {
        id: '1',
        name: 'Soja',
        symbol: 'SOY',
        currentPrice: 1250.50,
        previousPrice: 1220.00,
        changePercentage: 2.50,
        changeAmount: 30.50,
        unit: 'USD/ton',
        lastUpdated: '2024-12-15T10:30:00Z',
        trend: 'up',
        volatility: 0.15,
        forecast: {
          nextWeek: 1270.00,
          nextMonth: 1300.00,
          nextQuarter: 1350.00
        }
      },
      {
        id: '2',
        name: 'Milho',
        symbol: 'CORN',
        currentPrice: 580.75,
        previousPrice: 590.00,
        changePercentage: -1.57,
        changeAmount: -9.25,
        unit: 'USD/ton',
        lastUpdated: '2024-12-15T10:30:00Z',
        trend: 'down',
        volatility: 0.12,
        forecast: {
          nextWeek: 575.00,
          nextMonth: 570.00,
          nextQuarter: 580.00
        }
      },
      {
        id: '3',
        name: 'Café Arábica',
        symbol: 'COFFEE',
        currentPrice: 3200.00,
        previousPrice: 3150.00,
        changePercentage: 1.59,
        changeAmount: 50.00,
        unit: 'USD/ton',
        lastUpdated: '2024-12-15T10:30:00Z',
        trend: 'up',
        volatility: 0.18,
        forecast: {
          nextWeek: 3250.00,
          nextMonth: 3300.00,
          nextQuarter: 3400.00
        }
      },
      {
        id: '4',
        name: 'Açúcar',
        symbol: 'SUGAR',
        currentPrice: 450.25,
        previousPrice: 445.00,
        changePercentage: 1.18,
        changeAmount: 5.25,
        unit: 'USD/ton',
        lastUpdated: '2024-12-15T10:30:00Z',
        trend: 'up',
        volatility: 0.10,
        forecast: {
          nextWeek: 455.00,
          nextMonth: 460.00,
          nextQuarter: 470.00
        }
      },
      {
        id: '5',
        name: 'Algodão',
        symbol: 'COTTON',
        currentPrice: 1850.00,
        previousPrice: 1880.00,
        changePercentage: -1.60,
        changeAmount: -30.00,
        unit: 'USD/ton',
        lastUpdated: '2024-12-15T10:30:00Z',
        trend: 'down',
        volatility: 0.14,
        forecast: {
          nextWeek: 1830.00,
          nextMonth: 1800.00,
          nextQuarter: 1850.00
        }
      },
      {
        id: '6',
        name: 'Trigo',
        symbol: 'WHEAT',
        currentPrice: 680.50,
        previousPrice: 675.00,
        changePercentage: 0.81,
        changeAmount: 5.50,
        unit: 'USD/ton',
        lastUpdated: '2024-12-15T10:30:00Z',
        trend: 'up',
        volatility: 0.13,
        forecast: {
          nextWeek: 685.00,
          nextMonth: 690.00,
          nextQuarter: 700.00
        }
      }
    ];

    return mockPrices;
  };

  // Carregar preços
  const loadPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Em produção, aqui seria uma chamada real para a API
      // const response = await fetch('/api/commodity/prices');
      // const data = await response.json();

      const mockPrices = generateMockPrices();
      setPrices(mockPrices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar preços das commodities');
      console.error('Erro ao carregar preços das commodities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter preço por símbolo
  const getPriceBySymbol = useCallback((symbol: string): CommodityPrice | undefined => {
    return prices.find(price => price.symbol === symbol);
  }, [prices]);

  // Obter top movers
  const getTopMovers = useCallback((limit: number = 5): CommodityPrice[] => {
    return [...prices]
      .sort((a, b) => Math.abs(b.changePercentage) - Math.abs(a.changePercentage))
      .slice(0, limit);
  }, [prices]);

  // Obter histórico de preços
  const getPriceHistory = useCallback(async (symbol: string, period: '7d' | '30d' | '90d' | '1y'): Promise<Array<{date: string, price: number}>> => {
    try {
      const commodity = getPriceBySymbol(symbol);
      if (!commodity) {
        throw new Error(`Commodity ${symbol} não encontrada`);
      }

      const daysMap = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      };

      const days = daysMap[period];
      const history: Array<{date: string, price: number}> = [];
      const basePrice = commodity.previousPrice;
      const volatility = commodity.volatility;

      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simular variação de preço com tendência
        const trendFactor = commodity.trend === 'up' ? 1.001 : commodity.trend === 'down' ? 0.999 : 1.0;
        const randomFactor = 1 + (Math.random() - 0.5) * volatility * 0.5;
        const price = basePrice * Math.pow(trendFactor, days - i) * randomFactor;

        history.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(price * 100) / 100
        });
      }

      return history;
    } catch (err) {
      console.error('Erro ao carregar histórico de preços:', err);
      throw err;
    }
  }, [getPriceBySymbol]);

  // Função para atualizar preços
  const refreshPrices = useCallback(() => {
    loadPrices();
  }, [loadPrices]);

  // Carregar dados iniciais
  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  // Simular atualizações em tempo real (a cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && prices.length > 0) {
        // Simular pequenas variações nos preços
        setPrices(prev => prev.map(price => {
          const volatility = price.volatility * 0.1; // 10% da volatilidade total
          const randomFactor = 1 + (Math.random() - 0.5) * volatility * 2;
          
          const newPrice = price.currentPrice * randomFactor;
          const newChangeAmount = newPrice - price.previousPrice;
          const newChangePercentage = (newChangeAmount / price.previousPrice) * 100;

          // Determinar tendência
          let newTrend: 'up' | 'down' | 'stable' = 'stable';
          if (newChangePercentage > 0.5) newTrend = 'up';
          else if (newChangePercentage < -0.5) newTrend = 'down';

          return {
            ...price,
            currentPrice: Math.round(newPrice * 100) / 100,
            changeAmount: Math.round(newChangeAmount * 100) / 100,
            changePercentage: Math.round(newChangePercentage * 100) / 100,
            trend: newTrend,
            lastUpdated: new Date().toISOString()
          };
        }));
      }
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, [loading, prices]);

  return {
    prices,
    loading,
    error,
    refreshPrices,
    getPriceBySymbol,
    getTopMovers,
    getPriceHistory
  };
};

export default useCommodityPrices;