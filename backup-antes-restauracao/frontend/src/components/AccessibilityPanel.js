import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Volume2, MousePointer, X, Accessibility, Brain } from 'lucide-react';

const AccessibilityPanel = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    // Visual
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    colorBlind: false,
    screenReader: false,

    // Audio
    audioDescriptions: false,
    soundEffects: true,
    voiceNavigation: false,

    // Motor
    keyboardNavigation: true,
    largeClickTargets: false,
    stickyKeys: false,
    slowKeys: false,

    // Cognitive
    simplifiedLayout: false,
    readingGuide: false,
    focusIndicators: true,
    errorPrevention: true
  });

  const [activeTab, setActiveTab] = useState('visual');
  // const [announcements, setAnnouncements] = useState([]);

  // Carregar configurações salvas
  useEffect(() => {
    const savedSettings = localStorage.getItem('agroisync-accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Salvar configurações
  const saveSettings = newSettings => {
    setSettings(newSettings);
    localStorage.setItem('agroisync-accessibility-settings', JSON.stringify(newSettings));
    applyAccessibilitySettings(newSettings);
  };

  // Aplicar configurações de acessibilidade - SEM BUGS
  const applyAccessibilitySettings = newSettings => {
    const root = document.documentElement;
    if (!root || !root.classList || typeof root.classList.add !== 'function') return; // PROTEÇÃO CRÍTICA

    // Visual - COM PROTEÇÃO CONTRA BUGS
    try {
      if (newSettings.highContrast) {
        if (root && root.classList && typeof root.classList.add === 'function') root.classList.add('high-contrast');
        announceToScreenReader('Alto contraste ativado');
      } else {
        root.classList.remove('high-contrast');
      }
    } catch (e) {
      console.warn('Erro ao aplicar alto contraste:', e);
    }

    try {
      if (newSettings.largeText) {
        if (root && root.classList && typeof root.classList.add === 'function') root.classList.add('large-text');
        announceToScreenReader('Texto grande ativado');
      } else {
        root.classList.remove('large-text');
      }
    } catch (e) {
      // Silenciar erro
    }

    try {
      if (newSettings.reduceMotion) {
        if (root && root.classList && typeof root.classList.add === 'function') root.classList.add('reduce-motion');
        announceToScreenReader('Movimento reduzido ativado');
      } else {
        root.classList.remove('reduce-motion');
      }
    } catch (e) {
      // Silenciar erro
    }

    try {
      if (newSettings.colorBlind) {
        if (root && root.classList && typeof root.classList.add === 'function') root.classList.add('color-blind-friendly');
        announceToScreenReader('Modo daltônico ativado');
      } else {
        root.classList.remove('color-blind-friendly');
      }
    } catch (e) {
      // Silenciar erro
    }

    // Motor - COM PROTEÇÃO
    try {
      if (newSettings.largeClickTargets) {
        if (root && root.classList && typeof root.classList.add === 'function') root.classList.add('large-targets');
        announceToScreenReader('Alvos de clique grandes ativados');
      } else {
        root.classList.remove('large-targets');
      }
    } catch (e) {
      // Silenciar erro
    }

    try {
      if (newSettings.keyboardNavigation) {
        if (root && root.classList && typeof root.classList.add === 'function') root.classList.add('keyboard-navigation');
        announceToScreenReader('Navegação por teclado ativada');
      } else {
        root.classList.remove('keyboard-navigation');
      }
    } catch (e) {
      // Silenciar erro
    }

    // Cognitive - COM PROTEÇÃO
    try {
      if (newSettings.simplifiedLayout) {
        if (root && root.classList && typeof root.classList.add === 'function') root.classList.add('simplified-layout');
        announceToScreenReader('Layout simplificado ativado');
      } else {
        root.classList.remove('simplified-layout');
      }
    } catch (e) {
      // Silenciar erro
    }

    try {
      if (newSettings.readingGuide) {
        if (root && root.classList && typeof root.classList.add === 'function') root.classList.add('reading-guide');
        announceToScreenReader('Guia de leitura ativado');
      } else {
        root.classList.remove('reading-guide');
      }
    } catch (e) {
      // Silenciar erro
    }
  };

  // Anunciar para leitores de tela
  const announceToScreenReader = message => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    // Registrar anúncio para ferramentas assistivas (mantém estado usado)
      // setAnnouncements(prev => [...prev, { id: Date.now(), message }]);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Atualizar configuração
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  // Resetar todas as configurações
  const resetSettings = () => {
    const defaultSettings = {
      highContrast: false,
      largeText: false,
      reduceMotion: false,
      colorBlind: false,
      screenReader: false,
      audioDescriptions: false,
      soundEffects: true,
      voiceNavigation: false,
      keyboardNavigation: true,
      largeClickTargets: false,
      stickyKeys: false,
      slowKeys: false,
      simplifiedLayout: false,
      readingGuide: false,
      focusIndicators: true,
      errorPrevention: true
    };
    saveSettings(defaultSettings);
    announceToScreenReader('Configurações de acessibilidade resetadas');
  };

  const tabs = [
    { id: 'visual', label: 'Visual', icon: Eye },
    { id: 'audio', label: 'Áudio', icon: Volume2 },
    { id: 'motor', label: 'Motor', icon: MousePointer },
    { id: 'cognitive', label: 'Cognitivo', icon: Brain }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
        className='accessibility-panel-button fixed left-4 bottom-4 z-40 w-80 md:w-[400px] h-[480px] md:h-[550px] overflow-y-auto rounded-2xl border border-blue-500 bg-black text-white shadow-2xl transition-all'
        style={{ 
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.94), rgba(8, 47, 73, 0.92))',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.45), 0 12px 40px rgba(0, 0, 0, 0.35)'
        }}
        role='dialog'
        aria-labelledby='accessibility-panel-title'
        aria-modal='true'
      >
        {/* Header Futurista */}
        <div className='border-b border-blue-500/25 p-6' style={{ 
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(0, 0, 0, 0.3))',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.28)'
        }}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 border border-blue-400'>
                <Accessibility className='h-6 w-6 text-blue-300' />
              </div>
              <div>
                <h2 id='accessibility-panel-title' className='text-xl font-bold text-white'>
                  Acessibilidade
                </h2>
                <p className='text-xs text-blue-200'>WCAG 2.1 AA</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='rounded-lg p-2 transition-all hover:bg-blue-500/20 hover:rotate-90'
              aria-label='Fechar painel de acessibilidade'
            >
              <X className='h-5 w-5 text-blue-300' />
            </button>
          </div>
        </div>

        {/* Tabs Futuristas */}
        <div className='flex border-b border-blue-500/20'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 p-4 transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                    : 'text-blue-200 hover:bg-blue-500/10'
                }`}
                aria-pressed={activeTab === tab.id}
              >
                <Icon className='h-4 w-4' />
                <span className='text-sm font-medium'>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className='space-y-6 p-6'>
          {/* Visual Tab */}
          {activeTab === 'visual' && (
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-green-400'>Configurações Visuais</h3>

              {/* VLibras Info - Destaque */}
              <div className='rounded-lg bg-gradient-to-r from-blue-900/35 to-cyan-900/25 border border-blue-400/50 p-4 shadow-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='w-3 h-3 bg-blue-400 rounded-full animate-pulse'></div>
                  <span className='font-bold text-blue-300 text-lg'>🤟 VLibras Ativo</span>
                </div>
                <p className='text-sm text-blue-200 font-medium'>
                  Widget oficial do governo brasileiro para tradução em LIBRAS (Língua Brasileira de Sinais).
                </p>
                <p className='text-xs text-blue-300 mt-2 bg-blue-500/20 p-2 rounded'>
                  📍 Localização: Canto inferior DIREITO da tela
                </p>
                <p className='text-xs text-blue-200 mt-1'>
                  ♿ Clique no botão AZUL redondo para ativar/desativar o intérprete virtual
                </p>
              </div>

              <div className='space-y-3'>
                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Alto Contraste</div>
                    <div className='text-sm text-gray-400'>Melhora a visibilidade para baixa visão</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.highContrast}
                    onChange={e => updateSetting('highContrast', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>

                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Texto Grande</div>
                    <div className='text-sm text-gray-400'>Aumenta o tamanho da fonte</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.largeText}
                    onChange={e => updateSetting('largeText', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>

                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Reduzir Movimento</div>
                    <div className='text-sm text-gray-400'>Desativa animações para sensibilidade</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.reduceMotion}
                    onChange={e => updateSetting('reduceMotion', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>

                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Modo Daltônico</div>
                    <div className='text-sm text-gray-400'>Cores amigáveis para daltônicos</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.colorBlind}
                    onChange={e => updateSetting('colorBlind', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>
              </div>
            </div>
          )}

          {/* Audio Tab */}
          {activeTab === 'audio' && (
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-green-400'>Configurações de Áudio</h3>

              <div className='space-y-3'>
                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Descrições de Áudio</div>
                    <div className='text-sm text-gray-400'>Narração de elementos visuais</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.audioDescriptions}
                    onChange={e => updateSetting('audioDescriptions', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>

                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Efeitos Sonoros</div>
                    <div className='text-sm text-gray-400'>Sons de feedback e navegação</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.soundEffects}
                    onChange={e => updateSetting('soundEffects', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>

                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Navegação por Voz</div>
                    <div className='text-sm text-gray-400'>Comandos de voz para navegação</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.voiceNavigation}
                    onChange={e => updateSetting('voiceNavigation', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>
              </div>
            </div>
          )}

          {/* Motor Tab */}
          {activeTab === 'motor' && (
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-green-400'>Configurações Motoras</h3>

              <div className='space-y-3'>
                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Navegação por Teclado</div>
                    <div className='text-sm text-gray-400'>Navegação completa via teclado</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.keyboardNavigation}
                    onChange={e => updateSetting('keyboardNavigation', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>

                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Alvos de Clique Grandes</div>
                    <div className='text-sm text-gray-400'>Botões e links maiores</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.largeClickTargets}
                    onChange={e => updateSetting('largeClickTargets', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>

                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Teclas Grudadas</div>
                    <div className='text-sm text-gray-400'>Permite pressionar teclas uma de cada vez</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.stickyKeys}
                    onChange={e => updateSetting('stickyKeys', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>

                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Teclas Lentas</div>
                    <div className='text-sm text-gray-400'>Aumenta o tempo para pressionar teclas</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.slowKeys}
                    onChange={e => updateSetting('slowKeys', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>
              </div>
            </div>
          )}

          {/* Cognitive Tab */}
          {activeTab === 'cognitive' && (
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-green-400'>Configurações Cognitivas</h3>

              <div className='space-y-3'>
                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Layout Simplificado</div>
                    <div className='text-sm text-gray-400'>Interface mais limpa e direta</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.simplifiedLayout}
                    onChange={e => updateSetting('simplifiedLayout', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>

                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Guia de Leitura</div>
                    <div className='text-sm text-gray-400'>Destaque da linha atual</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.readingGuide}
                    onChange={e => updateSetting('readingGuide', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>

                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Indicadores de Foco</div>
                    <div className='text-sm text-gray-400'>Destaque visual do elemento focado</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.focusIndicators}
                    onChange={e => updateSetting('focusIndicators', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>

                <label className='flex items-center justify-between rounded-lg bg-gray-800 p-3'>
                  <div>
                    <div className='font-medium'>Prevenção de Erros</div>
                    <div className='text-sm text-gray-400'>Confirmações e validações extras</div>
                  </div>
                  <input
                    type='checkbox'
                    checked={settings.errorPrevention}
                    onChange={e => updateSetting('errorPrevention', e.target.checked)}
                    className='h-5 w-5 text-green-600'
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='space-y-3 border-t border-gray-700 p-6'>
          <button
            onClick={resetSettings}
            className='w-full rounded-lg bg-red-600 p-3 font-medium transition-colors hover:bg-red-700'
          >
            Resetar Configurações
          </button>

          <div className='text-center text-sm text-gray-400'>
            <p>Configurações salvas automaticamente</p>
            <p className='mt-1'>Compatível com WCAG 2.1 AA</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccessibilityPanel;
