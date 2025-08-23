import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { BarChart3, Search, Globe, Bitcoin, Rocket, Zap, Network } from 'lucide-react';
import NFTMinting from '../components/illustrations/NFTMinting';
import PremiumFarmer from '../components/illustrations/PremiumFarmer';
import InteractiveDashboard from '../components/illustrations/InteractiveDashboard';
import StakingFarming from '../components/illustrations/StakingFarming';
import CyberDefense from '../components/illustrations/CyberDefense';
import SmartFarming from '../components/illustrations/SmartFarming';

const Home = () => {
  const { t } = useTranslation();
  const { isDark, isLight } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const highlightCards = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('home.highlights.realTimeData'),
      description: t('home.highlights.realTimeDataDesc'),
      illustration: <InteractiveDashboard className="w-16 h-16" />
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: t('home.highlights.advancedAnalytics'),
      description: t('home.highlights.advancedAnalyticsDesc'),
      illustration: <CyberDefense className="w-16 h-16" />
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('home.highlights.marketIntelligence'),
      description: t('home.highlights.marketIntelligenceDesc'),
      illustration: <SmartFarming className="w-16 h-16" />
    },
    {
      icon: <Bitcoin className="w-8 h-8" />,
      title: t('home.highlights.cryptoTrading'),
      description: t('home.highlights.cryptoTradingDesc'),
      illustration: <NFTMinting className="w-20 h-20" />
    }
  ];

  const featureCards = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: t('home.features.feature1.title'),
      description: t('home.features.feature1.description'),
      illustration: <PremiumFarmer className="w-20 h-20" />
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('home.features.feature2.title'),
      description: t('home.features.feature2.description'),
      illustration: <StakingFarming className="w-20 h-20" />
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: t('home.features.feature3.title'),
      description: t('home.features.feature3.description'),
      illustration: <SmartFarming className="w-20 h-20" />
    }
  ];

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Gradiente de fundo baseado no tema */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-br from-dark-bg-primary via-dark-bg-secondary to-dark-bg-primary' 
            : 'bg-gradient-to-br from-light-bg-primary via-light-bg-secondary to-light-bg-primary'
        }`} />
        
        {/* Partículas flutuantes (apenas no tema escuro) */}
        {isDark && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${
                  isDark ? 'bg-dark-accent-primary/30' : 'bg-light-accent-primary/30'
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Título principal */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-orbitron"
            >
              <span className={`${
                isDark 
                  ? 'bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-light-accent-primary to-light-accent-secondary bg-clip-text text-transparent'
              }`}>
                {t('home.hero.title')}
              </span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              variants={itemVariants}
              className={`text-xl md:text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto leading-relaxed font-space-grotesk ${
                isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
              }`}
            >
              {t('home.hero.subtitle')}
            </motion.p>

            {/* Descrição */}
            <motion.p
              variants={itemVariants}
              className={`text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed font-inter ${
                isDark ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'
              }`}
            >
              {t('home.hero.description')}
            </motion.p>

            {/* Botões de ação */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/cadastro"
                className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary text-white shadow-lg hover:shadow-xl hover:shadow-dark-accent-primary/25'
                    : 'bg-gradient-to-r from-light-accent-primary to-light-accent-secondary text-white shadow-lg hover:shadow-xl hover:shadow-light-accent-primary/25'
                }`}
              >
                {t('home.hero.cta')}
              </Link>

              <Link
                to="/sobre"
                className={`px-8 py-4 rounded-2xl font-semibold text-lg border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                  isDark
                    ? 'border-dark-accent-primary text-dark-accent-primary hover:bg-dark-accent-primary hover:text-white'
                    : 'border-light-accent-primary text-light-accent-primary hover:bg-light-accent-primary hover:text-white'
                }`}
              >
                {t('home.hero.learnMore')}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-6 h-10 border-2 rounded-full flex justify-center ${
              isDark ? 'border-dark-accent-primary/50' : 'border-light-accent-primary/50'
            }`}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-1 h-3 rounded-full mt-2 ${
                isDark ? 'bg-dark-accent-primary' : 'bg-light-accent-primary'
              }`}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 font-orbitron ${
              isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
            }`}>
              {t('home.highlights.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlightCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:transform hover:scale-105 ${
                  isDark
                    ? 'bg-dark-bg-card/80 border-dark-border-primary hover:border-dark-accent-primary hover:shadow-lg hover:shadow-dark-accent-primary/20'
                    : 'bg-light-bg-card/80 border-light-border-primary hover:border-light-accent-primary hover:shadow-lg hover:shadow-light-accent-primary/20'
                }`}
              >
                <div className="text-center">
                  <div className={`flex justify-center mb-4 ${
                    isDark ? 'text-dark-accent-primary' : 'text-light-accent-primary'
                  }`}>
                    {card.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 font-space-grotesk ${
                    isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                  }`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm leading-relaxed font-inter ${
                    isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                  }`}>
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 font-orbitron ${
              isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
            }`}>
              {t('home.features.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featureCards.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`p-8 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:transform hover:scale-105 ${
                  isDark
                    ? 'bg-dark-bg-card/80 border-dark-border-primary hover:border-dark-accent-primary hover:shadow-lg hover:shadow-dark-accent-primary/20'
                    : 'bg-light-bg-card/80 border-light-border-primary hover:border-light-accent-primary hover:shadow-lg hover:shadow-light-accent-primary/20'
                }`}
              >
                <div className="text-center">
                  <div className={`flex justify-center mb-6 ${
                    isDark ? 'text-dark-accent-primary' : 'text-light-accent-primary'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-2xl font-semibold mb-4 font-space-grotesk ${
                    isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-base leading-relaxed font-inter ${
                    isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Demo Section - Apenas para desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-lg text-gray-500">Seção de Desenvolvimento - Theme Demo</h3>
            </div>
            {/* ThemeDemo component seria renderizado aqui apenas em desenvolvimento */}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
