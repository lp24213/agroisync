import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PaymentModal from './PaymentModal';
import { PAYMENT_PLANS, unlockSensitiveData, checkUserAccess } from '../services/stripe';

const DataAccessControl = ({ 
  adId, 
  adData, 
  onDataUnlocked, 
  showPreview = true,
  previewLength = 50 
}) => {
  const { user } = useAuth();
  const [accessStatus, setAccessStatus] = useState('locked');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Estados possíveis: 'locked', 'unlocked', 'pending', 'error'
  useEffect(() => {
    checkAccessStatus();
  }, [adId, user]);

  const checkAccessStatus = async () => {
    if (!user || !adId) return;
    
    try {
      const hasAccess = await checkUserAccess(user.id, adId);
      setAccessStatus(hasAccess ? 'unlocked' : 'locked');
    } catch (err) {
      console.error('Erro ao verificar acesso:', err);
      setAccessStatus('error');
    }
  };

  const handleUnlockClick = () => {
    if (!user) {
      alert('Você precisa estar logado para acessar os dados do anunciante');
      return;
    }
    
    setIsPaymentModalOpen(true);
    setError(null);
    setPaymentStatus(null);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    
    try {
      // Liberar dados sensíveis após pagamento confirmado
      await unlockSensitiveData(user.id, adId);
      
      // Atualizar status
      setAccessStatus('unlocked');
      setPaymentStatus('success');
      
      // Notificar componente pai
      if (onDataUnlocked) {
        onDataUnlocked(adId, adData);
      }
      
      // Fechar modal após delay
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setPaymentStatus(null);
      }, 2000);
      
    } catch (err) {
      setError('Erro ao liberar dados. Contate o suporte.');
      setPaymentStatus('error');
      console.error('Erro ao liberar dados:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error) => {
    setError('Erro no pagamento. Tente novamente.');
    setPaymentStatus('error');
    console.error('Erro no pagamento:', error);
  };

  const getPreviewText = (text) => {
    if (!text) return '';
    return text.length > previewLength 
      ? text.substring(0, previewLength) + '...' 
      : text;
  };

  const paymentData = {
    type: 'individual',
    adId: adId,
    userId: user?.id,
    amount: PAYMENT_PLANS.individual.price,
    planName: PAYMENT_PLANS.individual.name,
    description: `Acesso aos dados de contato do anunciante: ${adData?.title || 'Anúncio'}`,
    userName: user?.name || 'Usuário'
  };

  const renderLockedContent = () => (
    <div className="data-access-locked">
      <div className="locked-header">
        <Lock className="locked-icon" />
        <h3>Dados Protegidos</h3>
        <p>Para acessar os dados de contato do anunciante, é necessário realizar um pagamento de segurança.</p>
      </div>
      
      {showPreview && (
        <div className="preview-section">
          <h4>Prévia dos dados:</h4>
          <div className="preview-content">
            <p><strong>Nome:</strong> {getPreviewText(adData?.userName)}</p>
            <p><strong>Telefone:</strong> {getPreviewText(adData?.phone)}</p>
            <p><strong>Email:</strong> {getPreviewText(adData?.email)}</p>
            <p><strong>Localização:</strong> {getPreviewText(adData?.location)}</p>
          </div>
        </div>
      )}
      
      <div className="unlock-benefits">
        <h4>O que você recebe:</h4>
        <ul>
          <li>✓ Dados completos de contato</li>
          <li>✓ Informações detalhadas do anunciante</li>
          <li>✓ Acesso à mensageria direta</li>
          <li>✓ Suporte prioritário</li>
        </ul>
      </div>
      
      <button 
        className="btn-primary unlock-button"
        onClick={handleUnlockClick}
        disabled={isProcessing}
      >
        <CreditCard size={20} />
        Desbloquear Acesso - R$ {PAYMENT_PLANS.individual.price}
      </button>
      
      <div className="security-note">
        <AlertCircle size={16} />
        <span>Pagamento seguro via Stripe. Seus dados estão protegidos.</span>
      </div>
    </div>
  );

  const renderUnlockedContent = () => (
    <div className="data-access-unlocked">
      <div className="unlocked-header">
        <CheckCircle className="unlocked-icon" />
        <h3>Dados Liberados</h3>
        <p>Você tem acesso completo aos dados do anunciante.</p>
      </div>
      
      <div className="unlocked-content">
        <div className="contact-info">
          <h4>Informações de Contato:</h4>
          <div className="contact-details">
            <p><strong>Nome:</strong> {adData?.userName}</p>
            <p><strong>Telefone:</strong> {adData?.phone}</p>
            <p><strong>Email:</strong> {adData?.email}</p>
            <p><strong>Localização:</strong> {adData?.location}</p>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="btn-secondary">
            Enviar Mensagem
          </button>
          <button className="btn-gold">
            Ligar Agora
          </button>
        </div>
      </div>
    </div>
  );

  const renderPaymentStatus = () => {
    if (!paymentStatus) return null;
    
    return (
      <AnimatePresence>
        <motion.div 
          className={`payment-status ${paymentStatus}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {paymentStatus === 'processing' && (
            <>
              <Clock className="status-icon" />
              <span>Processando pagamento...</span>
            </>
          )}
          {paymentStatus === 'success' && (
            <>
              <CheckCircle className="status-icon" />
              <span>Pagamento aprovado! Dados liberados.</span>
            </>
          )}
          {paymentStatus === 'error' && (
            <>
              <AlertCircle className="status-icon" />
              <span>Erro no pagamento. Tente novamente.</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <div className="data-access-control">
        {accessStatus === 'locked' && renderLockedContent()}
        {accessStatus === 'unlocked' && renderUnlockedContent()}
        {accessStatus === 'error' && (
          <div className="data-access-error">
            <AlertCircle className="error-icon" />
            <p>Erro ao carregar dados. Tente novamente.</p>
            <button className="btn-secondary" onClick={checkAccessStatus}>
              Tentar Novamente
            </button>
          </div>
        )}
        
        {renderPaymentStatus()}
        
        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentData={paymentData}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
      
      <style jsx>{`
        .data-access-control {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
          margin: var(--space-lg) 0;
        }
        
        .data-access-locked {
          text-align: center;
        }
        
        .locked-header {
          margin-bottom: var(--space-xl);
        }
        
        .locked-icon {
          width: 48px;
          height: 48px;
          color: var(--text-secondary);
          margin-bottom: var(--space-md);
        }
        
        .locked-header h3 {
          color: var(--txc-primary-green);
          margin-bottom: var(--space-sm);
        }
        
        .locked-header p {
          color: var(--text-secondary);
          margin-bottom: 0;
        }
        
        .preview-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          margin: var(--space-lg) 0;
          text-align: left;
        }
        
        .preview-section h4 {
          color: var(--txc-primary-green);
          margin-bottom: var(--space-md);
          text-align: center;
        }
        
        .preview-content p {
          margin-bottom: var(--space-sm);
          color: var(--text-secondary);
        }
        
        .unlock-benefits {
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          margin: var(--space-lg) 0;
          text-align: left;
        }
        
        .unlock-benefits h4 {
          color: var(--grao-primary-gold);
          margin-bottom: var(--space-md);
          text-align: center;
        }
        
        .unlock-benefits ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .unlock-benefits li {
          padding: var(--space-sm) 0;
          color: var(--text-secondary);
        }
        
        .unlock-button {
          width: 100%;
          margin: var(--space-lg) 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
        }
        
        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          color: var(--text-light);
          font-size: var(--text-sm);
          margin-top: var(--space-md);
        }
        
        .data-access-unlocked {
          text-align: center;
        }
        
        .unlocked-header {
          margin-bottom: var(--space-xl);
        }
        
        .unlocked-icon {
          width: 48px;
          height: 48px;
          color: var(--txc-light-green);
          margin-bottom: var(--space-md);
        }
        
        .unlocked-header h3 {
          color: var(--txc-light-green);
          margin-bottom: var(--space-sm);
        }
        
        .unlocked-content {
          text-align: left;
        }
        
        .contact-info {
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          margin-bottom: var(--space-lg);
        }
        
        .contact-info h4 {
          color: var(--txc-primary-green);
          margin-bottom: var(--space-md);
          text-align: center;
        }
        
        .contact-details p {
          margin-bottom: var(--space-sm);
          color: var(--text-secondary);
        }
        
        .action-buttons {
          display: flex;
          gap: var(--space-md);
          justify-content: center;
        }
        
        .data-access-error {
          text-align: center;
          color: var(--text-secondary);
        }
        
        .error-icon {
          width: 48px;
          height: 48px;
          color: #ff3b30;
          margin-bottom: var(--space-md);
        }
        
        .payment-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-md);
          border-radius: var(--radius-lg);
          margin-top: var(--space-lg);
          font-weight: var(--font-medium);
        }
        
        .payment-status.processing {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }
        
        .payment-status.success {
          background: rgba(76, 175, 80, 0.1);
          color: var(--txc-light-green);
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .payment-status.error {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
          border: 1px solid rgba(255, 59, 48, 0.3);
        }
        
        .status-icon {
          width: 20px;
          height: 20px;
        }
        
        .error-message {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: #ff3b30;
          background: rgba(255, 59, 48, 0.1);
          border: 1px solid rgba(255, 59, 48, 0.3);
          border-radius: var(--radius-lg);
          padding: var(--space-md);
          margin-top: var(--space-lg);
        }
        
        @media (max-width: 768px) {
          .action-buttons {
            flex-direction: column;
          }
          
          .unlock-button {
            font-size: var(--text-sm);
          }
        }
      `}</style>
    </>
  );
};

export default DataAccessControl;
