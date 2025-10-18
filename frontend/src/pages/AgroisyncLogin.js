import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CloudflareTurnstile from '../components/CloudflareTurnstile';
// import AgroisyncHeader from '../components/AgroisyncHeader'; // Já incluído no App.js
// import AgroisyncFooter from '../components/AgroisyncFooter'; // Já incluído no App.js

const AgroisyncLogin = () => {
  const { updateUserState } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [turnstileToken, setTurnstileToken] = useState('');

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Permitir bypass do Turnstile em desenvolvimento
    if (!turnstileToken && process.env.NODE_ENV === 'production') {
      setErrors({ general: 'Por favor, complete a verificação "Não sou um robô"' });
      return;
    }

    setIsLoading(true);

    try {
      const api = process.env.REACT_APP_API_URL || '/api';
      const payloadToSend = {
        email: (formData.email || '').trim().toLowerCase(),
        password: (formData.password || '').trim(),
        turnstileToken: turnstileToken || 'dev-bypass'
      };
      const res = await fetch(`${api}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSend)
      });

      if (res.ok) {
        const payload = await res.json();

        const envelope = payload && payload.data ? payload.data : {};
        const token = envelope.token;
        const user = envelope.user;

        if (token && user) {
          updateUserState(user, token);
          
          // Redirecionar baseado no papel do usuário
          if (user.role === 'super-admin' || user.role === 'admin') {
            window.location.href = '/admin';
          } else if (user.isAdmin) {
            window.location.href = '/admin';
          } else {
            // Usuário normal - verificar status do plano e perfil
            try {
              // Buscar informações completas do usuário
              console.log('🔍 Buscando perfil do usuário...');
              const profileRes = await fetch(`${api}/user/profile`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              console.log('📊 Status da resposta:', profileRes.status);
              if (profileRes.ok) {
                const profileData = await profileRes.json();
                console.log('👤 Dados do perfil:', profileData);
                const userProfile = profileData.data?.user || user;

                // 1. VERIFICAR SE TEM PLANO (qualquer plano diferente de 'free' ou null)
                const userPlan = userProfile.plan || 'free';
                const hasPaidPlan = userPlan && userPlan !== 'free' && userPlan !== '' && userPlan !== null;
                
                console.log('📋 Verificação de plano:');
                console.log('  - userPlan:', userPlan);
                console.log('  - hasPaidPlan:', hasPaidPlan);
                console.log('  - plan_status:', userProfile.plan_status);
                console.log('  - plan_expires_at:', userProfile.plan_expires_at);

                // 2. SE NÃO TEM PLANO PAGO → Redirecionar para /plans
                // Só redireciona se for 'free', null, ou vazio
                if (!hasPaidPlan) {
                  console.log('🚫 Usuário sem plano pago - redirecionando para /plans');
                  window.location.href = '/plans';
                  return;
                }

                // 3. SE TEM PLANO PAGO → Deixar entrar (independente de expiração)
                console.log('✅ Usuário com plano pago - permitindo acesso');

                // 4. SE TEM PLANO → Verificar se completou perfil específico
                const hasUserType = userProfile.user_type && userProfile.user_type !== 'general';
                
                // 4. SE NÃO COMPLETOU PERFIL → Redirecionar para escolher tipo
                if (!hasUserType) {
                  console.log('📋 Usuário precisa completar perfil - redirecionando para /signup/product');
                  // Por padrão, redireciona para produto (pode ajustar para uma página de escolha)
                  window.location.href = '/signup/product';
                  return;
                }

                // 5. SE JÁ TEM TUDO → Dashboard
                console.log('✅ Usuário completo - redirecionando para dashboard');
                window.location.href = '/user-dashboard';
              } else {
                // Se falhar ao buscar perfil, redireciona para plans por segurança
                console.log('❌ Falha ao buscar perfil - Status:', profileRes.status);
                const errorData = await profileRes.json().catch(() => ({}));
                console.log('❌ Erro da API:', errorData);
                console.log('🚫 Redirecionando para /plans por segurança');
                window.location.href = '/plans';
              }
            } catch (profileError) {
              console.error('❌ Erro ao buscar perfil:', profileError);
              // Em caso de erro, redireciona para plans por segurança
              console.log('🚫 Redirecionando para /plans por segurança');
              window.location.href = '/plans';
            }
          }
        } else {
          setErrors({ general: payload.message || 'Credenciais inválidas' });
        }
      } else {
        const errorData = await res.json();
        setErrors({ general: errorData.message || 'Credenciais inválidas' });
      }
    } catch (error) {
      // Melhorar tratamento de erro com mais detalhes
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Tempo limite excedido. Tente novamente.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header já incluído no App.js */}

      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-gradient)',
          display: 'flex',
          alignItems: 'center',
          padding: '2rem 0'
        }}
      >
        <div className='container'>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              maxWidth: '1000px',
              margin: '0 auto'
            }}
          >
            {/* Left Side - Info */}
            <motion.div
              variants={heroVariants}
              initial='hidden'
              animate='visible'
              className='agro-text-center'
              style={{ color: 'var(--text-primary)' }}
            >
              <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto',
                    background: 'var(--accent)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 6px 20px rgba(42, 127, 79, 0.3)'
                  }}
                >
                  <User size={40} />
                </div>
              </motion.div>

              <motion.h1
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  marginBottom: '1rem',
                  color: 'var(--text-primary)'
                }}
                variants={itemVariants}
              >
                Bem-vindo de volta!
              </motion.h1>

              <motion.p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--muted)',
                  marginBottom: '2rem',
                  lineHeight: '1.6'
                }}
                variants={itemVariants}
              >
                Acesse sua conta e continue sua jornada no agronegócio digital.
              </motion.p>

              <motion.div
                variants={itemVariants}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(42, 127, 79, 0.1)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: 'var(--accent)',
                    fontWeight: '600'
                  }}
                >
                  ✓ Seguro
                </div>
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(42, 127, 79, 0.1)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: 'var(--accent)',
                    fontWeight: '600'
                  }}
                >
                  ✓ Rápido
                </div>
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(42, 127, 79, 0.1)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: 'var(--accent)',
                    fontWeight: '600'
                  }}
                >
                  ✓ Confiável
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              variants={heroVariants}
              initial='hidden'
              animate='visible'
              style={{
                background: 'var(--card-bg)',
                padding: '2.5rem',
                borderRadius: '16px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(15, 15, 15, 0.05)'
              }}
            >
              <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  Fazer Login
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                  Entre com suas credenciais para acessar sua conta
                </p>
              </motion.div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '1.5rem',
                    color: '#dc2626',
                    fontSize: '0.9rem'
                  }}
                >
                  {errors.general}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted)'
                      }}
                    />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder='seu@email.com'
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        border: `2px solid ${errors.email ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = errors.email ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.email}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Senha
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--muted)'
                      }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder='Sua senha'
                      style={{
                        width: '100%',
                        padding: '12px 44px 12px 44px',
                        border: `2px solid ${errors.password ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = errors.password ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--muted)',
                        padding: '4px'
                      }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.password}</p>
                  )}
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <input type='checkbox' style={{ margin: 0 }} />
                    Lembrar de mim
                  </label>
                  <Link
                    to='/forgot-password'
                    style={{
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}
                  >
                    Esqueceu a senha?
                  </Link>
                </motion.div>

                {/* Cloudflare Turnstile */}
                <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                  <CloudflareTurnstile
                    onVerify={token => {
                      setTurnstileToken(token);
                      setErrors(prev => ({ ...prev, general: '' }));
                    }}
                    onError={error => {
                      setErrors({ general: 'Erro na verificação. Tente novamente.' });
                      setTurnstileToken('');
                    }}
                    onExpire={() => {
                      setTurnstileToken('');
                      setErrors({ general: 'Verificação expirada. Tente novamente.' });
                    }}
                  />
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type='submit'
                  disabled={
                    isLoading || (process.env.NODE_ENV === 'production' && !turnstileToken)
                  }
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: isLoading || !turnstileToken ? 'var(--muted)' : 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  whileHover={!isLoading && turnstileToken ? { scale: 1.02 } : {}}
                  whileTap={!isLoading && turnstileToken ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <>
                      <div
                        className='spin-animation'
                        style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%'
                        }}
                      />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Esqueci minha senha */}
              <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link
                  to='/forgot-password'
                  style={{
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                >
                  Esqueci minha senha
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Não tem uma conta?{' '}
                  <Link
                    to='/register'
                    style={{
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    Criar Conta
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer já incluído no App.js */}
    </>
  );
};

export default AgroisyncLogin;
