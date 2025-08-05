'use client';

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Coins } from "lucide-react";
import { PremiumFarmerIcon } from "../ui/PremiumFarmerIcon";
import { Logo } from "../ui/Logo";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-black to-green-800">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 flex justify-center">
            <Logo size="lg" iconOnly={true} />
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            🚀 A maior plataforma Web3 para o agronegócio mundial - VERSÃO 2.2.3 ATUALIZADA! 
            Staking, NFTs agrícolas e governança descentralizada na Solana com performance otimizada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              Começar Agora
              <ArrowRight size={20} />
            </motion.button>
            <Link href="/documentation">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Documentação
              </motion.button>
            </Link>
          </div>

          {/* Ícone do Fazendeiro Premium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <PremiumFarmerIcon size="lg" className="drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Staking Premium</h3>
              <p className="text-gray-400">Earn rewards by staking your AGROTM tokens with enhanced security</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Segurança Avançada</h3>
              <p className="text-gray-400">Audited smart contracts with advanced security protocols</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Coins className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">NFTs Agrícolas</h3>
              <p className="text-gray-400">Mint and trade agricultural NFTs with real-world value</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}