import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, Mail, ArrowLeft } from 'lucide-react';
import adminService from '../services/adminService';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    if (!formData.password) {
      setError('Por favor, insira a senha.');
      return;
    }

    // Verificar credenciais fixas
    if (formData.email !== 'luispaulodeoliveira@agrotm.com.br' || formData.password !== 'Th@ys15221008') {
      setError('Credenciais inválidas.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Login admin via serviço
      const result = await adminService.adminLogin(formData.email, formData.password);
      
      if (result.success) {
        setSuccess('Login administrativo realizado com sucesso!');
        // Salvar token admin
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminEmail', formData.email);
        
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        setError(result.error || 'Erro ao fazer login administrativo.');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black">
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
            className="mx-auto h-20 w-20 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full flex items-center justify-center mb-6 shadow-2xl"
          >
            <Shield className="h-10 w-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            Painel Administrativo
          </h2>
          
          <p className="text-gray-300 text-sm">
            Acesso restrito a administradores autorizados
          </p>
        </motion.div>

        {/* Formulário de Login Admin */}
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            {/* Email (fixo) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Administrativo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-lg bg-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Digite o email administrativo"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Senha Administrativa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-slate-600 rounded-lg bg-slate-800 text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Digite a senha administrativa"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mensagens de erro/sucesso */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm"
            >
              {success}
            </motion.div>
          )}

          {/* Botão de Login */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Autenticando...
              </div>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Acessar Painel Admin
              </>
            )}
          </motion.button>

          {/* Botão Voltar */}
          <motion.button
            type="button"
            onClick={handleBackToMain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex justify-center py-2 px-4 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Site Principal
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-xs text-slate-500">
            Sistema de Administração AgroSync v2.0
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Acesso restrito e monitorado
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
