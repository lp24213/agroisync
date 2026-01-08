import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Globe, Mail, MapPin, Send, CheckCircle, Award } from 'lucide-react';
// import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt'; // Componente removido
import CloudflareTurnstile from '../components/CloudflareTurnstile';
import CryptoHash from '../components/CryptoHash';

const Partnerships = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    website: '',
    partnershipType: '',
    message: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const partnershipTypes = [
    { value: 'technology', label: 'Parceria Tecnológica' },
    { value: 'commercial', label: 'Parceria Comercial' },
    { value: 'distribution', label: 'Parceria de Distribuição' },
    { value: 'marketing', label: 'Parceria de Marketing' },
    { value: 'investment', label: 'Investimento' },
    { value: 'other', label: 'Outro' }
  ];

  const benefits = [
    {
      icon: <TrendingUp size={48} />,
      title: 'Plataforma em Crescimento',
      description: 'Faça parte de uma plataforma inovadora em expansão. Acesso a clientes qualificados do agronegócio',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(16, 185, 129, 0.2)',
      emoji: '📈'
    },
    {
      icon: <Globe size={48} />,
      title: 'Alcance Global',
      description: 'Plataforma com funcionalidade mundial. Conecte-se com produtores e empresas do agronegócio',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(59, 130, 246, 0.2)',
      emoji: '🌎'
    },
    {
      icon: <Users size={48} />,
      title: 'Rede em Expansão',
      description: 'Acesse nossa base crescente de produtores, compradores e transportadores verificados e qualificados',
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(168, 85, 247, 0.2)',
      emoji: '👥'
    },
    {
      icon: <Award size={48} />,
      title: 'Suporte Premium 24/7',
      description: 'Equipe técnica e comercial dedicada ao seu sucesso. Treinamento completo e materiais de marketing inclusos',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(0, 0, 0, 0.05))',
      border: '2px solid rgba(245, 158, 11, 0.2)',
      emoji: '🏆'
    }
  ];

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simular envio para email
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aqui seria a integração real com serviço de email
      if (process.env.NODE_ENV !== 'production') {
        // Formulário enviado com sucesso
      }

      setIsSubmitted(true);
    } catch (error) {
      // Erro ao enviar formulário
      alert('Erro ao enviar formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className='partnerships-success'>
        <div className='success-container'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='success-content'
          >
            <div className='success-icon'>
              <CheckCircle size={64} />
            </div>
            <h1>Solicitação Enviada!</h1>
            <p>
              Sua solicitação de parceria foi enviada com sucesso para nossa equipe. Entraremos em contato em até 48
              horas.
            </p>
            <div className='success-details'>
              <h3>Próximos Passos:</h3>
              <ul>
                <li>Análise da sua proposta</li>
                <li>Contato da nossa equipe comercial</li>
                <li>Agendamento de reunião</li>
                <li>Apresentação da proposta de parceria</li>
              </ul>
            </div>
            <button
              className='back-button agro-btn-animated'
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  company: '',
                  phone: '',
                  website: '',
                  partnershipType: '',
                  message: '',
                  budget: '',
                  timeline: ''
                });
              }}
            >
              Enviar Nova Solicitação
            </button>
          </motion.div>
        </div>

        <style jsx>{`
          .partnerships-success {
            min-height: 100vh;
            background: var(--agro-gradient-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .success-container {
            max-width: 600px;
            width: 100%;
          }

          .success-content {
            background: var(--agro-card-bg);
            border: 1px solid var(--agro-border-color);
            border-radius: 16px;
            padding: 40px;
            text-align: center;
          }

          .success-icon {
            color: var(--agro-primary-color);
            margin-bottom: 24px;
          }

          .success-content h1 {
            color: var(--agro-text-color);
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 16px 0;
          }

          .success-content p {
            color: var(--agro-secondary-color);
            font-size: 18px;
            margin: 0 0 32px 0;
          }

          .success-details {
            text-align: left;
            margin-bottom: 32px;
          }

          .success-details h3 {
            color: var(--agro-text-color);
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 16px 0;
          }

          .success-details ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .success-details li {
            color: var(--agro-secondary-color);
            font-size: 16px;
            margin-bottom: 8px;
            padding-left: 24px;
            position: relative;
          }

          .success-details li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--agro-primary-color);
            font-weight: bold;
          }

          .back-button {
            background: var(--agro-primary-color);
            color: var(--agro-primary-text);
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .back-button:hover {
            background: var(--agro-primary-hover);
            transform: translateY(-2px);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className='partnerships-page' data-page='partnerships'>
      <div className='partnerships-container'>
        {/* HERO COM IMAGEM DE PARCERIAS */}
        <section
          className='relative flex min-h-screen items-center justify-center'
          style={{
            backgroundImage: `url('https://media.istockphoto.com/id/1303594191/pt/foto/man-and-woman-are-working-in-office.jpg?s=612x612&w=0&k=20&c=9QxXyI4_XpVj3RnYVxQusSs0PaCfyx6X3txIkXqMrAw=')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll'
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-br from-green-900/50 via-black/70 to-emerald-900/30'></div>
          <div className='relative z-10 mx-auto max-w-5xl px-4 text-center'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{ 
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '8px 20px',
                borderRadius: '30px',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                marginBottom: '20px',
                display: 'inline-block'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>
                🤝 Parcerias Estratégicas do Agronegócio
              </span>
            </motion.div>

            <motion.h1
              className='mb-6 text-7xl font-bold'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #10b981 50%, #22c55e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.2'
              }}
            >
              🤝 Cresça Conosco<br/>Parceria Win-Win
            </motion.h1>
            <motion.p
              className='mb-8 text-xl text-white/90'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ maxWidth: '750px', margin: '0 auto 2rem', lineHeight: '1.6' }}
            >
              Junte-se à <strong style={{ color: '#10b981' }}>maior plataforma do agro</strong>! Oferecemos <strong>alcance nacional</strong>, tecnologia de ponta e <strong>suporte dedicado</strong> para crescermos juntos!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ marginBottom: '2rem', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
                <span style={{ fontSize: '14px' }}>🌎</span>
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.75rem' }}>Alcance Nacional</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 0, 0, 0.4)', padding: '6px 12px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
                <span style={{ fontSize: '14px' }}>📈</span>
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.75rem' }}>Crescimento Garantido</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 0, 0, 0.4)', padding: '10px 18px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
                <span style={{ fontSize: '20px' }}>🎯</span>
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>Suporte Dedicado</span>
              </div>
            </motion.div>

            <motion.div
              className='flex justify-center gap-4 flex-wrap'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <button
                onClick={() => {
                  const formElement = document.getElementById('partnership-form');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '16px 36px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                🚀 Quero Ser Parceiro
              </button>
              <button 
                style={{
                  padding: '16px 36px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                👥 Nossos Parceiros
              </button>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className='benefits-section'>
          <div className='benefits-container'>
            <h2>Por que Parceria com AGROISYNC?</h2>
            <div className='benefits-grid'>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className='benefit-card agro-card-animated'
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.05 }}
                  style={{
                    background: benefit.gradient,
                    border: benefit.border,
                    borderRadius: '20px',
                    padding: '30px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                    {benefit.emoji}
                  </div>
                  <div className='benefit-icon' style={{ color: benefit.color, marginBottom: '1rem' }}>
                    {benefit.icon}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: benefit.color, marginBottom: '1rem' }}>
                    {benefit.title}
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#666' }}>
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories (placeholder sem parceiros listados) */}
        <section className='success-stories'>
          <div className='stories-container'>
            <h2>Parcerias</h2>
            <div className='stories-grid'>
              <div className='text-center text-gray-400 w-full'>
                Ainda não temos parceiros listados publicamente. Entre em contato para iniciar uma parceria.
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Form */}
        <section className='partnership-form-section'>
          <div className='form-container'>
            <div className='form-header'>
              <h2>Solicite uma Parceria</h2>
              <p>Preencha o formulário abaixo e nossa equipe entrará em contato</p>
            </div>

            <form onSubmit={handleSubmit} className='partnership-form'>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='name'>Nome Completo *</label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='agro-btn-animated'
                    placeholder='Seu nome completo'
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='email'>Email *</label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className='agro-btn-animated'
                    placeholder='seu@email.com'
                  />
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='company'>Empresa *</label>
                  <input
                    type='text'
                    id='company'
                    name='company'
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className='agro-btn-animated'
                    placeholder='Nome da sua empresa'
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='phone'>Telefone</label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder='(11) 99999-9999'
                  />
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='website'>Website</label>
                  <input
                    type='url'
                    id='website'
                    name='website'
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder='https://www.suaempresa.com'
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='partnershipType'>Tipo de Parceria *</label>
                  <select
                    id='partnershipType'
                    name='partnershipType'
                    value={formData.partnershipType}
                    onChange={handleInputChange}
                    required
                    className='agro-btn-animated'
                  >
                    <option value=''>Selecione uma opção</option>
                    {partnershipTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='budget'>Orçamento Estimado</label>
                  <select id='budget' name='budget' value={formData.budget} onChange={handleInputChange}>
                    <option value=''>Selecione uma faixa</option>
                    <option value='under-10k'>Até R$ 10.000</option>
                    <option value='10k-50k'>R$ 10.000 - R$ 50.000</option>
                    <option value='50k-100k'>R$ 50.000 - R$ 100.000</option>
                    <option value='100k-500k'>R$ 100.000 - R$ 500.000</option>
                    <option value='over-500k'>Acima de R$ 500.000</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label htmlFor='timeline'>Prazo para Implementação</label>
                  <select id='timeline' name='timeline' value={formData.timeline} onChange={handleInputChange}>
                    <option value=''>Selecione um prazo</option>
                    <option value='immediate'>Imediato</option>
                    <option value='1-3months'>1-3 meses</option>
                    <option value='3-6months'>3-6 meses</option>
                    <option value='6-12months'>6-12 meses</option>
                    <option value='over-12months'>Acima de 12 meses</option>
                  </select>
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='message'>Mensagem *</label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className='agro-btn-animated'
                  placeholder='Conte-nos sobre sua empresa, objetivos da parceria e como podemos trabalhar juntos...'
                />
              </div>

              {/* Cloudflare Turnstile */}
              <CloudflareTurnstile
                onVerify={token => {
                  setTurnstileToken(token);
                }}
                onError={error => {
                  // Turnstile error
                  setTurnstileToken('');
                }}
                onExpire={() => {
                  setTurnstileToken('');
                }}
              />

              <div className='form-submit'>
                <button
                  type='submit'
                  className='submit-button agro-btn-animated'
                  disabled={isSubmitting || (process.env.NODE_ENV === 'production' && !turnstileToken)}
                >
                  {isSubmitting ? (
                    <>
                      <div className='spinner'></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Solicitação
                    </>
                  )}
                </button>
                <p className='form-note'>
                  * Campos obrigatórios. Sua solicitação será enviada diretamente para parcerias@agroisync.com
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Contact Info */}
        <section className='contact-info'>
          <div className='contact-container'>
            <h2>Outras Formas de Contato</h2>
            <div className='contact-grid'>
              <div className='contact-item'>
                <Mail size={24} />
                <div>
                  <h3>Email</h3>
                  <p>parcerias@agroisync.com</p>
                </div>
              </div>
              <div className='contact-item'>
                <MapPin size={24} />
                <div>
                  <h3>Localização</h3>
                  <p>Sinop - MT, Brasil</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .partnerships-page {
          min-height: 100vh;
          background: var(--agro-gradient-primary);
        }

        .partnerships-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .partnerships-hero {
          padding: 80px 0;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-icon {
          color: var(--agro-primary-color);
          margin-bottom: 24px;
        }

        .hero-text h1 {
          color: var(--agro-text-color);
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 24px 0;
        }

        .hero-text p {
          color: var(--agro-secondary-color);
          font-size: 20px;
          line-height: 1.6;
          margin: 0;
        }

        .benefits-section {
          padding: 80px 0;
        }

        .benefits-container h2 {
          color: var(--agro-text-color);
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          margin: 0 0 60px 0;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .benefit-card {
          background: var(--agro-card-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
        }

        .benefit-icon {
          color: var(--agro-primary-color);
          margin-bottom: 20px;
        }

        .benefit-card h3 {
          color: var(--agro-text-color);
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .benefit-card p {
          color: var(--agro-secondary-color);
          font-size: 16px;
          line-height: 1.6;
          margin: 0;
        }

        .success-stories {
          padding: 80px 0;
          background: var(--agro-card-bg);
        }

        .stories-container h2 {
          color: var(--agro-text-color);
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          margin: 0 0 60px 0;
        }

        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
        }

        .story-card {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 16px;
          padding: 32px;
        }

        .story-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .story-header svg {
          color: var(--agro-gold);
        }

        .story-rating {
          color: var(--agro-text-color);
          font-weight: 600;
        }

        .story-card blockquote {
          color: var(--agro-text-color);
          font-size: 18px;
          font-style: italic;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .story-footer {
          border-top: 1px solid var(--agro-border-color);
          padding-top: 16px;
        }

        .story-company {
          color: var(--agro-primary-color);
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .story-partnership {
          color: var(--agro-secondary-color);
          font-size: 14px;
          margin-bottom: 4px;
        }

        .story-result {
          color: var(--agro-text-color);
          font-size: 14px;
          font-weight: 500;
        }

        .partnership-form-section {
          padding: 80px 0;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .form-header h2 {
          color: var(--agro-text-color);
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .form-header p {
          color: var(--agro-secondary-color);
          font-size: 18px;
          margin: 0;
        }

        .partnership-form {
          background: var(--agro-card-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 16px;
          padding: 40px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          color: var(--agro-text-color);
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          color: var(--agro-text-color);
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--agro-primary-color);
          box-shadow: 0 0 0 3px rgba(57, 255, 20, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-submit {
          text-align: center;
          margin-top: 32px;
        }

        .submit-button {
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 auto 16px auto;
        }

        .submit-button:hover:not(:disabled) {
          background: var(--agro-primary-hover);
          transform: translateY(-2px);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .form-note {
          color: var(--agro-secondary-color);
          font-size: 14px;
          margin: 0;
        }

        .contact-info {
          padding: 80px 0;
          background: var(--agro-card-bg);
        }

        .contact-container h2 {
          color: var(--agro-text-color);
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          margin: 0 0 48px 0;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 32px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: var(--agro-button-bg);
          border: 1px solid var(--agro-border-color);
          border-radius: 12px;
        }

        .contact-item svg {
          color: var(--agro-primary-color);
          flex-shrink: 0;
        }

        .contact-item h3 {
          color: var(--agro-text-color);
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .contact-item p {
          color: var(--agro-secondary-color);
          font-size: 16px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .partnerships-container {
            padding: 0 16px;
          }

          .hero-text h1 {
            font-size: 36px;
          }

          .hero-text p {
            font-size: 18px;
          }

          .benefits-container h2,
          .stories-container h2,
          .form-header h2,
          .contact-container h2 {
            font-size: 28px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .partnership-form {
            padding: 24px;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className='mt-8 flex justify-center'>
        <CryptoHash pageName='partnerships' style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default Partnerships;
