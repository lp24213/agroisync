'use client';

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Coins } from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation('common');
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#000000]">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 flex justify-center">
            <Logo size="lg" iconOnly={true} />
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-orbitron text-4xl md:text-6xl lg:text-7xl text-[#00FF7F] font-bold tracking-wide drop-shadow-neon mb-8 animate-fadeIn"
          >
            O Futuro do Agronegócio na Blockchain
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-orbitron"
          >
            Staking, NFTs e Smart Farms com tecnologia Web3 avançada.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 255, 127, 0.8)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#00FF7F] text-black px-8 py-4 rounded-xl font-orbitron font-bold flex items-center justify-center gap-2 shadow-neon hover:scale-105 transition-all"
            >
              Começar Agora
              <ArrowRight size={20} />
            </motion.button>
            <Link href="/documentation">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 255, 127, 0.8)" }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-[#00FF7F] text-[#00FF7F] hover:bg-[#00FF7F] hover:text-black px-8 py-4 rounded-xl font-orbitron font-bold transition-all duration-300 shadow-neon"
              >
                Ver Documentação
              </motion.button>
            </Link>
          </motion.div>

          {/* Imagem do Fazendeiro Premium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Image 
                src="/assets/images/hero/farmer-tech-character.png" 
                alt="Premium Farmer Tech Character" 
                width={300} 
                height={300}
                className="drop-shadow-[0_0_30px_rgba(0,255,127,0.6)] rounded-2xl"
                unoptimized={true}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('farmer-tech-character.png')) {
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }
                }}
              />
              <div className="w-[300px] h-[300px] bg-gradient-to-br from-[#00FF7F]/20 to-[#00FF7F]/5 border-2 border-[#00FF7F]/30 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌾</div>
                  <div className="text-[#00FF7F] font-orbitron text-xl">AGROTM</div>
                  <div className="text-gray-300 text-sm">Premium Farming</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-center bg-black/70 border border-[#00FF7F] p-6 rounded-2xl hover:shadow-neon"
            >
              <div className="bg-[#00FF7F]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="text-[#00FF7F]" size={32} />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F] mb-2">Staking Premium</h3>
              <p className="text-gray-300">Ganhe recompensas através de staking DeFi e yield farming</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-center bg-black/70 border border-[#00FF7F] p-6 rounded-2xl hover:shadow-neon"
            >
              <div className="bg-[#00FF7F]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="text-[#00FF7F]" size={32} />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F] mb-2">Segurança Avançada</h3>
              <p className="text-gray-300">Segurança avançada e proteção blockchain</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-center bg-black/70 border border-[#00FF7F] p-6 rounded-2xl hover:shadow-neon"
            >
              <div className="bg-[#00FF7F]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Coins className="text-[#00FF7F]" size={32} />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-[#00FF7F] mb-2">NFTs Agrícolas</h3>
              <p className="text-gray-300">Crie e negocie ativos digitais agrícolas</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}