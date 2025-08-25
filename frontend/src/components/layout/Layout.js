import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Chatbot from '../Chatbot';
import AnimatedBackground from '../AnimatedBackground';
import PagePreloader from '../PagePreloader';
import PageTransition from '../PageTransition';
import GlobalTicker from '../GlobalTicker';
import GlobalWeatherWidget from '../GlobalWeatherWidget';

const Layout = ({ children }) => {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tempo de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Preloader */}
      <PagePreloader isLoading={isLoading} />

      <div className="min-h-screen relative overflow-hidden">
        {/* Fundo animado de estrelas (apenas no tema escuro) */}
        {isDark && <AnimatedBackground />}

        {/* Gradiente sutil sobre o fundo */}
        <div className={`absolute inset-0 pointer-events-none z-0 ${
          isDark
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
            : 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
        }`} />

        {/* Conteúdo principal */}
        <div className="relative z-10">
          {/* Ticker Global de Cotações - FIXO ACIMA DO MENU */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <GlobalTicker />
          </div>

          {/* Header SEMPRE FIXO - NUNCA DESAPARECE */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center" // Centralizado vertical e horizontalmente
          >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Navbar />
            </div>
          </motion.header>

          {/* Conteúdo principal */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 pt-20" // pt-20 para compensar menu fixo no topo
          >
            <PageTransition>
              {children}
            </PageTransition>
          </motion.main>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative z-10"
          >
            <Footer />
          </motion.footer>

          {/* Chatbot IA - SEMPRE VISÍVEL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="fixed bottom-6 right-6 z-50" // SEMPRE fixo
          >
            <Chatbot />
          </motion.div>

          {/* Widget de Clima Global - CANTO SUPERIOR DIREITO COM DRAG-AND-DROP */}
          <div className="fixed top-5 right-5 z-40">
            <GlobalWeatherWidget />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
