import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  UserPlus,
  Building
} from 'lucide-react';

const AgroisyncRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'producer',
    company: '',
    phone: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Você deve aceitar os termos de uso');
      setIsLoading(false);
      return;
    }

    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registration successful:', formData);
      // Redirecionar para login ou dashboard
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Shield size={24} />,
      text: 'Conta segura e protegida',
    },
    {
      icon: <UserPlus size={24} />,
      text: 'Acesso completo à plataforma',
    },
    {
      icon: <CheckCircle size={24} />,
      text: 'Suporte especializado',
    },
  ];

  const userTypes = [
    { value: 'producer', label: 'Produtor Rural', icon: <User size={20} /> },
    { value: 'buyer', label: 'Comprador', icon: <Building size={20} /> },
    { value: 'transporter', label: 'Transportador', icon: <User size={20} /> },
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
        background: 'linear-gradient(rgba(31, 46, 31, 0.4), rgba(31, 46, 31, 0.4)), url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop")',
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
                  <UserPlus size={48} />
                </div>
              </motion.div>

              <motion.h1 className="agro-hero-title" variants={itemVariants}>
                JUNTE-SE À REVOLUÇÃO
              </motion.h1>
              
              <motion.p className="agro-hero-subtitle" variants={itemVariants}>
                Crie sua conta e comece a transformar seu agronegócio hoje mesmo
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
                {benefits.map((benefit, index) => (
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
                      color: 'var(--txc-light-green)',
                      flexShrink: 0
                    }}>
                      {benefit.icon}
                    </div>
                    <span style={{ fontSize: '1rem', opacity: 0.9 }}>
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Register Form */}
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
                  Criar Conta
                </h2>
                <p className="agro-section-subtitle" style={{ fontSize: '1rem' }}>
                  Preencha os dados abaixo para começar
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

                {/* Tipo de Usuário */}
                <div style={{ marginBottom: 'var(--agro-space-lg)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}>
                    Tipo de Usuário *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--agro-space-sm)' }}>
                    {userTypes.map((type) => (
                      <label
                        key={type.value}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 'var(--agro-space-sm)',
                          padding: 'var(--agro-space-md)',
                          border: formData.userType === type.value ? '2px solid var(--txc-light-green)' : '2px solid rgba(57, 255, 20, 0.2)',
                          borderRadius: 'var(--agro-radius-lg)',
                          background: formData.userType === type.value ? 'rgba(57, 255, 20, 0.1)' : 'rgba(57, 255, 20, 0.05)',
                          cursor: 'pointer',
                          transition: 'all var(--agro-transition-normal)'
                        }}
                      >
                        <input
                          type="radio"
                          name="userType"
                          value={type.value}
                          checked={formData.userType === type.value}
                          onChange={handleInputChange}
                          style={{ display: 'none' }}
                        />
                        {type.icon}
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--agro-text-dark)' }}>
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nome */}
                <div style={{ marginBottom: 'var(--agro-space-lg)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}>
                    Nome Completo *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User 
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
                      type="text"
                      name="name"
                      value={formData.name}
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
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 'var(--agro-space-lg)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}>
                    Email *
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

                {/* Telefone */}
                <div style={{ marginBottom: 'var(--agro-space-lg)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}>
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: 'var(--agro-space-md)',
                      border: '2px solid rgba(57, 255, 20, 0.2)',
                      borderRadius: 'var(--agro-radius-lg)',
                      fontSize: '1rem',
                      background: 'rgba(57, 255, 20, 0.05)',
                      color: 'var(--agro-text-dark)',
                      transition: 'all var(--agro-transition-normal)',
                      backdropFilter: 'blur(10px)'
                    }}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                {/* Empresa */}
                {formData.userType !== 'producer' && (
                  <div style={{ marginBottom: 'var(--agro-space-lg)' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: 'var(--agro-space-sm)',
                      fontWeight: '500',
                      color: 'var(--agro-text-dark)'
                    }}>
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: 'var(--agro-space-md)',
                        border: '2px solid rgba(57, 255, 20, 0.2)',
                        borderRadius: 'var(--agro-radius-lg)',
                        fontSize: '1rem',
                        background: 'rgba(57, 255, 20, 0.05)',
                        color: 'var(--agro-text-dark)',
                        transition: 'all var(--agro-transition-normal)',
                        backdropFilter: 'blur(10px)'
                      }}
                      placeholder="Nome da empresa"
                    />
                  </div>
                )}

                {/* Senha */}
                <div style={{ marginBottom: 'var(--agro-space-lg)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}>
                    Senha *
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
                      placeholder="Mínimo 8 caracteres"
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

                {/* Confirmar Senha */}
                <div style={{ marginBottom: 'var(--agro-space-lg)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--agro-space-sm)',
                    fontWeight: '500',
                    color: 'var(--agro-text-dark)'
                  }}>
                    Confirmar Senha *
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
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
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
                      placeholder="Confirme sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Termos */}
                <div style={{ marginBottom: 'var(--agro-space-xl)' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--agro-space-sm)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      style={{ accentColor: 'var(--txc-light-green)', marginTop: '2px' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: 'var(--agro-text-dark)', lineHeight: 1.5 }}>
                      Eu aceito os{' '}
                      <Link to="/terms" style={{ color: 'var(--txc-light-green)', textDecoration: 'none' }}>
                        Termos de Uso
                      </Link>
                      {' '}e a{' '}
                      <Link to="/privacy" style={{ color: 'var(--txc-light-green)', textDecoration: 'none' }}>
                        Política de Privacidade
                      </Link>
                    </span>
                  </label>
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

              <div className="agro-text-center" style={{ marginTop: 'var(--agro-space-xl)' }}>
                <p style={{ color: 'var(--agro-text-light)', marginBottom: 'var(--agro-space-md)' }}>
                  Já tem uma conta?
                </p>
                <Link 
                  to="/login" 
                  className="agro-btn agro-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Fazer Login
                </Link>
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

export default AgroisyncRegister;
