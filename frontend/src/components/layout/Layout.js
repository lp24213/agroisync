import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
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

      <div className="min-h-screen relative overflow-hidden pt-16">
        {/* Universo estrelado animado é aplicado globalmente via CSS */}

        {/* Conteúdo principal */}
        <div className="relative z-10">
          {/* Ticker Global de Cotações - FIXO ACIMA DO MENU */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <GlobalTicker />
          </div>


          {/* Conteúdo principal */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 pt-20" pt-20 para compensar menu fixo no topo
          >
            <PageTransition>
              {children}
            </PageTransition>
          </motion.main>



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
