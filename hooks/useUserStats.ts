import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// Interface para estatísticas de usuários
interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  userGrowth: number;
  averageSessionTime: number;
  retentionRate: number;
  stakingUsers: number;
  nftHolders: number;
  daoParticipants: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
}

// Interface para retorno do hook
interface UseUserStatsReturn {
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Dados mock para demonstração
const mockStats: UserStats = {
  totalUsers: 45280,
  activeUsers: 12450,
  newUsersThisMonth: 3420,
  userGrowth: 18.5,
  averageSessionTime: 24.5, // em minutos
  retentionRate: 68.2,
  stakingUsers: 8420,
  nftHolders: 5680,
  daoParticipants: 2340,
  weeklyActiveUsers: 8920,
  monthlyActiveUsers: 18450
};

/**
 * Hook para buscar estatísticas de usuários
 * @returns Objeto com estatísticas, estado de loading, erro e função de refetch
 */
export const useUserStats = (): UseUserStatsReturn => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));

      if (connected && publicKey) {
        // Fetch real user stats from backend analytics
        const response = await fetch(`/api/users/stats?address=${publicKey.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user stats');
        }
        
        const data = await response.json();
        setStats(data.stats);
      } else {
        setStats(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas de usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [connected, publicKey]);

  const refetch = () => {
    fetchUserStats();
  };

  return {
    stats,
    loading,
    error,
    refetch
  };
};

/**
 * Função para obter estatísticas de usuários (para uso em summary-export)
 * @returns Promise com estatísticas de usuários
 */
export const getUserStats = async (): Promise<UserStats> => {
  try {
    const response = await fetch('/api/users/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }
    
    const data = await response.json();
    return data.stats;
  } catch (error) {
    logger.error('Error fetching user stats:', error);
    throw error;
  }
};

export default useUserStats;