import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  // Smartphone,
  Shield,
  Zap,
  Globe,
  // Star,
  Heart
} from 'lucide-react';
import validationService from '../services/validationService';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import CloudflareTurnstile from '../components/CloudflareTurnstile';

const AgroisyncRegister = () => {
  if (process.env.NODE_ENV !== 'production') {

    // Component loaded

  }
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // const [validations, setValidations] = useState({});

  // Estados para validação Email
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Estados para Turnstile
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Validação em tempo real
    if (name === 'phone') {
      validationService.validatePhone(value);
      // setValidations(prev => ({ ...prev, phone: phoneValidation }));
    }
  };

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
        toast.success(`Código Email enviado! Código: ${result.emailCode}`, { duration: 10000 });
      } else {
        toast.error(result.error || 'Erro ao enviar email');
      }
    } catch (error) {
      toast.error('Erro ao enviar email');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!emailCode) {
      toast.error('Por favor, insira o código de verificação');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.verifyEmail(formData.email, emailCode);
      if (result.success) {
        setEmailVerified(true);
        toast.success('Email verificado com sucesso!');
      } else {
        toast.error(result.error || 'Código inválido');
      }
    } catch (error) {
      toast.error('Erro ao verificar email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validação básica
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
      if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
      if (!formData.company.trim()) newErrors.company = 'Empresa é obrigatória';
      if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      if (!formData.password) newErrors.password = 'Senha é obrigatória';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }

      if (!emailVerified) newErrors.email = 'Email deve ser verificado';
      if (!turnstileToken) newErrors.turnstile = 'Complete a verificação "Não sou um robô"';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      // Registrar usuário
      const result = await authService.signUpWithEmail(
        formData.email,
        formData.password,
        {
          name: formData.name,
          company: formData.company,
          phone: formData.phone
        },
        turnstileToken
      );

      if (result.success) {
        if (result.requiresEmailVerification) {
          toast.success(`Cadastro realizado! Verifique seu email. Código: ${result.emailCode}`, { duration: 10000 });
          setEmailSent(true);
        } else {
          toast.success('Cadastro realizado com sucesso!');
          navigate('/login');
        }
      } else {
        setErrors({ general: result.error || 'Erro ao criar conta' });
      }
    } catch (error) {
      setErrors({ general: 'Erro interno do servidor' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -right-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-emerald-200 opacity-20 mix-blend-multiply blur-xl filter'></div>
        <div className='absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-teal-200 opacity-20 mix-blend-multiply blur-xl filter'></div>
        <div className='absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-blue-200 opacity-10 mix-blend-multiply blur-xl filter'></div>
      </div>

      <div className='relative z-10 flex min-h-screen items-center justify-center px-4 py-12'>
        <div className='mx-auto w-full max-w-7xl'>
          <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-12'>
            {/* Left Side - Hero Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className='text-center lg:text-left'
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className='mb-8'
              >
                <div className='mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/25'>
                  <Building2 className='h-10 w-10 text-white' />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='mb-6 text-5xl font-black leading-tight text-gray-900 lg:text-6xl'
              >
                Junte-se ao{' '}
                <span className='bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent'>
                  AgroSync
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='mb-8 max-w-lg text-xl leading-relaxed text-gray-600'
              >
                Transforme seu agronegócio com tecnologia de ponta. Conecte-se ao futuro da agricultura digital.
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className='mb-8 space-y-4'
              >
                <div className='flex items-center gap-3 text-gray-700'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100'>
                    <Zap className='h-4 w-4 text-emerald-600' />
                  </div>
                  <span className='font-semibold'>Tecnologia Avançada</span>
                </div>
                <div className='flex items-center gap-3 text-gray-700'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
                    <Shield className='h-4 w-4 text-blue-600' />
                  </div>
                  <span className='font-semibold'>100% Seguro</span>
                </div>
                <div className='flex items-center gap-3 text-gray-700'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-100'>
                    <Globe className='h-4 w-4 text-purple-600' />
                  </div>
                  <span className='font-semibold'>Conectividade Global</span>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className='grid grid-cols-3 gap-6 text-center'
              >
                <div className='rounded-2xl border border-white/20 bg-white/60 p-4 backdrop-blur-sm'>
                  <div className='text-2xl font-bold text-emerald-600'>10K+</div>
                  <div className='text-sm text-gray-600'>Usuários Ativos</div>
                </div>
                <div className='rounded-2xl border border-white/20 bg-white/60 p-4 backdrop-blur-sm'>
                  <div className='text-2xl font-bold text-teal-600'>99.9%</div>
                  <div className='text-sm text-gray-600'>Uptime</div>
                </div>
                <div className='rounded-2xl border border-white/20 bg-white/60 p-4 backdrop-blur-sm'>
                  <div className='text-2xl font-bold text-blue-600'>24/7</div>
                  <div className='text-sm text-gray-600'>Suporte</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='rounded-3xl border border-white/20 bg-white/90 p-4 shadow-2xl shadow-gray-900/10 backdrop-blur-xl sm:p-6 lg:p-8 xl:p-10'
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='mb-8 text-center'
              >
                <h2 className='mb-3 text-3xl font-bold text-gray-900'>Criar Conta</h2>
                <p className='text-lg text-gray-600'>Preencha os dados abaixo para começar</p>
                <div className='mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500'></div>
              </motion.div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'
                >
                  <AlertCircle className='h-5 w-5' />
                  {errors.general}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Nome */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <label className='mb-2 block text-sm font-bold text-gray-700'>Nome Completo</label>
                  <div className='relative'>
                    <User className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder='Seu nome completo'
                      className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-12 pr-4 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 sm:py-4 ${
                        errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className='mt-2 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.name}
                    </p>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <label className='mb-2 block text-sm font-bold text-gray-700'>Email</label>
                  <div className='relative'>
                    <Mail className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder='seu@email.com'
                      className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-12 pr-4 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 sm:py-4 ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className='mt-2 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.email}
                    </p>
                  )}
                </motion.div>

                {/* Empresa */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <label className='mb-2 block text-sm font-bold text-gray-700'>Empresa</label>
                  <div className='relative'>
                    <Building2 className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
                    <input
                      type='text'
                      name='company'
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder='Nome da sua empresa'
                      className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-12 pr-4 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 sm:py-4 ${
                        errors.company
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.company && (
                    <p className='mt-2 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.company}
                    </p>
                  )}
                </motion.div>

                {/* Telefone */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <label className='mb-2 block text-sm font-bold text-gray-700'>Telefone</label>
                  <div className='relative'>
                    <Phone className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder='(11) 99999-9999'
                      className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-12 pr-4 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 sm:py-4 ${
                        errors.phone
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className='mt-2 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.phone}
                    </p>
                  )}
                </motion.div>

                {/* Verificação Email */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
                  <label className='mb-2 block text-sm font-bold text-gray-700'>Verificação Email</label>
                  <div className='flex gap-3'>
                    <div className='relative flex-1'>
                      <Mail className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
                      <input
                        type='text'
                        value={emailCode}
                        onChange={e => setEmailCode(e.target.value)}
                        placeholder='Código Email'
                        maxLength='6'
                        className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-12 pr-4 text-center font-mono text-lg transition-all duration-300 focus:bg-white sm:py-4 ${
                          emailVerified
                            ? 'border-green-300 bg-green-50 text-green-700'
                            : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                        }`}
                      />
                      {emailVerified && (
                        <CheckCircle className='absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-green-500' />
                      )}
                    </div>
                    <button
                      type='button'
                      onClick={sendEmailCode}
                      disabled={emailSent || isLoading}
                      className='rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-purple-600 hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none sm:px-6 sm:py-4 sm:text-base'
                    >
                      {isLoading ? <Loader2 className='h-5 w-5 animate-spin' /> : emailSent ? 'Reenviar' : 'Enviar'}
                    </button>
                    <button
                      type='button'
                      onClick={verifyEmailCode}
                      disabled={!emailCode || isLoading || emailVerified}
                      className='rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-emerald-600 hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none sm:px-6 sm:py-4 sm:text-base'
                    >
                      {isLoading ? (
                        <Loader2 className='h-5 w-5 animate-spin' />
                      ) : emailVerified ? (
                        <CheckCircle className='h-5 w-5' />
                      ) : (
                        'Verificar'
                      )}
                    </button>
                  </div>
                  {emailVerified && (
                    <p className='mt-2 flex items-center gap-1 text-sm font-medium text-green-600'>
                      <CheckCircle className='h-4 w-4' />
                      Email verificado com sucesso!
                    </p>
                  )}
                </motion.div>

                {/* Senha */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
                  <label className='mb-2 block text-sm font-bold text-gray-700'>Senha</label>
                  <div className='relative'>
                    <Lock className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder='Sua senha'
                      className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-12 pr-12 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 sm:py-4 ${
                        errors.password
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600'
                    >
                      {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className='mt-2 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.password}
                    </p>
                  )}
                </motion.div>

                {/* Confirmar Senha */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
                  <label className='mb-2 block text-sm font-bold text-gray-700'>Confirmar Senha</label>
                  <div className='relative'>
                    <Lock className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name='confirmPassword'
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder='Confirme sua senha'
                      className={`w-full rounded-xl border-2 bg-gray-50 py-3 pl-12 pr-12 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 sm:py-4 ${
                        errors.confirmPassword
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600'
                    >
                      {showConfirmPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className='mt-2 flex items-center gap-1 text-sm text-red-500'>
                      <AlertCircle className='h-4 w-4' />
                      {errors.confirmPassword}
                    </p>
                  )}
                </motion.div>

                {/* Cloudflare Turnstile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  style={{ marginBottom: '1.5rem' }}
                >
                  <CloudflareTurnstile
                    onVerify={token => {
                      setTurnstileToken(token);
                      setErrors(prev => ({ ...prev, turnstile: '' }));
                    }}
                    onError={error => {
                      setErrors(prev => ({ ...prev, turnstile: 'Erro na verificação. Tente novamente.' }));
                      setTurnstileToken('');
                    }}
                    onExpire={() => {
                      setTurnstileToken('');
                    }}
                  />
                  {errors.turnstile && <p className='mt-2 text-sm text-red-500'>{errors.turnstile}</p>}
                </motion.div>

                {/* Botão Submit */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  whileHover={isLoading || !turnstileToken ? {} : { scale: 1.02 }}
                  whileTap={isLoading || !turnstileToken ? {} : { scale: 0.98 }}
                  type='submit'
                  disabled={isLoading || !turnstileToken}
                  className={`flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-base font-bold transition-all duration-300 sm:px-6 sm:py-4 sm:text-lg ${
                    isLoading || !turnstileToken
                      ? 'cursor-not-allowed bg-gray-400 text-gray-600'
                      : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white shadow-xl hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 hover:shadow-2xl'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='h-6 w-6 animate-spin' />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar Conta
                      <ArrowRight className='h-6 w-6' />
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className='mt-8 border-t border-gray-200 pt-6 text-center'
              >
                <p className='mb-2 text-gray-600'>
                  Já tem uma conta?{' '}
                  <Link
                    to='/login'
                    className='font-semibold text-emerald-600 transition-colors duration-200 hover:text-emerald-700 hover:underline'
                  >
                    Fazer Login
                  </Link>
                </p>
                <p className='flex items-center justify-center gap-1 text-xs text-gray-500'>
                  <Heart className='h-3 w-3 text-red-500' />
                  Feito com amor para o agronegócio brasileiro
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgroisyncRegister;
