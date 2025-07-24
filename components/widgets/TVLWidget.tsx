"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedCard } from "../AnimatedCard";

interface TVLWidgetProps {
  className?: string;
}

export function TVLWidget({ className = "" }: TVLWidgetProps) {
  const [tvl, setTvl] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTVL = async () => {
      try {
        // Simulação de API - substitua por integração real com DeFiLlama, TheGraph, etc
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockTVL = 2750000 + Math.random() * 100000;
        setTvl(mockTVL);
      } catch (error) {
        console.error("Erro ao buscar TVL:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVL();
    const interval = setInterval(fetchTVL, 60000); // Atualiza a cada 1 minuto
    
    return () => clearInterval(interval);
  }, []);

  const formatTVL = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  if (loading) {
    return (
      <AnimatedCard className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-20 mb-2"></div>
          <div className="h-6 bg-gray-600 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-600 rounded w-32"></div>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">Total Value Locked</p>
          <motion.p 
            className="text-2xl font-bold gradient-text"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            key={tvl}
          >
            {tvl ? formatTVL(tvl) : '--'}
          </motion.p>
          <p className="text-xs text-gray-500">
            Across all pools and farms
          </p>
        </div>
        
        <div className="w-12 h-12 rounded-full bg-success-green/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-success-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
    </AnimatedCard>
  );
}
