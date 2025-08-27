import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Shield, Key } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAdmin, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para funcionalidades adicionais
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [resetMethod, setResetMethod] = useState('email'); // 'email' ou 'sms'

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

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
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Verificar se é login de admin
      if (formData.email === 'luispaulodeoliveira@agrotm.com.br') {
        await loginAdmin(formData.email, formData.password);
        setSuccess('Login administrativo realizado com sucesso!');
        setTimeout(() => navigate('/admin/secure-panel'), 1500);
      } else {
        // Login normal com verificação 2FA
        const result = await login(formData.email, formData.password);
        if (result.requires2FA) {
          setShow2FA(true);
          setSuccess('Código 2FA enviado para seu dispositivo.');
        } else {
          setSuccess('Login realizado com sucesso!');
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setError('Por favor, insira seu e-mail.');
      return;
    }

    setIsResettingPassword(true);
    setError('');
    setSuccess('');

    try {
      // Simular envio de reset de senha
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (resetMethod === 'email') {
        setSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      } else {
        setSuccess('SMS de recuperação enviado! Verifique seu celular.');
      }
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
        setResetMethod('email');
      }, 3000);
    } catch (error) {
      setError('Erro ao enviar recuperação de senha. Tente novamente.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handle2FAVerification = async (e) => {
    e.preventDefault();
    if (!twoFACode || twoFACode.length !== 6) {
      setError('Por favor, insira o código de 6 dígitos.');
      return;
    }

    setIsVerifying2FA(true);
    setError('');

    try {
      // Simular verificação 2FA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui você implementaria a verificação real do código 2FA
      if (twoFACode === '123456') { // Código de exemplo
        setSuccess('Verificação 2FA realizada com sucesso!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError('Código 2FA inválido. Tente novamente.');
      }
    } catch (error) {
      setError('Erro ao verificar código 2FA. Tente novamente.');
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const resend2FACode = async () => {
    try {
      // Simular reenvio do código
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Novo código 2FA enviado!');
    } catch (error) {
      setError('Erro ao reenviar código. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mx-auto h-16 w-16 bg-gradient-to-r from-agro-green to-agro-yellow rounded-full flex items-center justify-center mb-6"
          >
            <User className="h-8 w-8 text-white" />
          </motion.div>
          
          <h2 className="title-premium text-3xl font-bold">
            {showForgotPassword ? 'Recuperar Senha' : show2FA ? 'Verificação 2FA' : 'Entrar na Conta'}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {showForgotPassword 
              ? 'Escolha como recuperar sua senha'
              : show2FA 
                ? 'Digite o código enviado para seu dispositivo'
                : 'Acesse sua conta AgroSync'
            }
          </p>
        </motion.div>

        {/* Formulário de Login */}
        <AnimatePresence mode="wait">
          {!showForgotPassword && !show2FA && (
            <motion.form
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="card-premium space-y-6"
            >
              {/* Campo E-mail */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-premium pl-10"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-premium pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Links de Ajuda */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-agro-green hover:text-agro-yellow transition-colors duration-200"
                >
                  Esqueceu sua senha?
                </button>
                
                <Link
                  to="/cadastro"
                  className="text-sm text-agro-green hover:text-agro-yellow transition-colors duration-200"
                >
                  Criar conta
                </Link>
              </div>

              {/* Botão de Login */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-accent-green w-full flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Entrar
                  </>
                )}
              </motion.button>

              {/* Link para Admin */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/admin/login')}
                  className="text-sm text-gray-500 hover:text-agro-green transition-colors duration-200"
                >
                  Acesso administrativo
                </button>
              </div>
            </motion.form>
          )}

          {/* Formulário de Recuperação de Senha */}
          {showForgotPassword && (
            <motion.form
              key="forgot-password-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleForgotPassword}
              className="card-premium space-y-6"
            >
              {/* Método de Recuperação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Escolha o método de recuperação:
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="resetMethod"
                      value="email"
                      checked={resetMethod === 'email'}
                      onChange={(e) => setResetMethod(e.target.value)}
                      className="mr-2"
                    />
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    E-mail
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="resetMethod"
                      value="sms"
                      checked={resetMethod === 'sms'}
                      onChange={(e) => setResetMethod(e.target.value)}
                      className="mr-2"
                    />
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    SMS
                  </label>
                </div>
              </div>

              {/* Campo E-mail/Telefone */}
              <div>
                <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {resetMethod === 'email' ? 'E-mail' : 'Telefone'}
                </label>
                <div className="relative">
                  {resetMethod === 'email' ? (
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  )}
                  <input
                    id="forgotEmail"
                    type={resetMethod === 'email' ? 'email' : 'tel'}
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="input-premium pl-10"
                    placeholder={resetMethod === 'email' ? 'seu@email.com' : '(11) 99999-9999'}
                    required
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex space-x-3">
                <motion.button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 inline" />
                  Voltar
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={isResettingPassword}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-accent-green flex-1 flex justify-center items-center"
                >
                  {isResettingPassword ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Enviar
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* Formulário de Verificação 2FA */}
          {show2FA && (
            <motion.form
              key="2fa-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handle2FAVerification}
              className="card-premium space-y-6"
            >
              {/* Código 2FA */}
              <div>
                <label htmlFor="twoFACode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Código de Verificação (6 dígitos)
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="twoFACode"
                    type="text"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="input-premium pl-10 text-center text-lg tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Digite o código de 6 dígitos enviado para seu dispositivo
                </p>
              </div>

              {/* Botões */}
              <div className="flex space-x-3">
                <motion.button
                  type="button"
                  onClick={() => setShow2FA(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 inline" />
                  Voltar
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={isVerifying2FA || twoFACode.length !== 6}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-accent-green flex-1 flex justify-center items-center"
                >
                  {isVerifying2FA ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Verificar
                    </>
                  )}
                </motion.button>
              </div>

              {/* Reenviar código */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={resend2FACode}
                  className="text-sm text-agro-green hover:text-agro-yellow transition-colors duration-200"
                >
                  Reenviar código
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Mensagens de Erro e Sucesso */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
