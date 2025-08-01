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
        // Fetch real user growth data from backend analytics
        const response = await fetch(`/api/users/growth?period=${period}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user growth data');
        }
        
        const data = await response.json();
        setData(data.growth);
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