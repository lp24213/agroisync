'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Zap, Shield, Leaf } from 'lucide-react';

const SmartFarmSection: React.FC = () => {
  return (
    <section className="bg-black-matte py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      <div className="absolute inset-0 scanlines opacity-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Automação <span className="text-[#00bfff]">Inteligente</span>
          </h2>
          <p className="text-lg text-[#00bfff] max-w-3xl mx-auto">
            Automação e inteligência artificial aplicadas ao agronegócio moderno.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Imagem Smart Farm */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/images/farm/smart-farm-futuristic.jpg"
                alt="Smart Farm Futurista - Automação Inteligente"
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
            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                  <Zap className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Automação Completa</h3>
                  <p className="text-base text-[#00bfff]">Sistemas inteligentes que otimizam todos os processos agrícolas.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                  <Shield className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Monitoramento 24/7</h3>
                  <p className="text-base text-[#00bfff]">Controle contínuo de todos os parâmetros da fazenda.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                  <Leaf className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Sustentabilidade</h3>
                  <p className="text-base text-[#00bfff]">Práticas agrícolas responsáveis e eficientes.</p>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00bfff] mb-2">100%</div>
                <div className="text-sm text-[#00bfff]">Verificado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00bfff] mb-2">24/7</div>
                <div className="text-sm text-[#00bfff]">Monitoramento</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00bfff] mb-2">150+</div>
                <div className="text-sm text-[#00bfff]">Países</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SmartFarmSection; 