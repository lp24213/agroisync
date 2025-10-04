import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Building2, Phone } from 'lucide-react';
import validationService from '../services/validationService';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import CloudflareTurnstile from '../components/CloudflareTurnstile';
import { setAuthToken } from '../config/constants.js';
// Modern UI components intentionally not used on this page (kept for future UI upgrades)

const SignupStore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan') || 'basic';
  const [formData, setFormData] = useState({
    // Dados do Plano
    plan: selectedPlan,
    planName: selectedPlan === 'basic' ? 'BÁSICO' : selectedPlan === 'intermediate' ? 'INTERMEDIÁRIO' : 'PREMIUM',
    planPrice: selectedPlan === 'basic' ? '149,99' : selectedPlan === 'intermediate' ? '259,99' : '599,99',
    planPeriod: selectedPlan === 'premium' ? 'ano' : 'mês',
    maxProducts: selectedPlan === 'basic' ? 10 : selectedPlan === 'intermediate' ? 20 : 50,
    company: '',
    password: '',
    confirmPassword: '',

    // Endereço
    cep: '',
    address: '',
    city: '',
    state: '',

    // Documentos
    cpf: '',
    cnpj: '',
    ie: '',

    // Dados da Loja
    storeName: '',
    storeDescription: '',
    storeCategory: '',

    // Produtos
    productName: '',
    productDescription: '',
    productCategory: '',
    productPrice: '',
    productStock: '',
    productWeight: '',
    productImage: null,

    // Tipo fixo - SEMPRE LOJA
    userType: 'producer',
    businessType: 'producer'
  });

  const [turnstileToken, setTurnstileToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({});

  // Estados para validação Email
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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

  const handleInputChange = async e => {
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

    // Validações em tempo real
    await validateField(name, value);
  };

  const validateField = async (fieldName, value) => {
    let validation = null;

    switch (fieldName) {
      case 'cnpj':
        if (value.length >= 14) {
          validation = await validationService.validateCNPJ(value);
        }
        break;
      case 'cep':
        if (value.length >= 8) {
          validation = await validationService.validateCEP(value);
          if (validation.valid) {
            // Preencher endereço automaticamente
            setFormData(prev => ({
              ...prev,
              address: validation.address || '',
              city: validation.city || '',
              state: validation.state || ''
            }));
          }
        }
        break;
      case 'phone':
        validation = validationService.validatePhone(value);
        break;
      case 'email':
        validation = validationService.validateEmail(value);
        break;
      case 'password':
        validation = validationService.validatePassword(value);
        break;
      default:
        break;
    }

    if (validation) {
      setValidations(prev => ({
        ...prev,
        [fieldName]: validation
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    // Validações de endereço
    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'UF é obrigatório';
    }

    // Validação CPF ou CNPJ (pelo menos um obrigatório)
    if (!formData.cpf.trim() && !formData.cnpj.trim()) {
      newErrors.cpf = 'CPF ou CNPJ é obrigatório';
      newErrors.cnpj = 'CPF ou CNPJ é obrigatório';
    }

    // Validações de produto
    if (!formData.productName.trim()) {
      newErrors.productName = 'Nome do produto é obrigatório';
    }
    if (!formData.productCategory.trim()) {
      newErrors.productCategory = 'Categoria é obrigatória';
    }
    if (!formData.productDescription.trim()) {
      newErrors.productDescription = 'Descrição é obrigatória';
    }
    if (!formData.productPrice) {
      newErrors.productPrice = 'Preço é obrigatório';
    }
    if (!formData.productStock) {
      newErrors.productStock = 'Estoque é obrigatório';
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

  // Enviar código de verificação de email
  const sendEmailCode = async () => {
    if (!formData.email) {
      toast.error('Email é obrigatório');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.resendVerificationEmail(formData.email);
      if (result.success) {
        setEmailSent(true);
        toast.success('Código de verificação enviado para seu email!');
      } else {
        toast.error(result.error || 'Erro ao enviar email');
      }
    } catch (error) {
      toast.error('Erro ao enviar email');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar código de email
  const verifyEmailCode = async () => {
    if (!emailCode) {
      toast.error('Código de email é obrigatório');
      return;
    }

    setIsLoading(true);
    try {
      // Simular verificação de email (em produção seria via API)
      setTimeout(() => {
        setEmailVerified(true);
        toast.success('Email verificado com sucesso!');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Erro ao verificar email');
      setIsLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Verificar se Email foi verificado
    if (!emailVerified) {
      toast.error('Email deve ser verificado');
      return;
    }

    setIsLoading(true);

    try {
      // Chamada real de cadastro
      const api = process.env.REACT_APP_API_URL || '/api';
      const res = await fetch(`${api}/stores/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          turnstileToken
        })
      });
      if (!res.ok) throw new Error('Falha no cadastro');
      const data = await res.json();
      // Guardar token e redirecionar para dashboard
      if (data?.data?.token) {
        setAuthToken(data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      // Redirecionar para dashboard
      navigate('/user-dashboard', { replace: true });
    } catch (error) {
      setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header já incluído no App.js */}

      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4'>
        <div className='mx-auto w-full max-w-6xl'>
          <div className='grid grid-cols-1 items-center gap-8 lg:grid-cols-2'>
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
                  <Building2 size={40} />
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
                Junte-se ao Agroisync!
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
                  ✓ Gratuito
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
                  ✓ Sem compromisso
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
                  ✓ Suporte 24/7
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              variants={heroVariants}
              initial='hidden'
              animate='visible'
              className='rounded-3xl border border-white/30 bg-white/90 p-8 shadow-2xl shadow-blue-500/20 backdrop-blur-xl'
            >
              <motion.div variants={itemVariants} className='mb-8 text-center'>
                <h2 className='mb-2 text-3xl font-bold text-gray-900'>Cadastro - Loja/Produtor</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                  Preencha os dados abaixo para criar sua conta
                </p>

                {/* Plano Selecionado */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '15px',
                    padding: '1.5rem',
                    marginTop: '1rem',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    📦 Plano Selecionado: {formData.planName}
                  </h3>
                  <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                    R$ {formData.planPrice}/{formData.planPeriod} • Até {formData.maxProducts} produtos
                  </p>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Ideal para lojas como a Agrobiológica</p>
                </div>
              </motion.div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    borderRadius: '16px',
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
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder='Seu nome completo'
                      className={`w-full rounded-2xl border-2 bg-gray-50/80 px-4 py-4 pl-12 text-gray-900 placeholder-gray-500 transition-all duration-300 hover:bg-gray-100/80 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200'}`}
                      onFocus={e => {
                        e.target.style.background = 'white';
                        e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={e => {
                        e.target.style.background = 'rgba(248, 250, 252, 0.8)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  {errors.name && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.name}</p>
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
                        borderRadius: '16px',
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
                      type='text'
                      name='company'
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder='Nome da sua empresa'
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        border: `2px solid ${errors.company ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = errors.company ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                  </div>
                  {errors.company && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.company}</p>
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
                    Telefone *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone
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
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder='(11) 99999-9999'
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        border: `2px solid ${errors.phone ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = errors.phone ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                  </div>
                  {validations.phone && !validations.phone.valid && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {validations.phone.message}
                    </p>
                  )}
                  {errors.phone && (
                    <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.phone}</p>
                  )}
                </motion.div>

                {/* VERIFICAÇÃO EMAIL */}
                <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Verificação Email *
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type='text'
                      value={emailCode}
                      onChange={e => setEmailCode(e.target.value)}
                      placeholder='Código Email'
                      maxLength='6'
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: `2px solid ${emailVerified ? '#10b981' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    />
                    <button
                      type='button'
                      onClick={sendEmailCode}
                      disabled={emailSent || isLoading}
                      style={{
                        padding: '12px 16px',
                        background: emailSent ? '#6b7280' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: emailSent || isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      {emailSent ? 'Reenviar' : 'Enviar Email'}
                    </button>
                    <button
                      type='button'
                      onClick={verifyEmailCode}
                      disabled={!emailCode || isLoading || emailVerified}
                      style={{
                        padding: '12px 16px',
                        background: emailVerified ? '#10b981' : '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: !emailCode || isLoading || emailVerified ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      {emailVerified ? '✓ Verificado' : 'Verificar'}
                    </button>
                  </div>
                  {emailVerified && (
                    <p style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      ✓ Email verificado com sucesso!
                    </p>
                  )}
                </motion.div>

                {/* SEÇÃO ENDEREÇO */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    📍 Endereço
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        CEP *
                      </label>
                      <input
                        type='text'
                        name='cep'
                        value={formData.cep}
                        onChange={handleInputChange}
                        placeholder='00000-000'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.cep ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        UF *
                      </label>
                      <input
                        type='text'
                        name='state'
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder='SP'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.state ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Endereço *
                      </label>
                      <input
                        type='text'
                        name='address'
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder='Rua, número'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.address ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Cidade *
                      </label>
                      <input
                        type='text'
                        name='city'
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder='Cidade'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.city ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* SEÇÃO DOCUMENTOS */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    📄 Documentos
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        CPF
                      </label>
                      <input
                        type='text'
                        name='cpf'
                        value={formData.cpf}
                        onChange={handleInputChange}
                        placeholder='000.000.000-00'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.cpf ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        CNPJ
                      </label>
                      <input
                        type='text'
                        name='cnpj'
                        value={formData.cnpj}
                        onChange={handleInputChange}
                        placeholder='00.000.000/0000-00'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.cnpj ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        IE
                      </label>
                      <input
                        type='text'
                        name='ie'
                        value={formData.ie}
                        onChange={handleInputChange}
                        placeholder='Inscrição Estadual'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.ie ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    * É obrigatório preencher CPF ou CNPJ
                  </p>
                </motion.div>

                {/* SEÇÃO PRODUTOS */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    🛍️ Produtos
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Nome do produto *
                      </label>
                      <input
                        type='text'
                        name='productName'
                        value={formData.productName}
                        onChange={handleInputChange}
                        placeholder='Ex: Soja Premium'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productName ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Categoria *
                      </label>
                      <select
                        name='productCategory'
                        value={formData.productCategory}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productCategory ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      >
                        <option value=''>Selecione a categoria</option>
                        <option value='grains'>Grãos</option>
                        <option value='vegetables'>Hortaliças</option>
                        <option value='fruits'>Frutas</option>
                        <option value='livestock'>Pecuária</option>
                        <option value='equipment'>Equipamentos</option>
                        <option value='seeds'>Sementes</option>
                        <option value='fertilizers'>Fertilizantes</option>
                        <option value='other'>Outros</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Descrição do produto *
                    </label>
                    <textarea
                      name='productDescription'
                      value={formData.productDescription}
                      onChange={handleInputChange}
                      placeholder='Descreva o produto, qualidade, origem...'
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${errors.productDescription ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        background: 'rgba(248, 250, 252, 0.8)',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Preço (R$) *
                      </label>
                      <input
                        type='number'
                        step='0.01'
                        name='productPrice'
                        value={formData.productPrice}
                        onChange={handleInputChange}
                        placeholder='25.50'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productPrice ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Estoque (kg) *
                      </label>
                      <input
                        type='number'
                        name='productStock'
                        value={formData.productStock}
                        onChange={handleInputChange}
                        placeholder='1000'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productStock ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Peso (kg)
                      </label>
                      <input
                        type='number'
                        name='productWeight'
                        value={formData.productWeight}
                        onChange={handleInputChange}
                        placeholder='50'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productWeight ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Origem
                      </label>
                      <input
                        type='text'
                        name='productOrigin'
                        value={formData.productOrigin}
                        onChange={handleInputChange}
                        placeholder='Ex: São Paulo, Brasil'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productOrigin ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Qualidade
                      </label>
                      <select
                        name='productQuality'
                        value={formData.productQuality}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.productQuality ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          transition: 'all 0.3s ease',
                          outline: 'none'
                        }}
                      >
                        <option value=''>Selecione a qualidade</option>
                        <option value='premium'>Premium</option>
                        <option value='standard'>Padrão</option>
                        <option value='basic'>Básica</option>
                        <option value='organic'>Orgânica</option>
                      </select>
                    </div>
                  </div>
                </motion.div>

                {/* SEÇÃO UPLOAD DE IMAGEM */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    📸 Imagem do Produto
                  </h3>

                  <div style={{ marginBottom: '1rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Foto do produto
                    </label>
                    <input
                      type='file'
                      name='productImage'
                      onChange={handleInputChange}
                      accept='image/*'
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${errors.productImage ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        background: 'rgba(248, 250, 252, 0.8)',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                    />
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                    </p>
                  </div>
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
                        borderRadius: '16px',
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

                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }}
                  >
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
                      name='confirmPassword'
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder='Confirme sua senha'
                      style={{
                        width: '100%',
                        padding: '12px 44px 12px 44px',
                        border: `2px solid ${errors.confirmPassword ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = errors.confirmPassword ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
                      }}
                    />
                    <button
                      type='button'
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

                {/* Turnstile */}
                <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
                  <CloudflareTurnstile onVerify={setTurnstileToken} onError={() => setTurnstileToken('')} />
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type='submit'
                  disabled={isLoading || !turnstileToken}
                  className={`flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-lg font-semibold text-white transition-all duration-300 ${
                    isLoading
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'transform bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
                  }`}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
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
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Cadastro - Loja/Produtor
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Já tem uma conta?{' '}
                  <Link
                    to='/login'
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
      </div>

      {/* Footer já incluído no App.js */}
    </>
  );
};

export default SignupStore;
