'use client';

import { motion } from "framer-motion";
import { Contact } from "../components/sections/Contact";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="grid-animation opacity-20"></div>
          <div className="scanlines opacity-10"></div>
          <div className="digital-rain opacity-5"></div>
        </div>
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -50, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl"
          animate={{ 
            x: [0, -60, 0], 
            y: [0, 40, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "easeInOut" 
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            {/* Logo AGROTM - Imagem que você enviou (Speech Bubble com Bandeira do Brasil) */}
            <motion.div 
              className="w-48 h-48 mx-auto mb-8 relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] relative overflow-hidden">
                {/* Speech Bubble com Bandeira do Brasil */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Speech Bubble Shape */}
                  <div className="relative w-40 h-32 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    {/* Bandeira do Brasil */}
                    <div className="w-32 h-24 bg-green-500 rounded-lg relative overflow-hidden">
                      {/* Losango amarelo */}
                      <div className="absolute inset-4 bg-yellow-400 transform rotate-45"></div>
                      {/* Círculo azul */}
                      <div className="absolute inset-6 bg-blue-600 rounded-full flex items-center justify-center">
                        {/* Estrelas brancas */}
                        <div className="text-white text-xs font-bold">★</div>
                      </div>
                      {/* Faixa branca */}
                      <div className="absolute inset-y-1/2 left-2 right-2 h-1 bg-white rounded-full"></div>
                    </div>
                    {/* Cauda do speech bubble */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white"></div>
                  </div>
                </div>
                <motion.div 
                  className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-white mb-6 text-glow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {t('hero.title')}
            <motion.span 
              className="block text-2xl md:text-3xl text-cyan-400 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {t('hero.subtitle')}
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-2xl md:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {t('hero.tagline')}
          </motion.p>

          <motion.p 
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {t('hero.description')}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.button 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.8)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('hero.enterPlatform')}
            </motion.button>
            <motion.button 
              className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-4 rounded-lg text-xl font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('hero.learnMore')}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white text-center mb-16 text-glow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {t('features.title')}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Staking Sustentável */}
            <motion.div 
              className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-8 text-center relative group hover:border-blue-500/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500 opacity-70"></div>
              
              <motion.div 
                className="text-6xl mb-6 text-glow"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🌾
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-4">{t('features.sustainableStaking.title')}</h3>
              <p className="text-gray-400">
                {t('features.sustainableStaking.description')}
              </p>
            </motion.div>

            {/* NFTs Agrícolas */}
            <motion.div 
              className="bg-black/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-8 text-center relative group hover:border-cyan-400/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-70"></div>
              
              <motion.div 
                className="text-6xl mb-6 text-glow"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🎨
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-4">{t('features.agriculturalNFTs.title')}</h3>
              <p className="text-gray-400">
                {t('features.agriculturalNFTs.description')}
              </p>
            </motion.div>

            {/* Governança */}
            <motion.div 
              className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-8 text-center relative group hover:border-blue-500/40 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ y: -10 }}
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500 opacity-70"></div>
              
              <motion.div 
                className="text-6xl mb-6 text-glow"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🏛️
              </motion.div>
              <h3 className="text-2xl font-semibold text-white mb-4">{t('features.governance.title')}</h3>
              <p className="text-gray-400">
                {t('features.governance.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Dashboard Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-glow">{t('interactiveDashboard.title')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('interactiveDashboard.description')}
            </p>
          </motion.div>

          <motion.div 
            className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-8 relative group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 opacity-70"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500 opacity-70"></div>
            
            {/* Interactive Dashboard - Imagem que você enviou */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
                  <h3 className="text-2xl font-bold text-blue-400 mb-4">{t('interactiveDashboard.title').toUpperCase()}</h3>
                  <div className="space-y-4">
                    {/* Linhas de dados */}
                    <div className="flex space-x-2">
                      <div className="h-2 bg-blue-400 rounded w-16"></div>
                      <div className="h-2 bg-blue-400 rounded w-24"></div>
                      <div className="h-2 bg-blue-400 rounded w-12"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-2 bg-blue-400 rounded w-20"></div>
                      <div className="h-2 bg-blue-400 rounded w-16"></div>
                      <div className="h-2 bg-blue-400 rounded w-28"></div>
                    </div>
                  </div>
                </div>
                
                {/* Gráfico de linha */}
                <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-6">
                  <div className="flex items-end space-x-1 h-20">
                    <div className="w-4 bg-cyan-400 rounded-t h-8"></div>
                    <div className="w-4 bg-cyan-400 rounded-t h-12"></div>
                    <div className="w-4 bg-cyan-400 rounded-t h-6"></div>
                    <div className="w-4 bg-cyan-400 rounded-t h-16"></div>
                    <div className="w-4 bg-cyan-400 rounded-t h-10"></div>
                    <div className="w-4 bg-cyan-400 rounded-t h-14"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">{t('interactiveDashboard.defi')}</div>
                </div>
                <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <div className="text-2xl font-bold text-cyan-400 mb-1">{t('interactiveDashboard.growth')}</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">{t('interactiveDashboard.analytics')}</div>
                </div>
                <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🌐</div>
                  <div className="text-2xl font-bold text-cyan-400 mb-1">{t('interactiveDashboard.network')}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cyber Defense Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-glow">{t('cyberDefense.title')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('cyberDefense.description')}
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Cyber Defense - Imagem que você enviou (Shield com planta) */}
            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-8 relative group">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500 opacity-70"></div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-400 mb-6">{t('cyberDefense.title').toUpperCase()}</h3>
                
                {/* Shield com planta - Imagem que você enviou */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full border-2 border-blue-500 rounded-lg flex items-center justify-center relative">
                    <div className="text-4xl text-green-400">🌱</div>
                  </div>
                </div>
                
                {/* Ícones de IA e Blockchain */}
                <div className="flex justify-center space-x-4">
                  <div className="text-2xl">🧠</div>
                  <div className="text-2xl">🔲</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold text-white mb-3">{t('cyberDefense.advancedProtection.title')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('cyberDefense.advancedProtection.description')}
                </p>
              </div>
              <div className="bg-black/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-white mb-3">{t('cyberDefense.intelligentAI.title')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('cyberDefense.intelligentAI.description')}
                </p>
              </div>
              <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-white mb-3">{t('cyberDefense.secureBlockchain.title')}</h3>
                <p className="text-gray-400 text-sm">
                  {t('cyberDefense.secureBlockchain.description')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Staking/Farming Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-glow">{t('stakingFarming.title')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('stakingFarming.description')}
            </p>
          </motion.div>

          <motion.div 
            className="bg-black/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-8 relative group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-70"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-70"></div>
            
            {/* Staking/Farming - Imagem que você enviou */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">{t('stakingFarming.title').toUpperCase()}</h3>
                
                {/* Linhas de dados */}
                <div className="space-y-2 mb-6">
                  <div className="flex space-x-2">
                    <div className="h-2 bg-cyan-400 rounded w-20"></div>
                    <div className="h-2 bg-cyan-400 rounded w-16"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-2 bg-cyan-400 rounded w-24"></div>
                    <div className="h-2 bg-cyan-400 rounded w-12"></div>
                  </div>
                </div>
                
                {/* Ícone de moedas */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="text-3xl">💰</div>
                  <div className="text-2xl text-cyan-400">✓</div>
                </div>
              </div>
              
              <div className="text-center">
                {/* Plantas com raízes de circuito */}
                <div className="flex justify-center space-x-8 mb-6">
                  <div className="text-center">
                    <div className="text-4xl text-cyan-400 mb-2">🌱</div>
                    <div className="w-16 h-1 bg-cyan-400 mx-auto"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl text-cyan-400 mb-2">🌱</div>
                    <div className="w-20 h-1 bg-cyan-400 mx-auto"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl text-cyan-400 mb-2">🌱</div>
                    <div className="w-12 h-1 bg-cyan-400 mx-auto"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🌱</div>
                    <h3 className="text-2xl font-semibold text-white mb-4">{t('stakingFarming.sustainableStaking.title')}</h3>
                    <p className="text-gray-400">
                      {t('stakingFarming.sustainableStaking.description')}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl mb-4">💰</div>
                    <h3 className="text-2xl font-semibold text-white mb-4">{t('stakingFarming.liquidityFarming.title')}</h3>
                    <p className="text-gray-400">
                      {t('stakingFarming.liquidityFarming.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NFT Minting Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-glow">{t('nftMinting.title')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('nftMinting.description')}
            </p>
          </motion.div>

          <motion.div 
            className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-8 relative group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 opacity-70"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500 opacity-70"></div>
            
            {/* NFT Minting - Imagem que você enviou */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-400 mb-6">{t('nftMinting.title').toUpperCase()}</h3>
                
                {/* Planta crescendo até NFT */}
                <div className="relative h-64 flex flex-col items-center justify-center">
                  {/* Semente */}
                  <div className="absolute bottom-0 text-3xl text-green-400">🌱</div>
                  
                  {/* Caule */}
                  <div className="absolute bottom-8 w-1 h-16 bg-green-400"></div>
                  
                  {/* Folhas */}
                  <div className="absolute bottom-16 left-4 text-2xl text-green-400">🍃</div>
                  <div className="absolute bottom-16 right-4 text-2xl text-green-400">🍃</div>
                  
                  {/* NFT Coin */}
                  <div className="absolute top-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    NFT
                  </div>
                </div>
                
                {/* Barras de progresso */}
                <div className="flex space-x-2 mt-4">
                  <div className="h-2 bg-blue-400 rounded w-8"></div>
                  <div className="h-2 bg-blue-400 rounded w-6"></div>
                  <div className="h-2 bg-blue-400 rounded w-10"></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-8xl mb-6">🎨</div>
                <h3 className="text-3xl font-semibold text-white mb-6">{t('nftMinting.createNFTs.title')}</h3>
                <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                  {t('nftMinting.createNFTs.description')}
                </p>
                <motion.button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('nftMinting.createNFTs.button')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
