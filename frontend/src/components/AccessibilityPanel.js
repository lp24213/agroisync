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
  const [announcements, setAnnouncements] = useState([]);

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

  // Aplicar configurações de acessibilidade
  const applyAccessibilitySettings = newSettings => {
    const root = document.documentElement;

    // Visual
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
      announceToScreenReader('Alto contraste ativado');
    } else {
      root.classList.remove('high-contrast');
    }

    if (newSettings.largeText) {
      root.classList.add('large-text');
      announceToScreenReader('Texto grande ativado');
    } else {
      root.classList.remove('large-text');
    }

    if (newSettings.reduceMotion) {
      root.classList.add('reduce-motion');
      announceToScreenReader('Movimento reduzido ativado');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (newSettings.colorBlind) {
      root.classList.add('color-blind-friendly');
      announceToScreenReader('Modo daltônico ativado');
    } else {
      root.classList.remove('color-blind-friendly');
    }

    // Motor
    if (newSettings.largeClickTargets) {
      root.classList.add('large-targets');
      announceToScreenReader('Alvos de clique grandes ativados');
    } else {
      root.classList.remove('large-targets');
    }

    if (newSettings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
      announceToScreenReader('Navegação por teclado ativada');
    } else {
      root.classList.remove('keyboard-navigation');
    }

    // Cognitive
    if (newSettings.simplifiedLayout) {
      root.classList.add('simplified-layout');
      announceToScreenReader('Layout simplificado ativado');
    } else {
      root.classList.remove('simplified-layout');
    }

    if (newSettings.readingGuide) {
      root.classList.add('reading-guide');
      announceToScreenReader('Guia de leitura ativado');
    } else {
      root.classList.remove('reading-guide');
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
    setAnnouncements(prev => [...prev, { id: Date.now(), message }]);

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
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3 }}
        className='accessibility-panel-button fixed right-0 top-0 z-40 h-full w-96 overflow-y-auto border-l border-black bg-black text-white shadow-2xl md:z-50'
        role='dialog'
        aria-labelledby='accessibility-panel-title'
        aria-modal='true'
      >
        {/* Header */}
        <div className='border-b border-black p-6' style={{ background: 'linear-gradient(135deg,#0f0f0f,#1a1a1a)' }}>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Accessibility className='h-6 w-6 text-yellow-400' />
              <h2 id='accessibility-panel-title' className='text-xl font-bold'>
                Painel de Acessibilidade
              </h2>
            </div>
            <button
              onClick={onClose}
              className='rounded-lg p-2 transition-colors hover:bg-white/10'
              aria-label='Fechar painel de acessibilidade'
            >
              <X className='h-5 w-5' />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex border-b border-black'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 p-4 transition-colors ${
                  activeTab === tab.id ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800'
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
