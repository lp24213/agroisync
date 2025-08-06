'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Lock, Shield, Zap, Coins, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export function Staking() {
  const { t } = useTranslation('common');

  const features = [
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Protocolos avançados de proteção para dados e investimentos agrícolas.',
    },
    {
      icon: TrendingUp,
      title: 'Rentabilidade Otimizada',
      description: 'Rentabilize seus ativos agrícolas com segurança e transparência.',
    },
    {
      icon: Lock,
      title: 'Transparência Total',
      description: 'Todas as operações são auditáveis e transparentes em tempo real',
    },
  ];

  const stats = [
    { label: 'APY Médio', value: '12.5%' },
    { label: 'Total Staked', value: '$15.2M' },
    { label: 'Usuários Ativos', value: '2,847' },
    { label: 'Tempo de Bloqueio', value: 'Flexível' },
  ];

  return (
    <section className="py-20 bg-black-matte relative overflow-hidden">
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
              Renda Passiva com <span className="text-[#00F0FF]">Ativos Digitais</span>
            </h2>
            <p className="text-xl text-[#00F0FF] mb-8 leading-relaxed font-orbitron">
              Rentabilize seus ativos agrícolas com segurança e transparência.
            </p>
            <p className="text-lg text-[#00F0FF] mb-8 leading-relaxed">
              Nossa plataforma oferece oportunidades de investimento seguras e lucrativas, permitindo que você ganhe rendimentos passivos enquanto contribui para o desenvolvimento do setor agrícola.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-[#00FF7F]/20 p-3 rounded-full flex-shrink-0">
                    <feature.icon className="text-[#00FF7F] w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-orbitron font-bold text-[#00FF7F] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[#00F0FF] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4 rounded-xl font-orbitron font-bold flex items-center gap-3"
            >
              Começar a Rentabilizar
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>

          {/* Staking Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <Image 
                src="/assets/images/staking/staking-farming.jpg" 
                alt="Staking Farming" 
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
                  <Coins className="text-[#00FF7F] mx-auto mb-4" size={64} />
                  <div className="text-[#00F0FF] font-orbitron text-2xl">Rentabilização</div>
                  <div className="text-[#00F0FF] text-lg">Ativos Agrícolas</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center cyberpunk-card p-6 backdrop-blur-sm"
            >
              <div className="text-3xl font-orbitron font-bold text-[#00FF7F] mb-2">
                {stat.value}
              </div>
              <div className="text-[#00F0FF] font-orbitron">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Benefits */}
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
              <Zap className="text-[#00FF7F]" size={40} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-4">Automação Inteligente</h3>
            <p className="text-[#00F0FF] text-lg leading-relaxed">
              Processos automatizados que otimizam seus investimentos sem intervenção manual
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center cyberpunk-card p-8 backdrop-blur-sm"
          >
            <div className="bg-[#00FF7F]/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-neon-green">
              <Shield className="text-[#00FF7F]" size={40} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-4">Proteção Garantida</h3>
            <p className="text-[#00F0FF] text-lg leading-relaxed">
              Múltiplas camadas de segurança para proteger seus ativos e transações
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-center cyberpunk-card p-8 backdrop-blur-sm"
          >
            <div className="bg-[#00FF7F]/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-neon-green">
              <TrendingUp className="text-[#00FF7F]" size={40} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-4">Crescimento Sustentável</h3>
            <p className="text-[#00F0FF] text-lg leading-relaxed">
              Estratégias de investimento focadas em crescimento consistente e responsável
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
