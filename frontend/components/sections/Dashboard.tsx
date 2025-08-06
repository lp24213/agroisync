'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BarChart3, TrendingUp, Activity, PieChart } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <section className="bg-black-matte py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Monitoramento <span className="text-[#00bfff]">Inteligente</span>
          </h2>
          <p className="text-lg text-[#00bfff] max-w-3xl mx-auto">
            Dashboard interativo com dados em tempo real para monitoramento completo do agronegócio.
          </p>
          <p className="text-base text-[#00bfff] max-w-2xl mx-auto mt-4">
            Visualize métricas, tendências e insights para tomada de decisões estratégicas.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Imagem do Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/images/dashboard/interactive-dashboard.jpg"
                alt="Dashboard Interativo - Monitoramento Inteligente"
                fill
                className="object-cover"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </motion.div>

          {/* Conteúdo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00bfff] mb-2">150+</div>
                <div className="text-sm text-[#00bfff]">Métricas Monitoradas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00bfff] mb-2">24/7</div>
                <div className="text-sm text-[#00bfff]">Monitoramento</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                  <BarChart3 className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Análise em Tempo Real</h3>
                  <p className="text-base text-[#00bfff]">Dados atualizados constantemente para insights precisos.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                  <TrendingUp className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Tendências e Previsões</h3>
                  <p className="text-base text-[#00bfff]">Identificação de padrões e projeções futuras.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                  <Activity className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Alertas Inteligentes</h3>
                  <p className="text-base text-[#00bfff]">Notificações automáticas para eventos importantes.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
