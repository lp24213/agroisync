import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { useTranslation } from 'react-i18next';
import {
  Store, Package, Truck, Users, CheckCircle, ArrowRight, 
  UserPlus, Building2, Search, Star, ShoppingCart, Leaf, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Loja = () => {
  const { isDark } = useTheme();
  const { user, isAdmin } = useAuth();
  const { isPaid, planActive } = usePayment();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Estados para animações de entrada
  const [mounted, setMounted] = useState(false);

  // Função para renderizar os ícones dos produtos
  const getProductIcon = (iconName) => {
    switch (iconName) {
      case 'Leaf':
        return <Leaf className="w-8 h-8" />;
      case 'User':
        return <User className="w-8 h-8" />;
      case 'Search':
        return <Search className="w-8 h-8" />;
      default:
        return <Package className="w-8 h-8" />;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animações de entrada
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section - DESIGN PREMIUM */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        className="py-24 px-4 header-premium relative overflow-hidden"
      >
        {/* Linha gradiente sutil no topo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-agro-green-500 via-agro-yellow-500 to-web3-neon-blue opacity-60"></div>
        {/* Elementos decorativos premium */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-agro-green-600 to-web3-neon-blue rounded-full opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-agro-yellow-500 to-web3-neon-blue rounded-full opacity-10 blur-xl animate-pulse"></div>
        <div className="max-w-7xl mx-auto text-center">
                      <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold title-premium mb-6"
            >
              {t('store.title')}
            </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto mb-8"
          >
            {t('store.description')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 text-lg flex items-center justify-center space-x-2 btn-accent-green relative overflow-hidden group"
            >
              {/* Efeito de glow no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-agro-green-400 via-agro-yellow-400 to-web3-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{t('store.cta.primary')}</span>
              <ArrowRight className="w-5 h-5 relative z-10" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold border-2 border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Efeito de glow no hover */}
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <span className="relative z-10">{t('store.cta.secondary')}</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section - Animação de entrada */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold title-premium mb-6">
              {t('store.features.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('store.features.description')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Package className="w-12 h-12 text-blue-600" />,
                title: t('store.features.products.title'),
                description: t('store.features.products.description')
              },
              {
                icon: <Truck className="w-12 h-12 text-emerald-600" />,
                title: t('store.features.freight.title'),
                description: t('store.features.freight.description')
              },
              {
                icon: <Users className="w-12 h-12 text-purple-600" />,
                title: t('store.features.community.title'),
                description: t('store.features.community.description')
              },
              {
                icon: <CheckCircle className="w-12 h-12 text-green-600" />,
                title: t('store.features.quality.title'),
                description: t('store.features.quality.description')
              },
              {
                icon: <Building2 className="w-12 h-12 text-orange-600" />,
                title: t('store.features.business.title'),
                description: t('store.features.business.description')
              },
              {
                icon: <UserPlus className="w-12 h-12 text-red-600" />,
                title: t('store.features.support.title'),
                description: t('store.features.support.description')
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="card-premium p-8 text-center group relative overflow-hidden hover-lift"
              >
                                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300 icon-premium">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                  
                  {/* Efeito de glow sutil */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-agro-green-500/5 via-agro-yellow-500/5 to-web3-neon-blue/5"></div>
                </motion.div>
            ))}
          </motion.div>
          </div>
      </motion.section>

      {/* Products Section - Animação de entrada */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 px-4 bg-gradient-to-r from-slate-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold title-premium mb-6">
              {t('store.products.title')}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t('store.products.description')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Produtos simulados com animações */}
            {[
              {
                id: 1,
                name: 'Sistema de Gestão Agrícola',
                description: 'Plataforma completa para gestão de fazendas e propriedades rurais',
                price: 'R$ 299,90',
                image: 'Leaf',
                category: 'Software'
              },
              {
                id: 2,
                name: 'Consultoria Especializada',
                description: 'Acompanhamento técnico e estratégico para otimização da produção',
                price: 'R$ 150,00',
                image: 'User',
                category: 'Serviço'
              },
              {
                id: 3,
                name: 'Análise de Solo Avançada',
                description: 'Relatórios detalhados com recomendações de fertilização',
                price: 'R$ 89,90',
                image: 'Search',
                category: 'Análise'
              }
            ].map((product, index) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -8 }}
                className="card-premium overflow-hidden hover-lift"
              >
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-agro-green-600 via-agro-yellow-500 to-web3-neon-blue flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {getProductIcon(product.image)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {product.description}
                  </p>
                  <div className="text-2xl font-bold text-gradient-agro mb-4">
                    {product.price}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 btn-accent-green relative overflow-hidden group"
                                      >
                      {/* Efeito de glow no hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-agro-green-500 via-agro-yellow-500 to-web3-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      <span className="relative z-10">{t('store.products.buy')}</span>
                    </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Loja;
