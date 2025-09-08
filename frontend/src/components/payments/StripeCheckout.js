import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Loader } from 'lucide-react';
import paymentService from '../../services/paymentService';

const StripeCheckout = ({ 
  orderData, 
  onSuccess, 
  onCancel, 
  onError 
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState('details');
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [error, setError] = useState(null);
  const [fees, setFees] = useState(null);

  useEffect(() => {
    calculateFees();
  }, [orderData, calculateFees]);

  const calculateFees = useCallback(async () => {
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
  }, [orderData.amount]);

  const handlePayment = async () => {
    setStep('processing');
    setError(null);

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
      setError(error.message);
      setStep('error');
      onError(error);
    } finally {
      // Payment processing completed
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  const renderDetails = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('payment.details', 'Detalhes do Pagamento')}
        </h2>
        <p className="text-gray-600">
          {t('payment.review', 'Revise os detalhes antes de prosseguir')}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          {t('payment.orderSummary', 'Resumo do Pedido')}
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">{orderData.description}</span>
            <span className="font-medium">{formatCurrency(orderData.amount)}</span>
          </div>
          {fees && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('payment.processingFee', 'Taxa de Processamento')}</span>
                <span className="font-medium">{formatCurrency(fees.processingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('payment.platformFee', 'Taxa da Plataforma')}</span>
                <span className="font-medium">{formatCurrency(fees.platformFee)}</span>
              </div>
            </>
          )}
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>{t('payment.total', 'Total')}</span>
            <span>{formatCurrency(orderData.amount + (fees ? fees.total : 0))}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t('common.cancel', 'Cancelar')}
        </button>
        <button
          onClick={handlePayment}
          className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {t('payment.payNow', 'Pagar Agora')}
        </button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-6">
      <Loader className="w-12 h-12 text-gray-600 mx-auto animate-spin" />
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('payment.processing', 'Processando Pagamento')}
        </h2>
        <p className="text-gray-600">
          {t('payment.pleaseWait', 'Por favor, aguarde...')}
        </p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('payment.success', 'Pagamento Realizado!')}
        </h2>
        <p className="text-gray-600">
          {t('payment.successMessage', 'Seu pagamento foi processado com sucesso.')}
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>{t('payment.transactionId', 'ID da Transação')}:</strong> {paymentIntent?.id}</p>
          <p><strong>{t('payment.amount', 'Valor')}:</strong> {formatCurrency(orderData.amount)}</p>
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('payment.error', 'Erro no Pagamento')}
        </h2>
        <p className="text-gray-600 mb-4">
          {error || t('payment.errorMessage', 'Ocorreu um erro ao processar seu pagamento.')}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t('common.cancel', 'Cancelar')}
        </button>
        <button
          onClick={() => setStep('details')}
          className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          {t('payment.tryAgain', 'Tentar Novamente')}
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
    >
        {step === 'details' && renderDetails()}
        {step === 'processing' && renderProcessing()}
        {step === 'success' && renderSuccess()}
        {step === 'error' && renderError()}
    </motion.div>
  );
};

export default StripeCheckout;