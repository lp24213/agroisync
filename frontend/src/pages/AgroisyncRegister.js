import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Building2 } from 'lucide-react';
import AgroisyncHeader from '../components/AgroisyncHeader';
import AgroisyncFooter from '../components/AgroisyncFooter';

const AgroisyncRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const handleInputChange = (e) => {
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Empresa é obrigatória';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful registration
      navigate('/login', { 
        state: { 
          message: 'Conta criada com sucesso! Faça login para continuar.' 
        } 
      });
    } catch (error) {
      setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AgroisyncHeader />
      
      <section style={{ 
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        display: 'flex',
        alignItems: 'center',
        padding: '2rem 0'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '3rem',
            alignItems: 'center',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {/* Left Side - Info */}
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="agro-text-center"
              style={{ color: 'var(--text-primary)' }}
            >
              <motion.div
                variants={itemVariants}
                style={{ marginBottom: '2rem' }}
              >
                <div style={{
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
                }}>
                  <Building2 size={40} />
                </div>
              </motion.div>

              <motion.h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }} variants={itemVariants}>
                Junte-se ao Agroisync!
              </motion.h1>
              
              <motion.p style={{ 
                fontSize: '1.1rem', 
                color: 'var(--muted)',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }} variants={itemVariants}>
                Crie sua conta e comece sua jornada no futuro do agronegócio digital.
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
                <div style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(42, 127, 79, 0.1)',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  color: 'var(--accent)',
                  fontWeight: '600'
                }}>
                  ✓ Gratuito
                </div>
                    <div style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(42, 127, 79, 0.1)',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  color: 'var(--accent)',
                  fontWeight: '600'
                }}>
                  ✓ Sem compromisso
                    </div>
                <div style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(42, 127, 79, 0.1)',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  color: 'var(--accent)',
                  fontWeight: '600'
                }}>
                  ✓ Suporte 24/7
                  </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              style={{ 
                background: 'var(--card-bg)',
                padding: '2.5rem',
                borderRadius: '16px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(15, 15, 15, 0.05)'
              }}
            >
              <motion.div
                variants={itemVariants}
                style={{ textAlign: 'center', marginBottom: '2rem' }}
              >
                <h2 style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '700', 
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  Criar Conta
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                  Preencha os dados abaixo para criar sua conta
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
                <motion.div 
                  variants={itemVariants}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>
                    Nome Completo
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User 
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
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome completo"
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        border: `2px solid ${errors.name ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.name ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                  </div>
                  {errors.name && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {errors.name}
                    </p>
                  )}
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>
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
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
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
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.email ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {errors.email}
                    </p>
                  )}
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>
                    Empresa
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2 
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
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Nome da sua empresa"
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        border: `2px solid ${errors.company ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.company ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                  </div>
                  {errors.company && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {errors.company}
                    </p>
                  )}
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>
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
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Sua senha"
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
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.password ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                    <button
                      type="button"
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
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {errors.password}
                    </p>
                  )}
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  style={{ marginBottom: '2rem' }}
                >
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem', 
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>
                    Confirmar Senha
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
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirme sua senha"
                      style={{
                        width: '100%',
                        padding: '12px 44px 12px 44px',
                        border: `2px solid ${errors.confirmPassword ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.confirmPassword ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {errors.confirmPassword}
                    </p>
                  )}
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={isLoading}
                  style={{ 
                    width: '100%', 
                    padding: '14px',
                    background: isLoading ? 'var(--muted)' : 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <>
                      <div className="spin-animation" style={{ width: '20px', height: '20px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%' }} />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar Conta
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div 
                variants={itemVariants}
                style={{ textAlign: 'center', marginTop: '2rem' }}
              >
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Já tem uma conta?{' '}
                <Link 
                  to="/login" 
                    style={{ 
                      color: 'var(--accent)', 
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                >
                  Fazer Login
                </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <AgroisyncFooter />
    </>
  );
};

export default AgroisyncRegister;