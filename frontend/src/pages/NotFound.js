import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, AlertTriangle, Store, Truck, Mail, HelpCircle, RefreshCw } from 'lucide-react';
import SEOHead from '../components/SEO/SEOHead';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SEOHead 
        title={t('notFound.seoTitle', 'Página Não Encontrada - AgroSync')}
        description={t('notFound.seoDescription', 'A página que você está procurando não foi encontrada. Explore nosso marketplace de produtos agrícolas, sistema de fretes e muito mais.')}
        noindex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-black dark:to-slate-800 flex items-center justify-center pt-16">
      <motion.div 
        className="text-center max-w-2xl mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Ícone de erro */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-yellow-900">!</span>
            </div>
          </div>
        </motion.div>

        {/* Título principal */}
        <motion.h1 
          className="text-8xl font-bold text-slate-900 dark:text-white mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          404
        </motion.h1>

        {/* Subtítulo */}
        <motion.h2 
          className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t('notFound.title', 'Página não encontrada')}
        </motion.h2>

        {/* Descrição */}
        <motion.p 
          className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {t('notFound.description', 'A página que você está procurando não existe ou foi movida. Verifique o endereço ou use os links abaixo para navegar.')}
        </motion.p>

        {/* Botões de ação */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={handleGoHome}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            {t('notFound.goHome', 'Voltar ao Início')}
          </button>

          <button
            onClick={handleGoBack}
            className="px-8 py-4 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('notFound.goBack', 'Voltar')}
          </button>
        </motion.div>

        {/* Links úteis */}
        <motion.div 
          className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-6 flex items-center justify-center gap-2">
            <Search className="w-5 h-5 text-agro-sky" />
            {t('notFound.usefulLinks', 'Links Úteis')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/store')}
              className="group p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-agro-emerald hover:text-white transition-all duration-300 transform hover:-translate-y-1"
            >
              <Store className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{t('notFound.store', 'Loja')}</span>
            </button>
            <button
              onClick={() => navigate('/freight')}
              className="group p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-agro-sky hover:text-white transition-all duration-300 transform hover:-translate-y-1"
            >
              <Truck className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{t('notFound.freight', 'Fretes')}</span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="group p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-agro-amber hover:text-white transition-all duration-300 transform hover:-translate-y-1"
            >
              <Mail className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{t('notFound.contact', 'Contato')}</span>
            </button>
            <button
              onClick={() => navigate('/help')}
              className="group p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-agro-purple hover:text-white transition-all duration-300 transform hover:-translate-y-1"
            >
              <HelpCircle className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{t('notFound.help', 'Ajuda')}</span>
            </button>
          </div>
        </motion.div>

        {/* Refresh Suggestion */}
        <motion.div 
          className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm">
              {t('notFound.refreshSuggestion', 'Tente atualizar a página ou verifique se a URL está correta.')}
            </span>
          </div>
        </motion.div>

        {/* Informações técnicas para desenvolvedores */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div 
            className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Informações Técnicas:
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              URL: {window.location.pathname}<br />
              Timestamp: {new Date().toISOString()}<br />
              User Agent: {navigator.userAgent}
            </p>
          </motion.div>
        )}
      </motion.div>
      </div>
    </>
  );
};

export default NotFound;
