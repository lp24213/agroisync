'use client';

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export function PremiumAnalytics() {
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
            Analytics Premium
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Monitore seus investimentos agrícolas com dados em tempo real
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="text-green-400" size={24} />
              <span className="text-green-400 text-sm font-semibold">+12.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">$2.5M</h3>
            <p className="text-gray-400">Total Value Locked</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-blue-400" size={24} />
              <span className="text-blue-400 text-sm font-semibold">+8.3%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">18.5%</h3>
            <p className="text-gray-400">APR Médio</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="text-purple-400" size={24} />
              <span className="text-purple-400 text-sm font-semibold">+15.2%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">25K</h3>
            <p className="text-gray-400">Usuários Ativos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-yellow-400" size={24} />
              <span className="text-yellow-400 text-sm font-semibold">+22.1%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">$450K</h3>
            <p className="text-gray-400">Rewards Distribuídos</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
