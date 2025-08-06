'use client';

import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Activity, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export function Dashboard() {
  const { t } = useTranslation('common');

  const stats = [
    {
      title: 'Volume Total',
      value: '$2.5M',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Usuários Ativos',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Transações',
      value: '45.2K',
      change: '+15.3%',
      changeType: 'positive',
      icon: Activity,
    },
    {
      title: 'Taxa de Sucesso',
      value: '99.8%',
      change: '+0.2%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-20 bg-[#000000] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 scanlines opacity-10"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-6">
              Painel de <span className="text-[#00F0FF]">Análise</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed font-orbitron">
              Painel de análise em tempo real, com métricas avançadas para gestão inteligente do agronegócio.
            </p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Monitore em tempo real o desempenho dos seus investimentos agrícolas, acompanhe tendências de mercado e tome decisões baseadas em dados precisos e atualizados.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="cyberpunk-card p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="text-[#00FF7F] w-6 h-6" />
                    <div className={`flex items-center text-sm ${
                      stat.changeType === 'positive' ? 'text-[#00FF7F]' : 'text-red-400'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-2xl font-orbitron font-bold text-[#00F0FF] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-orbitron">
                    {stat.title}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <Image 
                src="/assets/images/dashboard/interactive-dashboard.jpg" 
                alt="Interactive Dashboard" 
                width={600} 
                height={400}
                className="rounded-3xl shadow-neon-green"
                unoptimized={true}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-[600px] h-[400px] bg-gradient-to-br from-[#00FF7F]/20 to-[#000000] border-2 border-[#00FF7F]/30 rounded-3xl flex items-center justify-center shadow-neon-green">
                <div className="text-center">
                  <BarChart3 className="text-[#00FF7F] mx-auto mb-4" size={64} />
                  <div className="text-[#00FF7F] font-orbitron text-2xl">Painel Interativo</div>
                  <div className="text-gray-300 text-lg">Análise em Tempo Real</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center cyberpunk-card p-8 backdrop-blur-sm"
          >
            <div className="bg-[#00FF7F]/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-neon-green">
              <BarChart3 className="text-[#00FF7F]" size={40} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-4">Métricas Avançadas</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Análise detalhada de performance com gráficos interativos e relatórios personalizados
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center cyberpunk-card p-8 backdrop-blur-sm"
          >
            <div className="bg-[#00FF7F]/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-neon-green">
              <Activity className="text-[#00FF7F]" size={40} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-4">Tempo Real</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Monitoramento contínuo com atualizações automáticas e alertas inteligentes
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center cyberpunk-card p-8 backdrop-blur-sm"
          >
            <div className="bg-[#00FF7F]/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-neon-green">
              <PieChart className="text-[#00FF7F]" size={40} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-4">Gestão Inteligente</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Ferramentas de gestão otimizadas para maximizar a eficiência operacional
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
