import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente substituto: Banner de Cookies (fixo embaixo), clean e objetivo
const LGPDCompliance = ({ onAccept, onDecline, isVisible }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [prefs, setPrefs] = useState({
    necessary: true,
    performance: true,
    marketing: false
  });

  useEffect(() => {
    const stored = localStorage.getItem('agroisync-cookie-consent');
    if (stored === 'accepted' || stored === 'custom') {
      onAccept && onAccept();
    }
  }, [onAccept]);

  if (!isVisible) return null;

  const acceptAll = () => {
    localStorage.setItem('agroisync-cookie-consent', 'accepted');
    localStorage.setItem(
      'agroisync-cookie-prefs',
      JSON.stringify({
        necessary: true,
        performance: true,
        marketing: true
      })
    );
    onAccept && onAccept();
  };

  const saveCustom = () => {
    localStorage.setItem('agroisync-cookie-consent', 'custom');
    localStorage.setItem('agroisync-cookie-prefs', JSON.stringify(prefs));
    onAccept && onAccept();
  };

  const declineAll = () => {
    localStorage.setItem('agroisync-cookie-consent', 'declined');
    localStorage.setItem(
      'agroisync-cookie-prefs',
      JSON.stringify({
        necessary: true,
        performance: false,
        marketing: false
      })
    );
    onDecline && onDecline();
  };

  return (
    <>
      {/* Banner inferior */}
      <AnimatePresence>
        {!showConfig && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className='fixed inset-x-0 bottom-0 z-[2000]'
          >
            <div className='mx-auto max-w-5xl px-4 py-6 md:py-7'>
              <div className='rounded-xl border border-gray-200 bg-white px-5 py-6 shadow-xl md:px-8 md:py-7'>
                <p className='text-center text-lg leading-relaxed text-gray-700 md:text-xl'>
                  Nós usamos cookies para melhorar a sua experiência em nossos serviços. Ao utilizar nossos serviços,
                  você está ciente dessa funcionalidade.{' '}
                  <a href='/privacy' className='font-medium text-green-600 hover:underline'>
                    Saiba mais
                  </a>
                </p>
                <div className='mt-6 flex flex-col items-center justify-center gap-4 md:flex-row'>
                  <button onClick={acceptAll} className='btn px-8 text-lg' aria-label='Aceitar todos os cookies'>
                    Continuar
                  </button>
                  <button
                    onClick={() => setShowConfig(true)}
                    className='btn px-6 text-lg outline'
                    aria-label='Configurar cookies'
                  >
                    Configurar Cookies
                  </button>
                  <button onClick={declineAll} className='btn link text-base' aria-label='Recusar cookies opcionais'>
                    Recusar opcionais
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Painel de configuração simples */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[2100] flex items-end justify-center bg-black/50 p-4 md:items-center'
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className='w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl md:p-8'
            >
              <h3 className='mb-2 text-xl font-bold text-gray-900'>Preferências de Cookies</h3>
              <p className='mb-4 text-gray-600'>Escolha como deseja que usemos cookies opcionais.</p>

              <div className='space-y-4'>
                <label className='flex items-start gap-3 rounded-lg border border-gray-200 p-4'>
                  <input type='checkbox' checked readOnly className='mt-1' />
                  <div>
                    <p className='font-medium text-gray-900'>Necessários</p>
                    <p className='text-sm text-gray-600'>Essenciais para o funcionamento do site.</p>
                  </div>
                </label>

                <label className='flex items-start gap-3 rounded-lg border border-gray-200 p-4'>
                  <input
                    type='checkbox'
                    checked={prefs.performance}
                    onChange={e => setPrefs(p => ({ ...p, performance: e.target.checked }))}
                    className='mt-1'
                  />
                  <div>
                    <p className='font-medium text-gray-900'>Desempenho</p>
                    <p className='text-sm text-gray-600'>Ajuda a entender uso e melhorar a experiência.</p>
                  </div>
                </label>

                <label className='flex items-start gap-3 rounded-lg border border-gray-200 p-4'>
                  <input
                    type='checkbox'
                    checked={prefs.marketing}
                    onChange={e => setPrefs(p => ({ ...p, marketing: e.target.checked }))}
                    className='mt-1'
                  />
                  <div>
                    <p className='font-medium text-gray-900'>Marketing</p>
                    <p className='text-sm text-gray-600'>Ofertas e conteúdos relevantes para você.</p>
                  </div>
                </label>
              </div>

              <div className='mt-6 flex flex-col gap-3 md:flex-row'>
                <button onClick={() => setShowConfig(false)} className='btn flex-1 outline'>
                  Voltar
                </button>
                <button onClick={saveCustom} className='btn flex-1'>
                  Salvar Preferências
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LGPDCompliance;
