'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '../ui/Card';
import { useTranslation } from 'react-i18next';

export function DashboardSection() {
  const { t } = useTranslation('common');

  return (
    <section className="py-20 bg-agro-darker relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6 text-glow">
              {t('interactiveDashboard')} <span className="text-agro-blue">AGROTM</span>
            </h2>
            <p className="text-lg text-gray-400 mb-6">
              {t('dashboardDescription')}
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-agro-blue rounded-full"></div>
                <span className="text-gray-300">{t('realTimeAnalytics')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-agro-green rounded-full"></div>
                <span className="text-gray-300">{t('advancedMetrics')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-agro-purple rounded-full"></div>
                <span className="text-gray-300">{t('performanceTracking')}</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <Card className="bg-agro-darker/80 border border-agro-blue/20 backdrop-blur-sm overflow-hidden relative group cyberpunk-card">
              <div className="absolute inset-0 bg-gradient-to-r from-agro-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-agro-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="relative z-10 p-6">
                                 <Image 
                   src="/assets/images/dashboard/interactive-dashboard.png" 
                   alt="Interactive Dashboard" 
                   width={400} 
                   height={300}
                   className="w-full h-auto rounded-lg border border-agro-blue/20"
                   onError={(e) => {
                     e.currentTarget.src = "/images/placeholder.svg";
                   }}
                 />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 