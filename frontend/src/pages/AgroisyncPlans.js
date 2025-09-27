import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown,
  Check,
  Star,
  Zap,
  Shield,
  Users,
  Truck,
  Package,
  CreditCard,
  Gift,
  TrendingUp
} from 'lucide-react';
import CryptoHash from '../components/CryptoHash';

const AgroisyncPlans = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, semiannual, annual
  const [paymentMethod, setPaymentMethod] = useState('card'); // card ou pix

  const plans = [
    {
      name: 'Básico',
      price: 14.99, // Preço mensal normal
      semiannualPrice: 85.44, // 14.99 x 6 meses - 5% = 89.94 - 4.50 = 85.44
      annualPrice: 161.88, // 14.99 x 12 meses - 10% = 179.88 - 18.00 = 161.88
      annualPixPrice: 143.88, // 14.99 x 12 meses - 20% = 179.88 - 36.00 = 143.88
      description: 'Ideal para começar no agronegócio',
      features: [
        '1 anúncio de produto por mês',
        'Suporte por email',
        'Dashboard básico',
        'Relatórios simples'
      ],
      popular: false,
      color: 'green'
    },
    {
      name: 'Profissional',
      price: 29.99, // Preço mensal normal
      semiannualPrice: 170.94, // 29.99 x 6 meses - 5% = 179.94 - 9.00 = 170.94
      annualPrice: 323.88, // 29.99 x 12 meses - 10% = 359.88 - 36.00 = 323.88
      annualPixPrice: 287.88, // 29.99 x 12 meses - 20% = 359.88 - 72.00 = 287.88
      description: 'Para produtores em crescimento',
      features: [
        '3 anúncios de produtos por mês',
        'Suporte prioritário',
        'Dashboard avançado',
        'Relatórios detalhados',
        'Prioridade nas buscas'
      ],
      popular: true,
      color: 'blue'
    },
    {
      name: 'Empresarial',
      price: 149.99, // Preço mensal normal
      semiannualPrice: 854.94, // 149.99 x 6 meses - 5% = 899.94 - 45.00 = 854.94
      annualPrice: 1619.88, // 149.99 x 12 meses - 10% = 1799.88 - 180.00 = 1619.88
      annualPixPrice: 1439.88, // 149.99 x 12 meses - 20% = 1799.88 - 360.00 = 1439.88
      description: 'Para grandes operações',
      features: [
        '20 anúncios de produtos por mês',
        'Suporte 24/7',
        'Dashboard personalizado',
        'Relatórios avançados',
        'API de integração',
        'Notificações personalizadas'
      ],
      popular: false,
      color: 'purple'
    },
    {
      name: 'Premium',
      price: 459.99, // Preço mensal normal
      semiannualPrice: 2621.94, // 459.99 x 6 meses - 5% = 2759.94 - 138.00 = 2621.94
      annualPrice: 4959.88, // 459.99 x 12 meses - 10% = 5519.88 - 560.00 = 4959.88
      annualPixPrice: 4419.88, // 459.99 x 12 meses - 20% = 5519.88 - 1100.00 = 4419.88
      description: 'Para grandes empresas',
      features: [
        'Anúncios ilimitados',
        'Suporte 24/7 dedicado',
        'Dashboard personalizado',
        'Relatórios avançados',
        'API completa',
        'Notificações personalizadas',
        'Gerente de conta dedicado',
        'Treinamento especializado',
        'Prioridade máxima'
      ],
      popular: false,
      color: 'gold'
    }
  ];

  const getPrice = (plan) => {
    if (billingCycle === 'semiannual') {
      return plan.semiannualPrice;
    }
    if (billingCycle === 'annual') {
      return paymentMethod === 'pix' ? plan.annualPixPrice : plan.annualPrice;
    }
    return plan.price; // monthly - sem desconto
  };

  const getDiscount = (plan) => {
    if (billingCycle === 'semiannual') {
      const totalPrice = plan.price * 6;
      return Math.round(((totalPrice - plan.semiannualPrice) / totalPrice) * 100);
    }
    if (billingCycle === 'annual') {
      const totalPrice = plan.price * 12;
      const finalPrice = paymentMethod === 'pix' ? plan.annualPixPrice : plan.annualPrice;
      return Math.round(((totalPrice - finalPrice) / totalPrice) * 100);
    }
    return 0; // monthly - sem desconto
  };

  return (
    <div className="agro-plans-container" data-page="planos">
      {/* HERO COM IMAGEM DE CRESCIMENTO DE NEGÓCIOS */}
      <section
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url('https://media.istockphoto.com/id/2177423222/pt/foto/e-commerce-concept-online-sale-business-growth-businessman-drawing-increasing-trend-graph-of.jpg?s=612x612&w=0&k=20&c=40Ax20aDzE5HNePAP3JdVjxo-uKkhhM3N0fP05crDCc=')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="text-center max-w-4xl mx-auto px-4 relative z-10">
          <motion.h1
            className="text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            PLANOS AGROISYNC
          </motion.h1>
          <motion.p
            className="text-2xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Escolha o plano ideal para acelerar seu crescimento no agronegócio
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Escolher Plano
            </button>
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Falar com Vendas
            </button>
          </motion.div>
        </div>
      </section>

      {/* Controles de Billing e Pagamento */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
            {/* Toggle Billing Cycle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  billingCycle === 'monthly' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Mensal
              </button>
              
              <button
                onClick={() => setBillingCycle('semiannual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  billingCycle === 'semiannual' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                6 Meses
                {billingCycle === 'semiannual' && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded font-semibold">
                    -5%
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  billingCycle === 'annual' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Anual
                {billingCycle === 'annual' && (
                  <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-1 py-0.5 rounded font-semibold">
                    -10%
                  </span>
                )}
              </button>
            </div>

            {/* Payment Method - Só aparece se for anual */}
            {billingCycle === 'annual' && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    paymentMethod === 'card' 
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Cartão
                </button>
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    paymentMethod === 'pix' 
                      ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  PIX
                  {paymentMethod === 'pix' && (
                    <span className="bg-green-200 text-green-800 text-xs px-1 py-0.5 rounded font-semibold">
                      -10%
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-blue-500 scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      Mais Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Header do Plano */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      plan.color === 'green' ? 'bg-green-100' :
                      plan.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      <Crown className={`w-8 h-8 ${
                        plan.color === 'green' ? 'text-green-600' :
                        plan.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                      }`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>

                    {/* Preço */}
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          R$ {getPrice(plan).toFixed(2)}
                        </span>
                        <span className="text-gray-500">
                          {billingCycle === 'monthly' ? '/mês' : 
                           billingCycle === 'semiannual' ? '/6 meses' : '/ano'}
                        </span>
                      </div>
                      {getDiscount(plan) > 0 && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <span className="text-lg text-gray-400 line-through">
                            R$ {billingCycle === 'semiannual' ? (plan.price * 6).toFixed(2) : (plan.price * 12).toFixed(2)}
                          </span>
                          <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full font-semibold">
                            -{getDiscount(plan)}% desconto
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Botão de Contratação */}
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.popular ? 'Começar Agora' : 'Escolher Plano'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher os Planos Agroisync?
            </h2>
            <p className="text-lg text-gray-600">
              Tecnologia de ponta para acelerar seu crescimento no agronegócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Crescimento Garantido</h3>
              <p className="text-gray-600">Aumente suas vendas e conecte-se com mais clientes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Segurança Total</h3>
              <p className="text-gray-600">Transações seguras e dados protegidos</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Suporte Especializado</h3>
              <p className="text-gray-600">Equipe dedicada para seu sucesso</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Descontos Especiais</h3>
              <p className="text-gray-600">5% semestral, 10% anual e 20% anual no PIX</p>
          </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Posso mudar de plano a qualquer momento?
              </h3>
              <p className="text-gray-600">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                As alterações são aplicadas imediatamente.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como funcionam os descontos?
              </h3>
              <p className="text-gray-600">
                Oferecemos 5% de desconto no plano semestral (6 meses), 10% de desconto no plano anual (12 meses) 
                e 20% de desconto total quando você escolhe o plano anual com pagamento via PIX. 
                O plano mensal não possui desconto.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                O que acontece se eu exceder os limites do meu plano?
              </h3>
              <p className="text-gray-600">
                Você será notificado quando estiver próximo do limite. Você pode fazer upgrade 
                do plano ou adquirir créditos extras conforme necessário.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-8 flex justify-center">
        <CryptoHash pageName="plans" />
      </div>
    </div>
  );
};

export default AgroisyncPlans;