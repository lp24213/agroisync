'use client';

import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Globe, Shield, Leaf, Zap } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useTranslation } from 'react-i18next';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AboutPage() {
  const { t } = useTranslation('common');

  // Dados fictícios para gráficos
  const growthData = {
    labels: ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2'],
    datasets: [
      {
        label: 'Volume de Negociações (Milhões USD)',
        data: [2.5, 4.2, 6.8, 12.5, 18.3, 25.7],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const userData = {
    labels: ['Produtores', 'Compradores', 'Traders', 'Investidores'],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#1f2937',
      },
    ],
  };

  const volumeData = {
    labels: ['Soja', 'Milho', 'Café', 'Açúcar', 'Algodão', 'Outros'],
    datasets: [
      {
        label: 'Volume Projetado (Milhões USD)',
        data: [85, 65, 45, 35, 25, 40],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
      },
    ],
  };

  const stats = [
    {
      icon: TrendingUp,
      value: 'R$ 2.5B',
      label: 'Volume Projetado 2024',
      color: 'text-green-400',
    },
    {
      icon: Users,
      value: '25K+',
      label: 'Produtores Conectados',
      color: 'text-blue-400',
    },
    {
      icon: Globe,
      value: '150+',
      label: 'Países Alcançados',
      color: 'text-purple-400',
    },
    {
      icon: Shield,
      value: '99.9%',
      label: 'Uptime da Plataforma',
      color: 'text-orange-400',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-green-900 via-black to-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Sobre a <span className="text-green-400">AGROTM</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Revolucionando o agronegócio através da tecnologia blockchain e DeFi
            </p>
          </motion.div>
        </div>
      </section>

      {/* Missão e Visão */}
      <section className="py-20 bg-agro-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Nossa <span className="text-green-400">Missão</span>
              </h2>
              <p className="text-lg text-gray-400 mb-6">
                A AGROTM é uma startup de tecnologia especializada em intermediação digital de produtos agro e soluções blockchain. 
                Nossa missão é modernizar o agronegócio com DeFi, Web3 e inteligência artificial para impulsionar a produção e o comércio global.
              </p>
              <p className="text-lg text-gray-400 mb-6">
                Lançamos a criptomoeda AGROTM, destinada a investimentos e transações seguras entre produtores, compradores e traders do agro, 
                criando um ecossistema financeiro descentralizado e transparente.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Transparência total nas transações</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Inovação tecnológica constante</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Descentralização financeira</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-300">Sustentabilidade ambiental</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="text-center p-6 bg-agro-darker/80 border border-green-500/20">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Nossos <span className="text-green-400">Valores</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Construindo o futuro do agronegócio com princípios sólidos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Transparência',
                description: 'Todas as transações são públicas e verificáveis na blockchain',
                color: 'text-green-400',
              },
              {
                icon: Zap,
                title: 'Inovação',
                description: 'Sempre na vanguarda da tecnologia para o agronegócio',
                color: 'text-blue-400',
              },
              {
                icon: Globe,
                title: 'Descentralização',
                description: 'Eliminando intermediários desnecessários do processo',
                color: 'text-purple-400',
              },
              {
                icon: Leaf,
                title: 'Sustentabilidade',
                description: 'Promovendo práticas agrícolas sustentáveis e responsáveis',
                color: 'text-orange-400',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="text-center p-6 bg-agro-darker/80 border border-green-500/20 hover:border-green-400/40 transition-colors">
                  <value.icon className={`w-12 h-12 mx-auto mb-4 ${value.color}`} />
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gráficos e Estatísticas */}
      <section className="py-20 bg-agro-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Crescimento do <span className="text-green-400">Agronegócio Digital</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Dados e projeções que mostram o potencial do mercado
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-6 bg-agro-darker/80 border border-green-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Volume de Negociações</h3>
                <Line data={growthData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: { color: '#9ca3af' }
                    }
                  },
                  scales: {
                    x: { ticks: { color: '#9ca3af' } },
                    y: { ticks: { color: '#9ca3af' } }
                  }
                }} />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-6 bg-agro-darker/80 border border-green-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Distribuição de Usuários</h3>
                <Doughnut data={userData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: { color: '#9ca3af' }
                    }
                  }
                }} />
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-6 bg-agro-darker/80 border border-green-500/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Volume Projetado por Produto</h3>
              <Bar data={volumeData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: { color: '#9ca3af' }
                  }
                },
                scales: {
                  x: { ticks: { color: '#9ca3af' } },
                  y: { ticks: { color: '#9ca3af' } }
                }
              }} />
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
} 