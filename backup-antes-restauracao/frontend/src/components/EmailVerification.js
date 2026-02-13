import React from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const EmailVerification = ({ 
  email,
  emailCode, 
  setEmailCode, 
  emailVerified, 
  emailSent,
  isLoading,
  onSendCode,
  onVerifyCode,
  error 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3 }}
      style={{ marginBottom: '1.5rem' }}
    >
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
        📧 Verificação de Email *
      </label>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '200px' }}>
          <Mail size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            type='text'
            value={emailCode}
            onChange={e => setEmailCode(e.target.value)}
            placeholder='Código de 6 dígitos'
            maxLength='6'
            style={{
              width: '100%', 
              padding: '12px 12px 12px 44px', 
              textAlign: 'center', 
              fontFamily: 'monospace', 
              fontSize: '1.1rem',
              border: `2px solid ${emailVerified ? '#10b981' : 'rgba(15, 15, 15, 0.1)'}`,
              borderRadius: '8px', 
              background: emailVerified ? '#f0fdf4' : 'white',
              color: emailVerified ? '#10b981' : 'inherit',
              transition: 'all 0.2s ease'
            }}
          />
          {emailVerified && (
            <CheckCircle 
              size={20} 
              style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#10b981' 
              }} 
            />
          )}
        </div>
        <button
          type='button'
          onClick={onSendCode}
          disabled={isLoading || !email}
          style={{
            padding: '12px 20px', 
            borderRadius: '8px', 
            fontWeight: '600', 
            fontSize: '0.9rem',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
            color: 'white', 
            border: 'none',
            cursor: isLoading || !email ? 'not-allowed' : 'pointer',
            opacity: isLoading || !email ? 0.5 : 1,
            transition: 'all 0.2s ease', 
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {isLoading ? <Loader2 size={18} className='animate-spin' /> : emailSent ? 'Reenviar' : 'Enviar'}
        </button>
        <button
          type='button'
          onClick={onVerifyCode}
          disabled={!emailCode || isLoading || emailVerified}
          style={{
            padding: '12px 20px', 
            borderRadius: '8px', 
            fontWeight: '600', 
            fontSize: '0.9rem',
            background: emailVerified ? '#10b981' : 'linear-gradient(135deg, #10b981, #059669)', 
            color: 'white', 
            border: 'none',
            cursor: !emailCode || isLoading || emailVerified ? 'not-allowed' : 'pointer',
            opacity: !emailCode || isLoading || emailVerified ? 0.5 : 1,
            transition: 'all 0.2s ease', 
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {isLoading ? <Loader2 size={18} className='animate-spin' /> : emailVerified ? <CheckCircle size={18} /> : 'Verificar'}
        </button>
      </div>
      {emailVerified && (
        <p style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.25rem', 
          marginTop: '0.5rem', 
          fontSize: '0.85rem', 
          fontWeight: '600', 
          color: '#10b981' 
        }}>
          <CheckCircle size={16} />
          Email verificado com sucesso!
        </p>
      )}
      {error && (
        <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </motion.div>
  );
};

export default EmailVerification;

