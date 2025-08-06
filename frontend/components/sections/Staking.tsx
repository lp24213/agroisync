'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Coins, Shield, TrendingUp } from 'lucide-react';

const Staking: React.FC = () => {
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
            Renda Passiva com <span className="text-[#00bfff]">Ativos Digitais</span>
          </h2>
          <p className="text-lg text-[#00bfff] max-w-3xl mx-auto">
            Rentabilize seus ativos agrícolas com segurança e transparência.
          </p>
          <p className="text-base text-[#00bfff] max-w-2xl mx-auto mt-4">
            Protocolos avançados de proteção para dados e investimentos agrícolas.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00bfff] mb-2">12.5%</div>
                <div className="text-sm text-[#00bfff]">APY Médio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00bfff] mb-2">$1.2M</div>
                <div className="text-sm text-[#00bfff]">Total Staked</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                  <Shield className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Segurança Avançada</h3>
                  <p className="text-base text-[#00bfff]">Protocolos avançados de proteção para dados e investimentos agrícolas.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                  <TrendingUp className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Rentabilidade Otimizada</h3>
                  <p className="text-base text-[#00bfff]">Rentabilize seus ativos agrícolas com segurança e transparência.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                  <Coins className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Transparência Total</h3>
                  <p className="text-base text-[#00bfff]">Acompanhe todos os seus investimentos em tempo real.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Imagem do Staking */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/assets/images/staking/staking-farming.png"
                alt="Staking & Farming - Renda Passiva com Ativos Digitais"
                fill
                className="object-cover"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Staking;
