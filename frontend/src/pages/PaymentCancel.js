import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, Home, CreditCard, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Pagamento Cancelado - AGROISYNC';
  }, []);

  const handleRetryPayment = () => {
    navigate('/planos');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoDashboard = () => {
    if (user?.isPaid) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const getCancelReason = () => {
    const reason = searchParams.get('reason');
    const error = searchParams.get('error');
    
    if (reason) {
      return reason;
    }
    
    if (error) {
      return `Erro: ${error}`;
    }
    
    return 'Pagamento foi cancelado pelo usuário';
  };

  return (
    <div className="min-h-screen bg-agro-bg-primary text-agro-text-primary pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Ícone de cancelamento */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center"
            >
              <XCircle className="w-12 h-12 text-red-600" />
            </motion.div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-agro-text-primary mb-4">
            Pagamento Cancelado
          </h1>

          {/* Mensagem */}
          <p className="text-lg text-agro-text-secondary mb-8 max-w-2xl mx-auto">
            {getCancelReason()}
          </p>

          {/* Informações adicionais */}
          <div className="bg-agro-bg-secondary rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-agro-text-primary mb-3">
              O que aconteceu?
            </h3>
            <ul className="text-sm text-agro-text-secondary space-y-2 text-left">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>O pagamento não foi processado</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Nenhum valor foi debitado da sua conta</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Você pode tentar novamente quando quiser</span>
              </li>
            </ul>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetryPayment}
              className="btn-primary flex items-center gap-2 px-6 py-3"
            >
              <RefreshCw className="w-5 h-5" />
              Tentar Novamente
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoHome}
              className="btn-secondary flex items-center gap-2 px-6 py-3"
            >
              <Home className="w-5 h-5" />
              Voltar ao Início
            </motion.button>

            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoDashboard}
                className="btn-accent-sky flex items-center gap-2 px-6 py-3"
              >
                <ArrowLeft className="w-5 h-5" />
                Ir ao Painel
              </motion.button>
            )}
          </div>

          {/* Informações de suporte */}
          <div className="mt-12 pt-8 border-t border-agro-border-primary">
            <p className="text-sm text-agro-text-tertiary mb-4">
              Precisa de ajuda? Entre em contato conosco:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-agro-accent-emerald" />
                <span className="text-agro-text-secondary">
                  (66) 99236-2830
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-agro-text-secondary">
                  contato@agroisync.com
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentCancel;
