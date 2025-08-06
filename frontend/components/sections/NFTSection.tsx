'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, Shield, Target } from 'lucide-react';

const NFTSection: React.FC = () => {
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
            Tokenização <span className="text-[#00bfff]">Agrícola</span>
          </h2>
          <p className="text-lg text-[#00bfff] max-w-3xl mx-auto">
            Tokenização real de produtos agrícolas com rastreabilidade confiável e segurança garantida.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Imagem NFT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/images/nft/nft-minting.jpg"
                alt="NFT Minting - Tokenização Agrícola"
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
                  <Eye className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Rastreabilidade Total</h3>
                  <p className="text-base text-[#00bfff]">Acompanhe a origem e trajetória de cada produto agrícola.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                  <Shield className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Segurança Avançada</h3>
                  <p className="text-base text-[#00bfff]">Proteção blockchain para garantir autenticidade e integridade.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00bfff]/20 rounded-lg flex items-center justify-center shadow-neon-blue">
                  <Target className="w-6 h-6 text-[#00bfff]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#00bfff] mb-2">Transparência Garantida</h3>
                  <p className="text-base text-[#00bfff]">Informações públicas e verificáveis sobre cada token.</p>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00bfff] mb-2">10K+</div>
                <div className="text-sm text-[#00bfff]">NFTs Criados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00bfff] mb-2">100%</div>
                <div className="text-sm text-[#00bfff]">Verificados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00bfff] mb-2">24/7</div>
                <div className="text-sm text-[#00bfff]">Disponível</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NFTSection; 