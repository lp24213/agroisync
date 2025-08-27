import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle,
  MessageSquare, Building, Globe, ArrowRight
} from 'lucide-react';
// Componentes removidos - já renderizados pelo Layout global

const Contato = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-agro-green" />,
      title: t('contact.info.address.title'),
      content: 'Sinop - MT, Brasil',
      color: 'from-agro-green to-tech-green'
    },
    {
      icon: <Phone className="w-6 h-6 text-agro-gold" />,
      title: t('contact.info.phone.title'),
      content: '(66) 99236-2830',
      color: 'from-agro-gold to-tech-blue'
    },
    {
      icon: <Mail className="w-6 h-6 text-tech-blue" />,
      title: t('contact.info.email.title'),
      content: 'contato@agroisync.com',
      color: 'from-tech-blue to-agro-green'
    },
    {
      icon: <Clock className="w-6 h-6 text-agro-brown" />,
      title: t('contact.info.hours.title'),
      content: 'Segunda a Sexta: 8h às 18h',
      color: 'from-agro-brown to-agro-gold'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
              <div className="absolute inset-0 bg-white opacity-95"></div>
            </div>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-5xl md:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}
          >
            Entre em Contato
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl md:text-2xl max-w-4xl mx-auto mb-8 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}
          >
            Estamos aqui para ajudar você a aproveitar ao máximo a plataforma Agroisync
          </motion.p>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-slate-500'}`}
          >
            Nossa equipe está pronta para responder suas dúvidas e auxiliar em qualquer questão relacionada ao agronegócio
          </motion.p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Informações de Contato
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Entre em contato conosco através dos canais abaixo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center group"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${info.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {info.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  {info.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Envie sua Mensagem
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Preencha o formulário abaixo e entraremos em contato o mais breve possível
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
          >
            {success ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Mensagem Enviada!</h3>
                <p className="text-slate-600 mb-6">
                  Obrigado pelo seu contato. Retornaremos em breve!
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors duration-300"
                >
                  Enviar Nova Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Assunto *
                    </label>
                    <input
                      type="text"
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Descreva sua dúvida ou solicitação..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center mx-auto space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Enviar Mensagem</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Additional Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Outras Formas de Contato
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Além do formulário, você pode nos encontrar em outras plataformas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-slate-500 to-slate-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Chat Online
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                Converse conosco em tempo real através do chat da plataforma
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <Building className="w-10 h-10" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Escritório
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                Visite nosso escritório em Sinop - MT para atendimento presencial
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-10 h-10" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Redes Sociais
              </h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                Siga-nos nas redes sociais para novidades e atualizações
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contato;
