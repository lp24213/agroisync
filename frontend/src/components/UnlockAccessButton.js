import React, { useState } from 'react';
import { Lock, Unlock, CreditCard } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { PAYMENT_PLANS, unlockSensitiveData } from '../services/stripe';

const UnlockAccessButton = ({ adId, userId, adData, onUnlock }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleUnlockClick = () => {
    setIsPaymentModalOpen(true);
    setError(null);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    setIsProcessing(true);
    try {
      // Liberar dados sensíveis após pagamento confirmado
      await unlockSensitiveData(userId, adId);
      
      // Notificar componente pai
      if (onUnlock) {
        onUnlock(adId);
      }
      
      // Mostrar sucesso
      console.log('Pagamento confirmado! Dados liberados.');
    } catch (err) {
      setError('Erro ao liberar dados. Contate o suporte.');
      console.error('Erro ao liberar dados:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    setError('Erro no pagamento. Tente novamente.');
    console.error('Erro no pagamento:', error);
  };

  const paymentData = {
    type: 'individual',
    adId: adId,
    userId: userId,
    amount: PAYMENT_PLANS.individual.price,
    planName: PAYMENT_PLANS.individual.name,
    description: PAYMENT_PLANS.individual.description,
    userName: adData?.userName || 'Usuário'
  };

  return (
    <>
      <div className="unlock-access-section">
        <div className="unlock-header">
          <Lock size={20} />
          <h4>Acesso Restrito</h4>
        </div>
        
        <div className="unlock-content">
          <p className="unlock-description">
            Para acessar informações de contato, chat e detalhes de frete, 
            você precisa liberar o acesso através de um pagamento seguro.
          </p>
          
          <div className="unlock-features">
            <h5>O que você terá acesso:</h5>
            <ul>
              {PAYMENT_PLANS.individual.features.map((feature, index) => (
                <li key={index}>
                  <Unlock size={14} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="unlock-price">
            <span className="price-label">Valor:</span>
            <span className="price-value">R$ {PAYMENT_PLANS.individual.price.toFixed(2)}</span>
          </div>
          
          {error && (
            <div className="unlock-error">
              {error}
            </div>
          )}
          
          <button
            onClick={handleUnlockClick}
            disabled={isProcessing}
            className="unlock-button"
          >
            <CreditCard size={18} />
            {isProcessing ? 'Processando...' : 'Liberar Acesso'}
          </button>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentData={paymentData}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />

      <style jsx>{`
        .unlock-access-section {
          background: var(--agro-bg-secondary);
          border: 2px dashed var(--agro-border-color);
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
          text-align: center;
        }

        .unlock-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .unlock-header h4 {
          font-size: 18px;
          font-weight: 600;
          color: var(--agro-text-primary);
          margin: 0;
        }

        .unlock-content {
          max-width: 400px;
          margin: 0 auto;
        }

        .unlock-description {
          color: var(--agro-text-secondary);
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .unlock-features {
          text-align: left;
          margin-bottom: 20px;
        }

        .unlock-features h5 {
          font-size: 16px;
          font-weight: 600;
          color: var(--agro-text-primary);
          margin: 0 0 12px 0;
        }

        .unlock-features ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .unlock-features li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          color: var(--agro-text-secondary);
          font-size: 14px;
        }

        .unlock-price {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
          padding: 12px;
          background: var(--agro-bg-primary);
          border-radius: 8px;
          border: 1px solid var(--agro-border-color);
        }

        .price-label {
          color: var(--agro-text-secondary);
          font-size: 14px;
        }

        .price-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--agro-primary-color);
        }

        .unlock-error {
          background: rgba(255, 59, 48, 0.1);
          border: 1px solid rgba(255, 59, 48, 0.3);
          color: #ff3b30;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .unlock-button {
          background: var(--agro-primary-color);
          color: var(--agro-primary-text);
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 auto;
        }

        .unlock-button:hover:not(:disabled) {
          background: var(--agro-primary-hover);
          transform: translateY(-2px);
        }

        .unlock-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 480px) {
          .unlock-access-section {
            padding: 20px;
            margin: 16px 0;
          }

          .unlock-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default UnlockAccessButton;
