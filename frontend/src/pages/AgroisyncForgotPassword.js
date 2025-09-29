import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import CloudflareTurnstile from '../components/CloudflareTurnstile';
import CryptoHash from '../components/CryptoHash';

const AgroisyncForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: código, 3: nova senha
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
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

    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSendCode = async e => {
    e.preventDefault();

    if (!formData.email) {
      setErrors({ email: 'Email é obrigatório' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.forgotPassword(formData.email);
      if (result.success) {
        toast.success(`Código enviado! Código: ${result.resetCode}`, { duration: 10000 });
        setStep(2);
      } else {
        toast.error(result.error || 'Erro ao enviar código');
      }
    } catch (error) {
      toast.error('Erro ao enviar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async e => {
    e.preventDefault();

    if (!formData.code) {
      setErrors({ code: 'Código é obrigatório' });
      return;
    }

    if (formData.code.length !== 6) {
      setErrors({ code: 'Código deve ter 6 dígitos' });
      return;
    }

    setStep(3);
  };

  const handleResetPassword = async e => {
    e.preventDefault();

    if (!formData.newPassword) {
      setErrors({ newPassword: 'Nova senha é obrigatória' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrors({ newPassword: 'Senha deve ter pelo menos 6 caracteres' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Senhas não coincidem' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.resetPassword(formData.email, formData.code, formData.newPassword);

      if (result.success) {
        toast.success('Senha redefinida com sucesso!');
        navigate('/login');
      } else {
        toast.error(result.error || 'Erro ao redefinir senha');
      }
    } catch (error) {
      toast.error('Erro ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      variants={itemVariants}
      className='mx-auto w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm'
    >
      <div className='mb-8 text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100'>
          <Mail className='h-8 w-8 text-emerald-600' />
        </div>
        <h1 className='mb-2 text-2xl font-bold text-gray-900'>Recuperar Senha</h1>
        <p className='text-gray-600'>Digite seu email para receber um código de recuperação</p>
      </div>

      <form onSubmit={handleSendCode} className='space-y-6'>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Email</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            className='w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
            placeholder='seu@email.com'
            required
          />
          {errors.email && (
            <p className='mt-1 flex items-center text-sm text-red-600'>
              <AlertCircle className='mr-1 h-4 w-4' />
              {errors.email}
            </p>
          )}
        </div>

        {/* Cloudflare Turnstile */}
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

        <button
          type='submit'
          disabled={isLoading || !turnstileToken}
          className='w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLoading ? 'Enviando...' : 'Enviar Código'}
        </button>
      </form>

      <div className='mt-6 text-center'>
        <Link
          to='/login'
          className='flex items-center justify-center font-medium text-emerald-600 hover:text-emerald-700'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Voltar ao Login
        </Link>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      variants={itemVariants}
      className='mx-auto w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm'
    >
      <div className='mb-8 text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100'>
          <CheckCircle className='h-8 w-8 text-emerald-600' />
        </div>
        <h1 className='mb-2 text-2xl font-bold text-gray-900'>Verificar Código</h1>
        <p className='text-gray-600'>
          Digite o código de 6 dígitos enviado para <br />
          <span className='font-medium'>{formData.email}</span>
        </p>
      </div>

      <form onSubmit={handleVerifyCode} className='space-y-6'>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Código de Verificação</label>
          <input
            type='text'
            name='code'
            value={formData.code}
            onChange={handleInputChange}
            className='w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl tracking-widest transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
            placeholder='000000'
            maxLength='6'
            required
          />
          {errors.code && (
            <p className='mt-1 flex items-center text-sm text-red-600'>
              <AlertCircle className='mr-1 h-4 w-4' />
              {errors.code}
            </p>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Verificar Código
        </button>
      </form>

      <div className='mt-6 text-center'>
        <button
          onClick={() => setStep(1)}
          className='mx-auto flex items-center justify-center font-medium text-emerald-600 hover:text-emerald-700'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Voltar
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      variants={itemVariants}
      className='mx-auto w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm'
    >
      <div className='mb-8 text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100'>
          <CheckCircle className='h-8 w-8 text-emerald-600' />
        </div>
        <h1 className='mb-2 text-2xl font-bold text-gray-900'>Nova Senha</h1>
        <p className='text-gray-600'>Digite sua nova senha</p>
      </div>

      <form onSubmit={handleResetPassword} className='space-y-6'>
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Nova Senha</label>
          <input
            type='password'
            name='newPassword'
            value={formData.newPassword}
            onChange={handleInputChange}
            className='w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
            placeholder='Mínimo 6 caracteres'
            required
          />
          {errors.newPassword && (
            <p className='mt-1 flex items-center text-sm text-red-600'>
              <AlertCircle className='mr-1 h-4 w-4' />
              {errors.newPassword}
            </p>
          )}
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>Confirmar Nova Senha</label>
          <input
            type='password'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className='w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-emerald-500'
            placeholder='Digite novamente'
            required
          />
          {errors.confirmPassword && (
            <p className='mt-1 flex items-center text-sm text-red-600'>
              <AlertCircle className='mr-1 h-4 w-4' />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
        </button>
      </form>

      <div className='mt-6 text-center'>
        <button
          onClick={() => setStep(2)}
          className='mx-auto flex items-center justify-center font-medium text-emerald-600 hover:text-emerald-700'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Voltar
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -right-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-emerald-200 opacity-20 mix-blend-multiply blur-xl filter'></div>
        <div className='absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-teal-200 opacity-20 mix-blend-multiply blur-xl filter'></div>
      </div>

      <motion.div
        variants={heroVariants}
        initial='hidden'
        animate='visible'
        className='relative z-10 flex min-h-screen items-center justify-center p-4'
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        <div className='mt-8 flex justify-center'>
          <CryptoHash pageName='forgot-password' style={{ display: 'none' }} />
        </div>
      </motion.div>
    </div>
  );
};

export default AgroisyncForgotPassword;
