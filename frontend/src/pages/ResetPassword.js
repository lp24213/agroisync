import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import authService from '../services/authService';
import CloudflareTurnstile from '../components/CloudflareTurnstile';
import CryptoHash from '../components/CryptoHash';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    // Verificar se há token de recuperação na URL
    const token = searchParams.get('token');
    // const id = searchParams.get('id');

    if (!token) {
      setError('Link de recuperação inválido ou expirado');
    }
  }, [searchParams]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.password) {
      setError('Senha é obrigatória');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (!formData.confirmPassword) {
      setError('Confirmação de senha é obrigatória');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    const token = searchParams.get('token');
    const result = await authService.resetPassword(token, formData.password, formData.confirmPassword);

    if (result.success) {
      setSuccess('Senha redefinida com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error || 'Erro ao redefinir senha');
    }

    setIsLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}
    >
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
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '20px',
              marginBottom: '1rem',
              color: 'white'
            }}
          >
            <Lock size={40} />
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}
          >
            Nova Senha
          </h1>

          <p
            style={{
              color: '#6b7280',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}
          >
            Digite sua nova senha abaixo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#1f2937'
              }}
            >
              Nova Senha
            </label>

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                placeholder='Digite sua nova senha'
                style={{
                  width: '100%',
                  padding: '1rem',
                  paddingRight: '3rem',
                  border: `2px solid ${error ? '#dc2626' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: '#f9fafb',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
              />

              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#1f2937'
              }}
            >
              Confirmar Nova Senha
            </label>

            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder='Confirme sua nova senha'
                style={{
                  width: '100%',
                  padding: '1rem',
                  paddingRight: '3rem',
                  border: `2px solid ${error ? '#dc2626' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: '#f9fafb',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
              />

              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

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

          {/* Cloudflare Turnstile */}
          <CloudflareTurnstile
            onVerify={token => {
              setTurnstileToken(token);
              setError('');
            }}
            onError={error => {
              setError('Erro na verificação. Tente novamente.');
              setTurnstileToken('');
            }}
            onExpire={() => {
              setTurnstileToken('');
              setError('Verificação expirada. Tente novamente.');
            }}
          />

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading || !turnstileToken}
            style={{
              width: '100%',
              padding: '1rem',
              background: isLoading ? '#d1d5db' : 'linear-gradient(135deg, #10b981, #059669)',
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
            {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>

        {/* Back to Login */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to='/login'
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'color 0.3s ease'
            }}
          >
            Voltar para o Login
          </Link>
        </div>
        <div className='mt-8 flex justify-center'>
          <CryptoHash pageName='reset-password' style={{ display: 'none' }} />
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
