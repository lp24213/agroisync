import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Building2, Phone } from 'lucide-react';
import validationService from '../services/validationService';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import CloudflareTurnstile from '../components/CloudflareTurnstile';

const SignupFreight = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Dados Pessoais
    name: '',
    email: '',
    phone: '',
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

    // Dados do Veículo
    licensePlate: '',
    vehicleType: '',
    capacity: '',
    vehicleModel: '',

    // Serviços de Frete
    freightDescription: '',
    freightPrice: '',
    freightRoute: '',
    freightAvailability: '',

    // Tipo fixo - SEMPRE FRETE
    userType: 'transporter',
    businessType: 'transporter'
  });

  const [turnstileToken, setTurnstileToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estados para validação Email
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [validations, setValidations] = useState({});

  const sendEmailCode = async () => {
    if (!formData.email) {
      toast.error('Por favor, insira seu email primeiro');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.resendVerificationEmail(formData.email);
      if (result.success) {
        setEmailSent(true);
        toast.success(`Código Email enviado! Código: ${result.verificationCode}`, { duration: 10000 });
      } else {
        toast.error(result.error || 'Erro ao enviar email');
      }
    } catch (error) {
      toast.error('Erro ao enviar email');
    } finally {
      setIsLoading(false);
    }
  };

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

    // Validações de veículo
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'Placa é obrigatória';
    }
    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'Modelo é obrigatório';
    }

    // Validações de serviços
    if (!formData.freightDescription.trim()) {
      newErrors.freightDescription = 'Descrição dos serviços é obrigatória';
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

    setIsLoading(true);

    try {
      // Chamada real de cadastro
      const api = process.env.REACT_APP_API_URL || '/api';
      const res = await fetch(`${api}/freight/register`, {
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
        localStorage.setItem('authToken', data.data.token);
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

      <section
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
                  Cadastro - Transportador/Frete
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
                      onFocus={e => {
                        e.target.style.borderColor = 'var(--accent)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = errors.name ? '#dc2626' : 'rgba(15, 15, 15, 0.1)';
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
                        borderRadius: '8px',
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
                        borderRadius: '8px',
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
                        borderRadius: '8px',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    * É obrigatório preencher CPF ou CNPJ
                  </p>
                </motion.div>

                {/* SEÇÃO VEÍCULO */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    🚛 Veículo
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
                        Placa *
                      </label>
                      <input
                        type='text'
                        name='licensePlate'
                        value={formData.licensePlate}
                        onChange={handleInputChange}
                        placeholder='ABC-1234'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.licensePlate ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                        Modelo *
                      </label>
                      <input
                        type='text'
                        name='vehicleModel'
                        value={formData.vehicleModel}
                        onChange={handleInputChange}
                        placeholder='Scania R440'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.vehicleModel ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                        Tipo
                      </label>
                      <select
                        name='vehicleType'
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.vehicleType ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      >
                        <option value=''>Selecione o tipo</option>
                        <option value='truck'>Caminhão</option>
                        <option value='van'>Van</option>
                        <option value='pickup'>Pickup</option>
                        <option value='semi-trailer'>Carreta</option>
                        <option value='bitruck'>Bitruck</option>
                      </select>
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
                        Capacidade (kg)
                      </label>
                      <input
                        type='number'
                        name='capacity'
                        value={formData.capacity}
                        onChange={handleInputChange}
                        placeholder='15000'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.capacity ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* SEÇÃO SERVIÇOS DE FRETE */}
                <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
                  <h3
                    style={{
                      color: 'var(--text-primary)',
                      marginBottom: '1rem',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  >
                    💰 Serviços de Frete
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
                      Descrição dos serviços *
                    </label>
                    <textarea
                      name='freightDescription'
                      value={formData.freightDescription}
                      onChange={handleInputChange}
                      placeholder='Descreva os tipos de carga que transporta, regiões atendidas...'
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${errors.freightDescription ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

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
                        Preço por km (R$)
                      </label>
                      <input
                        type='number'
                        step='0.01'
                        name='freightPrice'
                        value={formData.freightPrice}
                        onChange={handleInputChange}
                        placeholder='2.50'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.freightPrice ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                        Rota principal
                      </label>
                      <input
                        type='text'
                        name='freightRoute'
                        value={formData.freightRoute}
                        onChange={handleInputChange}
                        placeholder='SP - RJ - MG'
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.freightRoute ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
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
                        Disponibilidade
                      </label>
                      <select
                        name='freightAvailability'
                        value={formData.freightAvailability}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: `2px solid ${errors.freightAvailability ? '#dc2626' : 'rgba(15, 15, 15, 0.1)'}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          background: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                      >
                        <option value=''>Selecione</option>
                        <option value='24h'>24 horas</option>
                        <option value='business'>Horário comercial</option>
                        <option value='weekends'>Fins de semana</option>
                        <option value='flexible'>Flexível</option>
                      </select>
                    </div>
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
                      Cadastro - Transportador/Frete
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
      </section>

      {/* Footer já incluído no App.js */}
    </>
  );
};

export default SignupFreight;
