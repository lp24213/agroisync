'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function About() {
  const { t } = useTranslation('common');
  return (
    <section id="about" className="py-20 bg-agro-darker relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/3 left-1/5 w-32 h-32 rounded-full bg-agro-blue/20 blur-xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/5 w-40 h-40 rounded-full bg-agro-green/20 blur-xl"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut" 
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6 text-glow">
              {t('aboutTitle')} <span className="text-agro-green">AGROTM</span>
            </h2>
            <p className="text-lg text-gray-400 mb-6">
              {t('aboutDescription')}
            </p>
            <p className="text-lg text-gray-400 mb-6">
              {t('mission')}
            </p>
            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                className="relative cyberpunk-stat p-4 border border-agro-green/30 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-agro-green"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-agro-green"></div>
                <motion.h3 
                  className="text-2xl font-bold text-agro-green mb-2 text-glow-green"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  25K+
                </motion.h3>
                <p className="text-gray-400">{t('activeUsers')}</p>
              </motion.div>
              <motion.div 
                className="relative cyberpunk-stat p-4 border border-agro-blue/30 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-agro-blue"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-agro-blue"></div>
                <motion.h3 
                  className="text-2xl font-bold text-agro-blue mb-2 text-glow-blue"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  $12.5M
                </motion.h3>
                <p className="text-gray-400">{t('totalValueLocked')}</p>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="bg-agro-darker/80 border border-agro-green/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
                <div className="absolute inset-0 bg-gradient-to-r from-agro-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-agro-green to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-agro-green to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                <div className="text-center relative z-10 p-6">
                  <motion.div 
                    className="text-3xl mb-3 inline-block"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  >
                    <span className="text-glow-green">🌱</span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('sustainability')}</h3>
                  <p className="text-gray-400">
                    {t('sustainabilityDesc')}
                  </p>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="bg-agro-darker/80 border border-agro-blue/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
                <div className="absolute inset-0 bg-gradient-to-r from-agro-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                <div className="text-center relative z-10 p-6">
                  <motion.div 
                    className="text-3xl mb-3 inline-block"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  >
                    <span className="text-glow-blue">🔒</span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('security')}</h3>
                  <p className="text-gray-400">
                    {t('securityDesc')}
                  </p>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="bg-agro-darker/80 border border-agro-purple/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
                <div className="absolute inset-0 bg-gradient-to-r from-agro-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-agro-purple to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-agro-purple to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                <div className="text-center relative z-10 p-6">
                  <motion.div 
                    className="text-3xl mb-3 inline-block"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  >
                    <span className="text-glow-purple">📈</span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('growth')}</h3>
                  <p className="text-gray-400">
                    {t('growthDesc')}
                  </p>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card className="bg-agro-darker/80 border border-agro-neon/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
                <div className="absolute inset-0 bg-gradient-to-r from-agro-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-agro-neon to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-agro-neon to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                <div className="text-center relative z-10 p-6">
                  <motion.div 
                    className="text-3xl mb-3 inline-block"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  >
                    <span className="text-glow">🌍</span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('impact')}</h3>
                  <p className="text-gray-400">
                    {t('impactDesc')}
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}