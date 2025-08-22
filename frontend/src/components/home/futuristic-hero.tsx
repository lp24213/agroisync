'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Zap, Globe, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function FuturisticHero() {
  const features = [
    {
      icon: Shield,
      title: 'Segurança Blockchain',
      description: 'Transações seguras e transparentes'
    },
    {
      icon: Zap,
      title: 'Tempo Real',
      description: 'Dados atualizados instantaneamente'
    },
    {
      icon: Globe,
      title: 'Global',
      description: 'Conectando produtores mundiais'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Avançado',
      description: 'Insights para maximizar lucros'
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border border-cyan-400/20 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 border border-blue-500/20 rounded-lg"
          animate={{
            rotate: -360,
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-20 h-20 border border-purple-500/20 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              AgroSync
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            O futuro da agricultura digital está aqui. 
            <span className="text-cyan-400 font-semibold"> Blockchain</span>, 
            <span className="text-blue-400 font-semibold"> IA</span> e 
            <span className="text-purple-400 font-semibold"> conectividade global</span> 
            para revolucionar o agronegócio.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <motion.button
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-bold rounded-xl text-lg hover:from-cyan-500 hover:to-blue-700 transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(34, 211, 238, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/store" className="flex items-center space-x-2">
              <span>Começar Agora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.button>

          <motion.button
            className="group px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-bold rounded-xl text-lg hover:bg-cyan-400 hover:text-black transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 25px rgba(34, 211, 238, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/about" className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Saiba Mais</span>
            </Link>
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-cyan-400/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px rgba(34, 211, 238, 0.1)"
              }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {[
            { number: '10K+', label: 'Produtores Ativos' },
            { number: '50+', label: 'Países Conectados' },
            { number: '99.9%', label: 'Uptime Garantido' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-lg">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
