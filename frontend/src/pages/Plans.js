import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  BarChart3,
  ArrowRight
} from 'lucide-react';

const Plans = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfeito para começar',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Até 100 transações/mês',
        'Suporte por email',
        'Dashboard básico',
        'Relatórios simples',
        '1 usuário'
      ],
      popular: false,
      cta: 'Começar Grátis',
      ctaLink: '/register'
    },
    {
      name: 'Professional',
      description: 'Para empresas em crescimento',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Transações ilimitadas',
        'Suporte prioritário 24/7',
        'Dashboard avançado',
        'Relatórios detalhados',
        'Até 10 usuários',
        'API completa',
        'Integrações premium'
      ],
      popular: true,
      cta: 'Testar Grátis',
      ctaLink: '/register'
    },
    {
      name: 'Enterprise',
      description: 'Solução completa para grandes empresas',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      features: [
        'Tudo do Professional',
        'Suporte dedicado',
        'Dashboard personalizado',
        'Relatórios customizados',
        'Usuários ilimitados',
        'SLA garantido',
        'Treinamento personalizado',
        'Consultoria especializada'
      ],
      popular: false,
      cta: 'Falar com Vendas',
      ctaLink: '/contact'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Performance Extrema',
      description: 'Tecnologia de ponta para máxima velocidade'
    },
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Proteção de nível bancário para seus dados'
    },
    {
      icon: Users,
      title: 'Suporte Premium',
      description: 'Equipe especializada sempre disponível'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avançado',
      description: 'Insights profundos para decisões inteligentes'
    }
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="hero-futuristic">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              Planos que <span className="text-gradient">Impressionam</span>
            </h1>
            <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              Escolha o plano perfeito para transformar seu agronegócio com tecnologia de ponta
            </p>
          </motion.div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="section-sm bg-secondary">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="card-futuristic p-2 flex items-center gap-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Anual
                <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-primary">
        <div className="container">
          <div className="grid-futuristic grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card-premium relative p-8 ${
                  plan.popular ? 'ring-2 ring-primary scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star size={16} />
                      Mais Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-secondary mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-extrabold text-primary">
                      R$ {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-secondary">
                      /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-muted">
                      Economize R$ {(plan.monthlyPrice * 12) - plan.yearlyPrice}/ano
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-white" />
                      </div>
                      <span className="text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>

                  <Link
                    to={plan.ctaLink}
                    className={`w-full text-center py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      plan.popular ? 'btn-premium' : 'btn-premium-secondary'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight size={16} />
                  </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-secondary">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Por que escolher o <span className="text-gradient">Agroisync</span>?
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Recursos avançados que fazem a diferença no seu agronegócio
            </p>
          </motion.div>
          
          <div className="grid-futuristic grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium text-center p-8 hover:scale-105 transition-transform"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-primary">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Perguntas <span className="text-gradient">Frequentes</span>
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Tire suas dúvidas sobre nossos planos e serviços
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid-futuristic grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card-premium p-6">
                <h3 className="text-xl font-bold text-primary mb-3">
                  Posso mudar de plano a qualquer momento?
                </h3>
                <p className="text-muted leading-relaxed">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                  As mudanças são aplicadas imediatamente.
                </p>
              </div>
              
              <div className="card-premium p-6">
                <h3 className="text-xl font-bold text-primary mb-3">
                  Há período de teste gratuito?
                </h3>
                <p className="text-muted leading-relaxed">
                  Oferecemos 14 dias de teste gratuito para todos os planos. 
                  Sem compromisso, sem cartão de crédito necessário.
                </p>
              </div>
              
              <div className="card-premium p-6">
                <h3 className="text-xl font-bold text-primary mb-3">
                  Que tipos de suporte vocês oferecem?
                </h3>
                <p className="text-muted leading-relaxed">
                  Oferecemos suporte por email, chat e telefone. Planos superiores 
                  incluem suporte prioritário e dedicado.
                </p>
              </div>
              
              <div className="card-premium p-6">
                <h3 className="text-xl font-bold text-primary mb-3">
                  Meus dados estão seguros?
                </h3>
                <p className="text-muted leading-relaxed">
                  Absolutamente! Utilizamos criptografia de nível bancário e 
                  seguimos todas as normas de segurança internacionais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-secondary">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Pronto para <span className="text-gradient">Começar</span>?
            </h2>
            <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de empresas que já transformaram seu agronegócio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-premium px-8 py-4 text-lg font-semibold flex items-center gap-3"
              >
                Começar Teste Grátis
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/contact"
                className="btn-premium-secondary px-8 py-4 text-lg font-semibold"
              >
                Falar com Vendas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Plans;
