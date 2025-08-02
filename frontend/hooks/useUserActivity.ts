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
        // Fetch real user activity from backend
        const response = await fetch(`/api/users/${userId}/activity`);
        if (!response.ok) {
          throw new Error('Failed to fetch user activity');
        }
        
        const data = await response.json();
        setActivities(data.activities);
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