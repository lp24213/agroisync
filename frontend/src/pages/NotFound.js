import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const NotFound = () => {
  const { t } = useTranslation();
  const { isDark, darkColors, lightColors } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <div className={`min-h-screen flex items-center justify-center ${colors.bgPrimary} ${colors.textPrimary}`}>
      <div className="max-w-4xl mx-auto px-4 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
          {/* 404 Animation */}
        <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
          >
            <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">
              404
          </div>
        </motion.div>

          {/* Error Message */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl font-bold mb-4"
        >
            {t('notFound.title')}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl mb-8 text-gray-600 dark:text-gray-300"
        >
            {t('notFound.description')}
        </motion.p>

          {/* Useful Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold mb-4">{t('notFound.usefulLinks')}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/store"
                className={`px-6 py-3 rounded-lg ${colors.accentPrimary} text-white hover:opacity-90 transition-opacity`}
              >
                {t('notFound.store')}
              </Link>
              <Link
                to="/freight"
                className={`px-6 py-3 rounded-lg ${colors.accentSecondary} text-white hover:opacity-90 transition-opacity`}
              >
                {t('notFound.freight')}
              </Link>
              <Link
                to="/contact"
                className={`px-6 py-3 rounded-lg ${colors.accentTertiary} text-white hover:opacity-90 transition-opacity`}
              >
                {t('notFound.contact')}
              </Link>
              <Link
                to="/help"
                className={`px-6 py-3 rounded-lg ${colors.accentQuaternary} text-white hover:opacity-90 transition-opacity`}
              >
                {t('notFound.help')}
              </Link>
          </div>
        </motion.div>

          {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className={`px-8 py-4 rounded-lg ${colors.accentPrimary} text-white font-semibold hover:opacity-90 transition-opacity`}
            >
              {t('notFound.goHome')}
            </Link>
            <button
              onClick={() => window.history.back()}
              className={`px-8 py-4 rounded-lg border-2 ${colors.borderPrimary} ${colors.textPrimary} font-semibold hover:opacity-90 transition-opacity`}
            >
              {t('notFound.goBack')}
            </button>
        </motion.div>

          {/* Additional Help */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8 text-sm text-gray-500 dark:text-gray-400"
          >
            <p>{t('notFound.refreshSuggestion')}</p>
          </motion.div>
      </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
