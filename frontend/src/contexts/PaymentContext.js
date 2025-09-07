import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment deve ser usado dentro de um PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [subscription, setSubscription] = useState(null);

  // Inicializar Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
        setStripe(stripeInstance);
      } catch (error) {
        console.error('Erro ao inicializar Stripe:', error);
        setError('Erro ao inicializar sistema de pagamentos');
      } finally {
        setLoading(false);
      }
    };

    initializeStripe();
  }, []);

  // Criar payment intent
  const createPaymentIntent = async (amount, currency = 'brl', metadata = {}) => {
    try {
      const response = await fetch('/api/payments/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Stripe usa centavos
          currency,
          metadata
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar payment intent');
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar payment intent:', error);
      throw error;
    }
  };

  // Processar pagamento com Stripe
  const processStripePayment = async (paymentIntent) => {
    if (!stripe) {
      throw new Error('Stripe não inicializado');
    }

    try {
      const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
        paymentIntent.client_secret
      );

      if (error) {
        throw new Error(error.message);
      }

      return confirmedPayment;
    } catch (error) {
      console.error('Erro ao processar pagamento Stripe:', error);
      throw error;
    }
  };

  // Processar pagamento com MetaMask
  const processMetaMaskPayment = async (amount, tokenAddress, recipientAddress) => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask não encontrado');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      const transactionParameters = {
        to: recipientAddress,
        from: account,
        value: '0x' + (amount * Math.pow(10, 18)).toString(16), // ETH em wei
        gas: '0x5208', // 21000 gas
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      return txHash;
    } catch (error) {
      console.error('Erro ao processar pagamento MetaMask:', error);
      throw error;
    }
  };

  // Obter planos de assinatura
  const getSubscriptionPlans = async () => {
    try {
      const response = await fetch('/api/payments/plans');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao obter planos');
      }

      return data.plans;
    } catch (error) {
      console.error('Erro ao obter planos:', error);
      throw error;
    }
  };

  // Criar assinatura
  const createSubscription = async (planId, paymentMethodId) => {
    try {
      const response = await fetch('/api/payments/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId,
          paymentMethodId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar assinatura');
      }

      setSubscription(data.subscription);
      return data;
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
  };

  // Cancelar assinatura
  const cancelSubscription = async (subscriptionId) => {
    try {
      const response = await fetch(`/api/payments/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cancelar assinatura');
      }

      setSubscription(null);
      return data;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw error;
    }
  };

  // Obter histórico de pagamentos
  const getPaymentHistory = async () => {
    try {
      const response = await fetch('/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao obter histórico');
      }

      return data.payments;
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      throw error;
    }
  };

  const value = {
    stripe,
    loading,
    error,
    paymentMethods,
    subscription,
    createPaymentIntent,
    processStripePayment,
    processMetaMaskPayment,
    getSubscriptionPlans,
    createSubscription,
    cancelSubscription,
    getPaymentHistory
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};