import { useState, useEffect } from 'react';

interface UserSegment {
  id: string;
  name: string;
  count: number;
  percentage: number;
  criteria: string[];
}

export function useUserSegmentation() {
  const [segments, setSegments] = useState<UserSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSegments = async () => {
      setLoading(true);
      try {
        // Simulação de dados de segmentação
        const mockSegments: UserSegment[] = [
          {
            id: '1',
            name: 'Novos Usuários',
            count: 1250,
            percentage: 25,
            criteria: ['Registrados nos últimos 30 dias']
          },
          {
            id: '2',
            name: 'Usuários Ativos',
            count: 3000,
            percentage: 60,
            criteria: ['Login nos últimos 7 dias']
          },
          {
            id: '3',
            name: 'Stakers',
            count: 750,
            percentage: 15,
            criteria: ['Tokens em staking > 0']
          }
        ];
        
        setSegments(mockSegments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar segmentação');
      } finally {
        setLoading(false);
      }
    };

    fetchSegments();
  }, []);

  return { segments, loading, error };
} 