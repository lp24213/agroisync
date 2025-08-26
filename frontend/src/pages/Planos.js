import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';
import metamaskService from '../services/metamaskService';
import { useTranslation } from 'react-i18next';
import { 
  Check, Star, ShoppingCart, Truck, Package, Leaf, Wrench, User, 
  Circle, Settings, BarChart3, Headphones, Zap, Shield, Globe, Coins, Users, Crown
} from 'lucide-react';
// Componentes removidos - já renderizados pelo Layout global

const Planos = () => {
  const { isDark } = useTheme();
  const { user, hasActivePlan } = useAuth();
  const { t } = useTranslation();
  const [selectedModule, setSelectedModule] = useState('store');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Planos - Agroisync';
  }, []);

  // Planos da Loja AgroSync
  const lojaPlans = [
    {
      id: 'loja-basico',
      name: t('plans.lojaBasico.name'),
      price: t('plans.lojaBasico.price'),
      period: t('plans.lojaBasico.period'),
      description: t('plans.lojaBasico.description'),
      features: [
        t('plans.lojaBasico.features.ads_count'),
        t('plans.lojaBasico.features.basic_support'),
        t('plans.lojaBasico.features.marketplace_access'),
        t('plans.lojaBasico.features.basic_chatbot')
      ],
      limitations: [
        t('plans.lojaBasico.limitations.ads_count'),
        t('plans.lojaBasico.limitations.chat_messages'),
        t('plans.lojaBasico.limitations.no_private_chat')
      ],
      color: 'from-gray-500 to-gray-600',
      buttonColor: 'bg-gray-600 hover:bg-gray-700',
      popular: false
    },
    {
      id: 'loja-pro',
      name: t('plans.lojaPro.name'),
      price: t('plans.lojaPro.price'),
      period: t('plans.lojaPro.period'),
      description: t('plans.lojaPro.description'),
      features: [
        t('plans.lojaPro.features.ads_count'),
        t('plans.lojaPro.features.private_chat'),
        t('plans.lojaPro.features.priority_support'),
        t('plans.lojaPro.features.advanced_chatbot'),
        t('plans.lojaPro.features.freight_premium'),
        t('plans.lojaPro.features.store_highlight')
      ],
      limitations: [],
      color: 'from-green-500 to-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      popular: true
    },
    {
      id: 'loja-enterprise',
      name: t('plans.lojaEnterprise.name'),
      price: t('plans.lojaEnterprise.price'),
      period: t('plans.lojaEnterprise.period'),
      description: t('plans.lojaEnterprise.description'),
      features: [
        t('plans.lojaEnterprise.features.everything_plus'),
        t('plans.lojaEnterprise.features.analytics_advanced'),
        t('plans.lojaEnterprise.features.api_custom'),
        t('plans.lojaEnterprise.features.vip_support'),
        t('plans.lojaEnterprise.features.white_label'),
        t('plans.lojaEnterprise.features.dedicated_manager')
      ],
      limitations: [],
      color: 'from-blue-600 to-purple-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      popular: false
    }
  ];

  // Planos do AgroConecta
  const agroconectaPlans = [
    {
      id: 'agroconecta-basico',
      name: t('plans.agroconectaBasico.name'),
      price: t('plans.agroconectaBasico.price'),
      period: t('plans.agroconectaBasico.period'),
      description: t('plans.agroconectaBasico.description'),
      features: [
        t('plans.agroconectaBasico.features.ads_count'),
        t('plans.agroconectaBasico.features.basic_support'),
        t('plans.agroconectaBasico.features.marketplace_access'),
        t('plans.agroconectaBasico.features.basic_chatbot')
      ],
      limitations: [
        t('plans.agroconectaBasico.limitations.ads_count'),
        t('plans.agroconectaBasico.limitations.chat_messages'),
        t('plans.agroconectaBasico.limitations.no_private_chat')
      ],
      color: 'from-orange-500 to-orange-600',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
      popular: false
    },
    {
      id: 'agroconecta-pro',
      name: t('plans.agroconectaPro.name'),
      price: t('plans.agroconectaPro.price'),
      period: t('plans.agroconectaPro.period'),
      description: t('plans.agroconectaPro.description'),
      features: [
        t('plans.agroconectaPro.features.ads_count'),
        t('plans.agroconectaPro.features.private_chat'),
        t('plans.agroconectaPro.features.priority_support'),
        t('plans.agroconectaPro.features.advanced_chatbot'),
        t('plans.agroconectaPro.features.freight_premium'),
        t('plans.agroconectaPro.features.store_highlight')
      ],
      limitations: [],
      color: 'from-blue-500 to-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      popular: true
    },
    {
      id: 'agroconecta-enterprise',
      name: t('plans.agroconectaEnterprise.name'),
      price: t('plans.agroconectaEnterprise.price'),
      period: t('plans.agroconectaEnterprise.period'),
      description: t('plans.agroconectaEnterprise.description'),
      features: [
        t('plans.agroconectaEnterprise.features.everything_plus'),
        t('plans.agroconectaEnterprise.features.analytics_advanced'),
        t('plans.agroconectaEnterprise.features.api_custom'),
        t('plans.agroconectaEnterprise.features.vip_support'),
        t('plans.agroconectaEnterprise.features.white_label'),
        t('plans.agroconectaEnterprise.features.dedicated_manager')
      ],
      limitations: [],
      color: 'from-purple-600 to-indigo-600',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      popular: false
    }
  ];

  const handlePlanSelection = async (module, plan) => {
    setSelectedModule(module);
    setSelectedPlan(plan);
    setLoading(true);
    setError('');

    try {
      // Simular integração com gateway de pagamento
      if (plan.price !== 'R$ 0,00') {
        // Redirecionar para página de pagamento
        const paymentData = {
          planId: plan.id,
          planName: plan.name,
          amount: parseFloat(plan.price.replace('R$ ', '').replace(',', '.')),
          module: module
        };
        
        // Salvar dados do plano selecionado no localStorage
        localStorage.setItem('selectedPlan', JSON.stringify(paymentData));
        
        // Redirecionar para página de pagamento (simulada)
        window.location.href = '/payment-success';
      } else {
        // Plano gratuito - ativar imediatamente
        await activateFreePlan(plan, module);
      }
    } catch (error) {
      setError('Erro ao processar seleção do plano. Tente novamente.');
      console.error('Erro na seleção do plano:', error);
    } finally {
      setLoading(false);
    }
  };

  const activateFreePlan = async (plan, module) => {
    try {
      // Simular ativação do plano gratuito
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar status do usuário
      if (user) {
        // Aqui seria feita a chamada para a API para atualizar o plano
        console.log('Plano gratuito ativado:', plan.name, 'para módulo:', module);
        
        // Redirecionar para dashboard ou página de sucesso
        alert('Plano gratuito ativado com sucesso!');
        window.location.href = '/';
      }
    } catch (error) {
      setError('Erro ao ativar plano gratuito. Tente novamente.');
      console.error('Erro na ativação:', error);
    }
  };

  const handlePayment = async (module, tier) => {
    try {
      setLoading(true);
      setError('');

      // Salvar plano selecionado no localStorage para uso posterior
      localStorage.setItem('selectedPlan', JSON.stringify({
        module,
        tier,
        timestamp: Date.now()
      }));

      if (module === 'crypto') {
        // Pagamento via cripto
        await handleCryptoPayment(tier);
      } else {
        // Pagamento via Stripe
        await handleStripePayment(module, tier);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoPayment = async (tier) => {
    try {
      // Verificar se Metamask está instalado
      if (!metamaskService.isMetamaskInstalled()) {
        throw new Error('Metamask não está instalado. Por favor, instale a extensão Metamask.');
      }

      // Conectar ao Metamask
      const connection = await metamaskService.connect();
      
      // Obter saldo
      const balance = await metamaskService.getBalance();
      
      // Mapear tier para valor em ETH
      const planValues = {
        'loja-basico': 0.01,
        'loja-pro': 0.02,
        'loja-enterprise': 0.05,
        'agroconecta-basico': 0.01,
        'agroconecta-pro': 0.02,
        'agroconecta-enterprise': 0.05
      };
      
      const amount = planValues[tier] || 0.01;
      
      if (parseFloat(balance) < amount) {
        throw new Error(`Saldo insuficiente. Você tem ${balance} ETH, mas precisa de ${amount} ETH.`);
      }

      // Endereço da carteira do AgroSync (deve ser configurado)
      const ownerWallet = process.env.REACT_APP_OWNER_WALLET || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      
      // Enviar pagamento
      const payment = await metamaskService.sendPayment(ownerWallet, amount, tier);
      
      // Verificar status da transação
      let status = 'pending';
      let confirmations = 0;
      
      // Aguardar confirmações
      while (status === 'pending' && confirmations < 1) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Aguardar 5 segundos
        const txStatus = await metamaskService.getTransactionStatus(payment.hash);
        status = txStatus.status;
        confirmations = txStatus.confirmations;
      }
      
      if (status === 'confirmed' || confirmations >= 1) {
        // Verificar pagamento no backend
        const verification = await paymentService.verifyCryptoPayment(payment.hash, tier);
        
        if (verification.success) {
          // Redirecionar para página de sucesso
          window.location.href = `/payment-success?plan=${tier}&method=crypto&tx=${payment.hash}`;
        } else {
          throw new Error('Falha na verificação do pagamento. Entre em contato com o suporte.');
        }
      } else {
        throw new Error('Transação não foi confirmada. Tente novamente.');
      }
      
    } catch (error) {
      console.error('Erro no pagamento cripto:', error);
      throw error;
    }
  };

  const handleStripePayment = async (module, tier) => {
    try {
      const session = await paymentService.createStripeSession(module, tier);
      // Redirecionar para Stripe
      window.location.href = session.url;
    } catch (error) {
      console.error('Erro no pagamento Stripe:', error);
      throw error;
    }
  };

  const getCurrentPlans = () => {
    return selectedModule === 'store' ? lojaPlans : agroconectaPlans;
  };

  const getModuleIcon = (module) => {
    switch (module) {
      case 'store':
        return <ShoppingCart className="w-6 h-6" />;
      case 'freight':
        return <Truck className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const getModuleTitle = (module) => {
    switch (module) {
      case 'store':
        return t('module.store');
      case 'freight':
        return t('module.freight');
      default:
        return t('module.select');
    }
  };

  const getModuleColor = () => {
    return selectedModule === 'store' ? 'from-green-500 to-blue-600' : 'from-blue-500 to-purple-600';
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <div className="absolute inset-0 bg-white opacity-95"></div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {t('header.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('header.description')}
          </p>
        </div>
      </section>

      {/* Module Selection */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
              {t('module.choose')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Loja AgroSync */}
              <button
                onClick={() => setSelectedModule('store')}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedModule === 'store'
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white`}>
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('module.store')}</h3>
                  <p className="text-gray-600 text-sm">
                    {t('module.storeDescription')}
                  </p>
                  {selectedModule === 'store' && (
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Check className="w-4 h-4 mr-1" />
                      {t('module.selected')}
                    </div>
                  )}
                </div>
              </button>

              {/* AgroConecta */}
              <button
                onClick={() => setSelectedModule('freight')}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedModule === 'freight'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white`}>
                    <Truck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('module.freight')}</h3>
                  <p className="text-gray-600 text-sm">
                    {t('module.freightDescription')}
                  </p>
                  {selectedModule === 'freight' && (
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Check className="w-4 h-4 mr-1" />
                      {t('module.selected')}
                    </div>
                  )}
                </div>
              </button>


            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Module Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${getModuleColor()} text-white mb-6`}>
              {getModuleIcon(selectedModule)}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('plans.title', { module: getModuleTitle(selectedModule) })}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {selectedModule === 'store' 
                ? t('plans.storeDescription')
                : t('plans.freightDescription')
              }
            </p>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {getCurrentPlans().map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'border-green-500 scale-105' : 'border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                      <Star className="w-4 h-4 mr-2 fill-current" />
                      {t('plans.popular')}
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      {t('plans.included')}
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Package className="w-5 h-5 text-gray-500 mr-2" />
                        {t('plans.limitations')}
                      </h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-start">
                            <div className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0">•</div>
                            <span className="text-gray-600">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePayment(selectedModule, plan.id)}
                    className={`w-full py-4 px-6 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 ${plan.buttonColor}`}
                    disabled={loading}
                  >
                    {loading ? t('plans.processing') : plan.price === 'R$ 0,00' ? t('plans.startFree') : t('plans.choosePlan')}
                  </button>

                  {/* Additional Info */}
                  {plan.price !== 'R$ 0,00' && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      {t('plans.cancelAnytime')} • {t('plans.noSetupFee')}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('comparison.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('comparison.description')}
            </p>
          </motion.div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      {t('comparison.feature')}
                    </th>
                    {getCurrentPlans().map((plan) => (
                      <th key={plan.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Anúncios/Fretes */}
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {selectedModule === 'store' ? t('comparison.activeAds') : t('comparison.activeFreights')}
                    </td>
                    {getCurrentPlans().map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.id.includes('basico') 
                          ? (selectedModule === 'store' ? '3' : '5/mês')
                          : plan.id.includes('pro')
                          ? (selectedModule === 'store' ? '50' : '100/mês')
                          : 'Ilimitado'
                        }
                      </td>
                    ))}
                  </tr>

                  {/* Destaque */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {t('comparison.highlight')}
                    </td>
                    {getCurrentPlans().map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.id.includes('basico') ? (
                          <span className="text-red-500">✗</span>
                        ) : (
                          <span className="text-green-500">✓</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Relatórios */}
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {t('comparison.reports')}
                    </td>
                    {getCurrentPlans().map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.id.includes('basico') ? t('comparison.basicReports') : 
                         plan.id.includes('pro') ? t('comparison.intermediateReports') : t('comparison.advancedReports')}
                      </td>
                    ))}
                  </tr>

                  {/* Suporte */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {t('comparison.support')}
                    </td>
                    {getCurrentPlans().map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.id.includes('basico') ? t('comparison.emailSupport') : 
                         plan.id.includes('pro') ? t('comparison.prioritySupport') : t('comparison.dedicatedSupport')}
                      </td>
                    ))}
                  </tr>

                  {/* Chat/API */}
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {selectedModule === 'store' ? t('comparison.apiIntegration') : t('comparison.directChat')}
                    </td>
                    {getCurrentPlans().map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.id.includes('enterprise') ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-red-500">✗</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-6"
          >
            {t('cta.ready')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-green-100 mb-8"
          >
            {t('cta.joinThousands')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-300">
              {t('cta.startNow')}
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-green-600 transition-colors duration-300">
              {t('cta.talkToExpert')}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Planos;
