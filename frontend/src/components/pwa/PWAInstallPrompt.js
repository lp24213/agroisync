import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Smartphone, Monitor, WifiOff, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
import { useAnalytics } from '../../hooks/useAnalytics';

const PWAInstallPrompt = () => {
  const { t } = useTranslation();
  const pwa = usePWA();
  const analytics = useAnalytics();
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Mostrar prompt de instalação
  useEffect(() => {
    if (pwa.isInstallable && !pwa.isInstalled) {
      // Verificar se já foi mostrado recentemente
      const lastShown = localStorage.getItem('pwa-install-prompt-last-shown');
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      if (!lastShown || (now - parseInt(lastShown)) > oneDay) {
        setIsVisible(true);
        analytics.trackEvent('pwa_install_prompt_shown');
      }
    }
  }, [pwa.isInstallable, pwa.isInstalled, analytics]);

  // Instalar PWA
  const handleInstall = async () => {
    setIsInstalling(true);
    analytics.trackEvent('pwa_install_attempted');

    try {
      const success = await pwa.installPWA();
      if (success) {
        setIsVisible(false);
        localStorage.setItem('pwa-install-prompt-last-shown', Date.now().toString());
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Fechar prompt
  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-prompt-last-shown', Date.now().toString());
    analytics.trackEvent('pwa_install_prompt_dismissed');
  };

  // Mostrar instruções para iOS
  const handleIOSInstall = () => {
    setShowIOSInstructions(true);
    analytics.trackEvent('pwa_ios_install_instructions_shown');
  };

  // Detectar iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;

  if (!isVisible || pwa.isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('pwa.installTitle', 'Instalar AgroSync')}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('pwa.installSubtitle', 'Acesso rápido e offline')}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Benefícios */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Smartphone className="w-3 h-3 mr-2" />
              {t('pwa.benefit1', 'Acesso como app nativo')}
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <WifiOff className="w-3 h-3 mr-2" />
              {t('pwa.benefit2', 'Funciona offline')}
            </div>
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Monitor className="w-3 h-3 mr-2" />
              {t('pwa.benefit3', 'Notificações push')}
            </div>
          </div>

          {/* Status de conectividade */}
          {!pwa.isOnline && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 mb-3">
              <div className="flex items-center">
                <WifiOff className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-xs text-yellow-800 dark:text-yellow-200">
                  {t('pwa.offlineMode', 'Modo offline ativo')}
                </span>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex space-x-2">
            {isIOS && !isInStandaloneMode ? (
              <button
                onClick={handleIOSInstall}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('pwa.installIOS', 'Instalar')}
              </button>
            ) : (
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                {isInstalling ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {t('pwa.install', 'Instalar App')}
              </button>
            )}
            <button
              onClick={handleClose}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t('pwa.later', 'Depois')}
            </button>
          </div>
        </div>

        {/* Instruções para iOS */}
        <AnimatePresence>
          {showIOSInstructions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                {t('pwa.iosInstructionsTitle', 'Como instalar no iOS')}
              </h4>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-start">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">1</span>
                  <span>{t('pwa.iosStep1', 'Toque no botão de compartilhar na parte inferior da tela')}</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">2</span>
                  <span>{t('pwa.iosStep2', 'Role para baixo e toque em "Adicionar à Tela de Início"')}</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">3</span>
                  <span>{t('pwa.iosStep3', 'Toque em "Adicionar" para confirmar')}</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="mt-3 w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {t('pwa.gotIt', 'Entendi')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
