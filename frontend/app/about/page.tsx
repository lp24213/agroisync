'use client';

import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Globe, Shield, Leaf, Zap, Target, Eye, Heart, Award, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function AboutPage() {
  const { t } = useTranslation('common');

  const values = [
    {
      icon: Shield,
      title: 'Transparência',
      description: 'Todas as operações são transparentes e auditáveis, garantindo confiança total em nossas transações.',
      color: 'text-[#00FF7F]'
    },
    {
      icon: Zap,
      title: 'Inovação',
      description: 'Sempre na vanguarda da tecnologia, desenvolvendo soluções inovadoras para o agronegócio.',
      color: 'text-[#00FF7F]'
    },
    {
      icon: Globe,
      title: 'Sustentabilidade',
      description: 'Comprometidos com práticas agrícolas sustentáveis e responsabilidade ambiental.',
      color: 'text-[#00FF7F]'
    },
    {
      icon: Heart,
      title: 'Confiança',
      description: 'Construindo relacionamentos duradouros baseados em confiança e resultados.',
      color: 'text-[#00FF7F]'
    }
  ];

  const impact = [
    {
      icon: TrendingUp,
      title: 'Crescimento Exponencial',
      value: '300%',
      description: 'Crescimento anual em volume de transações'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      value: '50K+',
      description: 'Usuários ativos na plataforma'
    },
    {
      icon: Globe,
      title: 'Alcance Global',
      value: '25+',
      description: 'Países atendidos'
    },
    {
      icon: Award,
      title: 'Reconhecimento',
      value: '15+',
      description: 'Prêmios e certificações'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] text-[#00F0FF] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-animation"></div>
        </div>
        
        {/* Scanlines Effect */}
        <div className="absolute inset-0 scanlines opacity-10"></div>

      {/* Hero Section */}
        <section className="pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
              <h1 className="text-5xl md:text-7xl font-orbitron font-bold gradient-text mb-6">
                Sobre a <span className="text-[#00F0FF]">AGROTM SOL</span>
            </h1>
              <p className="text-xl md:text-2xl text-[#00F0FF] max-w-4xl mx-auto leading-relaxed font-orbitron">
                Conectando o agronegócio ao futuro digital, com soluções seguras, escaláveis e transparentes
            </p>
          </motion.div>
        </div>
      </section>

        {/* Sobre Nós */}
        <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-8">
                  Sobre <span className="text-[#00F0FF]">Nós</span>
              </h2>
                <p className="text-lg text-[#00F0FF] leading-relaxed mb-6">
                  A AGROTM SOL é uma plataforma pertencente à startup AGROTM, especializada na intermediação de produtos do agronegócio. Conectamos produtores, investidores e compradores por meio de tecnologia avançada, garantindo segurança, rastreabilidade e eficiência em cada negociação.
              </p>
                <p className="text-lg text-[#00F0FF] leading-relaxed mb-8">
                  Nossa missão é modernizar e democratizar o acesso ao mercado agrícola através de tecnologia avançada e inovação sustentável, criando um ecossistema financeiro inovador que impulsiona o crescimento do setor agrícola.
              </p>
              <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-[#00F0FF] font-orbitron">Tecnologia avançada</span>
                </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-[#00F0FF] font-orbitron">Segurança e rastreabilidade</span>
                </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-[#00F0FF] font-orbitron">Eficiência nas negociações</span>
                </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#00FF7F] rounded-full shadow-neon-green"></div>
                    <span className="text-[#00F0FF] font-orbitron">Conexão global</span>
                </div>
              </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <Image 
                    src="/assets/images/about/agrotm-platform.jpg" 
                    alt="AGROTM SOL Platform" 
                    width={500} 
                    height={400}
                    className="rounded-3xl shadow-neon-green"
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-[500px] h-[400px] bg-gradient-to-br from-[#00FF7F]/20 to-[#000000] border-2 border-[#00FF7F]/30 rounded-3xl flex items-center justify-center shadow-neon-green">
                    <div className="text-center">
                      <Target className="text-[#00FF7F] mx-auto mb-4" size={64} />
                      <div className="text-[#00F0FF] font-orbitron text-2xl">AGROTM SOL</div>
                      <div className="text-[#00F0FF] text-lg">Plataforma de Intermediação</div>
                    </div>
                  </div>
                </div>
            </motion.div>
          </div>
        </div>
      </section>

        {/* Nossos Valores */}
        <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
                Nossos <span className="text-[#00F0FF]">Valores</span>
            </h2>
              <p className="text-xl text-[#00F0FF] max-w-3xl mx-auto font-orbitron">
                Construindo o futuro do agronegócio com princípios sólidos e inovação responsável
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                  <div className="cyberpunk-card text-center p-8 backdrop-blur-sm">
                    <value.icon className={`w-16 h-16 mx-auto mb-6 ${value.color}`} />
                    <h3 className="text-2xl font-orbitron font-bold text-[#00FF7F] mb-4">{value.title}</h3>
                    <p className="text-[#00F0FF] leading-relaxed">{value.description}</p>
                  </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* Impacto Tecnológico */}
        <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
                Impacto <span className="text-[#00F0FF]">Tecnológico</span>
            </h2>
              <p className="text-xl text-[#00F0FF] max-w-3xl mx-auto font-orbitron">
                Transformando o agronegócio através da inovação e tecnologia
            </p>
          </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impact.map((item, index) => (
            <motion.div
                  key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="cyberpunk-card text-center p-8 backdrop-blur-sm">
                    <item.icon className="w-16 h-16 mx-auto mb-6 text-[#00FF7F]" />
                    <div className="text-4xl font-orbitron font-bold text-[#00FF7F] mb-2">{item.value}</div>
                    <h3 className="text-xl font-orbitron font-bold text-[#00F0FF] mb-2">{item.title}</h3>
                    <p className="text-[#00F0FF]">{item.description}</p>
                  </div>
          </motion.div>
              ))}
            </div>
        </div>
      </section>
      </div>
    </Layout>
  );
} 