'use client';

import { motion } from "framer-motion";
import { Leaf, Cpu, Globe } from "lucide-react";

export function SmartFarmSection() {
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
            Smart Farming
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Agricultura inteligente com IoT e blockchain
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Leaf className="text-green-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Sustentável</h3>
            <p className="text-gray-400 mb-6">Agricultura eco-friendly</p>
            <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
            <p className="text-gray-400">Verificado</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Cpu className="text-blue-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">IoT</h3>
            <p className="text-gray-400 mb-6">Sensores inteligentes</p>
            <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
            <p className="text-gray-400">Monitoramento</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center"
          >
            <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Globe className="text-purple-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Global</h3>
            <p className="text-gray-400 mb-6">Acesso mundial</p>
            <div className="text-3xl font-bold text-purple-400 mb-2">150+</div>
            <p className="text-gray-400">Países</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 