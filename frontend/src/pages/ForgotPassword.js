import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import authService from '../services/authService';
import CloudflareTurnstile from '../components/CloudflareTurnstile';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email é obrigatório');
      return;
    }

    if (!turnstileToken) {
      setError('Por favor, complete a verificação "Não sou um robô"');
      return;
    }

    setIsLoading(true);
    setError('');
    
    const result = await authService.forgotPassword(email, turnstileToken);
    
    if (result.success) {
      setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } else {
      setError(result.error || 'Erro ao enviar email de recuperação');
    }
    
    setIsLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem 2rem',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '20px',
            marginBottom: '1rem',
            color: 'white'
          }}>
            <Mail size={40} />
          </div>
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Recuperar Senha
          </h1>
          
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              Email
            </label>
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{
                width: '100%',
                padding: '1rem',
                border: `2px solid ${error ? '#dc2626' : '#e5e7eb'}`,
                borderRadius: '12px',
                fontSize: '1rem',
                background: '#f9fafb',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
            />
          </div>

          {/* Cloudflare Turnstile */}
          <CloudflareTurnstile
            onVerify={(token) => {
              setTurnstileToken(token);
              setError(''); // Limpar erro quando verificação for completada
            }}
            onError={(error) => {
              setError('Erro na verificação. Tente novamente.');
              setTurnstileToken('');
            }}
            onExpire={() => {
              setTurnstileToken('');
              setError('Verificação expirada. Tente novamente.');
            }}
          />

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#fef2f2',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}
            >
              <XCircle size={20} />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#f0fdf4',
                color: '#16a34a',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}
            >
              <CheckCircle size={20} />
              {success}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              background: isLoading
                ? '#d1d5db'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '1.5rem',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        {/* Back to Login */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'color 0.3s ease'
            }}
          >
            <ArrowLeft size={16} />
            Voltar para o Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;