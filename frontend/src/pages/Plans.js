import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown,
  ArrowRight,
  Users,
  BarChart3,
  Shield,
  Globe,
  TrendingUp
} from 'lucide-react';

const Plans = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  const plans = [
    {
      name: 'Starter',
      description: 'Perfeito para produtores individuais',
      icon: Users,
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Até 10 anúncios por mês',
        'Acesso ao marketplace básico',
        'Suporte por email',
        'Relatórios básicos',
        '1 usuário'
      ],
      limitations: [
        'Sem acesso ao AgroConecta',
        'Sem analytics avançados',
        'Sem API personalizada'
      ],
      popular: false,
      color: 'primary'
    },
    {
      name: 'Professional',
      description: 'Ideal para empresas em crescimento',
      icon: BarChart3,
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        'Anúncios ilimitados',
        'Acesso completo ao marketplace',
        'AgroConecta básico',
        'Analytics avançados',
        'Suporte prioritário',
        'Até 5 usuários',
        'API básica'
      ],
      limitations: [
        'Sem integração personalizada',
        'Suporte limitado a horário comercial'
      ],
      popular: true,
      color: 'success'
    },
    {
      name: 'Enterprise',
      description: 'Para grandes corporações',
      icon: Crown,
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        'Tudo do Professional',
        'AgroConecta premium',
        'Integrações personalizadas',
        'Suporte 24/7',
        'Usuários ilimitados',
        'API completa',
        'Consultoria especializada',
        'SLA garantido',
        'Treinamento personalizado'
      ],
      limitations: [],
      popular: false,
      color: 'warning'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Segurança Máxima',
      description: 'Criptografia de nível bancário e conformidade total com LGPD'
    },
    {
      icon: Zap,
      title: 'Performance Extrema',
      description: '99.9% de uptime garantido com tecnologia de ponta'
    },
    {
      icon: Globe,
      title: 'Conectividade Global',
      description: 'Acesso a mercados internacionais e parceiros estratégicos'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Avançados',
      description: 'Dados em tempo real para decisões mais inteligentes'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getPlanColor = (color) => {
    const colors = {
      primary: 'border-primary bg-primary/5',
      success: 'border-success bg-success/5',
      warning: 'border-warning bg-warning/5'
    };
    return colors[color] || colors.primary;
  };

  const getButtonColor = (color) => {
    const colors = {
      primary: 'btn-futuristic',
      success: 'bg-success-gradient text-white border-0',
      warning: 'bg-warning-gradient text-white border-0'
    };
    return colors[color] || colors.primary;
  };

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
              Escolha seu <span className="text-yellow-300">Plano</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Planos flexíveis para atender desde produtores individuais até 
              grandes corporações do agronegócio
            </p>
          </motion.div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-12 bg-secondary">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="glass-card p-2 flex items-center gap-4">
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
                <span className="ml-2 text-xs bg-success text-white px-2 py-1 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-primary">
        <div className="container-futuristic">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative glass-card p-8 ${getPlanColor(plan.color)} ${
                  plan.popular ? 'ring-2 ring-success scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-success-gradient text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star size={16} />
                      Mais Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary-gradient rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <plan.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/80 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-white">
                      {formatPrice(billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice)}
                    </div>
                    <div className="text-white/60">
                      {billingCycle === 'monthly' ? 'por mês' : 'por ano'}
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-success text-sm mt-1">
                        Economize {formatPrice(plan.monthlyPrice * 12 - plan.yearlyPrice)} por ano
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Incluído:</h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check size={20} className="text-success flex-shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="text-lg font-semibold text-white mb-4 mt-6">Limitações:</h4>
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-center gap-3">
                          <X size={20} className="text-danger flex-shrink-0" />
                          <span className="text-white/60">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <motion.button
                  className={`w-full ${getButtonColor(plan.color)} flex items-center justify-center gap-2`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.name === 'Enterprise' ? 'Falar com Vendas' : 'Começar Agora'}
                  <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Por que escolher o <span className="text-gradient">AgroSync</span>?
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Recursos avançados que fazem a diferença no seu negócio
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center hover:scale-105 transition-transform"
              >
                <div className="w-16 h-16 bg-primary-gradient rounded-xl mx-auto mb-4 flex items-center justify-center">
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
      <section className="py-20 bg-primary">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Perguntas <span className="text-yellow-300">Frequentes</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Tire suas dúvidas sobre nossos planos e serviços
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: 'Posso mudar de plano a qualquer momento?',
                answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações são aplicadas imediatamente e os valores são ajustados proporcionalmente.'
              },
              {
                question: 'Há período de teste gratuito?',
                answer: 'Oferecemos 14 dias de teste gratuito para todos os planos. Você pode experimentar todas as funcionalidades sem compromisso.'
              },
              {
                question: 'Quais formas de pagamento são aceitas?',
                answer: 'Aceitamos cartões de crédito, débito, PIX, boleto bancário e transferência bancária. Para planos Enterprise, também oferecemos faturamento corporativo.'
              },
              {
                question: 'O suporte está disponível em português?',
                answer: 'Sim! Todo nosso suporte é oferecido em português, com equipe especializada no agronegócio brasileiro.'
              },
              {
                question: 'Meus dados estão seguros?',
                answer: 'Absolutamente! Utilizamos criptografia de nível bancário, servidores seguros e somos totalmente conformes com a LGPD.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-white/80">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-gradient">
        <div className="container-futuristic text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para <span className="text-yellow-300">Começar</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais do agronegócio que já transformaram 
              seus negócios com o AgroSync
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/cadastro"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Teste Grátis por 14 Dias
                <ArrowRight size={20} />
              </motion.a>
              <motion.a
                href="/contato"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Falar com Especialista
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Plans;