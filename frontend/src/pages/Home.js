import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import NFTMinting from '../components/illustrations/NFTMinting';
import PremiumFarmer from '../components/illustrations/PremiumFarmer';
import InteractiveDashboard from '../components/illustrations/InteractiveDashboard';
import StakingFarming from '../components/illustrations/StakingFarming';
import CyberDefense from '../components/illustrations/CyberDefense';
import SmartFarming from '../components/illustrations/SmartFarming';
import ThemeDemo from '../components/ThemeDemo';

const Home = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

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
      icon: "📊",
      title: t('home.highlights.realTimeData'),
      description: "Dados atualizados em tempo real para tomada de decisões estratégicas",
      illustration: <InteractiveDashboard className="w-16 h-16" />
    },
    {
      icon: "🔍",
      title: t('home.highlights.advancedAnalytics'),
      description: "Análises avançadas com inteligência artificial e machine learning",
      illustration: <CyberDefense className="w-16 h-16" />
    },
    {
      icon: "🌍",
      title: t('home.highlights.marketIntelligence'),
      description: "Inteligência de mercado com insights globais e tendências",
      illustration: <SmartFarming className="w-16 h-16" />
    },
    {
      icon: "₿",
      title: t('home.highlights.cryptoTrading'),
      description: "Trading de criptomoedas integrado ao ecossistema agrícola",
      illustration: <NFTMinting className="w-16 h-16" />
    }
  ];

  const featureCards = [
    {
      icon: "🚀",
      title: t('home.features.feature1.title'),
      description: t('home.features.feature1.description'),
      illustration: <PremiumFarmer className="w-20 h-20" />
    },
    {
      icon: "⚡",
      title: t('home.features.feature2.title'),
      description: t('home.features.feature2.description'),
      illustration: <StakingFarming className="w-20 h-20" />
    },
    {
      icon: "🌐",
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
          theme === 'dark' 
            ? 'bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary' 
            : 'bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary'
        }`} />
        
        {/* Partículas flutuantes (apenas no tema escuro) */}
        {theme === 'dark' && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-accent-primary/30 rounded-full"
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
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="text-gradient">
                {t('home.hero.title')}
              </span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl lg:text-3xl text-text-secondary mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              {t('home.hero.subtitle')}
            </motion.p>

            {/* Descrição */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-text-tertiary mb-12 max-w-3xl mx-auto leading-relaxed"
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
                className="btn btn-primary"
              >
                {t('home.hero.cta')}
              </Link>

              <Link
                to="/sobre"
                className="btn btn-secondary"
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
            className="w-6 h-10 border-2 border-accent-primary/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-accent-primary rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Highlights Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {t('home.highlights.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlightCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="card">
                  {/* Ilustração futurista */}
                  <div className="flex justify-center mb-4">
                    {card.illustration}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {card.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-bg-tertiary/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {t('home.features.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featureCards.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="card">
                  {/* Ilustração futurista */}
                  <div className="flex justify-center mb-6">
                    {feature.illustration}
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-text-primary mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Theme Demo Section */}
      <ThemeDemo />

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Pronto para o Futuro?
            </h2>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Junte-se à revolução digital do agronegócio e conecte-se ao futuro da agricultura
            </p>
            <Link
              to="/cadastro"
              className="btn btn-primary text-lg px-10 py-5"
            >
              Começar Agora
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
