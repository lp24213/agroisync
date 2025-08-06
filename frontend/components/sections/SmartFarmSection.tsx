'use client';

import { motion } from "framer-motion";
import { Leaf, Cpu, Globe } from "lucide-react";
import { SmartFarm } from "../ui/SmartFarm";

export function SmartFarmSection() {
  return (
    <section className="py-20 bg-black-matte relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 scanlines opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-orbitron font-bold text-[#00F0FF] mb-4">
            Automação <span className="text-[#00FF7F]">Inteligente</span>
          </h2>
          <p className="text-xl text-[#00F0FF] max-w-2xl mx-auto">
            Automação e inteligência artificial aplicadas ao agronegócio moderno
          </p>
        </motion.div>

        {/* Smart Farm Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex justify-center mb-16"
        >
          <SmartFarm size="lg" className="drop-shadow-[0_0_30px_rgba(0,255,127,0.3)]" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="cyberpunk-card p-8 backdrop-blur-sm text-center"
          >
            <div className="bg-[#00FF7F]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-neon-green">
              <Leaf className="text-[#00FF7F]" size={32} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00F0FF] mb-4">Sustentável</h3>
            <p className="text-[#00F0FF] mb-6">Práticas agrícolas responsáveis</p>
            <div className="text-3xl font-orbitron font-bold text-[#00FF7F] mb-2">100%</div>
            <p className="text-[#00F0FF]">Verificado</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="cyberpunk-card p-8 backdrop-blur-sm text-center"
          >
            <div className="bg-[#00FF7F]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-neon-green">
              <Cpu className="text-[#00FF7F]" size={32} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00F0FF] mb-4">IoT</h3>
            <p className="text-[#00F0FF] mb-6">Sensores inteligentes avançados</p>
            <div className="text-3xl font-orbitron font-bold text-[#00FF7F] mb-2">24/7</div>
            <p className="text-[#00F0FF]">Monitoramento</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="cyberpunk-card p-8 backdrop-blur-sm text-center"
          >
            <div className="bg-[#00FF7F]/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-neon-green">
              <Globe className="text-[#00FF7F]" size={32} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-[#00F0FF] mb-4">Global</h3>
            <p className="text-[#00F0FF] mb-6">Acesso mundial integrado</p>
            <div className="text-3xl font-orbitron font-bold text-[#00FF7F] mb-2">150+</div>
            <p className="text-[#00F0FF]">Países</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 