import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, CreditCard, Lock } from 'lucide-react';
import { processIndividualPayment, processPlanPayment, PAYMENT_PLANS } from '../services/stripe';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz');

const PaymentForm = ({ paymentData, onSuccess, onError, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Criar Payment Intent
      let clientSecret;
      if (paymentData.type === 'individual') {
        clientSecret = await processIndividualPayment(
          paymentData.adId,
          paymentData.userId,
          paymentData.amount
        );
      } else {
        clientSecret = await processPlanPayment(
          paymentData.planType,
          paymentData.userId,
          paymentData.amount
        );
      }

      // Confirmar pagamento
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: paymentData.userName || 'Usuário',
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        onError(stripeError);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError('Erro ao processar pagamento. Tente novamente.');
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-header">
        <h3 className="payment-title">
          <CreditCard size={24} />
          Pagamento Seguro
        </h3>
        <button type="button" onClick={onClose} className="payment-close">
          <X size={20} />
        </button>
      </div>

      <div className="payment-info">
        <div className="payment-plan">
          <h4>{paymentData.planName}</h4>
          <p className="payment-description">{paymentData.description}</p>
          <div className="payment-price">
            R$ {paymentData.amount.toFixed(2)}
          </div>
        </div>

        <div className="payment-security">
          <Lock size={16} />
          <span>Pagamento 100% seguro com Stripe</span>
        </div>
      </div>

      <div className="payment-card">
        <label className="payment-label">Dados do Cartão</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="payment-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="payment-submit"
      >
        {isProcessing ? 'Processando...' : `Pagar R$ ${paymentData.amount.toFixed(2)}`}
      </button>
    </form>
  );
};

const PaymentModal = ({ isOpen, onClose, paymentData, onSuccess, onError }) => {
  if (!isOpen) return null;

  const handleSuccess = (paymentIntent) => {
    onSuccess(paymentIntent);
    onClose();
  };

  const handleError = (error) => {
    onError(error);
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <Elements stripe={stripePromise}>
          <PaymentForm
            paymentData={paymentData}
            onSuccess={handleSuccess}
            onError={handleError}
            onClose={onClose}
          />
        </Elements>
      </div>

      <style jsx>{`
        .payment-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .payment-modal {
          background: var(--agro-bg-primary);
          border: 1px solid var(--agro-border-color);
          border-radius: 16px;
          padding: 0;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .payment-form {
          padding: 24px;
        }

        .payment-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--agro-border-color);
        }

        .payment-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 600;
          color: var(--agro-text-primary);
          margin: 0;
        }

        .payment-close {
          background: none;
          border: none;
          color: var(--agro-text-secondary);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .payment-close:hover {
          background: var(--agro-hover-bg);
          color: var(--agro-text-primary);
        }

        .payment-info {
          margin-bottom: 24px;
        }

        .payment-plan h4 {
          font-size: 18px;
          font-weight: 600;
          color: var(--agro-text-primary);
          margin: 0 0 8px 0;
        }

        .payment-description {
          color: var(--agro-text-secondary);
          margin: 0 0 12px 0;
        }

        .payment-price {
          font-size: 24px;
          font-weight: 700;
          color: var(--agro-primary-color);
        }

        .payment-security {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--agro-text-secondary);
          font-size: 14px;
          margin-top: 12px;
        }

        .payment-card {
          margin-bottom: 20px;
        }

        .payment-label {
          display: block;
          font-weight: 500;
          color: var(--agro-text-primary);
          margin-bottom: 8px;
        }

        .payment-error {
          background: rgba(255, 59, 48, 0.1);
          border: 1px solid rgba(255, 59, 48, 0.3);
          color: #ff3b30;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .payment-submit {
          width: 100%;
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .payment-submit:hover:not(:disabled) {
          background: var(--agro-primary-hover);
          transform: translateY(-2px);
        }

        .payment-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 480px) {
          .payment-modal {
            width: 95%;
            margin: 20px;
          }

          .payment-form {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentModal;
