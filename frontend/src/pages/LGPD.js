import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Scale, UserCheck, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

const LGPD = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const lgpdPrinciples = [
    {
      principle: 'Finalidade',
      description: 'Os dados são coletados para finalidades específicas, explícitas e legítimas',
      icon: <CheckCircle className="w-6 h-6 text-green-500" />
    },
    {
      principle: 'Adequação',
      description: 'O tratamento é compatível com as finalidades informadas ao titular',
      icon: <Scale className="w-6 h-6 text-blue-500" />
    },
    {
      principle: 'Necessidade',
      description: 'Limitamos o tratamento ao mínimo necessário para as finalidades',
      icon: <Shield className="w-6 h-6 text-purple-500" />
    },
    {
      principle: 'Livre Acesso',
      description: 'Garantimos acesso facilitado às informações sobre o tratamento',
      icon: <UserCheck className="w-6 h-6 text-orange-500" />
    },
    {
      principle: 'Qualidade dos Dados',
      description: 'Garantimos exatidão, clareza e atualização dos dados',
      icon: <FileText className="w-6 h-6 text-indigo-500" />
    },
    {
      principle: 'Transparência',
      description: 'Informações claras sobre o tratamento, incluindo responsáveis',
      icon: <Lock className="w-6 h-6 text-cyan-500" />
    }
  ];

  const legalBases = [
    {
      basis: 'Consentimento',
      description: 'Autorização livre, informada e inequívoca do titular',
      examples: ['Marketing', 'Cookies opcionais', 'Compartilhamento com parceiros'],
      color: 'from-green-500 to-green-600'
    },
    {
      basis: 'Execução de Contrato',
      description: 'Necessário para cumprir obrigações contratuais',
      examples: ['Processamento de pagamentos', 'Entrega de produtos', 'Suporte técnico'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      basis: 'Obrigação Legal',
      description: 'Cumprimento de obrigação legal ou regulatória',
      examples: ['Relatórios fiscais', 'Prevenção à lavagem de dinheiro', 'Auditorias'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      basis: 'Interesse Legítimo',
      description: 'Para proteger interesses legítimos do Agroisync ou terceiros',
      examples: ['Segurança da plataforma', 'Prevenção de fraudes', 'Melhorias de serviço'],
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const dataProcessing = [
    {
      stage: 'Coleta',
      measures: ['Formulários seguros', 'Consentimento explícito', 'Minimização de dados'],
      icon: '📥'
    },
    {
      stage: 'Processamento',
      measures: ['Criptografia', 'Controle de acesso', 'Logs de auditoria'],
      icon: '⚙️'
    },
    {
      stage: 'Armazenamento',
      measures: ['Backups seguros', 'Redundância', 'Monitoramento contínuo'],
      icon: '💾'
    },
    {
      stage: 'Compartilhamento',
      measures: ['Acordos de confidencialidade', 'Transferências seguras', 'Controle rigoroso'],
      icon: '🔗'
    },
    {
      stage: 'Exclusão',
      measures: ['Processo automatizado', 'Verificação de conformidade', 'Documentação'],
      icon: '🗑️'
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
            <Scale className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            Lei Geral de Proteção de Dados
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Conformidade total com a LGPD e proteção dos seus dados pessoais
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* O que é LGPD */}
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
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">O que é a LGPD?</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) é a legislação brasileira 
                que regula o tratamento de dados pessoais, garantindo maior controle aos cidadãos 
                sobre suas informações.
              </p>
            </div>

            <div className={`p-8 rounded-xl border ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-3 text-green-500">✅ Objetivos da LGPD</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Proteger dados pessoais dos cidadãos</li>
                    <li>• Estabelecer regras claras para empresas</li>
                    <li>• Promover transparência no tratamento</li>
                    <li>• Garantir direitos aos titulares</li>
                    <li>• Criar ambiente de confiança digital</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3 text-blue-500">🎯 Aplicação</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Todas as empresas que tratam dados</li>
                    <li>• Setor público e privado</li>
                    <li>• Dados coletados no Brasil</li>
                    <li>• Dados de brasileiros no exterior</li>
                    <li>• Sanções administrativas e judiciais</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Princípios da LGPD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Princípios Fundamentais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lgpdPrinciples.map((principle, index) => (
                <motion.div
                  key={principle.principle}
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
                      {principle.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-3">{principle.principle}</h3>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bases Legais */}
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
                <Scale className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Bases Legais para Tratamento</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Conheça as bases legais que autorizam o tratamento de seus dados pessoais
              </p>
            </div>

            <div className="space-y-6">
              {legalBases.map((basis, index) => (
                <motion.div
                  key={basis.basis}
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
                    <div className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-r ${basis.color} text-white`}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-3">{basis.basis}</h3>
                      <p className={`text-sm mb-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {basis.description}
                      </p>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-gray-500">Exemplos de Aplicação:</h4>
                        <div className="flex flex-wrap gap-2">
                          {basis.examples.map((example, idx) => (
                            <span key={idx} className={`px-3 py-1 text-xs rounded-full ${
                              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Ciclo de Vida dos Dados */}
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
                <Lock className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Ciclo de Vida dos Dados</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Como protegemos seus dados em cada etapa do processamento
              </p>
            </div>

            <div className="space-y-6">
              {dataProcessing.map((stage, index) => (
                <motion.div
                  key={stage.stage}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`p-6 rounded-xl border ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{stage.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-3">{stage.stage}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stage.measures.map((measure, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">{measure}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Conformidade Agroisync */}
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
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Conformidade Agroisync</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Nossas medidas para garantir total conformidade com a LGPD
              </p>
            </div>

            <div className={`p-8 rounded-xl border ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4 text-green-500">✅ Implementado</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Política de Privacidade transparente</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Consentimento explícito para cookies</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Controle de acesso rigoroso</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Criptografia de dados sensíveis</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Processo de exclusão automatizado</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-4 text-blue-500">🔄 Em Desenvolvimento</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <span className="text-sm">Dashboard de privacidade para usuários</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <span className="text-sm">Relatórios de impacto à proteção de dados</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <span className="text-sm">Certificação ISO 27001</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <span className="text-sm">Auditorias externas regulares</span>
                    </li>
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
                são tratados em estrita conformidade com a LGPD. Implementamos controles rigorosos 
                de acesso, criptografia avançada e monitoramento contínuo para garantir a segurança 
                das informações.
              </p>
              
              <p>
                <strong>Isenção de Responsabilidade:</strong> O Agroisync não se responsabiliza por 
                violações de LGPD causadas por terceiros, falhas técnicas de sistemas externos, ou 
                por uso inadequado de credenciais pelo usuário. Nossa responsabilidade é limitada ao 
                que está expressamente previsto na legislação.
              </p>
              
              <p>
                <strong>Encarregado de Dados (DPO):</strong> Para exercer seus direitos LGPD ou 
                esclarecer dúvidas sobre conformidade, entre em contato com nosso Encarregado de 
                Proteção de Dados através do email: dpo@agroisync.com
              </p>
              
              <p>
                <strong>Autoridade Nacional de Proteção de Dados (ANPD):</strong> Em caso de 
                insatisfação com o tratamento de seus dados ou suspeita de violação da LGPD, 
                você pode recorrer à ANPD através do site: www.gov.br/anpd
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
            <h3 className="text-2xl font-bold mb-4">Dúvidas sobre LGPD?</h3>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Nossa equipe de conformidade está disponível para esclarecer qualquer dúvida sobre a LGPD
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

export default LGPD;
