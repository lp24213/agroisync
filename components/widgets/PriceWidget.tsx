"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedCard } from "../AnimatedCard";

interface PriceWidgetProps {
  token?: string;
  className?: string;
}

export function PriceWidget({ token = "AGRO", className = "" }: PriceWidgetProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // Simulação de API - substitua por integração real (CoinGecko, Chainlink, etc)
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockPrice = 0.0245 + (Math.random() - 0.5) * 0.001;
        const mockChange = (Math.random() - 0.5) * 10;
        
        setPrice(mockPrice);
        setChange24h(mockChange);
      } catch (error) {
        console.error("Erro ao buscar preço:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Atualiza a cada 30s
    
    return () => clearInterval(interval);
  }, [token]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <AnimatedCard className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-16 mb-2"></div>
          <div className="h-6 bg-gray-600 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-600 rounded w-20"></div>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{token}</p>
          <motion.p 
            className="text-2xl font-bold text-white"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3 }}
            key={price}
          >
            {price ? formatPrice(price) : '--'}
          </motion.p>
          <p className={`text-sm font-medium ${
            change24h >= 0 ? 'text-success-green' : 'text-error-red'
          }`}>
            {formatPercentage(change24h)}
          </p>
        </div>
        
        <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-neon-blue" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
    </AnimatedCard>
  );
}
