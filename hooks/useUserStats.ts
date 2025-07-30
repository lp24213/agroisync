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
        // In a real implementation, you would fetch stats from your backend/analytics
        // For now, we'll use mock data with some randomization
        const randomizedStats = {
          ...mockStats,
          totalUsers: mockStats.totalUsers + Math.floor(Math.random() * 1000 - 500),
          activeUsers: mockStats.activeUsers + Math.floor(Math.random() * 500 - 250),
          userGrowth: mockStats.userGrowth + (Math.random() * 5 - 2.5),
          retentionRate: mockStats.retentionRate + (Math.random() * 10 - 5)
        };
        
        setStats(randomizedStats);
      } else {
        setStats(mockStats); // Return mock data even when not connected for demo
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
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    ...mockStats,
    totalUsers: mockStats.totalUsers + Math.floor(Math.random() * 1000 - 500),
    activeUsers: mockStats.activeUsers + Math.floor(Math.random() * 500 - 250),
    userGrowth: mockStats.userGrowth + (Math.random() * 5 - 2.5),
    retentionRate: mockStats.retentionRate + (Math.random() * 10 - 5)
  };
};

export default useUserStats;