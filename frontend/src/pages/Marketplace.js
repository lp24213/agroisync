import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Rocket, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Marketplace = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center py-20"
        >
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Rocket className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              <span className="text-gradient">{t('marketplace.title')}</span>
            </h1>
            
            <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed mb-8">
              {t('marketplace.subtitle')}
            </p>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="panel mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Clock className="w-8 h-8 text-blue-500" />
              <h2 className="text-3xl font-bold text-primary">
                {t('marketplace.status')}
              </h2>
            </div>
            
            <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
              {t('marketplace.description')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-primary">{t('marketplace.features.technology')}</h3>
                <p className="text-sm text-muted">
                  {t('marketplace.features.technologyDesc')}
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-primary">{t('marketplace.features.launch')}</h3>
                <p className="text-sm text-muted">
                  {t('marketplace.features.launchDesc')}
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-primary">{t('marketplace.features.development')}</h3>
                <p className="text-sm text-muted">
                  {t('marketplace.features.developmentDesc')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-primary mb-4">
              {t('marketplace.notify.title')}
            </h3>
            <p className="text-muted mb-8">
              {t('marketplace.notify.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('marketplace.notify.placeholder')}
                className="form-input flex-1"
              />
              <button className="btn btn-primary px-6 py-3">
                {t('marketplace.notify.button')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Marketplace;
