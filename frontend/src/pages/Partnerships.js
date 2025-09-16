import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Send,
  CheckCircle,
  Star,
  Award
} from 'lucide-react';
import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt';

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
      icon: <TrendingUp size={32} />,
      title: 'Crescimento Acelerado',
      description: 'Expanda seu negócio com nossa plataforma de agronegócio'
    },
    {
      icon: <Globe size={32} />,
      title: 'Alcance Nacional',
      description: 'Conecte-se com produtores de todo o Brasil'
    },
    {
      icon: <Users size={32} />,
      title: 'Rede de Contatos',
      description: 'Acesse nossa rede de produtores e compradores'
    },
    {
      icon: <Award size={32} />,
      title: 'Suporte Especializado',
      description: 'Equipe dedicada para seu sucesso'
    }
  ];

  const successStories = [
    {
      company: 'TechAgro Solutions',
      partnership: 'Parceria Tecnológica',
      result: 'Aumento de 300% nas vendas em 6 meses',
      testimonial: 'A parceria com AGROISYNC revolucionou nosso negócio.'
    },
    {
      company: 'AgroDistribuidora',
      partnership: 'Parceria Comercial',
      result: 'Expansão para 5 novos estados',
      testimonial: 'Conseguimos expandir nossa operação rapidamente.'
    },
    {
      company: 'FarmTech Brasil',
      partnership: 'Parceria de Distribuição',
      result: 'Redução de 40% nos custos logísticos',
      testimonial: 'A plataforma otimizou toda nossa cadeia de suprimentos.'
    }
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

    try {
      // Simular envio para email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui seria a integração real com serviço de email
      console.log('Dados enviados para suporte@agroisync.com:', formData);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao enviar formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="partnerships-success">
        <div className="success-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="success-content"
          >
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h1>Solicitação Enviada!</h1>
            <p>
              Sua solicitação de parceria foi enviada com sucesso para nossa equipe.
              Entraremos em contato em até 48 horas.
            </p>
            <div className="success-details">
              <h3>Próximos Passos:</h3>
              <ul>
                <li>Análise da sua proposta</li>
                <li>Contato da nossa equipe comercial</li>
                <li>Agendamento de reunião</li>
                <li>Apresentação da proposta de parceria</li>
              </ul>
            </div>
            <button 
              className="back-button"
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
    <div className="partnerships-page">
      <div className="partnerships-container">
        {/* HERO COM IMAGEM 4K DE APERTO DE MÃOS */}
        <AgroisyncHeroPrompt 
          title="Seja Nosso Parceiro"
          subtitle="Junte-se à AGROISYNC e faça parte da revolução do agronegócio brasileiro"
          heroImage="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIHZpZXdCb3g9IjAgMCAxOTIwIDEwODAiPgogIDwhLS0gSW1hZ2VtIGRlIGFwZXJ0byBkZSBtw6NvcyBlbSBjb25mZXLDqm5jaWEgLS0+CiAgPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0iI0ZGRkZGRiIvPgogIDx0ZXh0IHg9Ijk2MCIgeT0iNTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMzMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbSBkZSBBcGVydG8gZGUgTcOjb3MgZW0gQ29uZmVyw6puY2lhPC90ZXh0Pgo8L3N2Zz4K"
          showCTA={true}
        />

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="benefits-container">
            <h2>Por que Parceria com AGROISYNC?</h2>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="benefit-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="benefit-icon">
                    {benefit.icon}
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="success-stories">
          <div className="stories-container">
            <h2>Histórias de Sucesso</h2>
            <div className="stories-grid">
              {successStories.map((story, index) => (
                <motion.div
                  key={story.company}
                  className="story-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="story-header">
                    <Star size={20} />
                    <span className="story-rating">5.0</span>
                  </div>
                  <blockquote>"{story.testimonial}"</blockquote>
                  <div className="story-footer">
                    <div className="story-company">{story.company}</div>
                    <div className="story-partnership">{story.partnership}</div>
                    <div className="story-result">{story.result}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Form */}
        <section className="partnership-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Solicite uma Parceria</h2>
              <p>Preencha o formulário abaixo e nossa equipe entrará em contato</p>
            </div>

            <form onSubmit={handleSubmit} className="partnership-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nome Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company">Empresa *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.suaempresa.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="partnershipType">Tipo de Parceria *</label>
                  <select
                    id="partnershipType"
                    name="partnershipType"
                    value={formData.partnershipType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione uma opção</option>
                    {partnershipTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="budget">Orçamento Estimado</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione uma faixa</option>
                    <option value="under-10k">Até R$ 10.000</option>
                    <option value="10k-50k">R$ 10.000 - R$ 50.000</option>
                    <option value="50k-100k">R$ 50.000 - R$ 100.000</option>
                    <option value="100k-500k">R$ 100.000 - R$ 500.000</option>
                    <option value="over-500k">Acima de R$ 500.000</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="timeline">Prazo para Implementação</label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um prazo</option>
                    <option value="immediate">Imediato</option>
                    <option value="1-3months">1-3 meses</option>
                    <option value="3-6months">3-6 meses</option>
                    <option value="6-12months">6-12 meses</option>
                    <option value="over-12months">Acima de 12 meses</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensagem *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Conte-nos sobre sua empresa, objetivos da parceria e como podemos trabalhar juntos..."
                />
              </div>

              <div className="form-submit">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Solicitação
                    </>
                  )}
                </button>
                <p className="form-note">
                  * Campos obrigatórios. Sua solicitação será enviada diretamente para suporte@agroisync.com
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Contact Info */}
        <section className="contact-info">
          <div className="contact-container">
            <h2>Outras Formas de Contato</h2>
            <div className="contact-grid">
              <div className="contact-item">
                <Mail size={24} />
                <div>
                  <h3>Email</h3>
                  <p>suporte@agroisync.com</p>
                </div>
              </div>
              <div className="contact-item">
                <Phone size={24} />
                <div>
                  <h3>Telefone</h3>
                  <p>(66) 99236-2830</p>
                </div>
              </div>
              <div className="contact-item">
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
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
    </div>
  );
};

export default Partnerships;
