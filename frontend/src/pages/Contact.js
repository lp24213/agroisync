import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock, 
  User, 
  Building, 
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subjects = [
    'Suporte Técnico',
    'Vendas e Comercial',
    'Parcerias',
    'Feedback',
    'Outros'
  ];

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
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.email'),
      details: ['contato@agroisync.com', 'suporte@agroisync.com'],
      description: t('contact.responseTime')
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      details: ['(66) 99236-2830'],
      description: t('contact.workingHours')
    },
    {
      icon: MapPin,
      title: t('contact.location'),
      details: ['Sinop - MT'],
      description: t('contact.visitInfo')
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section - Premium */}
      <section className="hero-futuristic bg-gradient-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info - Premium */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium text-center p-8 hover:scale-105 transition-transform"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <info.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-muted font-medium">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-muted text-sm mt-4">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form - Premium */}
      <section className="py-20 bg-primary">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="card-premium p-8">
                <h2 className="text-3xl font-bold text-primary mb-6">
                  Envie sua <span className="text-gradient">Mensagem</span>
                </h2>
                
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                      <CheckCircle size={40} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      Mensagem Enviada!
                    </h3>
                    <p className="text-secondary mb-6">
                      Obrigado pelo seu contato. Responderemos em breve!
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="btn-futuristic btn-primary"
                    >
                      Enviar Nova Mensagem
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">
                          Nome Completo *
                        </label>
                        <div className="relative">
                          <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 pl-10 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-panel text-primary placeholder-muted"
                            placeholder="Seu nome completo"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="form-label">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 pl-10 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-panel text-primary placeholder-muted"
                            placeholder="seu@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">
                          Telefone
                        </label>
                        <div className="relative">
                          <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="form-input pl-10"
                            placeholder="(66) 99999-9999"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="form-label">
                          Empresa
                        </label>
                        <div className="relative">
                          <Building size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="form-input pl-10"
                            placeholder="Nome da sua empresa"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">
                        Assunto *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="form-input form-select"
                      >
                        <option value="">Selecione um assunto</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">
                        Mensagem *
                      </label>
                      <div className="relative">
                        <MessageSquare size={20} className="absolute left-3 top-3 text-muted" />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="form-input form-textarea pl-10"
                          placeholder="Descreva sua mensagem aqui..."
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-premium w-full flex items-center justify-center gap-2 py-4 text-lg font-semibold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                )}
              </div>
            </motion.div>

            {/* Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="card-premium p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">
                  Por que escolher o <span className="text-gradient">Agroisync</span>?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">
                        Suporte 24/7
                      </h4>
                      <p className="text-secondary text-sm">
                        Nossa equipe está sempre disponível para ajudar
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">
                        Tecnologia Avançada
                      </h4>
                      <p className="text-secondary text-sm">
                        Soluções de ponta para o agronegócio moderno
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">
                        Segurança Garantida
                      </h4>
                      <p className="text-secondary text-sm">
                        Proteção total dos seus dados e transações
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-futuristic">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Horário de Funcionamento
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-muted" />
                    <div>
                      <p className="font-medium text-primary">Segunda a Sexta</p>
                      <p className="text-secondary text-sm">8h às 18h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-muted" />
                    <div>
                      <p className="font-medium text-primary">Sábado</p>
                      <p className="text-secondary text-sm">8h às 12h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-muted" />
                    <div>
                      <p className="font-medium text-primary">Domingo</p>
                      <p className="text-secondary text-sm">Fechado</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
