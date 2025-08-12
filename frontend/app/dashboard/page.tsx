'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Lock, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { CryptoChart } from '../../components/widgets/CryptoChart';

export default function DashboardPage() {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('dashboard.stats.totalValueLocked'),
      value: 'R$ 5.5M',
      change: '+12.5%',
      changeType: 'positive',
      icon: <Lock className="w-6 h-6" />,
      color: 'from-premium-neon-blue to-premium-neon-cyan'
    },
    {
      title: t('dashboard.stats.averageAPY'),
      value: '8.8%',
      change: '+2.1%',
      changeType: 'positive',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-premium-neon-green to-premium-neon-emerald'
    },
    {
      title: t('dashboard.stats.activeUsers'),
      value: '206,200',
      change: '+5.3%',
      changeType: 'positive',
      icon: <Users className="w-6 h-6" />,
      color: 'from-premium-neon-purple to-premium-neon-pink'
    },
    {
      title: t('dashboard.stats.totalStaked'),
      value: 'R$ 2.1M',
      change: '+8.7%',
      changeType: 'positive',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-premium-neon-orange to-premium-neon-red'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-black via-black to-premium-black">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-premium-neon-blue rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-premium-neon-green rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-premium-neon-purple rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-32 pb-8 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-orbitron font-bold bg-gradient-to-r from-premium-neon-blue to-premium-neon-green bg-clip-text text-transparent mb-4">
                Dashboard AGROTM
              </h1>
              <p className="text-xl text-gray-400 font-orbitron max-w-3xl mx-auto">
                Monitore seus investimentos agrícolas em tempo real com nossa interface futurista
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-4 sm:px-6 lg:px-8 mb-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  variants={itemVariants}
                  className="bg-premium-black/50 backdrop-blur-xl border border-premium-neon-blue/20 rounded-2xl p-6 shadow-2xl shadow-premium-neon-blue/10 hover:shadow-premium-neon-blue/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-black`}>
                      {stat.icon}
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${
                      stat.changeType === 'positive' ? 'text-premium-neon-green' : 'text-red-400'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight size={16} />
                      ) : (
                        <ArrowDownRight size={16} />
                      )}
                      <span className="font-orbitron font-medium">{stat.change}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-orbitron font-bold text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-400 font-orbitron text-sm">
                      {stat.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-4 sm:px-6 lg:px-8 mb-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Crypto Chart */}
              <motion.div variants={itemVariants}>
                <CryptoChart />
              </motion.div>

              {/* Staking Overview */}
              <motion.div
                variants={itemVariants}
                className="bg-premium-black/50 backdrop-blur-xl border border-premium-neon-blue/20 rounded-2xl p-6 shadow-2xl shadow-premium-neon-blue/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-orbitron font-bold text-white mb-1">
                      Pools de Staking
                    </h3>
                    <p className="text-gray-400 text-sm font-orbitron">
                      {t('stakingFarming.stakingPools.description')}
                    </p>
                  </div>
                  <Activity className="w-6 h-6 text-premium-neon-green" />
                </div>

                <div className="space-y-4">
                  {/* AGROTM Pool */}
                  <div className="bg-premium-black/30 rounded-xl p-4 border border-premium-neon-green/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-premium-neon-green rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-sm">🌾</span>
                        </div>
                        <div>
                          <h4 className="text-white font-orbitron font-bold">AGROTM Pool</h4>
                          <p className="text-gray-400 text-sm font-orbitron">Staking Principal</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-premium-neon-green font-orbitron font-bold text-lg">12.5%</p>
                        <p className="text-gray-400 text-xs font-orbitron">APY</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-orbitron">Total Staked</span>
                      <span className="text-white font-orbitron font-medium">R$ 3.2M</span>
                    </div>
                  </div>

                  {/* SOL Pool */}
                  <div className="bg-premium-black/30 rounded-xl p-4 border border-premium-neon-blue/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-premium-neon-blue rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-sm">◎</span>
                        </div>
                        <div>
                          <h4 className="text-white font-orbitron font-bold">SOL Pool</h4>
                          <p className="text-gray-400 text-sm font-orbitron">Liquidity Pool</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-premium-neon-blue font-orbitron font-bold text-lg">8.8%</p>
                        <p className="text-gray-400 text-xs font-orbitron">APY</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-orbitron">Total Staked</span>
                      <span className="text-white font-orbitron font-medium">R$ 1.8M</span>
                    </div>
                  </div>

                  {/* ETH Pool */}
                  <div className="bg-premium-black/30 rounded-xl p-4 border border-premium-neon-purple/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-premium-neon-purple rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-sm">Ξ</span>
                        </div>
                        <div>
                          <h4 className="text-white font-orbitron font-bold">ETH Pool</h4>
                          <p className="text-gray-400 text-sm font-orbitron">Yield Farming</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-premium-neon-purple font-orbitron font-bold text-lg">6.2%</p>
                        <p className="text-gray-400 text-xs font-orbitron">APY</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-orbitron">Total Staked</span>
                      <span className="text-white font-orbitron font-medium">R$ 500K</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-4 sm:px-6 lg:px-8 mb-12"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={itemVariants}
              className="bg-premium-black/50 backdrop-blur-xl border border-premium-neon-blue/20 rounded-2xl p-6 shadow-2xl shadow-premium-neon-blue/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-1">
                    Atividade Recente
                  </h3>
                  <p className="text-gray-400 text-sm font-orbitron">
                    Últimas transações e eventos
                  </p>
                </div>
                <Activity className="w-6 h-6 text-premium-neon-blue" />
              </div>

              <div className="space-y-4">
                {[
                  { type: 'stake', user: 'João Silva', amount: 'R$ 50,000', time: '2 min atrás', status: 'success' },
                  { type: 'unstake', user: 'Maria Santos', amount: 'R$ 25,000', time: '15 min atrás', status: 'success' },
                  { type: 'reward', user: 'Pedro Costa', amount: 'R$ 1,250', time: '1 hora atrás', status: 'success' },
                  { type: 'stake', user: 'Ana Oliveira', amount: 'R$ 75,000', time: '3 horas atrás', status: 'pending' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-premium-black/30 rounded-xl border border-premium-neon-blue/10">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.status === 'success' ? 'bg-premium-neon-green/20' : 'bg-premium-neon-orange/20'
                      }`}>
                        {activity.type === 'stake' && <Lock size={16} className="text-premium-neon-green" />}
                        {activity.type === 'unstake' && <Lock size={16} className="text-red-400" />}
                        {activity.type === 'reward' && <TrendingUp size={16} className="text-premium-neon-green" />}
                      </div>
                      <div>
                        <p className="text-white font-orbitron font-medium">
                          {activity.user}
                        </p>
                        <p className="text-gray-400 text-sm font-orbitron">
                          {activity.type === 'stake' ? 'Stake realizado' : 
                           activity.type === 'unstake' ? 'Unstake realizado' : 'Recompensa recebida'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-orbitron font-bold">{activity.amount}</p>
                      <p className="text-gray-400 text-sm font-orbitron">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
