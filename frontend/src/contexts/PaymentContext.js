import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import metamaskService from '../services/metamaskService';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment deve ser usado dentro de um PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const { user } = useAuth();
  const [isPaid, setIsPaid] = useState(false);
  const [planActive, setPlanActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');

  useEffect(() => {
    if (user) {
      checkPaymentStatus();
      checkMetamaskConnection();
    } else {
      setIsPaid(false);
      setPlanActive(null);
      setLoading(false);
    }
  }, [user]);

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsPaid(false);
        setPlanActive(null);
        return;
      }

      const response = await fetch('/api/payments/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsPaid(data.isPaid);
        setPlanActive(data.planActive);
      } else {
        setIsPaid(false);
        setPlanActive(null);
      }
    } catch (error) {
      console.error('Erro ao verificar status de pagamento:', error);
      setIsPaid(false);
      setPlanActive(null);
    } finally {
      setLoading(false);
    }
  };

  const checkMetamaskConnection = async () => {
    try {
      if (metamaskService.isMetamaskInstalled()) {
        const accounts = await metamaskService.getAccounts();
        if (accounts.length > 0) {
          setMetamaskConnected(true);
          setWalletAddress(accounts[0]);
          const balance = await metamaskService.getBalance();
          setWalletBalance(balance);
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
        const balance = await metamaskService.getBalance();
        setWalletBalance(balance);
        return { success: true };
      } else {
        return { success: false, error: connection.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const disconnectMetamask = () => {
    setMetamaskConnected(false);
    setWalletAddress('');
    setWalletBalance('0');
  };

  const processStripePayment = async (planId, planData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/payments/stripe/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId,
          planData,
          returnUrl: window.location.origin + '/payment-success',
          cancelUrl: window.location.origin + '/planos'
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Redirecionar para Stripe Checkout
        window.location.href = data.url;
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const processCryptoPayment = async (planId, planData, amount) => {
    try {
      setLoading(true);
      
      if (!metamaskConnected) {
        return { success: false, error: 'Metamask não conectado' };
      }

      // Endereço da carteira do AgroSync
      const ownerWallet = process.env.REACT_APP_OWNER_WALLET || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      
      // Enviar pagamento
      const payment = await metamaskService.sendPayment(
        ownerWallet, 
        amount, 
        `Pagamento AgroSync - ${planData.name}`
      );

      // Aguardar confirmação
      let confirmations = 0;
      let attempts = 0;
      const maxAttempts = 12; // 1 minuto máximo

      while (confirmations < 1 && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Aguardar 5 segundos
        const status = await metamaskService.getTransactionStatus(payment.hash);
        confirmations = status.confirmations;
        attempts++;
      }

      if (confirmations >= 1) {
        // Verificar pagamento no backend
        const token = localStorage.getItem('token');
        const verification = await fetch('/api/payments/crypto/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            transactionHash: payment.hash,
            planId,
            amount,
            fromAddress: walletAddress,
            toAddress: ownerWallet
          })
        });

        if (verification.ok) {
          const result = await verification.json();
          if (result.success) {
            // Atualizar status de pagamento
            await checkPaymentStatus();
            return { success: true, hash: payment.hash };
          } else {
            return { success: false, error: 'Falha na verificação do pagamento' };
          }
        } else {
          return { success: false, error: 'Falha na verificação do pagamento' };
        }
      } else {
        return { success: false, error: 'Transação não foi confirmada no tempo limite' };
      }

    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/payments/verify/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Atualizar status de pagamento
          await checkPaymentStatus();
          return { success: true };
        } else {
          return { success: false, error: data.error };
        }
      } else {
        return { success: false, error: 'Falha na verificação' };
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/payments/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Atualizar status de pagamento
          await checkPaymentStatus();
          return { success: true };
        } else {
          return { success: false, error: data.error };
        }
      } else {
        return { success: false, error: 'Falha ao cancelar assinatura' };
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const getPaymentHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, history: data.history };
      } else {
        return { success: false, error: 'Falha ao buscar histórico' };
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    }
  };

  const value = {
    isPaid,
    planActive,
    loading,
    metamaskConnected,
    walletAddress,
    walletBalance,
    connectMetamask,
    disconnectMetamask,
    processStripePayment,
    processCryptoPayment,
    verifyPayment,
    cancelSubscription,
    getPaymentHistory,
    checkPaymentStatus
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
