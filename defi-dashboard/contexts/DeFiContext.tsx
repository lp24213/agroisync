import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDeFiPools } from '../services/defi';
import { DeFiPool, DeFiContextType } from '../types';

// Create a context with a default value that matches our type
const DeFiContext = createContext<DeFiContextType>({
  pools: [],
  loading: false,
  error: null,
  fetchPools: async () => {}
});

interface DeFiProviderProps {
  children: ReactNode;
}

export const DeFiProvider: React.FC<DeFiProviderProps> = ({ children }) => {
  const [pools, setPools] = useState<DeFiPool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getDeFiPools();
      setPools(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching pools:', err);
      setError('Failed to load DeFi pools. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  // Create the context value object
  const contextValue: DeFiContextType = {
    pools,
    loading,
    error,
    fetchPools
  };

  return (
    <DeFiContext.Provider value={contextValue}>
      {children}
    </DeFiContext.Provider>
  );
};

export const useDeFi = (): DeFiContextType => {
  const context = useContext(DeFiContext);
  if (!context) {
    throw new Error('useDeFi must be used within a DeFiProvider');
  }
  return context;
};