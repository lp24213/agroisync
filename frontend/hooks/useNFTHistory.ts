import { useState, useEffect, useCallback } from 'react';
import { subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NFTValuationHistory {
  date: string;
  averageValue: number;
  totalValue: number;
  farmValue: number;
  machineryValue: number;
  grainLotsValue: number;
  certificatesValue: number;
  volume: number;
  transactions: number;
}

interface UseNFTHistoryReturn {
  valuationHistory: NFTValuationHistory[];
  loading: boolean;
  error: string | null;
  refreshHistory: () => void;
  getHistoryByPeriod: (period: '7d' | '30d' | '90d' | '1y') => Promise<NFTValuationHistory[]>;
}

const useNFTHistory = (): UseNFTHistoryReturn => {
  const [valuationHistory, setValuationHistory] = useState<NFTValuationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gerar dados mock de histórico
  const generateMockHistory = (days: number): NFTValuationHistory[] => {
    const history: NFTValuationHistory[] = [];
    const baseValues = {
      averageValue: 80000,
      totalValue: 120000000,
      farmValue: 75000000,
      machineryValue: 25000000,
      grainLotsValue: 15000000,
      certificatesValue: 10000000,
      volume: 25000000,
      transactions: 150
    };

    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const volatility = 0.05; // 5% de volatilidade diária
      const randomFactor = 1 + (Math.random() - 0.5) * volatility * 2;
      
      history.push({
        date: format(date, 'yyyy-MM-dd', { locale: ptBR }),
        averageValue: Math.round(baseValues.averageValue * randomFactor),
        totalValue: Math.round(baseValues.totalValue * randomFactor),
        farmValue: Math.round(baseValues.farmValue * randomFactor),
        machineryValue: Math.round(baseValues.machineryValue * randomFactor),
        grainLotsValue: Math.round(baseValues.grainLotsValue * randomFactor),
        certificatesValue: Math.round(baseValues.certificatesValue * randomFactor),
        volume: Math.round(baseValues.volume * (0.5 + Math.random())),
        transactions: Math.round(baseValues.transactions * (0.7 + Math.random() * 0.6))
      });
    }

    return history;
  };

  // Carregar histórico
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Em produção, aqui seria uma chamada real para a API
      // const response = await fetch('/api/nft/history');
      // const data = await response.json();

      const mockHistory = generateMockHistory(30); // 30 dias de histórico
      setValuationHistory(mockHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter histórico por período
  const getHistoryByPeriod = useCallback(async (period: '7d' | '30d' | '90d' | '1y'): Promise<NFTValuationHistory[]> => {
    try {
      const daysMap = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      };

      const days = daysMap[period];
      const mockHistory = generateMockHistory(days);
      
      return mockHistory;
    } catch (err) {
      console.error('Erro ao carregar histórico por período:', err);
      throw err;
    }
  }, []);

  // Função para atualizar histórico
  const refreshHistory = useCallback(() => {
    loadHistory();
  }, [loadHistory]);

  // Carregar dados iniciais
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Simular atualizações em tempo real (a cada hora)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && valuationHistory.length > 0) {
        // Adicionar novo ponto de dados
        const lastEntry = valuationHistory[valuationHistory.length - 1];
        const newDate = new Date();
        const volatility = 0.02; // 2% de volatilidade
        const randomFactor = 1 + (Math.random() - 0.5) * volatility * 2;

        const newEntry: NFTValuationHistory = {
          date: format(newDate, 'yyyy-MM-dd', { locale: ptBR }),
          averageValue: Math.round(lastEntry.averageValue * randomFactor),
          totalValue: Math.round(lastEntry.totalValue * randomFactor),
          farmValue: Math.round(lastEntry.farmValue * randomFactor),
          machineryValue: Math.round(lastEntry.machineryValue * randomFactor),
          grainLotsValue: Math.round(lastEntry.grainLotsValue * randomFactor),
          certificatesValue: Math.round(lastEntry.certificatesValue * randomFactor),
          volume: Math.round(lastEntry.volume * (0.8 + Math.random() * 0.4)),
          transactions: Math.round(lastEntry.transactions * (0.9 + Math.random() * 0.2))
        };

        setValuationHistory(prev => {
          const newHistory = [...prev, newEntry];
          // Manter apenas os últimos 365 dias
          if (newHistory.length > 365) {
            return newHistory.slice(-365);
          }
          return newHistory;
        });
      }
    }, 3600000); // 1 hora

    return () => clearInterval(interval);
  }, [loading, valuationHistory]);

  return {
    valuationHistory,
    loading,
    error,
    refreshHistory,
    getHistoryByPeriod
  };
};

export default useNFTHistory;