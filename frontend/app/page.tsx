'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import Hero from '../components/sections/Hero';

export default function HomePage() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Hero />
        
        {/* Adicione outras seções aqui */}
        <motion.section
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-20 bg-premium-dark"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-premium-neon-blue mb-8">
                O Futuro da Agricultura
              </h2>
              <p className="text-xl text-premium-light/80 max-w-3xl mx-auto">
                Conectando agricultores e investidores através da tecnologia blockchain mais avançada do mundo.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </Layout>
  );
}
