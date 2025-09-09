import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  BarChart3,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Plans = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFAQ, setOpenFAQ] = useState(null);
  const { isDarkMode } = useTheme();

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

  const faqItems = [
    {
      question: 'Posso mudar de plano a qualquer momento?',
      answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente e você só paga a diferença proporcional.'
    },
    {
      question: 'Há período de teste gratuito?',
      answer: 'Oferecemos 14 dias de teste gratuito para todos os planos. Sem compromisso, sem cartão de crédito necessário. Teste todas as funcionalidades antes de decidir.'
    },
    {
      question: 'Que tipos de suporte vocês oferecem?',
      answer: 'Oferecemos suporte por email, chat e telefone. Planos superiores incluem suporte prioritário e dedicado. Nossa equipe está sempre disponível para ajudar.'
    },
    {
      question: 'Meus dados estão seguros?',
      answer: 'Absolutamente! Utilizamos criptografia de nível bancário, seguimos todas as normas de segurança internacionais e somos totalmente compatíveis com a LGPD.'
    },
    {
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento e você continuará tendo acesso até o final do período pago.'
    },
    {
      question: 'Há desconto para pagamento anual?',
      answer: 'Sim! Oferecemos 20% de desconto para pagamentos anuais. É uma ótima forma de economizar e garantir acesso contínuo à plataforma.'
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
                className={`relative p-8 rounded-2xl shadow-lg ${
                  plan.popular 
                    ? 'ring-2 ring-green-500 scale-105' 
                    : ''
                } ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star size={16} />
                      Mais Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      R$ {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Economize R$ {(plan.monthlyPrice * 12) - plan.yearlyPrice}/ano
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-white" />
                      </div>
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                    </div>
                  ))}
                </div>

                  <Link
                    to={plan.ctaLink}
                    className={`w-full text-center py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      plan.popular 
                        ? 'bg-black text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-green-500' 
                        : 'bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:from-gray-700 hover:to-gray-600'
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
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-amber-50'}`}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Perguntas <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Frequentes</span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Tire suas dúvidas sobre nossos planos e serviços
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.question}
                    </h3>
                    {openFAQ === index ? (
                      <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-6 pb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
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
