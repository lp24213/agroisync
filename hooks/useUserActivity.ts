import { useState, useEffect } from 'react';

interface UserActivity {
  id: string;
  userId: string;
  type: 'login' | 'transaction' | 'staking' | 'nft_mint' | 'governance';
  timestamp: Date;
  details: Record<string, any>;
}

export function useUserActivity(userId?: string) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchActivities = async () => {
      setLoading(true);
      try {
        // Simulação de dados
        const mockActivities: UserActivity[] = [
          {
            id: '1',
            userId,
            type: 'login',
            timestamp: new Date(),
            details: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0...' }
          },
          {
            id: '2',
            userId,
            type: 'transaction',
            timestamp: new Date(Date.now() - 3600000),
            details: { amount: '100', token: 'AGROTM' }
          }
        ];
        
        setActivities(mockActivities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar atividades');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  return { activities, loading, error };
} 