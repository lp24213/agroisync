import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, Rocket } from 'lucide-react';

const Plans = () => {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Para começar na plataforma",
      icon: Star,
      color: "gray",
      features: [
        "Até 5 publicações de produtos",
        "Até 3 publicações de fretes",
        "Suporte por email",
        "Acesso básico à plataforma"
      ],
      popular: false
    },
    {
      name: "Básico",
      price: "R$ 99",
      period: "/mês",
      description: "Para produtores e transportadores ativos",
      icon: Zap,
      color: "neon-blue",
      features: [
        "Publicações ilimitadas de produtos",
        "Publicações ilimitadas de fretes",
        "Suporte prioritário",
        "Analytics básicos",
        "Mensageria integrada"
      ],
      popular: true
    },
    {
      name: "Pro",
      price: "R$ 199",
      period: "/mês",
      description: "Para empresas em crescimento",
      icon: Crown,
      color: "neon-purple",
      features: [
        "Tudo do plano Básico",
        "Destaque nas buscas",
        "Analytics avançados",
        "API de integração",
        "Suporte telefônico",
        "Relatórios personalizados"
      ],
      popular: false
    },
    {
      name: "Enterprise",
      price: "Sob consulta",
      period: "",
      description: "Para grandes empresas",
      icon: Rocket,
      color: "neon-gold",
      features: [
        "Tudo do plano Pro",
        "Conta dedicada",
        "Integração customizada",
        "Suporte 24/7",
        "SLA garantido",
        "Treinamento personalizado"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            <span className="text-gradient">Planos</span> de Intermediação
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Escolha o plano ideal para sua necessidade. <strong>Nossa receita vem das assinaturas 
            que permitem publicar produtos e fretes em nossa plataforma de intermediação.</strong>
          </motion.p>
        </div>

        {/* Modelo de Negócio */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-futuristic p-8 mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Como Funciona Nossa <span className="text-gradient">Receita</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-neon-blue to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Assinaturas</h3>
              <p className="text-gray-400">
                Cobramos mensalidade para acessar a plataforma de intermediação
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-neon-green to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚫</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Sem Comissões</h3>
              <p className="text-gray-400">
                <strong>Não cobramos comissão sobre as vendas</strong>, apenas a assinatura
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-neon-purple to-violet-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Só Intermediamos</h3>
              <p className="text-gray-400">
                Facilitamos conexões. As vendas são diretas entre vocês
              </p>
            </div>
          </div>
        </motion.div>

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`card-futuristic p-6 relative ${
                plan.popular ? 'ring-2 ring-neon-blue shadow-neon' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-${plan.color} to-${plan.color}/50 rounded-xl flex items-center justify-center`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:from-neon-purple hover:to-neon-blue'
                  : 'glass-effect text-white hover:bg-white/20'
              }`}>
                {plan.name === 'Enterprise' ? 'Falar com Vendas' : 'Escolher Plano'}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Plans;
