'use client';

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Coins } from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation('common');
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-black to-green-800">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 flex justify-center">
            <Logo size="lg" iconOnly={true} />
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            🌱 {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {t('hero.button')}
              <ArrowRight size={20} />
            </motion.button>
            <Link href="/documentation">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                {t('hero.docButton')}
              </motion.button>
            </Link>
          </div>

          {/* Imagem do Fazendeiro Premium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center mb-8"
          >
                         <Image 
               src="/assets/images/hero/farmer-tech-character.png" 
               alt="Premium Farmer Tech Character" 
               width={200} 
               height={200}
               className="drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]"
               onError={(e) => {
                 e.currentTarget.src = "/images/placeholder.svg";
               }}
             />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('features.stakingPremium.title')}</h3>
              <p className="text-gray-400">{t('features.stakingPremium.description')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('features.advancedSecurity.title')}</h3>
              <p className="text-gray-400">{t('features.advancedSecurity.description')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Coins className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('features.agriculturalNFTs.title')}</h3>
              <p className="text-gray-400">{t('features.agriculturalNFTs.description')}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}