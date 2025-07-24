import { useEffect, useState } from 'react';
import { getDeFiPools } from '../services/defi';
import { DeFiPool } from '../types';

interface UseDeFiPoolsResult {
  pools: DeFiPool[];
  loading: boolean;
  error: Error | null;
}

const useDeFiPools = (): UseDeFiPoolsResult => {
  const [pools, setPools] = useState<DeFiPool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      setLoading(true);
      try {
        const data = await getDeFiPools();
        setPools(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching pools:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  return { pools, loading, error };
};

export { useDeFiPools };