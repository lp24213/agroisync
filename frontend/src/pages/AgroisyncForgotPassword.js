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
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSendCode = async (e) => {
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

  const handleVerifyCode = async (e) => {
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

  const handleResetPassword = async (e) => {
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
      const result = await authService.resetPassword(
        formData.email,
        formData.code,
        formData.newPassword
      );
      
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
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar Senha</h1>
        <p className="text-gray-600">Digite seu email para receber um código de recuperação</p>
      </div>

      <form onSubmit={handleSendCode} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            placeholder="seu@email.com"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Cloudflare Turnstile */}
        <CloudflareTurnstile
          onVerify={(token) => {
            setTurnstileToken(token);
            setErrors(prev => ({ ...prev, general: '' }));
          }}
          onError={(error) => {
            setErrors({ general: 'Erro na verificação. Tente novamente.' });
            setTurnstileToken('');
          }}
          onExpire={() => {
            setTurnstileToken('');
            setErrors({ general: 'Verificação expirada. Tente novamente.' });
          }}
        />

        <button
          type="submit"
          disabled={isLoading || !turnstileToken}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enviando...' : 'Enviar Código'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Login
        </Link>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      variants={itemVariants}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificar Código</h1>
        <p className="text-gray-600">
          Digite o código de 6 dígitos enviado para <br />
          <span className="font-medium">{formData.email}</span>
        </p>
      </div>

      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de Verificação
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest"
            placeholder="000000"
            maxLength="6"
            required
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.code}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verificar Código
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setStep(1)}
          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      variants={itemVariants}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nova Senha</h1>
        <p className="text-gray-600">Digite sua nova senha</p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nova Senha
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            placeholder="Mínimo 6 caracteres"
            required
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.newPassword}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            placeholder="Digite novamente"
            required
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setStep(2)}
          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <motion.div
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex items-center justify-center min-h-screen p-4"
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        <div className="mt-8 flex justify-center">
          <CryptoHash pageName="forgot-password" />
        </div>
      </motion.div>
    </div>
  );
};

export default AgroisyncForgotPassword;
