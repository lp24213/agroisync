'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Shield, Lock, Eye } from 'lucide-react';

export function SecuritySection() {
  return (
    <section className="py-20 bg-black-matte relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center lg:order-2"
          >
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 2 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Image 
                src="/assets/images/security/cyber-defense.png" 
                alt="AGROTM Cyber Defense" 
                width={600} 
                height={400}
                className="rounded-3xl shadow-neon-blue hover:scale-105 transition-transform duration-500"
                unoptimized={true}
                priority
              />
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:order-1"
          >
            <h2 className="font-orbitron text-4xl md:text-5xl text-[#00bfff] font-bold tracking-wide drop-shadow-neon mb-8 animate-fadeIn">
              Segurança Avançada
            </h2>
            <p className="text-xl text-[#00bfff] leading-relaxed mb-10">
              Segurança avançada e proteção blockchain com tecnologia de ponta para proteger seus ativos digitais.
            </p>
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center space-x-4"
              >
                <div className="w-4 h-4 bg-[#00bfff] rounded-full shadow-neon-blue"></div>
                <span className="text-[#00bfff] font-orbitron text-lg">Proteção Avançada</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center space-x-4"
              >
                <div className="w-4 h-4 bg-[#00bfff] rounded-full shadow-neon-blue"></div>
                <span className="text-[#00bfff] font-orbitron text-lg">Blockchain Seguro</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center space-x-4"
              >
                <div className="w-4 h-4 bg-[#00bfff] rounded-full shadow-neon-blue"></div>
                <span className="text-[#00bfff] font-orbitron text-lg">Monitoramento 24/7</span>
              </motion.div>
            </div>
            
            {/* Feature Icons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-12"
            >
              <div className="text-center">
                <div className="bg-[#00bfff]/20 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-neon-blue">
                  <Shield className="text-[#00bfff]" size={32} />
                </div>
                <div className="text-[#00bfff] font-orbitron text-sm">Proteção</div>
              </div>
              <div className="text-center">
                <div className="bg-[#00bfff]/20 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-neon-blue">
                  <Lock className="text-[#00bfff]" size={32} />
                </div>
                <div className="text-[#00bfff] font-orbitron text-sm">Segurança</div>
              </div>
              <div className="text-center">
                <div className="bg-[#00bfff]/20 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-neon-blue">
                  <Eye className="text-[#00bfff]" size={32} />
                </div>
                <div className="text-[#00bfff] font-orbitron text-sm">Monitoramento</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 