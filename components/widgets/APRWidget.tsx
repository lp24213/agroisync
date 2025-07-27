'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '../AnimatedCard';

interface APRWidgetProps {
  poolId?: string;
  className?: string;
}

export function APRWidget({ poolId, className }: APRWidgetProps): JSX.Element {
  const [apr, setApr] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAPR = async () => {
      setLoading(true);
      let aprValue = null;
      try {
        // Exemplo: buscar APR real de endpoint backend
        const res = await fetch('/api/defi/apr'); // Ajuste para sua API real
        const data = await res.json();
        aprValue = data.apr;
      } catch (err) {
        console.error('Erro ao buscar APR real:', err);
      }
      setApr(aprValue);
      setLoading(false);
    };

    fetchAPR();
    const interval = setInterval(fetchAPR, 45000); // Atualiza a cada 45s
    return () => clearInterval(interval);
  }, [poolId]);

  const formatAPR = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getAPRColor = (value: number) => {
    if (value >= 20) return 'text-success-green';
    if (value >= 10) return 'text-warning-yellow';
    return 'text-neon-blue';
  };

  if (loading) {
    return (
      <AnimatedCard className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-16 mb-2"></div>
          <div className="h-6 bg-gray-600 rounded w-20 mb-1"></div>
          <div className="h-3 bg-gray-600 rounded w-24"></div>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">Average APR</p>
          <motion.p
            className={`text-2xl font-bold ${apr ? getAPRColor(apr) : 'text-white'}`}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            key={apr}
          >
            {apr ? formatAPR(apr) : '--'}
          </motion.p>
          <p className="text-xs text-gray-500">Annual Percentage Rate</p>
        </div>

        <div className="w-12 h-12 rounded-full bg-warning-yellow/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-warning-yellow" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </AnimatedCard>
  );
}
