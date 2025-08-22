'use client';

import { motion } from 'framer-motion';
import { Globe, Users, Target, Award } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Users, number: '10K+', label: 'Usuários Ativos' },
    { icon: Globe, number: '50+', label: 'Países' },
    { icon: Target, number: '99.9%', label: 'Uptime' },
    { icon: Award, number: '15+', label: 'Prêmios' }
  ];

  const values = [
    {
      title: 'Inovação',
      description: 'Sempre na vanguarda da tecnologia agrícola',
      icon: '🚀'
    },
    {
      title: 'Sustentabilidade',
      description: 'Compromisso com o futuro do planeta',
      icon: '🌱'
    },
    {
      title: 'Transparência',
      description: 'Blockchain para confiança total',
      icon: '🔍'
    },
    {
      title: 'Comunidade',
      description: 'Conectando produtores globais',
      icon: '🤝'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Sobre o <span className="text-gradient">AgroSync</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Somos uma plataforma revolucionária que combina blockchain, inteligência artificial 
            e conectividade global para transformar o agronegócio. Nossa missão é democratizar 
            o acesso à tecnologia agrícola de ponta.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-400/50 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 border border-cyan-400/30 rounded-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">Nossa Missão</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Transformar a agricultura global através da tecnologia, conectando produtores, 
              facilitando o acesso a insumos de qualidade e criando um ecossistema sustentável 
              para o futuro da alimentação mundial.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
