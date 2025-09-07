import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle,
  MessageSquare,
  Clock,
  User,
  Building
} from 'lucide-react';

const Contact = () => {
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
    
    // Simular envio do formulário
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contato@agroisync.com',
      link: 'mailto:contato@agroisync.com',
      description: 'Envie-nos um email e responderemos em até 24 horas'
    },
    {
      icon: Phone,
      title: 'Telefone/WhatsApp',
      value: '(66) 99236-2830',
      link: 'https://wa.me/5566992362830',
      description: 'Ligue ou envie uma mensagem no WhatsApp'
    },
    {
      icon: MapPin,
      title: 'Localização',
      value: 'Sinop - MT, Brasil',
      link: '#',
      description: 'Nossa sede está localizada no coração do agronegócio brasileiro'
    }
  ];

  const subjects = [
    'Suporte Técnico',
    'Vendas e Comercial',
    'Parcerias',
    'Imprensa e Mídia',
    'Trabalhe Conosco',
    'Outros'
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Entre em <span className="text-yellow-300">Contato</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Estamos aqui para ajudar! Entre em contato conosco através do formulário 
              abaixo ou use nossos canais diretos de comunicação.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-secondary">
        <div className="container-futuristic">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 text-center"
              >
                <div className="w-16 h-16 bg-primary-gradient rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <info.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{info.title}</h3>
                <a 
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : '_self'}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  className="text-secondary hover:text-primary transition-colors block mb-3"
                >
                  {info.value}
                </a>
                <p className="text-muted text-sm">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-primary">
        <div className="container-futuristic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="glass-card p-8">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Envie sua <span className="text-yellow-300">Mensagem</span>
                </h2>
                
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-success-gradient rounded-full mx-auto mb-6 flex items-center justify-center">
                      <CheckCircle size={40} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Mensagem Enviada!
                    </h3>
                    <p className="text-white/80 mb-6">
                      Obrigado pelo seu contato. Responderemos em breve!
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="btn-futuristic"
                    >
                      Enviar Nova Mensagem
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">
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
                            className="input-futuristic pl-10"
                            placeholder="Seu nome completo"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">
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
                            className="input-futuristic pl-10"
                            placeholder="seu@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Telefone
                        </label>
                        <div className="relative">
                          <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="input-futuristic pl-10"
                            placeholder="(66) 99999-9999"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Empresa
                        </label>
                        <div className="relative">
                          <Building size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="input-futuristic pl-10"
                            placeholder="Nome da sua empresa"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Assunto *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="input-futuristic"
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
                      <label className="block text-white font-medium mb-2">
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
                          className="input-futuristic pl-10 resize-none"
                          placeholder="Descreva sua mensagem aqui..."
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-futuristic w-full flex items-center justify-center gap-2"
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
              {/* Business Hours */}
              <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary-gradient rounded-lg flex items-center justify-center">
                    <Clock size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Horário de Funcionamento</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Segunda - Sexta</span>
                    <span className="text-white font-medium">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Sábado</span>
                    <span className="text-white font-medium">09:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Domingo</span>
                    <span className="text-white font-medium">Fechado</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="text-white/80 text-sm">
                    <strong>Suporte 24/7:</strong> Para emergências técnicas, 
                    nosso suporte está disponível 24 horas por dia.
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Nossa Localização</h3>
                <div className="bg-secondary rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={48} className="text-primary mx-auto mb-4" />
                    <p className="text-secondary font-medium">Sinop - MT, Brasil</p>
                    <p className="text-muted text-sm mt-2">
                      Mapa interativo será implementado aqui
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Contato Rápido</h3>
                <div className="space-y-4">
                  <a
                    href="https://wa.me/5566992362830"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-success/10 rounded-lg hover:bg-success/20 transition-colors"
                  >
                    <Phone size={20} className="text-success" />
                    <span className="text-white">WhatsApp: (66) 99236-2830</span>
                  </a>
                  
                  <a
                    href="mailto:contato@agroisync.com"
                    className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Mail size={20} className="text-primary" />
                    <span className="text-white">contato@agroisync.com</span>
                  </a>
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