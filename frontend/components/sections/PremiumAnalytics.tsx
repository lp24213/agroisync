'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const metrics = [
  {
    title: 'Total Value Locked',
    value: '$2,456,789,123',
    change: '+12.5%',
    isPositive: true,
    icon: DollarSign,
    color: 'text-green-400',
  },
  {
    title: 'Active Users',
    value: '45,234',
    change: '+8.3%',
    isPositive: true,
    icon: Users,
    color: 'text-blue-400',
  },
  {
    title: 'Daily Volume',
    value: '$89,456,789',
    change: '-2.1%',
    isPositive: false,
    icon: Activity,
    color: 'text-purple-400',
  },
  {
    title: 'APY Average',
    value: '24.8%',
    change: '+1.2%',
    isPositive: true,
    icon: TrendingUp,
    color: 'text-yellow-400',
  },
];

const chartData = {
  tvl: [2.1, 2.3, 2.2, 2.5, 2.4, 2.6, 2.8, 2.7, 2.9, 3.0, 3.2, 3.1],
  users: [35, 38, 40, 42, 41, 43, 45, 44, 46, 47, 48, 49],
  volume: [65, 68, 70, 72, 71, 73, 75, 74, 76, 77, 78, 79],
};

const timeframes = ['1H', '24H', '7D', '30D', '1Y', 'ALL'];

export function PremiumAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [selectedTimeframe]);

  return (
    <section className='relative py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-0 w-full h-full'>
          <div className='absolute top-20 left-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl' />
          <div className='absolute bottom-20 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl' />
        </div>
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-6 py-3 mb-8'
          >
            <BarChart3 className='w-5 h-5 text-green-400' />
            <span className='text-green-400 font-medium'>Live Analytics</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-4xl md:text-6xl font-bold text-white mb-6'
          >
            <span className='bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent'>
              Real-Time
            </span>
            <br />
            <span className='text-white'>Market Analytics</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='text-xl text-gray-400 max-w-3xl mx-auto'
          >
            Track your investments with advanced analytics, real-time data, and predictive insights
            powered by artificial intelligence.
          </motion.p>
        </div>

        {/* Timeframe Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='flex justify-center mb-12'
        >
          <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2'>
            {timeframes.map(timeframe => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedTimeframe === timeframe
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='group relative'
            >
              <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300'>
                <div className='flex items-center justify-between mb-4'>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center`}
                  >
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className='flex items-center space-x-1'>
                    {metric.isPositive ? (
                      <ArrowUpRight className='w-4 h-4 text-green-400' />
                    ) : (
                      <ArrowDownRight className='w-4 h-4 text-red-400' />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        metric.isPositive ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>

                <div className='mb-2'>
                  <div className='text-2xl font-bold text-white'>{metric.value}</div>
                  <div className='text-sm text-gray-400'>{metric.title}</div>
                </div>

                {/* Mini Chart */}
                <div className='h-12 flex items-end space-x-1'>
                  {chartData.tvl.slice(-8).map((value, i) => (
                    <div
                      key={i}
                      className='flex-1 bg-gradient-to-t from-green-500/30 to-emerald-500/30 rounded-t'
                      style={{ height: `${(value / 3.2) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16'>
          {/* TVL Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'
          >
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-white'>Total Value Locked</h3>
              <LineChart className='w-6 h-6 text-green-400' />
            </div>

            <div className='h-64 flex items-end space-x-2'>
              {chartData.tvl.map((value, index) => (
                <div
                  key={index}
                  className='flex-1 bg-gradient-to-t from-green-500 to-emerald-600 rounded-t transition-all duration-300 hover:opacity-80'
                  style={{ height: `${(value / 3.2) * 100}%` }}
                />
              ))}
            </div>

            <div className='mt-4 grid grid-cols-3 gap-4 text-center'>
              <div>
                <div className='text-sm text-gray-400'>Current</div>
                <div className='text-lg font-bold text-white'>$3.1B</div>
              </div>
              <div>
                <div className='text-sm text-gray-400'>Change</div>
                <div className='text-lg font-bold text-green-400'>+12.5%</div>
              </div>
              <div>
                <div className='text-sm text-gray-400'>Peak</div>
                <div className='text-lg font-bold text-white'>$3.2B</div>
              </div>
            </div>
          </motion.div>

          {/* Users Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'
          >
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-white'>Active Users</h3>
              <BarChart3 className='w-6 h-6 text-blue-400' />
            </div>

            <div className='h-64 flex items-end space-x-2'>
              {chartData.users.map((value, index) => (
                <div
                  key={index}
                  className='flex-1 bg-gradient-to-t from-blue-500 to-cyan-600 rounded-t transition-all duration-300 hover:opacity-80'
                  style={{ height: `${(value / 50) * 100}%` }}
                />
              ))}
            </div>

            <div className='mt-4 grid grid-cols-3 gap-4 text-center'>
              <div>
                <div className='text-sm text-gray-400'>Current</div>
                <div className='text-lg font-bold text-white'>49.2K</div>
              </div>
              <div>
                <div className='text-sm text-gray-400'>Change</div>
                <div className='text-lg font-bold text-blue-400'>+8.3%</div>
              </div>
              <div>
                <div className='text-sm text-gray-400'>Peak</div>
                <div className='text-lg font-bold text-white'>52.1K</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6'
        >
          <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center'>
            <PieChart className='w-12 h-12 text-purple-400 mx-auto mb-4' />
            <h3 className='text-lg font-bold text-white mb-2'>Asset Distribution</h3>
            <p className='text-gray-400 text-sm'>View your portfolio allocation</p>
          </div>

          <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center'>
            <TrendingUp className='w-12 h-12 text-green-400 mx-auto mb-4' />
            <h3 className='text-lg font-bold text-white mb-2'>Performance</h3>
            <p className='text-gray-400 text-sm'>Track your investment returns</p>
          </div>

          <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center'>
            <Activity className='w-12 h-12 text-blue-400 mx-auto mb-4' />
            <h3 className='text-lg font-bold text-white mb-2'>Risk Analysis</h3>
            <p className='text-gray-400 text-sm'>AI-powered risk assessment</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
