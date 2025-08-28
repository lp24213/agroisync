import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../services/paymentService';
import metamaskService from '../services/metamaskService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Check, Star, ShoppingCart, Truck, Package, Leaf, Wrench, User, 
  Circle, Settings, BarChart3, Headphones, Zap, Shield, Globe, Coins, Users, Crown,
  CreditCard, Wallet, ArrowRight, CheckCircle, AlertCircle
} from 'lucide-react';

const Planos = () => {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState('store');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' ou 'metamask'
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    document.title = 'Planos - Agroisync';
    checkMetamaskConnection();
  }, []);

  const checkMetamaskConnection = async () => {
    try {
      if (metamaskService.isMetamaskInstalled()) {
        const accounts = await metamaskService.getAccounts();
        if (accounts.length > 0) {
          setMetamaskConnected(true);
          setWalletAddress(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar conexão Metamask:', error);
    }
  };

  const connectMetamask = async () => {
    try {
      setLoading(true);
      const connection = await metamaskService.connect();
      
      if (connection.success) {
        setMetamaskConnected(true);
        setWalletAddress(connection.address);
        setPaymentMethod('metamask');
        setSuccess('Metamask conectado com sucesso!');
      } else {
        setError(connection.error || 'Erro ao conectar Metamask');
      }
    } catch (error) {
      setError('Erro ao conectar Metamask: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    setError('');
    setSuccess('');
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Selecione um plano primeiro');
      return;
    }

    if (!isAuthenticated) {
      // Redirecionar para cadastro se não estiver logado
      navigate('/cadastro', { 
        state: { 
          redirectTo: '/planos',
          selectedPlan: selectedPlan.id,
          message: 'Complete seu cadastro para continuar com o pagamento'
        }
      });
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;

      if (paymentMethod === 'metamask') {
        if (!metamaskConnected) {
          await connectMetamask();
          return;
        }
        
        // Pagamento via Metamask
        result = await metamaskService.sendTransaction({
          to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Endereço da carteira do AgroSync
          value: getPlanPriceInWei(selectedPlan),
          data: '0x' // Dados da transação
        });

        if (result.success) {
          setSuccess(`Pagamento realizado com sucesso! Hash: ${result.hash}`);
          // Redirecionar para dashboard após pagamento
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setError(result.error || 'Erro no pagamento via Metamask');
        }
      } else {
        // Pagamento via Stripe
        result = await paymentService.createPaymentIntent({
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          amount: getPlanPriceInCents(selectedPlan),
          currency: 'brl',
          userId: user.id
        });

        if (result.success) {
          // Redirecionar para página de pagamento do Stripe
          window.location.href = result.paymentUrl;
        } else {
          setError(result.error || 'Erro ao criar sessão de pagamento');
        }
      }
    } catch (error) {
      setError('Erro no processamento do pagamento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlanPriceInCents = (plan) => {
    // Converter preço para centavos para Stripe
    const price = parseFloat(plan.price.replace('R$', '').replace(',', '.'));
    return Math.round(price * 100);
  };

  const getPlanPriceInWei = (plan) => {
    // Converter preço para Wei para Metamask (1 ETH = ~R$ 15.000)
    const price = parseFloat(plan.price.replace('R$', '').replace(',', '.'));
    const ethPrice = price / 15000; // Taxa de conversão aproximada
    return Math.round(ethPrice * 1e18); // 1 ETH = 1e18 Wei
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  // Planos da Loja AgroSync
  const lojaPlans = [
    {
      id: 'loja-basico',
      name: 'Loja Básico',
      price: 'R$ 29,90',
      period: 'por mês',
      description: 'Ideal para pequenos produtores e comerciantes',
      features: [
        'Até 50 anúncios ativos',
        'Suporte básico por email',
        'Acesso ao marketplace',
        'Chatbot básico incluído'
      ],
      limitations: [
        'Máximo 50 anúncios',
        '100 mensagens/mês',
        'Sem chat privado'
      ],
      color: 'from-emerald-600 to-blue-600',
      buttonColor: 'btn-premium',
      popular: false
    },
    {
      id: 'loja-pro',
      name: 'Loja Pro',
      price: 'R$ 79,90',
      period: 'por mês',
      description: 'Perfeito para produtores em crescimento',
      features: [
        'Anúncios ilimitados',
        'Chat privado incluído',
        'Suporte prioritário',
        'Chatbot avançado',
        'Fretes premium',
        'Destaque na loja'
      ],
      limitations: [],
      color: 'from-yellow-500 to-blue-600',
      buttonColor: 'btn-premium',
      popular: true
    },
    {
      id: 'loja-enterprise',
      name: 'Loja Enterprise',
      price: 'R$ 199,90',
      period: 'por mês',
      description: 'Solução completa para grandes empresas',
      features: [
        'Tudo do plano Pro',
        'Analytics avançados',
        'API personalizada',
        'Suporte VIP',
        'White label',
        'Gerente dedicado'
      ],
      limitations: [],
      color: 'from-blue-600 to-emerald-600',
      buttonColor: 'btn-premium',
      popular: false
    }
  ];

  // Planos do AgroConecta
  const agroconectaPlans = [
    {
      id: 'agroconecta-medio',
      name: 'AgroConecta - Médio',
      price: 'R$ 99,90',
      period: 'por mês',
      description: 'Acesso básico às funções premium',
      features: [
        'Mensageria completa',
        'Listar fretes ilimitados',
        'Contatos após pagamento',
        'Suporte prioritário',
        'Notificações avançadas',
        'Relatórios básicos'
      ],
      limitations: [
        'Sem destaque premium',
        'API limitada'
      ],
      color: 'from-green-600 to-blue-600',
      buttonColor: 'btn-premium',
      popular: false
    },
    {
      id: 'agroconecta-pro',
      name: 'AgroConecta - Pro',
      price: 'R$ 249,90',
      period: 'por mês',
      description: 'Acesso completo com prioridade',
      features: [
        'Tudo do plano Médio',
        'Listar ilimitado',
        'Prioridade nos resultados',
        'Relatórios avançados',
        'API completa',
        'Suporte VIP',
        'Destaque premium'
      ],
      limitations: [],
      color: 'from-blue-600 to-purple-600',
      buttonColor: 'btn-premium',
      popular: true
    }
  ];

  // Planos de Criptomoedas - REMOVIDOS
  // A funcionalidade crypto permanece disponível na página /cripto
  // mas não faz parte dos planos pagos

  const getCurrentPlans = () => {
    switch (selectedModule) {
      case 'store':
        return lojaPlans;
      case 'agroconecta':
        return agroconectaPlans;
      default:
        return lojaPlans;
    }
  };

  const getModuleIcon = (module) => {
    switch (module) {
      case 'store':
        return <ShoppingCart className="w-6 h-6" />;
      case 'agroconecta':
        return <Truck className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const getModuleName = (module) => {
    switch (module) {
      case 'store':
        return 'Loja AgroSync';
      case 'agroconecta':
        return 'AgroConecta';
      default:
        return 'Loja AgroSync';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-emerald-700 to-blue-600 bg-clip-text text-transparent mb-6">
            Escolha o Plano Ideal para Você
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Planos flexíveis para todos os tamanhos de negócio. Escolha o que melhor se adapta às suas necessidades.
          </p>
        </motion.div>

        {/* Seleção de Módulo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'store', name: 'Loja AgroSync', icon: ShoppingCart },
              { id: 'agroconecta', name: 'AgroConecta', icon: Truck }
            ].map((module) => {
              const Icon = module.icon;
              const isActive = selectedModule === module.id;
              
              return (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{module.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Planos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getCurrentPlans().map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedPlan?.id === plan.id
                    ? 'border-emerald-500 shadow-2xl'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                }`}
              >
                {/* Badge Popular */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Mais Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Header do Plano */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 ml-2">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                      O que está incluído:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitações */}
                  {plan.limitations.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
                        Limitações:
                      </h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                            <span className="text-slate-600 dark:text-slate-400 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Botão de Seleção */}
                  <button
                    onClick={() => handlePlanSelection(plan)}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      selectedPlan?.id === plan.id
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {selectedPlan?.id === plan.id ? '✓ Plano Selecionado' : 'Selecionar Plano'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Seleção de Método de Pagamento */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                Método de Pagamento
              </h3>

              {/* Opções de Pagamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Stripe */}
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    paymentMethod === 'stripe'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paymentMethod === 'stripe' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      <CreditCard className={`w-6 h-6 ${
                        paymentMethod === 'stripe' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                      }`} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Cartão de Crédito</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Pagamento seguro via Stripe</p>
                    </div>
                  </div>
                </button>

                {/* Metamask */}
                <button
                  onClick={() => setPaymentMethod('metamask')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    paymentMethod === 'metamask'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paymentMethod === 'metamask' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      <Wallet className={`w-6 h-6 ${
                        paymentMethod === 'metamask' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                      }`} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Criptomoedas</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {metamaskConnected ? 'Metamask conectado' : 'Conectar Metamask'}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Status da Carteira */}
              {paymentMethod === 'metamask' && (
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  {metamaskConnected ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          Metamask conectado
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <span className="text-amber-700 dark:text-amber-400 font-medium">
                          Metamask não conectado
                        </span>
                      </div>
                      <button
                        onClick={connectMetamask}
                        disabled={loading}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Conectando...' : 'Conectar'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Resumo do Plano */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Resumo do Plano</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{selectedPlan.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedPlan.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">{selectedPlan.price}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {paymentMethod === 'metamask' ? 'em ETH' : 'em BRL'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de Pagamento */}
              <button
                onClick={handlePayment}
                disabled={loading || (paymentMethod === 'metamask' && !metamaskConnected)}
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'metamask' ? 'Pagar com Metamask' : 'Pagar com Cartão'}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Mensagens de Status */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 dark:text-red-400">{error}</span>
                  </div>
                </div>
              )}

              {success && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 dark:text-green-400">{success}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* CTA para Cadastro */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-slate-200 dark:border-slate-600">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Ainda não tem uma conta?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Crie sua conta gratuitamente e comece a usar o AgroSync hoje mesmo!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/cadastro')}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
                >
                  Criar Conta Gratuita
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-transparent border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                >
                  Já tenho conta
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Planos;
