import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle 
} from 'lucide-react';

const Contato = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simular envio para o backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em produção, enviar para: contato@agroisync.com
      console.log('Dados do formulário:', formData);
      
      setSubmitSuccess(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
      
      // Resetar sucesso após 5 segundos
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Localização',
      content: 'Sinop - MT, Brasil',
      description: 'Centro de tecnologia agropecuária'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Telefone',
      content: '(66) 99236-2830',
      description: 'Atendimento de segunda a sexta'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'E-mail',
      content: 'contato@agroisync.com',
      description: 'Resposta em até 24 horas'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Horário de Atendimento',
      content: 'Segunda a Sexta',
      description: '8h às 18h (GMT-4)'
    }
  ];

  const supportEmails = [
    { email: 'contato@agroisync.com', label: 'Contato Geral' },
    { email: 'suporte@agroisync.com', label: 'Suporte Técnico' }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-green-900/20 to-blue-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            Entre em Contato
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Estamos aqui para ajudar você a conectar-se ao futuro do agronegócio
          </motion.p>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-xl border border-gray-200 hover:border-green-500 shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-white">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {info.title}
                </h3>
                <p className="text-lg font-semibold mb-2 text-green-600">
                  {info.content}
                </p>
                <p className="text-sm text-gray-600">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* E-mails de Suporte */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center p-8 rounded-2xl mb-16 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              E-mails de Suporte
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportEmails.map((emailInfo, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm mb-2 text-gray-600">
                    {emailInfo.label}
                  </p>
                  <a
                    href={`mailto:${emailInfo.email}`}
                    className="text-lg font-semibold hover:text-green-500 transition-colors text-green-600"
                  >
                    {emailInfo.email}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Formulário de Contato */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Envie sua Mensagem
            </h2>

            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Mensagem enviada com sucesso! Entraremos em contato em breve.</span>
              </motion.div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg border transition-colors bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg border transition-colors bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border transition-colors bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500"
                    placeholder="(66) 99236-2830"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg border transition-colors bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500"
                    placeholder="Como podemos ajudar?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Mensagem *
                </label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full p-3 rounded-lg border transition-colors resize-none bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500"
                  placeholder="Descreva sua dúvida ou solicitação..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
                >
                  {isSubmitting ? (
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
          </motion.div>
        </div>
      </section>

      {/* Mapa */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Nossa Localização
            </h2>
            
            <div className="text-center mb-6">
              <p className="text-lg text-gray-700">
                Sinop - Mato Grosso, Brasil
              </p>
              <p className="text-sm text-gray-600">
                Centro de tecnologia agropecuária
              </p>
            </div>

            {/* Mapa embutido - Google Maps */}
            <div className="w-full h-96 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24476.123456789!2d-55.6333!3d-11.8333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDUwJzAwLjAiUyA1NcKwMzgnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AgroSync - Sinop, MT"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contato;
