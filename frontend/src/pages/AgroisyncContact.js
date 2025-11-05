import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, User, MessageSquare, CheckCircle } from 'lucide-react';

const AgroisyncContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simula envio (integrar com backend depois)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Erro ao enviar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Principal',
      info: 'contato@agroisync.com',
      link: 'mailto:contato@agroisync.com'
    },
    {
      icon: Mail,
      title: 'Contato Comercial',
      info: 'luispaulo@agroisync.com',
      link: 'mailto:luispaulo@agroisync.com',
      subtitle: 'Luis Paulo de Oliveira'
    },
    {
      icon: Mail,
      title: 'Suporte Técnico',
      info: 'franco@agroisync.com',
      link: 'mailto:franco@agroisync.com',
      subtitle: 'Franco Piccoli'
    },
    {
      icon: Mail,
      title: 'Suporte Geral',
      info: 'taiza@agroisync.com',
      link: 'mailto:taiza@agroisync.com',
      subtitle: 'Taiza Dellazzari'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Entre em Contato
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos aqui para ajudar você a transformar o agronegócio. 
              Fale conosco através dos canais abaixo ou envie uma mensagem direta.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Nossos Canais
              </h2>

              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl text-white">
                      <item.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-sm text-gray-500 mb-2">{item.subtitle}</p>
                      )}
                      <p className="text-blue-600 font-medium">{item.info}</p>
                    </div>
                  </div>
                </motion.a>
              ))}

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-200"
              >
                <h3 className="font-semibold text-gray-800 text-lg mb-3 flex items-center gap-2">
                  <MapPin className="text-green-600" size={20} />
                  Onde Estamos
                </h3>
                <p className="text-gray-600">
                  Atendemos todo o Brasil com soluções digitais para o agronegócio.
                  Nossa plataforma está disponível 24/7 para você.
                </p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Envie sua Mensagem
              </h2>

              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700"
                >
                  <CheckCircle size={20} />
                  <span className="font-medium">Mensagem enviada com sucesso!</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Telefone (opcional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="comercial">Informações Comerciais</option>
                    <option value="suporte">Suporte Técnico</option>
                    <option value="parceria">Parceria</option>
                    <option value="feedback">Feedback/Sugestão</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare size={16} className="inline mr-2" />
                    Mensagem
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    placeholder="Digite sua mensagem aqui..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Mensagem
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgroisyncContact;

