import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const { isDark } = useTheme();
  const { login, error: authError } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Login - Agroisync';
    
    // Verificar se usuário vem de um pagamento bem-sucedido
    const urlParams = new URLSearchParams(window.location.search);
    const planActivated = urlParams.get('plan');
    
    if (planActivated === 'activated') {
      // Mostrar mensagem de sucesso para usuário com plano ativado
      setError('');
      // Aqui você pode adicionar uma mensagem de sucesso
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(formData);
      // Redirect will be handled by AuthContext
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              Bem-vindo de volta
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Acesse sua conta Agroisync e continue conectando o agronegócio brasileiro
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} p-8`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Digite seu e-mail"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Digite sua senha"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {(error || authError) && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-600 dark:text-red-400">
                      {error || authError}
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform hover:scale-105'
                  }`}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              {/* Additional Links */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Não tem uma conta?{' '}
                  <a
                    href="/cadastro"
                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors duration-200"
                  >
                    Cadastre-se aqui
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Acesso Seguro</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Suas credenciais são protegidas com criptografia de ponta
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Privacidade Total</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seus dados pessoais são mantidos em total sigilo
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Suporte 24/7</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nossa equipe está sempre disponível para ajudar
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Login;
