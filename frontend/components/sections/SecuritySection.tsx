'use client';

import { motion } from "framer-motion";
import { Shield, Lock, Eye, CheckCircle } from "lucide-react";

export function SecuritySection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Segurança Máxima
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Smart contracts auditados e infraestrutura segura
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Auditado</h3>
            <p className="text-gray-400">Smart contracts verificados</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Criptografado</h3>
            <p className="text-gray-400">Dados protegidos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Eye className="text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Transparente</h3>
            <p className="text-gray-400">Código aberto</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Verificado</h3>
            <p className="text-gray-400">Testado e aprovado</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 