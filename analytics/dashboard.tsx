'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Chart } from '@/components/analytics/Chart';
import { MetricsCard } from '@/components/analytics/MetricsCard';
import { useWeb3 } from '@/hooks/useWeb3';
import { validation } from '@/utils/validation';

interface AnalyticsData {
  totalTransactions: number;
  totalVolume: number;
  averageTransactionSize: number;
  uniqueUsers: number;
  dailyStats: Array<{
    date: string;
    transactions: number;
    volume: number;
  }>;
}

export default function AnalyticsDashboard() {
  const { isConnected, publicKey } = useWeb3();
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Simular dados de analytics
        const mockData: AnalyticsData = {
          totalTransactions: 156789,
          totalVolume: 12500000,
          averageTransactionSize: 79.6,
          uniqueUsers: 25430,
          dailyStats: [
            { date: '2024-01-09', transactions: 1234, volume: 98765 },
            { date: '2024-01-10', transactions: 1456, volume: 112345 },
            { date: '2024-01-11', transactions: 1678, volume: 134567 },
            { date: '2024-01-12', transactions: 1890, volume: 156789 },
            { date: '2024-01-13', transactions: 2102, volume: 178901 },
            { date: '2024-01-14', transactions: 2324, volume: 201234 },
            { date: '2024-01-15', transactions: 2546, volume: 223456 },
          ],
        };

        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-agro-darker flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Conecte sua Carteira</h1>
            <p className="text-gray-400">
              Para acessar o dashboard de analytics, você precisa conectar sua carteira.
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
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-agro-darker flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Erro ao Carregar Dados</h1>
            <p className="text-gray-400">
              Não foi possível carregar os dados de analytics.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const transactionChartData = data.dailyStats.map(stat => ({
    label: new Date(stat.date).toLocaleDateString('pt-BR'),
    value: stat.transactions,
  }));

  const volumeChartData = data.dailyStats.map(stat => ({
    label: new Date(stat.date).toLocaleDateString('pt-BR'),
    value: stat.volume,
  }));

  return (
    <div className="min-h-screen bg-agro-darker p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">
            Carteira: {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total de Transações"
            value={validation.formatNumber(data.totalTransactions)}
            change={12.5}
            changeLabel="vs. último mês"
            icon="📊"
            trend="up"
            color="blue"
          />
          <MetricsCard
            title="Volume Total"
            value={validation.formatCurrency(data.totalVolume)}
            change={8.3}
            changeLabel="vs. último mês"
            icon="💰"
            trend="up"
            color="green"
          />
          <MetricsCard
            title="Tamanho Médio"
            value={validation.formatCurrency(data.averageTransactionSize)}
            change={-2.1}
            changeLabel="vs. último mês"
            icon="📈"
            trend="down"
            color="yellow"
          />
          <MetricsCard
            title="Usuários Únicos"
            value={validation.formatNumber(data.uniqueUsers)}
            change={15.7}
            changeLabel="vs. último mês"
            icon="👥"
            trend="up"
            color="purple"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            title="Transações Diárias"
            data={transactionChartData}
            type="line"
            height={300}
          />
          <Chart
            title="Volume Diário"
            data={volumeChartData}
            type="bar"
            height={300}
          />
        </div>

        {/* Additional Analytics */}
        <div className="mt-8">
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">Análise Detalhada</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Top Tokens</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">AGRO</span>
                    <span className="text-white">45.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SOL</span>
                    <span className="text-white">28.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">USDC</span>
                    <span className="text-white">26.1%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Atividade por Hora</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pico</span>
                    <span className="text-white">14:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Baixa</span>
                    <span className="text-white">02:00 - 06:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Média</span>
                    <span className="text-white">1,234/hora</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Geolocalização</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Brasil</span>
                    <span className="text-white">67.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">EUA</span>
                    <span className="text-white">18.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Outros</span>
                    <span className="text-white">13.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 