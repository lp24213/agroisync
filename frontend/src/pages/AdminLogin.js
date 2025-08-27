import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { loginAdmin, loading, error, clearError } = useAuth();

  useEffect(() => {
    document.title = 'Admin Login - AgroSync';
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    clearError();

    if (!email || !password) {
      return;
    }

    const result = await loginAdmin(email, password);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        navigate('/admin/secure-panel');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-agro-green-500 via-agro-yellow-500 to-web3-neon-blue"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-agro-green-600 to-web3-neon-blue rounded-full opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-agro-yellow-500 to-web3-neon-blue rounded-full opacity-10 blur-xl animate-pulse"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 bg-gradient-to-r from-agro-green-600 via-agro-yellow-500 to-web3-neon-blue rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          <h2 className="mt-6 text-4xl font-bold title-premium">
            Painel Administrativo
          </h2>
          <p className="mt-2 text-lg text-slate-300">
            Acesso exclusivo para administradores
          </p>
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email Administrativo
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                placeholder="luispaulodeoliveira@agrotm.com.br"
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white/20 border border-white/30 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-agro-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-200 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-200 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Mensagens de erro/sucesso */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
              >
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="text-sm text-red-200">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg"
              >
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="text-sm text-emerald-200">{success}</span>
              </motion.div>
            )}

            {/* Botão de login */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-agro-green-600 via-agro-yellow-500 to-web3-neon-blue hover:from-agro-green-700 hover:via-agro-yellow-600 hover:to-web3-neon-cyan focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agro-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Acessando...</span>
                </div>
              ) : (
                'Acessar Painel Admin'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Acesso restrito apenas para administradores autorizados
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/')}
            className="text-agro-green-400 hover:text-agro-green-300 text-sm transition-colors duration-200 hover:underline"
          >
            ← Voltar ao site principal
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
