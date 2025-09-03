import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home, User, CreditCard, Coins } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import StockMarketTicker from '../components/StockMarketTicker';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [planDetails, setPlanDetails] = useState(null);

  useEffect(() => {
    document.title = 'Pagamento Confirmado - Agroisync';
    
    const plan = searchParams.get('plan');
    const method = searchParams.get('method');
    const tx = searchParams.get('tx');
    
    if (plan) {
      setPlanDetails(plan);
    }
    
    // Simular verificação do status do pagamento
    setTimeout(() => {
      setLoading(false);
      // Atualizar dados do usuário
      if (user) {
        refreshUser();
      }
    }, 2000);
  }, [searchParams, user, refreshUser]);

  const handleContinue = () => {
    if (user?.isPaid) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const getPlanName = (planId) => {
    const planNames = {
      'anunciante-basic': 'Anunciante Básico',
      'anunciante-premium': 'Anunciante Premium',
      'anunciante-enterprise': 'Anunciante Enterprise',
      'freteiro-basic': 'Freteiro Básico',
      'freteiro-premium': 'Freteiro Premium',
      'freteiro-enterprise': 'Freteiro Enterprise',
      'comprador-basic': 'Comprador Básico',
      'comprador-premium': 'Comprador Premium',
      'loja-basico': 'Loja Básico',
      'loja-pro': 'Loja Pro',
      'loja-enterprise': 'Loja Enterprise',
      'agroconecta-basico': 'AgroConecta Básico',
      'agroconecta-pro': 'AgroConecta Pro',
      'agroconecta-enterprise': 'AgroConecta Enterprise'
    };
    return planNames[planId] || 'Plano';
  };

  const getPaymentMethodInfo = () => {
    const method = searchParams.get('method');
    const tx = searchParams.get('tx');
    
    if (method === 'crypto' && tx) {
      return {
        method: 'Criptomoeda',
        icon: 'Coins',
        details: `Transação: ${tx.substring(0, 10)}...${tx.substring(tx.length - 8)}`,
        description: 'Pagamento processado via blockchain'
      };
    } else {
      return {
        method: 'Cartão de Crédito',
        icon: 'CreditCard',
        details: 'Processado via Stripe',
        description: 'Pagamento seguro e instantâneo'
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-16">
      <StockMarketTicker />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gradient-agro mb-4">
              Pagamento Confirmado!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Seu plano foi ativado com sucesso. Bem-vindo ao AgroSync!
            </p>
          </div>

          {/* Plan Details */}
          {planDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8 border border-green-200"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Detalhes do Plano
              </h2>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {getPlanName(planDetails)}
                </h3>
                <p className="text-gray-600 mb-4">
                  Seu plano está ativo e você tem acesso completo às funcionalidades.
                </p>
                
                {/* Payment Method Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getPaymentMethodInfo().icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{getPaymentMethodInfo().method}</p>
                        <p className="text-sm text-gray-600">{getPaymentMethodInfo().description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-mono">{getPaymentMethodInfo().details}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Ativo</span>
                  </div>
                  <div className="text-gray-400">•</div>
                  <div className="text-gray-600">
                    Expira em 30 dias
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Próximos Passos
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Acessar Dashboard
                </h3>
                <p className="text-gray-600 mb-4">
                  Gerencie seus produtos, fretes e mensagens no painel privado.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ir para Dashboard
                </button>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Home className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Voltar ao Início
                </h3>
                <p className="text-gray-600 mb-4">
                  Explore o marketplace e descubra novos produtos e fretes.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
            >
              Continuar
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

