'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '../ui/Card';
import { useTranslation } from 'react-i18next';

export function DashboardSection() {
  const { t } = useTranslation('common');

  return (
    <section className="py-20 bg-black-matte relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="font-orbitron text-4xl md:text-5xl text-neonBlue mb-6 animate-fadeIn">
              Interactive Dashboard
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              Advanced analytics and real-time monitoring interface with cutting-edge Web3 technology.
            </p>
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center space-x-3"
              >
                <div className="w-3 h-3 bg-neonBlue rounded-full shadow-neon"></div>
                <span className="text-gray-300 font-orbitron">Real-time Analytics</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center space-x-3"
              >
                <div className="w-3 h-3 bg-neonBlue rounded-full shadow-neon"></div>
                <span className="text-gray-300 font-orbitron">Advanced Metrics</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center space-x-3"
              >
                <div className="w-3 h-3 bg-neonBlue rounded-full shadow-neon"></div>
                <span className="text-gray-300 font-orbitron">Performance Tracking</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Image 
                src="/assets/images/dashboard/interactive-dashboard.png" 
                alt="AGROTM Interactive Dashboard" 
                width={600} 
                height={400}
                className="rounded-2xl shadow-neon hover:shadow-neon transition-all duration-500"
                unoptimized={true}
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.svg";
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 