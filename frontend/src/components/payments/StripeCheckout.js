import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  CreditCard, Lock, Shield, CheckCircle,
  AlertCircle, Loader, ArrowLeft, Info
} from 'lucide-react';
import paymentService from '../../services/paymentService';

const StripeCheckout = ({ 
  orderData, 
  onSuccess, 
  onCancel, 
  onError 
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('details'); // 'details', 'payment', 'processing', 'success', 'error'
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [error, setError] = useState(null);
  const [fees, setFees] = useState(null);

  useEffect(() => {
    calculateFees();
  }, [orderData]);

  const calculateFees = async () => {
    try {
      const feesData = await paymentService.calculateFees(
        orderData.amount,
        'brl',
        'payment'
      );
      setFees(feesData);
    } catch (error) {
      console.error('Erro ao calcular taxas:', error);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    setStep('processing');

    try {
      // Criar PaymentIntent
      const intentData = await paymentService.createPaymentIntent({
        amount: orderData.amount,
        currency: 'brl',
        orderId: orderData.id,
        userId: user.id,
        type: orderData.type,
        description: orderData.description
      });

      setPaymentIntent(intentData);

      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular sucesso
      setStep('success');
      onSuccess({
        paymentIntentId: intentData.id,
        orderId: orderData.id,
        amount: orderData.amount
      });

    } catch (error) {
      console.error('Erro no pagamento:', error);
      setError(error.message || 'Erro ao processar pagamento');
      setStep('error');
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const renderDetails = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Resumo do Pedido */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          {t('checkout.orderSummary', 'Resumo do Pedido')}
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">
              {t('checkout.product', 'Produto')}:
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {orderData.productName}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">
              {t('checkout.quantity', 'Quantidade')}:
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {orderData.quantity} {orderData.unit}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">
              {t('checkout.subtotal', 'Subtotal')}:
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(orderData.subtotal)}
            </span>
          </div>
          
          {fees && (
            <>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  {t('checkout.fees', 'Taxas')}:
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(fees.total)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  {t('checkout.shipping', 'Frete')}:
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(orderData.shipping || 0)}
                </span>
              </div>
            </>
          )}
          
          <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                {t('checkout.total', 'Total')}:
              </span>
              <span className="text-lg font-bold text-emerald-600">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(orderData.amount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informações de Segurança */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              {t('checkout.securePayment', 'Pagamento Seguro')}
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {t('checkout.secureDescription', 'Seus dados são protegidos com criptografia SSL e processados pelo Stripe.')}
            </p>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4">
        <button
          onClick={handleCancel}
          className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {t('checkout.cancel', 'Cancelar')}
        </button>
        <button
          onClick={() => setStep('payment')}
          className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          {t('checkout.continue', 'Continuar')}
        </button>
      </div>
    </motion.div>
  );

  const renderPayment = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Formulário de Pagamento */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
          {t('checkout.paymentMethod', 'Método de Pagamento')}
        </h3>
        
        {/* Simulação de formulário Stripe */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('checkout.cardNumber', 'Número do Cartão')}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
              <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('checkout.expiryDate', 'Validade')}
              </label>
              <input
                type="text"
                placeholder="MM/AA"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('checkout.cvv', 'CVV')}
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('checkout.cardholderName', 'Nome no Cartão')}
            </label>
            <input
              type="text"
              placeholder={user?.name || t('checkout.cardholderName', 'Nome no Cartão')}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4">
        <button
          onClick={() => setStep('details')}
          className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('checkout.back', 'Voltar')}
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
          {t('checkout.payNow', 'Pagar Agora')}
        </button>
      </div>
    </motion.div>
  );

  const renderProcessing = () => (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-6"></div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
        {t('checkout.processing', 'Processando Pagamento')}
      </h3>
      <p className="text-slate-600 dark:text-slate-400">
        {t('checkout.processingDescription', 'Aguarde enquanto processamos seu pagamento...')}
      </p>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
        {t('checkout.success', 'Pagamento Realizado!')}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {t('checkout.successDescription', 'Seu pagamento foi processado com sucesso.')}
      </p>
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('checkout.transactionId', 'ID da Transação')}: {paymentIntent?.id}
        </p>
      </div>
    </motion.div>
  );

  const renderError = () => (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
        {t('checkout.error', 'Erro no Pagamento')}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        {error || t('checkout.errorDescription', 'Ocorreu um erro ao processar seu pagamento.')}
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setStep('payment')}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {t('checkout.tryAgain', 'Tentar Novamente')}
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {t('checkout.cancel', 'Cancelar')}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          {t('checkout.title', 'Finalizar Compra')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t('checkout.subtitle', 'Complete seu pagamento de forma segura')}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'details' && renderDetails()}
        {step === 'payment' && renderPayment()}
        {step === 'processing' && renderProcessing()}
        {step === 'success' && renderSuccess()}
        {step === 'error' && renderError()}
      </AnimatePresence>
    </div>
  );
};

export default StripeCheckout;
