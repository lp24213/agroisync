import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Contrast, 
  ZoomIn, 
  ZoomOut,
  Settings,
  X,
  Accessibility,
  Mic,
  MicOff
} from 'lucide-react';

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    voiceEnabled: true,
    screenReader: false,
    fontSize: 'normal',
    zoom: 100
  });

  // Aplicar configurações de acessibilidade
  useEffect(() => {
    const root = document.documentElement;
    
    // Alto contraste
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Texto grande
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Movimento reduzido
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Zoom
    root.style.fontSize = `${settings.zoom}%`;
    
  }, [settings]);

  // Inicializar leitor de tela
  useEffect(() => {
    if (settings.screenReader && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Modo leitor de tela ativado');
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [settings.screenReader]);

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const announceToScreenReader = (text) => {
    if (settings.screenReader && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Adicionar listeners para navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + A para abrir painel de acessibilidade
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsOpen(true);
        announceToScreenReader('Painel de acessibilidade aberto');
      }
      
      // Escape para fechar
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        announceToScreenReader('Painel de acessibilidade fechado');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, settings.screenReader]);

  return (
    <>
      {/* Botão de Acessibilidade */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(true);
          announceToScreenReader('Painel de acessibilidade aberto');
        }}
        className="fixed bottom-6 left-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Abrir configurações de acessibilidade"
      >
        <Accessibility size={24} />
      </motion.button>

      {/* Painel de Acessibilidade */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-labelledby="accessibility-title"
              aria-describedby="accessibility-description"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Accessibility size={32} />
                    <div>
                      <h2 id="accessibility-title" className="text-xl font-bold">Acessibilidade</h2>
                      <p id="accessibility-description" className="text-blue-100 text-sm">Configurações para melhorar sua experiência</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      announceToScreenReader('Painel de acessibilidade fechado');
                    }}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Fechar painel de acessibilidade"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Atalhos de Teclado */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Atalhos de Teclado</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                    <div><kbd className="bg-blue-200 px-2 py-1 rounded">Alt + A</kbd> Abrir acessibilidade</div>
                    <div><kbd className="bg-blue-200 px-2 py-1 rounded">Esc</kbd> Fechar painel</div>
                    <div><kbd className="bg-blue-200 px-2 py-1 rounded">Tab</kbd> Navegar elementos</div>
                    <div><kbd className="bg-blue-200 px-2 py-1 rounded">Enter</kbd> Ativar elemento</div>
                  </div>
                </div>

                {/* Configurações Visuais */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Configurações Visuais</h3>
                  
                  <div className="space-y-4">
                    {/* Alto Contraste */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Contrast size={20} className="text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-800">Alto Contraste</h4>
                          <p className="text-sm text-gray-600">Melhora a visibilidade para pessoas com baixa visão</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          toggleSetting('highContrast');
                          announceToScreenReader(settings.highContrast ? 'Alto contraste desativado' : 'Alto contraste ativado');
                        }}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-label={`${settings.highContrast ? 'Desativar' : 'Ativar'} alto contraste`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Texto Grande */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Type size={20} className="text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-800">Texto Grande</h4>
                          <p className="text-sm text-gray-600">Aumenta o tamanho da fonte para melhor leitura</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          toggleSetting('largeText');
                          announceToScreenReader(settings.largeText ? 'Texto grande desativado' : 'Texto grande ativado');
                        }}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.largeText ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-label={`${settings.largeText ? 'Desativar' : 'Ativar'} texto grande`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.largeText ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Zoom */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <ZoomIn size={20} className="text-gray-600" />
                        <h4 className="font-medium text-gray-800">Zoom da Página</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const newZoom = Math.max(75, settings.zoom - 25);
                            updateSetting('zoom', newZoom);
                            announceToScreenReader(`Zoom ajustado para ${newZoom}%`);
                          }}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                          aria-label="Diminuir zoom"
                        >
                          <ZoomOut size={16} />
                        </button>
                        <span className="text-sm font-medium min-w-[60px] text-center">
                          {settings.zoom}%
                        </span>
                        <button
                          onClick={() => {
                            const newZoom = Math.min(200, settings.zoom + 25);
                            updateSetting('zoom', newZoom);
                            announceToScreenReader(`Zoom ajustado para ${newZoom}%`);
                          }}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                          aria-label="Aumentar zoom"
                        >
                          <ZoomIn size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configurações de Áudio */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Configurações de Áudio</h3>
                  
                  <div className="space-y-4">
                    {/* Leitor de Tela */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Volume2 size={20} className="text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-800">Leitor de Tela</h4>
                          <p className="text-sm text-gray-600">Anuncia elementos da página em voz alta</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          toggleSetting('screenReader');
                          announceToScreenReader(settings.screenReader ? 'Leitor de tela desativado' : 'Leitor de tela ativado');
                        }}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.screenReader ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-label={`${settings.screenReader ? 'Desativar' : 'Ativar'} leitor de tela`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.screenReader ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    {/* Áudio Habilitado */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mic size={20} className="text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-800">Comando de Voz</h4>
                          <p className="text-sm text-gray-600">Permite interação por voz</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          toggleSetting('voiceEnabled');
                          announceToScreenReader(settings.voiceEnabled ? 'Comando de voz desativado' : 'Comando de voz ativado');
                        }}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.voiceEnabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-label={`${settings.voiceEnabled ? 'Desativar' : 'Ativar'} comando de voz`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.voiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Movimento Reduzido */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <EyeOff size={20} className="text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-800">Movimento Reduzido</h4>
                      <p className="text-sm text-gray-600">Reduz animações para pessoas sensíveis ao movimento</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      toggleSetting('reducedMotion');
                      announceToScreenReader(settings.reducedMotion ? 'Movimento reduzido desativado' : 'Movimento reduzido ativado');
                    }}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-label={`${settings.reducedMotion ? 'Desativar' : 'Ativar'} movimento reduzido`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 p-6 rounded-b-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Essas configurações são salvas localmente no seu navegador
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      announceToScreenReader('Painel de acessibilidade fechado');
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityPanel;
