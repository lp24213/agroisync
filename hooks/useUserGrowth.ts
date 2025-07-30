import { useState, useEffect } from 'react';

interface UserGrowthData {
  date: string;
  newUsers: number;
  activeUsers: number;
  totalUsers: number;
}

export function useUserGrowth(period: '7d' | '30d' | '90d' = '30d') {
  const [data, setData] = useState<UserGrowthData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrowthData = async () => {
      setLoading(true);
      try {
        // Simulação de dados de crescimento
        const mockData: UserGrowthData[] = [];
        const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          mockData.push({
            date: date.toISOString().split('T')[0],
            newUsers: Math.floor(Math.random() * 50) + 10,
            activeUsers: Math.floor(Math.random() * 200) + 100,
            totalUsers: 1000 + (days - i) * 25
          });
        }
        
        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados de crescimento');
      } finally {
        setLoading(false);
      }
    };

    fetchGrowthData();
  }, [period]);

  return { data, loading, error };
} 