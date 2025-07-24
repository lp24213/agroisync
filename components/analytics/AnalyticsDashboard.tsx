'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { AnimatedCard } from '@/components/AnimatedCard';
import { NeonButton } from '@/components/NeonButton';
import { 
  TrendingUp, BarChart3, Activity, DollarSign, Users, Zap, Award, Globe, 
  ArrowUpRight, ArrowDownRight, RefreshCw, Download
} from 'lucide-react';

interface AnalyticsData {
  revenue: { date: string; value: number; growth: number }[];
  users: { date: string; active: number; new: number; retained: number }[];
  transactions: { date: string; count: number; volume: number; fees: number }[];
  yields: { pool: string; apy: number; tvl: number; volume24h: number }[];
  geography: { country: string; users: number; volume: number }[];
  performance: { metric: string; current: number; previous: number; change: number }[];
}

const mockData: AnalyticsData = {
  revenue: [
    { date: '2024-01', value: 125000, growth: 12.5 },
    { date: '2024-02', value: 142000, growth: 13.6 },
    { date: '2024-03', value: 158000, growth: 11.3 },
    { date: '2024-04', value: 175000, growth: 10.8 },
    { date: '2024-05', value: 195000, growth: 11.4 },
    { date: '2024-06', value: 218000, growth: 11.8 }
  ],
  users: [
    { date: '2024-01', active: 12500, new: 2100, retained: 10400 },
    { date: '2024-02', active: 14200, new: 2350, retained: 11850 },
    { date: '2024-03', active: 15800, new: 2180, retained: 13620 },
    { date: '2024-04', active: 17500, new: 2420, retained: 15080 },
    { date: '2024-05', active: 19500, new: 2650, retained: 16850 },
    { date: '2024-06', active: 21800, new: 2890, retained: 18910 }
  ],
  transactions: [
    { date: '2024-01', count: 45000, volume: 2500000, fees: 12500 },
    { date: '2024-02', count: 52000, volume: 2850000, fees: 14250 },
    { date: '2024-03', count: 58000, volume: 3200000, fees: 16000 },
    { date: '2024-04', count: 65000, volume: 3650000, fees: 18250 },
    { date: '2024-05', count: 72000, volume: 4100000, fees: 20500 },
    { date: '2024-06', count: 81000, volume: 4650000, fees: 23250 }
  ],
  yields: [
    { pool: 'AGROTM-SOL', apy: 18.5, tvl: 2500000, volume24h: 450000 },
    { pool: 'AGROTM-USDC', apy: 12.3, tvl: 1800000, volume24h: 320000 },
    { pool: 'SOL-USDC', apy: 8.7, tvl: 3200000, volume24h: 680000 },
    { pool: 'Carbon Credits', apy: 15.2, tvl: 950000, volume24h: 125000 },
    { pool: 'Farm NFTs', apy: 22.1, tvl: 1200000, volume24h: 180000 }
  ],
  geography: [
    { country: 'United States', users: 8500, volume: 1850000 },
    { country: 'Brazil', users: 6200, volume: 1320000 },
    { country: 'India', users: 4800, volume: 890000 },
    { country: 'Germany', users: 3200, volume: 750000 },
    { country: 'Japan', users: 2900, volume: 680000 },
    { country: 'Others', users: 5400, volume: 1160000 }
  ],
  performance: [
    { metric: 'Total Value Locked', current: 12500000, previous: 11200000, change: 11.6 },
    { metric: 'Active Users', current: 21800, previous: 19500, change: 11.8 },
    { metric: 'Transaction Volume', current: 4650000, previous: 4100000, change: 13.4 },
    { metric: 'Revenue', current: 218000, previous: 195000, change: 11.8 },
    { metric: 'Carbon Offset', current: 15600, previous: 14200, change: 9.9 },
    { metric: 'NFT Sales', current: 1250, previous: 1080, change: 15.7 }
  ]
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function AnalyticsDashboard() {
  const [data] = useState<AnalyticsData>(mockData);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6M');
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const exportData = () => {
    // Simulate data export
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agrotm-analytics.json';
    link.click();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Real-time insights and performance metrics
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-400"
            >
              <option value="1M">Last Month</option>
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="1Y">Last Year</option>
            </select>

            <NeonButton
              onClick={refreshData}
              variant="secondary"
              size="sm"
              loading={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </NeonButton>

            <NeonButton
              onClick={exportData}
              variant="secondary"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </NeonButton>
          </div>
        </div>
      </motion.div>

      {/* Key Performance Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
      >
        {data.performance.map((metric, index: number) => (
          <AnimatedCard key={index} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {metric.metric === 'Total Value Locked' && <DollarSign className="w-5 h-5 text-blue-400 mr-2" />}
                {metric.metric === 'Active Users' && <Users className="w-5 h-5 text-green-400 mr-2" />}
                {metric.metric === 'Transaction Volume' && <Activity className="w-5 h-5 text-purple-400 mr-2" />}
                {metric.metric === 'Revenue' && <TrendingUp className="w-5 h-5 text-yellow-400 mr-2" />}
                {metric.metric === 'Carbon Offset' && <Award className="w-5 h-5 text-green-500 mr-2" />}
                {metric.metric === 'NFT Sales' && <Zap className="w-5 h-5 text-pink-400 mr-2" />}
              </div>
              {metric.change >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              )}
            </div>
            
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {metric.metric.includes('Value') || metric.metric.includes('Revenue') || metric.metric.includes('Volume')
                  ? formatCurrency(metric.current)
                  : formatNumber(metric.current)
                }
              </p>
              <p className="text-xs text-gray-400 mb-2">{metric.metric}</p>
              <p className={`text-sm font-semibold ${
                metric.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPercentage(metric.change)}
              </p>
            </div>
          </AnimatedCard>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
              Revenue Growth
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value / 1000}K`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  fill="url(#colorRevenue)" 
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </AnimatedCard>
        </motion.div>

        {/* User Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-green-400" />
              User Analytics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.users}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#10B981" strokeWidth={2} name="Active Users" />
                <Line type="monotone" dataKey="new" stroke="#3B82F6" strokeWidth={2} name="New Users" />
                <Line type="monotone" dataKey="retained" stroke="#F59E0B" strokeWidth={2} name="Retained Users" />
              </LineChart>
            </ResponsiveContainer>
          </AnimatedCard>
        </motion.div>

        {/* Transaction Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-purple-400" />
              Transaction Analytics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.transactions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'volume' ? formatCurrency(value) : formatNumber(value),
                    name === 'volume' ? 'Volume' : name === 'count' ? 'Count' : 'Fees'
                  ]}
                />
                <Legend />
                <Bar dataKey="count" fill="#8B5CF6" name="Transaction Count" />
                <Bar dataKey="fees" fill="#EF4444" name="Fees Collected" />
              </BarChart>
            </ResponsiveContainer>
          </AnimatedCard>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-cyan-400" />
              Geographic Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.geography}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="users"
                  label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.geography.map((_, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    formatNumber(value),
                    name === 'users' ? 'Users' : 'Volume'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </AnimatedCard>
        </motion.div>
      </div>

      {/* Yield Pools Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <AnimatedCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-400" />
            Yield Pools Performance
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 py-3 px-4">Pool</th>
                  <th className="text-right text-gray-400 py-3 px-4">APY</th>
                  <th className="text-right text-gray-400 py-3 px-4">TVL</th>
                  <th className="text-right text-gray-400 py-3 px-4">24h Volume</th>
                  <th className="text-right text-gray-400 py-3 px-4">Performance</th>
                </tr>
              </thead>
              <tbody>
                {data.yields.map((pool, index: number) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mr-3" />
                        <span className="text-white font-semibold">{pool.pool}</span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className="text-green-400 font-semibold">{pool.apy.toFixed(1)}%</span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className="text-white">{formatCurrency(pool.tvl)}</span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className="text-gray-300">{formatCurrency(pool.volume24h)}</span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="flex items-center justify-end">
                        <div className="w-16 h-2 bg-gray-700 rounded-full mr-2">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                            style={{ width: `${Math.min((pool.apy / 25) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">{Math.round((pool.apy / 25) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedCard>
      </motion.div>

      {/* Real-time Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <AnimatedCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-red-400" />
            Real-time Activity
          </h3>
          
          <div className="space-y-4">
            {[
              { type: 'stake', user: '0x1234...5678', amount: '1,250 AGROTM', time: '2 minutes ago' },
              { type: 'harvest', user: '0x2345...6789', amount: '45.2 SOL', time: '5 minutes ago' },
              { type: 'nft_purchase', user: '0x3456...7890', amount: '2.5 SOL', time: '8 minutes ago' },
              { type: 'liquidity', user: '0x4567...8901', amount: '5,000 USDC', time: '12 minutes ago' },
              { type: 'carbon_offset', user: '0x5678...9012', amount: '100 tons CO2', time: '15 minutes ago' }
            ].map((activity, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    activity.type === 'stake' ? 'bg-green-400' :
                    activity.type === 'harvest' ? 'bg-yellow-400' :
                    activity.type === 'nft_purchase' ? 'bg-purple-400' :
                    activity.type === 'liquidity' ? 'bg-blue-400' :
                    'bg-emerald-400'
                  }`} />
                  <div>
                    <p className="text-white font-semibold">
                      {activity.type === 'stake' ? 'Staked' :
                       activity.type === 'harvest' ? 'Harvested' :
                       activity.type === 'nft_purchase' ? 'NFT Purchase' :
                       activity.type === 'liquidity' ? 'Added Liquidity' :
                       'Carbon Offset'
                      } {activity.amount}
                    </p>
                    <p className="text-gray-400 text-sm">{activity.user}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </motion.div>
    </div>
  );
}
