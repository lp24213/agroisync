import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PLANS, createCheckoutSession, formatCurrency } from '../services/stripeService';

const Planos = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Carregar email do usuário se estiver logado
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = async (plan) => {
    if (!userEmail) {
      alert('Por favor, informe seu email para continuar');
      return;
    }

    setLoading(true);
    try {
      const successUrl = `${window.location.origin}/payment-success?plan=${plan.name}`;
      const cancelUrl = `${window.location.origin}/planos`;

      await createCheckoutSession(
        plan.id,
        userEmail,
        successUrl,
        cancelUrl
      );
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const PlanCard = ({ plan, isPopular = false }) => (
    <div className={`relative bg-neutral-800 rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
      isPopular 
        ? 'border-blue-500 bg-gradient-to-br from-neutral-800 to-blue-900/20' 
        : 'border-neutral-700 hover:border-blue-400'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Mais Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold text-blue-400">
            {formatCurrency(plan.price)}
          </span>
          <span className="text-neutral-400 ml-2">/mês</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-neutral-300">
            <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={() => handleSubscribe(plan)}
        disabled={loading}
        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
          isPopular
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 hover:border-blue-400'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Processando...' : 'Assinar Agora'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16 px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
            Escolha Seu Plano
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            Acesso completo à plataforma AGROSYNC com dados em tempo real, 
            análises avançadas e suporte especializado para seu agronegócio.
          </p>
        </div>

        {/* Email Input */}
        <div className="max-w-md mx-auto mb-12 px-4">
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
              Email para recebimento
            </label>
            <input
              type="email"
              id="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-neutral-500 mt-2">
              Seu email será usado para envio de faturas e acesso à plataforma
            </p>
          </div>
        </div>

        {/* Planos */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <PlanCard plan={PLANS.BASIC} />
            <PlanCard plan={PLANS.PROFESSIONAL} isPopular={true} />
            <PlanCard plan={PLANS.ENTERPRISE} />
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="max-w-4xl mx-auto mt-20 px-4">
          <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Por que escolher a AGROSYNC?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Dados em Tempo Real</h3>
                    <p className="text-neutral-400">Cotações atualizadas a cada 15 minutos do IBGE e Agrolink</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Segurança Garantida</h3>
                    <p className="text-neutral-400">Proteção DDoS, criptografia SSL e compliance LGPD</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Suporte Especializado</h3>
                    <p className="text-neutral-400">Equipe técnica disponível para ajudar no seu sucesso</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">API Integrada</h3>
                    <p className="text-neutral-400">Conecte seus sistemas com nossa API robusta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mt-16 px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h3 className="font-semibold text-white mb-2">
                Como funciona o cancelamento?
              </h3>
              <p className="text-neutral-400">
                Você pode cancelar sua assinatura a qualquer momento através do painel de controle. 
                O acesso será mantido até o final do período já pago.
              </p>
            </div>
            
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h3 className="font-semibold text-white mb-2">
                Os dados são atualizados em tempo real?
              </h3>
              <p className="text-neutral-400">
                Sim! As cotações são atualizadas a cada 15 minutos diretamente das fontes oficiais 
                como IBGE, Agrolink e Receita Federal.
              </p>
            </div>
            
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h3 className="font-semibold text-white mb-2">
                Posso mudar de plano?
              </h3>
              <p className="text-neutral-400">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                A diferença será cobrada ou creditada proporcionalmente.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Planos;
