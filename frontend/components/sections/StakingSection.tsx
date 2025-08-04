'use client';

import { motion } from "framer-motion";
import { Coins, TrendingUp, Lock } from "lucide-react";
import { StakingFarming } from "../ui/StakingFarming";

export function StakingSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Staking & Farming
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Ganhe recompensas fazendo stake dos seus tokens AGROTM
          </p>
        </motion.div>

        {/* Staking/Farming Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex justify-center mb-16"
        >
          <StakingFarming size="lg" className="drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Coins className="text-green-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Staking Simples</h3>
            <p className="text-gray-400 mb-6">Stake seus tokens e ganhe recompensas</p>
            <div className="text-3xl font-bold text-green-400 mb-2">18.5%</div>
            <p className="text-gray-400">APR Anual</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="text-blue-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Liquidity Farming</h3>
            <p className="text-gray-400 mb-6">Forneça liquidez e ganhe mais</p>
            <div className="text-3xl font-bold text-blue-400 mb-2">25.2%</div>
            <p className="text-gray-400">APR Anual</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="text-purple-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Staking Locked</h3>
            <p className="text-gray-400 mb-6">Stake por mais tempo, ganhe mais</p>
            <div className="text-3xl font-bold text-purple-400 mb-2">32.8%</div>
            <p className="text-gray-400">APR Anual</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 