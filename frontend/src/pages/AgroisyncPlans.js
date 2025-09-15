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

const AgroisyncPlans = () => {
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
      buttonStyle: 'agro-btn-secondary',
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
      buttonStyle: 'agro-btn-primary',
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
      buttonStyle: 'agro-btn-secondary',
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
      <section className="agro-hero-section" style={{
        background: 'linear-gradient(rgba(31, 46, 31, 0.4), rgba(31, 46, 31, 0.4)), url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="agro-hero-content">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              style={{ marginBottom: 'var(--agro-space-xl)' }}
            >
              <div style={{
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
              }}>
                <Star size={48} />
              </div>
            </motion.div>

            <motion.h1 className="agro-hero-title" variants={itemVariants}>
              PLANOS AGROISYNC
            </motion.h1>
            
            <motion.p className="agro-hero-subtitle" variants={itemVariants}>
              Escolha o plano ideal para seu agronegócio e revolucione seus resultados
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="agro-section">
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
          >
            <h2 className="agro-section-title">Escolha seu Plano</h2>
            <p className="agro-section-subtitle">
              Planos flexíveis para todos os tamanhos de operação
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: 'var(--agro-space-xl)',
            marginTop: 'var(--agro-space-3xl)'
          }}>
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className="agro-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                style={{ 
                  position: 'relative',
                  border: plan.popular ? '2px solid var(--agro-green-accent)' : '1px solid #E5E5E5',
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
                    background: 'var(--agro-green-accent)',
                    color: 'var(--agro-dark-green)',
                    padding: 'var(--agro-space-sm) var(--agro-space-lg)',
                    borderRadius: 'var(--agro-radius-full)',
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
                  background: plan.popular ? 'var(--agro-green-accent)' : 'var(--agro-light-beige)',
                  borderRadius: 'var(--agro-radius-xl) var(--agro-radius-xl) 0 0'
                }} />

                <div className="agro-text-center" style={{ marginBottom: 'var(--agro-space-xl)' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto var(--agro-space-lg) auto',
                    background: 'var(--agro-gradient-accent)',
                    borderRadius: 'var(--agro-radius-2xl)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--agro-dark-green)',
                    boxShadow: 'var(--agro-shadow-md)'
                  }}>
                    {plan.icon}
                  </div>
                  
                  <h3 className="agro-card-title" style={{ fontSize: '1.5rem', marginBottom: 'var(--agro-space-sm)' }}>
                    {plan.name}
                  </h3>
                  
                  <div style={{ marginBottom: 'var(--agro-space-md)' }}>
                    <span style={{ 
                      fontSize: '3rem', 
                      fontWeight: '900', 
                      color: 'var(--agro-green-accent)',
                      fontFamily: 'var(--agro-font-secondary)'
                    }}>
                      {plan.price}
                    </span>
                    <span style={{ 
                      fontSize: '1rem', 
                      color: 'var(--agro-text-light)',
                      marginLeft: 'var(--agro-space-sm)'
                    }}>
                      {plan.period}
                    </span>
                  </div>
                  
                  <p className="agro-card-description" style={{ marginBottom: 'var(--agro-space-xl)' }}>
                    {plan.description}
                  </p>
                </div>

                <div style={{ marginBottom: 'var(--agro-space-xl)' }}>
                  {plan.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 'var(--agro-space-md)',
                        marginBottom: 'var(--agro-space-md)',
                        padding: 'var(--agro-space-sm) 0'
                      }}
                    >
                      <CheckCircle 
                        size={20} 
                        style={{ 
                          color: 'var(--agro-green-accent)', 
                          flexShrink: 0 
                        }} 
                      />
                      <span style={{ color: 'var(--agro-text-dark)' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link 
                  to="/register" 
                  className={`agro-btn ${plan.buttonStyle}`}
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
      <section className="agro-section" style={{ background: 'var(--agro-light-beige)' }}>
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
          >
            <h2 className="agro-section-title">Por que Escolher AGROISYNC?</h2>
            <p className="agro-section-subtitle">
              Tecnologia de ponta para o agronegócio moderno
            </p>
          </motion.div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--agro-space-xl)' 
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="agro-card"
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
                  margin: '0 auto var(--agro-space-lg) auto',
                  background: 'var(--agro-gradient-accent)',
                  borderRadius: 'var(--agro-radius-2xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agro-dark-green)',
                  boxShadow: 'var(--agro-shadow-md)'
                }}>
                  {feature.icon}
                </div>
                <h3 className="agro-card-title" style={{ marginBottom: 'var(--agro-space-md)' }}>
                  {feature.title}
                </h3>
                <p className="agro-card-description">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="agro-section">
        <div className="agro-container">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="agro-text-center"
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 className="agro-section-title" style={{ marginBottom: 'var(--agro-space-lg)' }}>
              Pronto para Começar?
            </h2>
            <p className="agro-section-subtitle" style={{ marginBottom: 'var(--agro-space-xl)' }}>
              Junte-se a milhares de produtores que já revolucionaram seus negócios
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--agro-space-lg)', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Link to="/register" className="agro-btn agro-btn-primary">
                Começar Grátis
                <ArrowRight size={20} />
              </Link>
              <Link to="/contact" className="agro-btn agro-btn-secondary">
                Falar com Especialista
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AgroisyncPlans;
