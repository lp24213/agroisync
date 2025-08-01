'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { TVLWidget } from '@/components/widgets/TVLWidget';
import { APRWidget } from '@/components/widgets/APRWidget';
import { PriceWidget } from '@/components/widgets/PriceWidget';
import { useProtectedRole } from '@/hooks/useProtectedRole';

export default function AnalyticsPage() {
  const { hasPermission } = useProtectedRole();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simular carregamento
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (!hasPermission('view_analytics')) {
    return (
      <div className="min-h-screen bg-agro-darker flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
            <p className="text-gray-400">
              Você não tem permissão para acessar a página de analytics.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-agro-darker p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agro-darker p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">
            Análise detalhada da plataforma e métricas de performance
          </p>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <TVLWidget tvl={12500000} change24h={2.5} />
          <APRWidget apr={18.5} change24h={-0.3} />
          <PriceWidget price={2.45} change24h={5.2} symbol="AGRO" />
        </div>

        {/* Analytics Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Overview */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Visão Geral do Mercado</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Volume 24h</span>
                <span className="text-white font-semibold">$2.3M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Usuários Ativos</span>
                <span className="text-white font-semibold">25,430</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transações</span>
                <span className="text-white font-semibold">156,789</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pools Ativos</span>
                <span className="text-white font-semibold">12</span>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Métricas de Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Taxa de Sucesso</span>
                <span className="text-green-400 font-semibold">99.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tempo Médio de TX</span>
                <span className="text-white font-semibold">0.4s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Uptime</span>
                <span className="text-green-400 font-semibold">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Gas Médio</span>
                <span className="text-white font-semibold">0.000005 SOL</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="mt-8">
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Gráficos de Performance</h2>
            <div className="h-64 bg-agro-dark/50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Gráficos interativos serão implementados aqui</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 