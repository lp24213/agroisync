import React from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Clock, Users, Zap, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AgroConecta = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Truck,
      title: t('agroconecta.features.freight'),
      description: t('agroconecta.features.freightDesc')
    },
    {
      icon: MapPin,
      title: t('agroconecta.features.tracking'),
      description: t('agroconecta.features.trackingDesc')
    },
    {
      icon: Users,
      title: t('agroconecta.features.network'),
      description: t('agroconecta.features.networkDesc')
    },
    {
      icon: Zap,
      title: t('agroconecta.features.ai'),
      description: t('agroconecta.features.aiDesc')
    },
    {
      icon: Shield,
      title: t('agroconecta.features.security'),
      description: t('agroconecta.features.securityDesc')
    },
    {
      icon: Clock,
      title: t('agroconecta.features.fast'),
      description: t('agroconecta.features.fastDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto py-20"
        >
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <Truck className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              <span className="text-gradient">{t('agroconecta.title')}</span>
            </h1>
            
            <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              {t('agroconecta.subtitle')}
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="panel text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Como Funciona */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="panel mb-16"
          >
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              {t('agroconecta.howItWorks.title')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="text-xl font-semibold text-primary">{t('agroconecta.howItWorks.step1')}</h3>
                <p className="text-muted">
                  {t('agroconecta.howItWorks.step1Desc')}
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="text-xl font-semibold text-primary">{t('agroconecta.howItWorks.step2')}</h3>
                <p className="text-muted">
                  {t('agroconecta.howItWorks.step2Desc')}
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="text-xl font-semibold text-primary">{t('agroconecta.howItWorks.step3')}</h3>
                <p className="text-muted">
                  {t('agroconecta.howItWorks.step3Desc')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">
              {t('agroconecta.cta.title')}
            </h2>
            <p className="text-muted mb-8 max-w-2xl mx-auto">
              {t('agroconecta.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary px-8 py-4">
                {t('agroconecta.cta.haveLoad')}
              </button>
              <button className="btn btn-secondary px-8 py-4">
                {t('agroconecta.cta.transporter')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgroConecta;
