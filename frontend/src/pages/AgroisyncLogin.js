import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  User,
  Shield
} from 'lucide-react';

const AgroisyncLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simular login
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (formData.email === 'demo@agroisync.com' && formData.password === 'demo123') {
        // Login bem-sucedido
        const userData = {
          id: '1',
          name: 'Usuário Demo',
          email: formData.email,
          role: 'user'
        };
        
        await login(userData);
        
        // Redirecionar para dashboard + mensageria
        navigate('/dashboard');
      } else if (formData.email === 'admin@agroisync.com' && formData.password === 'admin123') {
        // Login admin
        const adminData = {
          id: 'admin',
          name: 'Administrador',
          email: formData.email,
          role: 'admin'
        };
        
        await login(adminData);
        
        // Redirecionar para painel admin
        navigate('/admin');
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Shield size={24} />,
      text: 'Login seguro com criptografia',
    },
    {
      icon: <User size={24} />,
      text: 'Acesso a todas as funcionalidades',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Suporte 24/7',
    },
  ];

  const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
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

  return (
    <div>
      {/* Hero Section TXC */}
      <section className="agro-hero-section" style={{
        background: 'linear-gradient(rgba(31, 46, 31, 0.4), rgba(31, 46, 31, 0.4)), url("https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="agro-container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
            gap: 'var(--agro-space-3xl)',
            alignItems: 'center'
          }}>
            {/* Left Side - Info */}
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="agro-text-center"
              style={{ color: 'var(--agro-white)' }}
            >
              <motion.div
                variants={itemVariants}
                style={{ marginBottom: 'var(--agro-space-xl)' }}
              >
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto',
                  background: 'var(--agro-gradient-accent)',
                  borderRadius: 'var(--agro-radius-3xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agro-dark-green)',
                  boxShadow: 'var(--agro-shadow-lg)'
                }}>
                  <User size={48} />
                </div>
              </motion.div>

              <motion.h1 className="agro-hero-title" variants={itemVariants}>
                BEM-VINDO DE VOLTA
              </motion.h1>
              
              <motion.p className="agro-hero-subtitle" variants={itemVariants}>
                Acesse sua conta e continue revolucionando seu agronegócio
              </motion.p>

              <motion.div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 'var(--agro-space-md)',
                  marginTop: 'var(--agro-space-xl)',
                  maxWidth: '400px',
                  margin: 'var(--agro-space-xl) auto 0 auto'
                }}
                variants={itemVariants}
              >
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--agro-space-md)',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'rgba(57, 255, 20, 0.2)',
                      borderRadius: 'var(--agro-radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--agro-green-accent)',
                      flexShrink: 0
                    }}>
                      {feature.icon}
                    </div>
                    <span style={{ fontSize: '1rem', opacity: 0.9 }}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="agro-card"
              style={{ 
                maxWidth: '500px', 
                margin: '0 auto',
                padding: 'var(--agro-space-3xl)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(57, 255, 20, 0.2)'
              }}
            >
              <div className="agro-text-center" style={{ marginBottom: 'var(--agro-space-2xl)' }}>
                <h2 className="agro-section-title" style={{ fontSize: '2rem', marginBottom: 'var(--agro-space-md)' }}>
                  Fazer Login
                </h2>
                <p className="agro-section-subtitle" style={{ fontSize: '1rem' }}>
                  Entre com suas credenciais para acessar sua conta
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--agro-space-sm)',
                      padding: 'var(--agro-space-md)',
                      background: 'rgba(255, 75, 75, 0.1)',
                      border: '1px solid rgba(255, 75, 75, 0.3)',
                      borderRadius: 'var(--agro-radius-lg)',
                      marginBottom: 'var(--agro-space-lg)',
                      color: '#FF4B4B'
                    }}
                  >
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div style={{ marginBottom: 'var(--agro-space-lg)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}>
                    Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail 
                      size={20} 
                      style={{
                        position: 'absolute',
                        left: 'var(--agro-space-md)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--agro-text-light)'
                      }}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--agro-space-md) var(--agro-space-md) var(--agro-space-md) 3rem',
                        border: '2px solid rgba(57, 255, 20, 0.2)',
                        borderRadius: 'var(--agro-radius-lg)',
                        fontSize: '1rem',
                        background: 'rgba(57, 255, 20, 0.05)',
                        color: 'var(--agro-text-dark)',
                        transition: 'all var(--agro-transition-normal)',
                        backdropFilter: 'blur(10px)'
                      }}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--agro-space-xl)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}>
                    Senha
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock 
                      size={20} 
                      style={{
                        position: 'absolute',
                        left: 'var(--agro-space-md)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--agro-text-light)'
                      }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: 'var(--agro-space-md) var(--agro-space-md) var(--agro-space-md) 3rem',
                        border: '2px solid rgba(57, 255, 20, 0.2)',
                        borderRadius: 'var(--agro-radius-lg)',
                        fontSize: '1rem',
                        background: 'rgba(57, 255, 20, 0.05)',
                        color: 'var(--agro-text-dark)',
                        transition: 'all var(--agro-transition-normal)',
                        backdropFilter: 'blur(10px)'
                      }}
                      placeholder="Sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 'var(--agro-space-md)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--agro-text-light)',
                        cursor: 'pointer',
                        padding: 'var(--agro-space-sm)'
                      }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 'var(--agro-space-xl)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--agro-space-sm)', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ accentColor: 'var(--agro-green-accent)' }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--agro-text-dark)' }}>
                      Lembrar de mim
                    </span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--agro-green-accent)',
                      textDecoration: 'none'
                    }}
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  className="agro-btn agro-btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    width: '100%', 
                    justifyContent: 'center',
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid transparent',
                        borderTop: '2px solid currentColor',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
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

              <div className="agro-text-center" style={{ marginTop: 'var(--agro-space-xl)' }}>
                <p style={{ color: 'var(--agro-text-light)', marginBottom: 'var(--agro-space-md)' }}>
                  Não tem uma conta?
                </p>
                <Link 
                  to="/register" 
                  className="agro-btn agro-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Criar Conta
                </Link>
              </div>

              <div className="agro-text-center" style={{ marginTop: 'var(--agro-space-lg)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--agro-text-light)' }}>
                  Demo: demo@agroisync.com / demo123
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AgroisyncLogin;
