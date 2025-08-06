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
            className="font-orbitron text-4xl md:text-6xl lg:text-7xl text-[#00F0FF] mb-8 animate-fadeIn"
          >
            AGROTM
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-[#cccccc] mb-8 max-w-3xl mx-auto font-orbitron"
          >
            🌱 Agricultura Tokenizada do Futuro
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.8)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#00F0FF] hover:bg-[#00d4e0] text-black px-8 py-4 rounded-xl font-orbitron font-semibold flex items-center justify-center gap-2 shadow-neon transition-all duration-300"
            >
              Acessar Dashboard
              <ArrowRight size={20} />
            </motion.button>
            <Link href="/documentation">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.8)" }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black px-8 py-4 rounded-xl font-orbitron font-semibold transition-all duration-300 shadow-neon"
              >
                Documentação
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
                src="/assets/hero.png" 
                alt="Premium Farmer Tech Character" 
                width={300} 
                height={300}
                className="drop-shadow-[0_0_30px_rgba(0,240,255,0.6)] rounded-2xl"
                unoptimized={true}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('hero.png')) {
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }
                }}
              />
              <div className="w-[300px] h-[300px] bg-gradient-to-br from-[#00F0FF]/20 to-[#00F0FF]/5 border-2 border-[#00F0FF]/30 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌾</div>
                  <div className="text-[#00F0FF] font-orbitron text-xl">AGROTM</div>
                  <div className="text-[#cccccc] text-sm">Premium Farming</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-center bg-black/70 border border-[#00F0FF] p-6 rounded-2xl hover:shadow-neon"
            >
              <div className="bg-[#00F0FF]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="text-[#00F0FF]" size={32} />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-[#00F0FF] mb-2">Staking Premium</h3>
              <p className="text-[#cccccc]">Ganhe recompensas através de staking DeFi e yield farming</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-center bg-black/70 border border-[#00F0FF] p-6 rounded-2xl hover:shadow-neon"
            >
              <div className="bg-[#00F0FF]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="text-[#00F0FF]" size={32} />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-[#00F0FF] mb-2">Segurança Avançada</h3>
              <p className="text-[#cccccc]">Segurança avançada e proteção blockchain</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-center bg-black/70 border border-[#00F0FF] p-6 rounded-2xl hover:shadow-neon"
            >
              <div className="bg-[#00F0FF]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Coins className="text-[#00F0FF]" size={32} />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-[#00F0FF] mb-2">NFTs Agrícolas</h3>
              <p className="text-[#cccccc]">Crie e negocie ativos digitais agrícolas</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}