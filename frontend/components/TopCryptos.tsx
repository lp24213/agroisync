'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import { Card } from './ui/Card';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  sparkline_in_7d: {
    price: number[];
  };
}

interface TopCryptosProps {
  limit?: number;
  className?: string;
}

export default function TopCryptos({ limit = 20, className = '' }: TopCryptosProps) {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        'https://pro-api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: limit,
            page: 1,
            sparkline: true,
          },
          headers: {
            'x-cg-pro-api-key': 'CG-BTkHrqswBAYJKoPMkqKSQLM4',
          },
        }
      );

      setCryptos(response.data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erro ao buscar dados das criptomoedas:', err);
      setError('Erro ao carregar dados das criptomoedas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
    
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchCryptos, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [limit]);

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {isPositive ? '+' : ''}{percentage.toFixed(2)}%
      </span>
    );
  };

  const createSparklineData = (prices: number[], isPositive: boolean) => {
    const labels = Array.from({ length: prices.length }, (_, i) => i);
    
    return {
      labels,
      datasets: [
        {
          data: prices,
          borderColor: isPositive ? '#00FF7F' : '#FF6B35',
          backgroundColor: isPositive 
            ? 'rgba(0, 255, 127, 0.1)' 
            : 'rgba(255, 107, 53, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    };
  };

  const sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  if (loading && cryptos.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-premium-neon-blue animate-spin" />
            <span className="text-premium-light font-orbitron">Carregando criptomoedas...</span>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-premium-light mb-4">{error}</p>
            <button
              onClick={fetchCryptos}
              className="px-4 py-2 bg-premium-neon-blue text-premium-black rounded-lg hover:bg-premium-neon-cyan transition-colors font-orbitron"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-orbitron font-bold text-premium-neon-blue">
          Principais Criptomoedas
        </h2>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-sm text-premium-light/60 font-orbitron">
              Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
            </span>
          )}
          <button
            onClick={fetchCryptos}
            disabled={loading}
            className="p-2 text-premium-neon-blue hover:text-premium-neon-cyan transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-premium-neon-blue/20">
              <th className="text-left py-3 px-4 font-orbitron text-premium-neon-blue">#</th>
              <th className="text-left py-3 px-4 font-orbitron text-premium-neon-blue">Moeda</th>
              <th className="text-right py-3 px-4 font-orbitron text-premium-neon-blue">Preço</th>
              <th className="text-right py-3 px-4 font-orbitron text-premium-neon-blue">24h</th>
              <th className="text-right py-3 px-4 font-orbitron text-premium-neon-blue">Market Cap</th>
              <th className="text-right py-3 px-4 font-orbitron text-premium-neon-blue">7d</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto, index) => {
              const isPositive7d = crypto.price_change_percentage_7d_in_currency >= 0;
              const sparklineData = createSparklineData(
                crypto.sparkline_in_7d.price,
                isPositive7d
              );

              return (
                <motion.tr
                  key={crypto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-premium-neon-blue/10 hover:bg-premium-neon-blue/5 transition-colors"
                >
                  <td className="py-4 px-4 text-premium-light font-orbitron">
                    {crypto.market_cap_rank}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-orbitron font-semibold text-premium-light">
                          {crypto.name}
                        </div>
                        <div className="text-sm text-premium-light/60 uppercase">
                          {crypto.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-orbitron text-premium-light">
                    {formatPrice(crypto.current_price)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {formatPercentage(crypto.price_change_percentage_24h)}
                  </td>
                  <td className="py-4 px-4 text-right font-orbitron text-premium-light">
                    {formatMarketCap(crypto.market_cap)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="w-24 h-12">
                      <Line data={sparklineData} options={sparklineOptions} />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {loading && cryptos.length > 0 && (
        <div className="flex items-center justify-center py-4 mt-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-premium-neon-blue animate-spin" />
            <span className="text-sm text-premium-light/60 font-orbitron">
              Atualizando...
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
