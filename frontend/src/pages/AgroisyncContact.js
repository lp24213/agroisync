import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import CryptoHash from '../components/CryptoHash';

const AgroisyncContact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: <Mail size={32} />,
      title: t('contact.email', 'Email'),
      info: 'contato@agroisync.com',
      description: t('contact.emailDescription', 'Envie-nos um email e responderemos em até 24h')
    },
    {
      icon: <Phone size={32} />,
      title: t('contact.phone', 'Telefone'),
      info: '+55 (11) 99999-9999',
      description: t('contact.phoneDescription', 'Atendimento de segunda a sexta, 8h às 18h')
    },
    {
      icon: <MapPin size={32} />,
      title: t('contact.address', 'Endereço'),
      info: 'São Paulo, SP - Brasil',
      description: t('contact.addressDescription', 'Rua das Flores, 123 - Jardim Verde')
    },
    {
      icon: <Clock size={32} />,
      title: t('contact.hours', 'Horário'),
      info: 'Seg - Sex: 8h às 18h',
      description: t('contact.hoursDescription', 'Sábado: 8h às 12h')
    }
  ];

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (process.env.NODE_ENV !== 'production') {

      console.log('Form submitted:', formData);

    }
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <div>
      {/* Hero Section TXC */}
      <section
        className='agro-hero-section'
        style={{
          background: 'linear-gradient(rgba(31, 46, 31, 0.4), rgba(31, 46, 31, 0.4)), url("/images/marketplace.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className='agro-hero-content'>
          <motion.div variants={heroVariants} initial='hidden' animate='visible'>
            <motion.div variants={itemVariants} style={{ marginBottom: 'var(--agro-space-xl)' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto',
                  background: 'var(--agro-gradient-accent)',
                  borderRadius: 'var(--agro-radius-3xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agro-dark-green)',
                  boxShadow: 'var(--agro-shadow-lg)'
                }}
              >
                <MessageCircle size={48} />
              </div>
            </motion.div>

            <motion.h1 className='agro-hero-title' variants={itemVariants}>
              FALE CONOSCO
            </motion.h1>

            <motion.p className='agro-hero-subtitle' variants={itemVariants}>
              Estamos aqui para ajudar você a revolucionar seu agronegócio
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className='agro-section'>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className='agro-text-center'
          >
            <h2 className='agro-section-title'>Informações de Contato</h2>
            <p className='agro-section-subtitle'>Escolha a melhor forma de entrar em contato conosco</p>
          </motion.div>

          <div className='agro-cards-grid'>
            {contactInfo.map((contact, index) => (
              <motion.div
                key={contact.title}
                className='agro-card agro-fade-in'
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                style={{ textAlign: 'center' }}
              >
                <div className='agro-card-icon' style={{ color: 'var(--agro-green)' }}>
                  {contact.icon}
                </div>
                <h3 className='agro-card-title'>{contact.title}</h3>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--agro-text-dark)',
                    marginBottom: 'var(--agro-space-md)'
                  }}
                >
                  {contact.info}
                </div>
                <p className='agro-card-description'>{contact.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className='agro-section' style={{ background: 'var(--agro-light-beige)' }}>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className='agro-text-center'
          >
            <h2 className='agro-section-title'>Envie sua Mensagem</h2>
            <p className='agro-section-subtitle'>Preencha o formulário abaixo e entraremos em contato</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <form onSubmit={handleSubmit} className='agro-card' style={{ padding: 'var(--agro-space-2xl)' }}>
              <div style={{ marginBottom: 'var(--agro-space-lg)' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}
                >
                  {t('contact.fullName', 'Nome Completo')} *
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--agro-space-md)',
                    border: '2px solid rgba(57, 255, 20, 0.2)',
                    borderRadius: 'var(--agro-radius-lg)',
                    fontSize: '1rem',
                    background: 'rgba(57, 255, 20, 0.1)',
                    color: 'var(--agro-text-dark)',
                    transition: 'all var(--agro-transition-normal)',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder={t('contact.fullNamePlaceholder', 'Seu nome completo')}
                />
              </div>

              <div style={{ marginBottom: 'var(--agro-space-lg)' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}
                >
                  {t('contact.email', 'Email')} *
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--agro-space-md)',
                    border: '2px solid rgba(57, 255, 20, 0.2)',
                    borderRadius: 'var(--agro-radius-lg)',
                    fontSize: '1rem',
                    background: 'rgba(57, 255, 20, 0.1)',
                    color: 'var(--agro-text-dark)',
                    transition: 'all var(--agro-transition-normal)',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder={t('contact.emailPlaceholder', 'seu@email.com')}
                />
              </div>

              <div style={{ marginBottom: 'var(--agro-space-lg)' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}
                >
                  {t('contact.subject', 'Assunto')} *
                </label>
                <select
                  name='subject'
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--agro-space-md)',
                    border: '2px solid rgba(57, 255, 20, 0.2)',
                    borderRadius: 'var(--agro-radius-lg)',
                    fontSize: '1rem',
                    background: 'rgba(57, 255, 20, 0.1)',
                    color: 'var(--agro-text-dark)',
                    transition: 'all var(--agro-transition-normal)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <option value=''>{t('contact.selectSubject', 'Selecione um assunto')}</option>
                  <option value='suporte'>{t('contact.support', 'Suporte Técnico')}</option>
                  <option value='vendas'>{t('contact.plans', 'Informações sobre Planos')}</option>
                  <option value='parceria'>{t('contact.partnership', 'Parcerias')}</option>
                  <option value='outro'>{t('contact.other', 'Outro')}</option>
                </select>
              </div>

              <div style={{ marginBottom: 'var(--agro-space-xl)' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}
                >
                  {t('contact.message', 'Mensagem')} *
                </label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: 'var(--agro-space-md)',
                    border: '2px solid rgba(57, 255, 20, 0.2)',
                    borderRadius: 'var(--agro-radius-lg)',
                    fontSize: '1rem',
                    background: 'rgba(57, 255, 20, 0.1)',
                    color: 'var(--agro-text-dark)',
                    transition: 'all var(--agro-transition-normal)',
                    backdropFilter: 'blur(10px)',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder={t('contact.messagePlaceholder', 'Conte-nos como podemos ajudar...')}
                />
              </div>

              <motion.button
                type='submit'
                className='agro-btn agro-btn-primary'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle size={20} />
                    {t('contact.messageSent', 'Mensagem Enviada!')}
                  </>
                ) : (
                  <>
                    {t('contact.sendMessage', 'Enviar Mensagem')}
                    <Send size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='agro-section'>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className='agro-text-center'
          >
            <h2 className='agro-section-title'>Perguntas Frequentes</h2>
            <p className='agro-section-subtitle'>Respostas para as dúvidas mais comuns</p>
          </motion.div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {[
              {
                question: 'Como funciona o marketplace AGROISYNC?',
                answer:
                  'Nosso marketplace conecta produtores, compradores e transportadores em uma plataforma segura, utilizando blockchain para garantir transparência e segurança nas transações.'
              },
              {
                question: 'Quais são os custos para usar a plataforma?',
                answer:
                  'Oferecemos um plano gratuito para começar, com planos pagos que oferecem recursos avançados. Consulte nossa página de planos para mais detalhes.'
              },
              {
                question: 'A plataforma é segura?',
                answer:
                  'Sim! Utilizamos tecnologia blockchain e criptografia de ponta para garantir a segurança de todas as transações e dados dos usuários.'
              },
              {
                question: 'Como posso começar a usar?',
                answer:
                  'É simples! Basta criar uma conta gratuita, completar seu perfil e começar a explorar as funcionalidades da plataforma.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className='agro-card'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{ marginBottom: 'var(--agro-space-lg)' }}
              >
                <h3 className='agro-card-title' style={{ marginBottom: 'var(--agro-space-md)' }}>
                  {faq.question}
                </h3>
                <p className='agro-card-description'>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
          <div className='mt-8 flex justify-center'>
            <CryptoHash pageName='contact' style={{ display: 'none' }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgroisyncContact;
