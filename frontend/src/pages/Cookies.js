import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Cookie, Eye, Lock, Settings, AlertTriangle } from 'lucide-react';

const Cookies = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const cookieTypes = [
    {
      type: 'Essenciais',
      description: 'Cookies necessários para o funcionamento básico do site',
      examples: ['Autenticação', 'Sessão do usuário', 'Preferências básicas'],
      necessary: true
    },
    {
      type: 'Analíticos',
      description: 'Cookies que nos ajudam a entender como o site é usado',
      examples: ['Google Analytics', 'Estatísticas de navegação', 'Melhorias de UX'],
      necessary: false
    },
    {
      type: 'Funcionais',
      description: 'Cookies que melhoram a funcionalidade do site',
      examples: ['Idioma preferido', 'Tema escuro/claro', 'Personalização'],
      necessary: false
    },
    {
      type: 'Marketing',
      description: 'Cookies usados para publicidade e marketing',
      examples: ['Anúncios personalizados', 'Redes sociais', 'Campanhas'],
      necessary: false
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300 pt-16`}>
      
      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
              <div className="absolute inset-0 bg-white opacity-95"></div>
            </div>
          )}
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-gradient-to-r from-green-500 to-blue-600"
          >
            <Cookie className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            Política de Cookies
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Saiba como utilizamos cookies para melhorar sua experiência no Agroisync
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* O que são Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">O que são Cookies?</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Cookies são pequenos arquivos de texto armazenados no seu dispositivo que nos ajudam a fornecer uma experiência personalizada e funcional.
              </p>
            </div>
          </motion.div>

          {/* Tipos de Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Tipos de Cookies que Utilizamos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cookieTypes.map((cookie, index) => (
                <motion.div
                  key={cookie.type}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${
                      cookie.necessary 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {cookie.necessary ? <Lock className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-lg">{cookie.type}</h3>
                        {cookie.necessary && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Necessário
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mb-3 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {cookie.description}
                      </p>
                      <div className="space-y-1">
                        {cookie.examples.map((example, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span className={`text-xs ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {example}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Como Gerenciar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Settings className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Como Gerenciar Cookies</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Você tem controle total sobre os cookies que aceita em nosso site
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`p-6 rounded-xl border text-center ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <Shield className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-bold mb-2">Configurações do Navegador</h3>
                <p className="text-sm">Acesse as configurações do seu navegador para gerenciar cookies</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`p-6 rounded-xl border text-center ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="font-bold mb-2">Aviso de Cookies</h3>
                <p className="text-sm">Sempre informamos quando novos cookies são utilizados</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`p-6 rounded-xl border text-center ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <Lock className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-bold mb-2">Controle Total</h3>
                <p className="text-sm">Você pode aceitar ou rejeitar cookies não essenciais</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Informações Legais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-8 rounded-xl border ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Informações Legais</h2>
            
            <div className="space-y-4 text-sm">
              <p>
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
              
              <p>
                Esta política de cookies está em conformidade com a Lei Geral de Proteção de Dados (LGPD) 
                e outras regulamentações aplicáveis. Ao continuar usando nosso site, você concorda com 
                o uso de cookies conforme descrito nesta política.
              </p>
              
              <p>
                <strong>Isenção de Responsabilidade:</strong> O Agroisync não se responsabiliza pelo 
                funcionamento de cookies de terceiros ou por mudanças nas políticas de cookies de 
                serviços externos integrados ao nosso site.
              </p>
              
              <p>
                <strong>Dados Sigilosos:</strong> Todos os dados coletados via cookies são tratados 
                conforme nossa Política de Privacidade e em estrita conformidade com a LGPD, 
                garantindo a segurança e confidencialidade das informações dos usuários.
              </p>
            </div>
          </motion.div>

          {/* Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16"
          >
            <h3 className="text-2xl font-bold mb-4">Dúvidas sobre Cookies?</h3>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Entre em contato conosco para esclarecer qualquer dúvida sobre nossa política de cookies
            </p>
            <a
              href="/contato"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Fale Conosco
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Cookies;
