import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle, CheckCircle } from 'lucide-react';

const Privacidade = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const dataCategories = [
    {
      category: 'Dados Pessoais',
      examples: ['Nome completo', 'CPF/CNPJ', 'Endereço', 'Telefone', 'Email'],
      purpose: 'Identificação e comunicação',
      retention: 'Até 5 anos após encerramento da conta'
    },
    {
      category: 'Dados de Navegação',
      examples: ['IP', 'Cookies', 'Histórico', 'Preferências'],
      purpose: 'Melhorar experiência e segurança',
      retention: 'Até 2 anos'
    },
    {
      category: 'Dados Transacionais',
      examples: ['Histórico de compras', 'Pagamentos', 'Fretes', 'NFTs'],
      purpose: 'Processamento de transações',
      retention: 'Até 10 anos (obrigação fiscal)'
    },
    {
      category: 'Dados de Localização',
      examples: ['Coordenadas GPS', 'Endereço de entrega', 'Rota de frete'],
      purpose: 'Serviços de localização e entrega',
      retention: 'Até 3 anos'
    }
  ];

  const userRights = [
    {
      right: 'Acesso aos Dados',
      description: 'Solicitar acesso a todos os dados pessoais que temos sobre você',
      icon: <Eye className="w-5 h-5 text-blue-500" />
    },
    {
      right: 'Correção',
      description: 'Solicitar correção de dados incorretos ou desatualizados',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      right: 'Exclusão',
      description: 'Solicitar exclusão de dados pessoais (com exceções legais)',
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />
    },
    {
      right: 'Portabilidade',
      description: 'Receber seus dados em formato estruturado e legível',
      icon: <Database className="w-5 h-5 text-purple-500" />
    },
    {
      right: 'Revogação do Consentimento',
      description: 'Revogar consentimento para uso de dados a qualquer momento',
      icon: <UserCheck className="w-5 h-5 text-orange-500" />
    },
    {
      right: 'Oposição',
      description: 'Opor-se ao processamento de dados para finalidades específicas',
      icon: <Shield className="w-5 h-5 text-indigo-500" />
    }
  ];

  const securityMeasures = [
    'Criptografia de ponta a ponta para dados sensíveis',
    'Autenticação de dois fatores (2FA)',
    'Monitoramento contínuo de segurança',
    'Backups regulares e seguros',
    'Controle de acesso baseado em funções',
    'Auditorias regulares de segurança',
    'Conformidade com padrões internacionais (ISO 27001)',
    'Treinamento da equipe em segurança da informação'
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
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            Política de Privacidade
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Como protegemos e tratamos seus dados pessoais no Agroisync
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Aviso LGPD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-6 rounded-xl border mb-16 ${
              isDark 
                ? 'bg-blue-900/20 border-blue-700' 
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              <Lock className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-blue-700 mb-2">Conformidade com LGPD</h3>
                <p className="text-blue-700">
                  Nossa política está em total conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). 
                  Comprometemo-nos a proteger seus dados pessoais e respeitar seus direitos fundamentais.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Categorias de Dados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Dados que Coletamos</h2>
            
            <div className="space-y-6">
              {dataCategories.map((category, index) => (
                <motion.div
                  key={category.category}
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
                    <div className="flex-shrink-0 p-2 rounded-lg bg-blue-100 text-blue-600">
                      <Database className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-3">{category.category}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-gray-500">Exemplos</h4>
                          <ul className="space-y-1">
                            {category.examples.map((example, idx) => (
                              <li key={idx} className="text-xs text-gray-600">• {example}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-gray-500">Finalidade</h4>
                          <p className="text-xs text-gray-600">{category.purpose}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-gray-500">Retenção</h4>
                          <p className="text-xs text-gray-600">{category.retention}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Direitos do Usuário */}
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
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Seus Direitos LGPD</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Conheça todos os seus direitos como titular de dados pessoais
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userRights.map((right, index) => (
                <motion.div
                  key={right.right}
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
                    <div className="flex-shrink-0">
                      {right.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{right.right}</h3>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {right.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Medidas de Segurança */}
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
                <Lock className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Medidas de Segurança</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Implementamos as mais rigorosas medidas de segurança para proteger seus dados
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityMeasures.map((measure, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center space-x-3 p-4 rounded-lg ${
                    isDark 
                      ? 'bg-green-900/20 border border-green-700' 
                      : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className={`text-sm ${
                    isDark ? 'text-green-200' : 'text-green-700'
                  }`}>
                    {measure}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Compartilhamento de Dados */}
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
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Compartilhamento de Dados</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Saiba quando e como seus dados podem ser compartilhados
              </p>
            </div>

            <div className={`p-8 rounded-xl border ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3 text-green-500">✅ Compartilhamento Autorizado</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Prestadores de serviço:</strong> Apenas para funcionalidades essenciais (pagamentos, frete)</li>
                    <li>• <strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial</li>
                    <li>• <strong>Parceiros comerciais:</strong> Com seu consentimento explícito</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3 text-red-500">❌ Nunca Compartilhamos</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Dados pessoais para marketing sem consentimento</li>
                    <li>• Informações financeiras com terceiros não autorizados</li>
                    <li>• Dados de localização para fins não relacionados aos serviços</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Informações Legais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-8 rounded-xl border mb-16 ${
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
                <strong>Dados Sigilosos:</strong> Todos os dados confidenciais e informações sigilosas 
                são tratados com máxima segurança, utilizando criptografia avançada e protocolos 
                de segurança internacionais. Implementamos controles rigorosos de acesso e 
                monitoramento contínuo.
              </p>
              
              <p>
                <strong>Isenção de Responsabilidade:</strong> O Agroisync não se responsabiliza por 
                vazamentos de dados causados por terceiros, falhas técnicas de sistemas externos, 
                ou por uso inadequado de credenciais pelo usuário. Nossa responsabilidade é limitada 
                ao que está expressamente previsto na LGPD.
              </p>
              
              <p>
                <strong>Encarregado de Dados (DPO):</strong> Para exercer seus direitos ou esclarecer 
                dúvidas sobre esta política, entre em contato com nosso Encarregado de Proteção de Dados 
                através do email: dpo@agroisync.com
              </p>
              
              <p>
                <strong>Autoridade Nacional de Proteção de Dados (ANPD):</strong> Em caso de 
                insatisfação com o tratamento de seus dados, você pode recorrer à ANPD através 
                do site: www.gov.br/anpd
              </p>
            </div>
          </motion.div>

          {/* Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Dúvidas sobre Privacidade?</h3>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Nossa equipe de proteção de dados está disponível para esclarecer qualquer dúvida
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

export default Privacidade;
