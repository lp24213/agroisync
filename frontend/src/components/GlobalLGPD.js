import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, Eye, Lock, Database, User, X } from 'lucide-react';

const GlobalLGPD = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCookies, setAcceptedCookies] = useState(false);
  const [acceptedDataProcessing, setAcceptedDataProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Verificar se já aceitou anteriormente
  useEffect(() => {
    const lgpdConsent = localStorage.getItem('agroisync-lgpd-consent');
    if (lgpdConsent !== 'accepted') {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    if (acceptedTerms && acceptedCookies && acceptedDataProcessing) {
      localStorage.setItem('agroisync-lgpd-consent', 'accepted');
      localStorage.setItem('agroisync-lgpd-timestamp', new Date().toISOString());
      setIsVisible(false);
    }
  };

  const handleDecline = () => {
    localStorage.setItem('agroisync-lgpd-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
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
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={32} />
                <div>
                  <h2 className="text-xl font-bold">Conformidade LGPD</h2>
                  <p className="text-gray-300 text-sm">Proteção de Dados Pessoais</p>
                </div>
              </div>
              <button
                onClick={handleDecline}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Introdução */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Importante - Lei Geral de Proteção de Dados</h3>
                  <p className="text-blue-700 text-sm">
                    O AGROISYNC está comprometido com a proteção dos seus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD).
                    Para continuar usando nossos serviços, precisamos do seu consentimento para o processamento dos seus dados.
                  </p>
                </div>
              </div>
            </div>

            {/* Dados Coletados */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Database size={20} className="text-gray-600" />
                Dados Coletados pelo AGROISYNC
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Dados de Identificação</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Nome e sobrenome</li>
                    <li>• Endereço de e-mail</li>
                    <li>• Telefone (opcional)</li>
                    <li>• Localização (opcional)</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Dados de Uso</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Histórico de navegação</li>
                    <li>• Preferências do usuário</li>
                    <li>• Dados de transações</li>
                    <li>• Interações com IA</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Finalidades */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Eye size={20} className="text-gray-600" />
                Finalidades do Processamento
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle size={16} className="text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-green-800">Melhoria do Serviço</h4>
                    <p className="text-sm text-green-700">Análise de uso para melhorar a plataforma</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle size={16} className="text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-800">Personalização</h4>
                    <p className="text-sm text-blue-700">Adaptar conteúdo às suas necessidades</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <CheckCircle size={16} className="text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-purple-800">Suporte Técnico</h4>
                    <p className="text-sm text-purple-700">Fornecer suporte e resolver problemas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direitos do Usuário */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User size={20} className="text-gray-600" />
                Seus Direitos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Acesso aos seus dados</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Correção de dados incorretos</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Exclusão dos seus dados</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Portabilidade dos dados</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Revogação do consentimento</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Informações sobre o processamento</span>
                </div>
              </div>
            </div>

            {/* Segurança */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Lock size={20} className="text-gray-600" />
                Medidas de Segurança
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                <div>• Criptografia de dados em trânsito</div>
                <div>• Criptografia de dados em repouso</div>
                <div>• Acesso restrito aos dados</div>
                <div>• Auditoria regular de segurança</div>
                <div>• Backup seguro dos dados</div>
                <div>• Monitoramento de acesso</div>
              </div>
            </div>

            {/* Checkboxes de Consentimento */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  <strong>Termos de Uso:</strong> Li e aceito os termos de uso do AGROISYNC.
                </label>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cookies"
                  checked={acceptedCookies}
                  onChange={(e) => setAcceptedCookies(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="cookies" className="text-sm text-gray-700">
                  <strong>Cookies:</strong> Autorizo o uso de cookies para melhorar a experiência.
                </label>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="data-processing"
                  checked={acceptedDataProcessing}
                  onChange={(e) => setAcceptedDataProcessing(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="data-processing" className="text-sm text-gray-700">
                  <strong>Processamento de Dados:</strong> Autorizo o processamento dos meus dados pessoais conforme descrito acima.
                </label>
              </div>
            </div>

            {/* Detalhes Adicionais */}
            <div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                {showDetails ? 'Ocultar detalhes' : 'Ver detalhes completos'}
              </button>
              
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="space-y-3 text-sm text-gray-600">
                      <p><strong>Responsável pelo tratamento:</strong> AGROISYNC LTDA</p>
                      <p><strong>CNPJ:</strong> 00.000.000/0001-00</p>
                      <p><strong>E-mail:</strong> privacidade@agroisync.com</p>
                      <p><strong>Telefone:</strong> (11) 99999-9999</p>
                      <p><strong>Endereço:</strong> Rua Exemplo, 123 - São Paulo/SP</p>
                      <p><strong>Prazo de retenção:</strong> Os dados serão mantidos pelo tempo necessário para cumprir as finalidades descritas ou conforme exigido por lei.</p>
                      <p><strong>Compartilhamento:</strong> Seus dados não serão compartilhados com terceiros sem seu consentimento, exceto quando exigido por lei.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 rounded-b-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Recusar
              </button>
              <button
                onClick={handleAccept}
                disabled={!acceptedTerms || !acceptedCookies || !acceptedDataProcessing}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Aceitar e Continuar
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Ao continuar, você concorda com nossa Política de Privacidade e os Termos de Uso.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalLGPD;
