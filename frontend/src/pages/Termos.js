import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { FileText, Shield, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const Termos = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const termsSections = [
    {
      title: 'Aceitação dos Termos',
      content: 'Ao acessar e usar o Agroisync, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.',
      icon: <CheckCircle className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Descrição dos Serviços',
      content: 'O Agroisync é uma plataforma digital que oferece marketplace de produtos agrícolas, serviços de frete (AgroConecta), soluções em criptomoedas e inteligência artificial para o agronegócio brasileiro.',
      icon: <Info className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Conta de Usuário',
      content: 'Para acessar certos recursos, você deve criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais e por todas as atividades que ocorrem em sua conta.',
      icon: <Shield className="w-6 h-6 text-purple-500" />
    },
    {
      title: 'Uso Aceitável',
      content: 'Você concorda em usar nossos serviços apenas para propósitos legais e de acordo com estes Termos. É proibido o uso para atividades ilegais, fraudulentas ou que violem direitos de terceiros.',
      icon: <CheckCircle className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Conteúdo do Usuário',
      content: 'Você mantém a propriedade do conteúdo que envia, mas concede ao Agroisync uma licença para usar, modificar e distribuir esse conteúdo para fornecer nossos serviços.',
      icon: <FileText className="w-6 h-6 text-orange-500" />
    },
    {
      title: 'Propriedade Intelectual',
      content: 'Todo o conteúdo, marcas registradas, patentes e outros direitos de propriedade intelectual no Agroisync são de propriedade da empresa ou de nossos licenciadores.',
      icon: <Shield className="w-6 h-6 text-indigo-500" />
    }
  ];

  const prohibitedActivities = [
    'Uso não autorizado de contas de outros usuários',
    'Transmissão de vírus, malware ou código malicioso',
    'Tentativas de hackear ou comprometer a segurança',
    'Spam ou mensagens não solicitadas',
    'Violação de direitos de propriedade intelectual',
    'Atividades ilegais ou fraudulentas',
    'Assédio ou comportamento abusivo',
    'Venda de produtos proibidos ou ilegais'
  ];

  const limitations = [
    'O Agroisync não garante que os serviços estarão sempre disponíveis ou livres de erros',
    'Não nos responsabilizamos por perdas indiretas, incidentais ou consequenciais',
    'Nossa responsabilidade total é limitada ao valor pago pelos serviços',
    'Não garantimos a precisão de informações fornecidas por terceiros',
    'Serviços podem ser interrompidos para manutenção ou atualizações'
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
            <FileText className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            Termos de Uso
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Conheça as regras e condições para uso da plataforma Agroisync
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Aviso Importante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-6 rounded-xl border mb-16 ${
              isDark 
                ? 'bg-yellow-900/20 border-yellow-700' 
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-yellow-700 mb-2">Aviso Importante</h3>
                <p className="text-yellow-700">
                  Ao usar nossos serviços, você concorda com estes Termos de Uso. 
                  Leia atentamente antes de prosseguir. Seus dados são tratados conforme nossa 
                  <a href="/privacidade" className="underline ml-1">Política de Privacidade</a>.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Seções dos Termos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Principais Cláusulas</h2>
            
            <div className="space-y-6">
              {termsSections.map((section, index) => (
                <motion.div
                  key={section.title}
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
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-3">{section.title}</h3>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Atividades Proibidas */}
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
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Atividades Proibidas</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                As seguintes atividades são estritamente proibidas e podem resultar em suspensão ou encerramento da conta
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prohibitedActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center space-x-3 p-4 rounded-lg ${
                    isDark 
                      ? 'bg-red-900/20 border border-red-700' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className={`text-sm ${
                    isDark ? 'text-red-200' : 'text-red-700'
                  }`}>
                    {activity}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Limitações de Responsabilidade */}
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
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Limitações de Responsabilidade</h2>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Compreenda as limitações de nossa responsabilidade legal
              </p>
            </div>

            <div className="space-y-4">
              {limitations.map((limitation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-start space-x-3 p-4 rounded-lg ${
                    isDark 
                      ? 'bg-gray-800 border border-gray-700' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {limitation}
                  </span>
                </motion.div>
              ))}
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
                <strong>Isenção de Responsabilidade:</strong> O Agroisync não se responsabiliza por 
                danos causados por terceiros, falhas técnicas de sistemas externos, ou por uso 
                inadequado de nossos serviços. Nossa responsabilidade é limitada ao que está 
                expressamente previsto nestes termos.
              </p>
              
              <p>
                <strong>Dados Sigilosos:</strong> Todas as informações confidenciais e dados 
                sigilosos são tratados conforme nossa Política de Privacidade e em estrita 
                conformidade com a LGPD. Implementamos medidas de segurança para proteger 
                suas informações.
              </p>
              
              <p>
                <strong>Modificações:</strong> Reservamo-nos o direito de modificar estes termos 
                a qualquer momento. Alterações significativas serão comunicadas com antecedência 
                através de notificação em nossa plataforma.
              </p>
              
              <p>
                <strong>Lei Aplicável:</strong> Estes termos são regidos pelas leis brasileiras. 
                Qualquer disputa será resolvida nos tribunais da comarca de Sinop - MT, Brasil.
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
            <h3 className="text-2xl font-bold mb-4">Dúvidas sobre os Termos?</h3>
            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Nossa equipe jurídica está disponível para esclarecer qualquer dúvida sobre estes termos
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

export default Termos;
