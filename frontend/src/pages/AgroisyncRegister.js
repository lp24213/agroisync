import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowRight, Building2, 
  Phone, CheckCircle, AlertCircle, Loader2, Smartphone,
  Shield, Zap, Globe, Star, Heart
} from 'lucide-react';
import validationService from '../services/validationService';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import CloudflareTurnstile from '../components/CloudflareTurnstile';

const AgroisyncRegister = () => {
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
  const [validations, setValidations] = useState({});
  
  // Estados para validação Email
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // Estados para Turnstile
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Validação em tempo real
    if (name === 'phone') {
      const phoneValidation = validationService.validatePhone(value);
      setValidations(prev => ({ ...prev, phone: phoneValidation }));
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

  const handleSubmit = async (e) => {
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
      const result = await authService.signUpWithEmail(formData.email, formData.password, {
        name: formData.name,
        company: formData.company,
        phone: formData.phone
      }, turnstileToken);

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Hero Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl shadow-emerald-500/25 mb-6">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight"
              >
                Junte-se ao{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                  AgroSync
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg"
              >
                Transforme seu agronegócio com tecnologia de ponta. 
                Conecte-se ao futuro da agricultura digital.
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4 mb-8"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="font-semibold">Tecnologia Avançada</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold">100% Seguro</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-semibold">Conectividade Global</span>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-6 text-center"
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-emerald-600">10K+</div>
                  <div className="text-sm text-gray-600">Usuários Ativos</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-teal-600">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Suporte</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/10 border border-white/20 p-4 sm:p-6 lg:p-8 xl:p-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Criar Conta
                </h2>
                <p className="text-gray-600 text-lg">
                  Preencha os dados abaixo para começar
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-4"></div>
              </motion.div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  {errors.general}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome completo"
                      className={`w-full pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
                        errors.name 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      className={`w-full pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </motion.div>

                {/* Empresa */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Empresa
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Nome da sua empresa"
                      className={`w-full pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
                        errors.company 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.company}
                    </p>
                  )}
                </motion.div>

                {/* Telefone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                      className={`w-full pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
                        errors.phone 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </motion.div>


                {/* Verificação Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Verificação Email
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                        placeholder="Código Email"
                        maxLength="6"
                        className={`w-full pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 text-center text-lg font-mono ${
                          emailVerified 
                            ? 'border-green-300 bg-green-50 text-green-700' 
                            : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                        }`}
                      />
                      {emailVerified && (
                        <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={sendEmailCode}
                      disabled={emailSent || isLoading}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none text-sm sm:text-base"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : emailSent ? 'Reenviar' : 'Enviar'}
                    </button>
                    <button
                      type="button"
                      onClick={verifyEmailCode}
                      disabled={!emailCode || isLoading || emailVerified}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none text-sm sm:text-base"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : emailVerified ? <CheckCircle className="w-5 h-5" /> : 'Verificar'}
                    </button>
                  </div>
                  {emailVerified && (
                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Email verificado com sucesso!
                    </p>
                  )}
                </motion.div>

                {/* Senha */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Sua senha"
                      className={`w-full pl-12 pr-12 py-3 sm:py-4 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </motion.div>

                {/* Confirmar Senha */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirme sua senha"
                      className={`w-full pl-12 pr-12 py-3 sm:py-4 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 ${
                        errors.confirmPassword 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
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
                    onVerify={(token) => {
                      setTurnstileToken(token);
                      setErrors(prev => ({ ...prev, turnstile: '' }));
                    }}
                    onError={(error) => {
                      setErrors(prev => ({ ...prev, turnstile: 'Erro na verificação. Tente novamente.' }));
                      setTurnstileToken('');
                    }}
                    onExpire={() => {
                      setTurnstileToken('');
                    }}
                  />
                  {errors.turnstile && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.turnstile}
                    </p>
                  )}
                </motion.div>

                {/* Botão Submit */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  whileHover={(isLoading || !turnstileToken) ? {} : { scale: 1.02 }}
                  whileTap={(isLoading || !turnstileToken) ? {} : { scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !turnstileToken}
                  className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    (isLoading || !turnstileToken)
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 text-white shadow-xl hover:shadow-2xl'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar Conta
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="text-center mt-8 pt-6 border-t border-gray-200"
              >
                <p className="text-gray-600 mb-2">
                  Já tem uma conta?{' '}
                  <Link 
                    to="/login" 
                    className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200 hover:underline"
                  >
                    Fazer Login
                  </Link>
                </p>
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" />
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