import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useTranslation();

  // Verificar se é tentativa de login admin
  useEffect(() => {
    if (email === 'luispaulodeoliveira@agrotm.com.br') {
      setIsAdminLogin(true);
    } else {
      setIsAdminLogin(false);
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        setSuccess('Login realizado com sucesso!');
        
        // Redirecionamento baseado no tipo de usuário
        if (result.isAdmin) {
          // Admin vai para /admin
          setTimeout(() => {
            navigate('/admin');
          }, 1000);
        } else {
          // Usuário comum vai para dashboard ou área específica
          const from = location.state?.from || '/dashboard';
          setTimeout(() => {
            navigate(from);
          }, 1000);
        }
      } else {
        setError(result.message || 'Erro no login');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setEmail('luispaulodeoliveira@agrotm.com.br');
    setPassword('Th@ys15221008');
    setIsAdminLogin(true);
  };

  const handleUserLogin = () => {
    setEmail('');
    setPassword('');
    setIsAdminLogin(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">A</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
            {isAdminLogin ? 'Admin Login' : 'Login'}
          </h2>
          <p className="text-neutral-400">
            {isAdminLogin 
              ? 'Acesso administrativo ao sistema AgroSync'
              : 'Acesse sua conta AgroSync'
            }
          </p>
        </div>

        {/* Tabs de tipo de login */}
        <div className="flex bg-neutral-800 rounded-lg p-1">
          <button
            onClick={handleUserLogin}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              !isAdminLogin
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            👤 Usuário Comum
          </button>
          <button
            onClick={handleAdminLogin}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              isAdminLogin
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            👑 Admin
          </button>
        </div>

        {/* Formulário de Login */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder={isAdminLogin ? 'luispaulodeoliveira@agrotm.com.br' : 'seu@email.com'}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-neutral-400 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mensagens de erro/sucesso */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Entrando...</span>
              </div>
            ) : (
              <span>Entrar</span>
            )}
          </button>

          {/* Informações adicionais */}
          <div className="text-center space-y-4">
            {isAdminLogin && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">🔐 Acesso Administrativo</h3>
                <p className="text-sm text-purple-300">
                  Credenciais fixas para administradores do sistema AgroSync
                </p>
                <div className="mt-2 text-xs text-purple-400">
                  <p>Email: luispaulodeoliveira@agrotm.com.br</p>
                  <p>Senha: Th@ys15221008</p>
                </div>
              </div>
            )}

            {!isAdminLogin && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h3 className="font-semibold text-green-400 mb-2">💡 Painel Secreto</h3>
                <p className="text-sm text-green-300">
                  Após o login, você terá acesso ao seu painel secreto na área Loja ou AgroConecta
                </p>
                <div className="mt-2 text-xs text-green-400">
                  <p>• Controle de anúncios/produtos</p>
                  <p>• Caixa de mensagens pessoal</p>
                  <p>• Histórico de atividades</p>
                  <p>• Dados pessoais</p>
                </div>
              </div>
            )}

            <div className="text-sm text-neutral-400">
              <p>Não tem uma conta? </p>
              <a 
                href="/cadastro" 
                className="text-green-400 hover:text-green-300 transition-colors font-medium"
              >
                Cadastre-se aqui
              </a>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
