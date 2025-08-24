import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, TrendingUp, Globe, Shield, Zap, 
  Users, Package, Truck, Coins, BarChart3,
  CheckCircle, Star, Award, Target, Lightbulb
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlobalTicker from '../components/GlobalTicker';
import WeatherWidget from '../components/WeatherWidget';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `Agroisync - ${t('home.hero.subtitle')}`;
  }, [t]);

  const features = [
    {
      icon: <Package className="w-8 h-8" />,
      title: t('home.features.marketplace.title'),
      description: t('home.features.marketplace.description'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: t('home.features.freight.title'),
      description: t('home.features.freight.description'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Coins className="w-8 h-8" />,
      title: t('home.features.crypto.title'),
      description: t('home.features.crypto.description'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('home.features.quotes.title'),
      description: t('home.features.quotes.description'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  const highlights = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t('home.highlights.realTimeData'),
      description: t('home.highlights.realTimeDataDesc'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('home.highlights.advancedAnalytics'),
      description: t('home.highlights.advancedAnalyticsDesc'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: t('home.highlights.marketIntelligence'),
      description: t('home.highlights.marketIntelligenceDesc'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('home.highlights.cryptoTrading'),
      description: t('home.highlights.cryptoTradingDesc'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  const steps = [
    {
      icon: <Users className="w-8 h-8" />,
      title: t('home.howItWorks.step1.title'),
      description: t('home.howItWorks.step1.description'),
      step: '01'
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: t('home.howItWorks.step2.title'),
      description: t('home.howItWorks.step2.description'),
      step: '02'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: t('home.howItWorks.step3.title'),
      description: t('home.howItWorks.step3.description'),
      step: '03'
    }
  ];

  const testimonials = [
    {
      name: 'João Silva',
      role: t('home.testimonials.farmer.role'),
      content: t('home.testimonials.farmer.content'),
      rating: 5,
      avatar: 'JS'
    },
    {
      name: 'Maria Santos',
      role: t('home.testimonials.transporter.role'),
      content: t('home.testimonials.transporter.content'),
      rating: 5,
      avatar: 'MS'
    },
    {
      name: 'Pedro Costa',
      role: t('home.testimonials.buyer.role'),
      content: t('home.testimonials.buyer.content'),
      rating: 5,
      avatar: 'PC'
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '10K+', label: t('home.stats.users') },
    { icon: <Package className="w-6 h-6" />, value: '50K+', label: t('home.stats.products') },
    { icon: <Truck className="w-6 h-6" />, value: '25K+', label: t('home.stats.freights') },
    { icon: <CheckCircle className="w-6 h-6" />, value: '99.9%', label: t('home.stats.uptime') }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${
            isDark ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'
          }`}></div>
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              {t('home.hero.title')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              {t('home.hero.subtitle')}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-3xl mx-auto"
            >
              {t('home.hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <a
                href="/loja"
                className="group bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>{t('home.hero.cta.primary')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              
              <a
                href="/sobre"
                className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 flex items-center space-x-2"
              >
                <span>{t('home.hero.cta.secondary')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.highlights.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('home.highlights.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${highlight.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {highlight.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{highlight.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.features.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('home.features.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className={`w-20 h-20 mb-6 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.howItWorks.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('home.howItWorks.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="relative">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{stat.value}</div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.testimonials.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('home.testimonials.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.cta.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{t('home.cta.subtitle')}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/cadastro"
                className="group bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>{t('home.cta.primary')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              
              <a
                href="/planos"
                className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 flex items-center space-x-2"
              >
                <span>{t('home.cta.secondary')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Home;
