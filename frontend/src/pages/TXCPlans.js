import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Users,
  Crown,
  Globe
} from 'lucide-react';

const TXCPlans = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Gratuito',
      period: 'Para sempre',
      description: 'Perfeito para começar no agronegócio digital',
      features: [
        'Acesso ao marketplace básico',
        'Até 5 transações por mês',
        'Suporte por email',
        'Relatórios básicos',
        'App mobile incluído',
      ],
      buttonText: 'Começar Grátis',
      buttonStyle: 'txc-btn-secondary',
      popular: false,
      icon: <Globe size={32} />,
    },
    {
      name: 'Professional',
      price: 'R$ 99',
      period: 'por mês',
      description: 'Para produtores que querem crescer',
      features: [
        'Marketplace completo',
        'Transações ilimitadas',
        'Suporte prioritário',
        'Relatórios avançados',
        'Integração com sistemas',
        'Consultoria especializada',
        'AgroConecta incluído',
      ],
      buttonText: 'Escolher Plano',
      buttonStyle: 'txc-btn-primary',
      popular: true,
      icon: <Zap size={32} />,
    },
    {
      name: 'Enterprise',
      price: 'R$ 299',
      period: 'por mês',
      description: 'Para grandes operações',
      features: [
        'Tudo do Professional',
        'Crypto Agro incluído',
        'API personalizada',
        'Suporte dedicado 24/7',
        'Relatórios customizados',
        'Treinamento da equipe',
        'SLA garantido',
        'Integração completa',
      ],
      buttonText: 'Falar com Vendas',
      buttonStyle: 'txc-btn-secondary',
      popular: false,
      icon: <Crown size={32} />,
    },
  ];

  const features = [
    {
      icon: <Shield size={24} />,
      title: 'Segurança Máxima',
      description: 'Proteção total para suas transações',
    },
    {
      icon: <Users size={24} />,
      title: 'Suporte Especializado',
      description: 'Equipe dedicada ao seu sucesso',
    },
    {
      icon: <Zap size={24} />,
      title: 'Performance Superior',
      description: 'Tecnologia de ponta para resultados',
    },
  ];

  const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div>
      {/* Hero Section TXC */}
      <section className="txc-hero-section" style={{
        background: 'linear-gradient(rgba(31, 46, 31, 0.4), rgba(31, 46, 31, 0.4)), url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="txc-hero-content">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              style={{ marginBottom: 'var(--txc-space-xl)' }}
            >
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto',
                background: 'var(--txc-gradient-accent)',
                borderRadius: 'var(--txc-radius-3xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--txc-dark-green)',
                boxShadow: 'var(--txc-shadow-lg)'
              }}>
                <Star size={48} />
              </div>
            </motion.div>

            <motion.h1 className="txc-hero-title" variants={itemVariants}>
              PLANOS AGROISYNC
            </motion.h1>
            
            <motion.p className="txc-hero-subtitle" variants={itemVariants}>
              Escolha o plano ideal para seu agronegócio e revolucione seus resultados
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="txc-section">
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
          >
            <h2 className="txc-section-title">Escolha seu Plano</h2>
            <p className="txc-section-subtitle">
              Planos flexíveis para todos os tamanhos de operação
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: 'var(--txc-space-xl)',
            marginTop: 'var(--txc-space-3xl)'
          }}>
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className="txc-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                style={{ 
                  position: 'relative',
                  border: plan.popular ? '2px solid var(--txc-green-accent)' : '1px solid #E5E5E5',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  zIndex: plan.popular ? 10 : 1
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--txc-green-accent)',
                    color: 'var(--txc-dark-green)',
                    padding: 'var(--txc-space-sm) var(--txc-space-lg)',
                    borderRadius: 'var(--txc-radius-full)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    zIndex: 20
                  }}>
                    MAIS POPULAR
                  </div>
                )}

                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: plan.popular ? 'var(--txc-green-accent)' : 'var(--txc-light-beige)',
                  borderRadius: 'var(--txc-radius-xl) var(--txc-radius-xl) 0 0'
                }} />

                <div className="txc-text-center" style={{ marginBottom: 'var(--txc-space-xl)' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto var(--txc-space-lg) auto',
                    background: 'var(--txc-gradient-accent)',
                    borderRadius: 'var(--txc-radius-2xl)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--txc-dark-green)',
                    boxShadow: 'var(--txc-shadow-md)'
                  }}>
                    {plan.icon}
                  </div>
                  
                  <h3 className="txc-card-title" style={{ fontSize: '1.5rem', marginBottom: 'var(--txc-space-sm)' }}>
                    {plan.name}
                  </h3>
                  
                  <div style={{ marginBottom: 'var(--txc-space-md)' }}>
                    <span style={{ 
                      fontSize: '3rem', 
                      fontWeight: '900', 
                      color: 'var(--txc-green-accent)',
                      fontFamily: 'var(--txc-font-secondary)'
                    }}>
                      {plan.price}
                    </span>
                    <span style={{ 
                      fontSize: '1rem', 
                      color: 'var(--txc-text-light)',
                      marginLeft: 'var(--txc-space-sm)'
                    }}>
                      {plan.period}
                    </span>
                  </div>
                  
                  <p className="txc-card-description" style={{ marginBottom: 'var(--txc-space-xl)' }}>
                    {plan.description}
                  </p>
                </div>

                <div style={{ marginBottom: 'var(--txc-space-xl)' }}>
                  {plan.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--txc-space-md)',
                        marginBottom: 'var(--txc-space-md)',
                        padding: 'var(--txc-space-sm) 0'
                      }}
                    >
                      <CheckCircle 
                        size={20} 
                        style={{ 
                          color: 'var(--txc-green-accent)', 
                          flexShrink: 0 
                        }} 
                      />
                      <span style={{ color: 'var(--txc-text-dark)' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/register" 
                  className={`txc-btn ${plan.buttonStyle}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {plan.buttonText}
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="txc-section" style={{ background: 'var(--txc-light-beige)' }}>
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
          >
            <h2 className="txc-section-title">Por que Escolher AGROISYNC?</h2>
            <p className="txc-section-subtitle">
              Tecnologia de ponta para o agronegócio moderno
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--txc-space-xl)' 
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="txc-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto var(--txc-space-lg) auto',
                  background: 'var(--txc-gradient-accent)',
                  borderRadius: 'var(--txc-radius-2xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--txc-dark-green)',
                  boxShadow: 'var(--txc-shadow-md)'
                }}>
                  {feature.icon}
                </div>
                <h3 className="txc-card-title" style={{ marginBottom: 'var(--txc-space-md)' }}>
                  {feature.title}
                </h3>
                <p className="txc-card-description">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="txc-section">
        <div className="txc-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="txc-text-center"
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 className="txc-section-title" style={{ marginBottom: 'var(--txc-space-lg)' }}>
              Pronto para Começar?
            </h2>
            <p className="txc-section-subtitle" style={{ marginBottom: 'var(--txc-space-xl)' }}>
              Junte-se a milhares de produtores que já revolucionaram seus negócios
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--txc-space-lg)', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Link to="/register" className="txc-btn txc-btn-primary">
                Começar Grátis
                <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="txc-btn txc-btn-secondary">
                Falar com Especialista
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TXCPlans;
