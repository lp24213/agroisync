import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import GrainsDashboard from '../components/grains/GrainsDashboard';

const Cotacao = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-black text-white">

      
      {/* Header Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-900/20 to-green-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
            {t('cotacao.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('cotacao.description')}
          </p>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <GrainsDashboard />
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            {t('cotacao.detectionTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">1. {t('cotacao.detectionStep1')}</h3>
              <p className="text-gray-400">{t('cotacao.detectionStep1Desc')}</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">2. {t('cotacao.detectionStep2')}</h3>
              <p className="text-gray-400">{t('cotacao.detectionStep2Desc')}</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L8 8l4 4 4-4-4-6z"/>
                  <path d="M8 8v8a4 4 0 0 0 8 0V8"/>
                  <path d="M6 16h12"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">3. {t('cotacao.detectionStep3')}</h3>
              <p className="text-gray-400">{t('cotacao.detectionStep3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grãos Disponíveis */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            {t('cotacao.grainsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Soja', unit: 'sc', color: 'from-green-500 to-green-600' },
              { name: 'Milho', unit: 'sc', color: 'from-yellow-500 to-yellow-600' },
              { name: 'Trigo', unit: 'sc', color: 'from-amber-500 to-amber-600' },
              { name: 'Arroz', unit: 'sc', color: 'from-gray-500 to-gray-600' },
              { name: 'Café', unit: 'sc', color: 'from-brown-500 to-brown-600' },
              { name: 'Algodão', unit: '@', color: 'from-white to-gray-400' }
            ].map((grain) => (
              <div key={grain.name} className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition-colors duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${grain.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L8 8l4 4 4-4-4-6z"/>
                    <path d="M8 8v8a4 4 0 0 0 8 0V8"/>
                    <path d="M6 16h12"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{grain.name}</h3>
                <p className="text-gray-400">{t('cotacao.unit')}: {grain.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Cotacao;
