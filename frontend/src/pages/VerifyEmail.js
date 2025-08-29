import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const VerifyEmail = () => {
  const { verifyEmail, resendVerification, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [success, setSuccess] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [token, setToken] = useState('');

  useEffect(() => {
    document.title = 'Verificar Email - AgroSync';
    clearError();
    
    // Extrair token da URL
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      // Verificar automaticamente
      handleVerifyEmail(tokenFromUrl);
    }
  }, [clearError, searchParams]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerifyEmail = async (emailToken) => {
    setSuccess('');
    clearError();

    const result = await verifyEmail(emailToken);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  const handleResendVerification = async () => {
    setVerificationSent(false);
    clearError();

    // Para reenviar, precisamos do email do usuário
    // Em uma implementação real, você pode armazenar o email temporariamente
    // ou pedir para o usuário digitar novamente
    const email = localStorage.getItem('pendingVerificationEmail');
    
    if (!email) {
      // Se não há email, redirecionar para cadastro
      navigate('/cadastro');
      return;
    }

    const result = await resendVerification(email);
    
    if (result.success) {
      setVerificationSent(true);
      setCountdown(60); // 60 segundos de espera
    }
  };

  const canResend = countdown === 0;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-md w-full space-y-8">
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
              className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gradient-agro">
            Verificar Email
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Confirme seu endereço de email para ativar sua conta
          </p>
        </motion.div>

        {/* Conteúdo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-card border border-slate-200 p-8"
        >
          {/* Status da verificação */}
          {token ? (
            <div className="text-center space-y-6">
              {loading ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
                  <p className="text-slate-600">Verificando seu email...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">Verificação Falhou</h3>
                    <p className="text-sm text-slate-600">{error}</p>
                  </div>
                </div>
              ) : success ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">Email Verificado!</h3>
                    <p className="text-sm text-slate-600">{success}</p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">Verificação Necessária</h3>
                <p className="text-sm text-slate-600">
                  Para acessar sua conta, você precisa verificar seu endereço de email.
                </p>
              </div>
            </div>
          )}

          {/* Mensagens de erro/sucesso */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
            >
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="text-sm text-emerald-700">{success}</span>
            </motion.div>
          )}

          {/* Reenviar verificação */}
          {!success && (
            <div className="mt-6 text-center">
              {verificationSent ? (
                <div className="text-sm text-slate-600">
                  Email enviado! Aguarde {countdown}s para reenviar
                </div>
              ) : (
                <button
                  onClick={handleResendVerification}
                  disabled={!canResend}
                  className="text-sm text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reenviar email de verificação</span>
                </button>
              )}
            </div>
          )}

          {/* Informações importantes */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2 flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Verificação por Email</span>
            </h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• O link expira em 24 horas</li>
              <li>• Verifique sua pasta de spam</li>
              <li>• Clique no link para verificar</li>
              <li>• Após verificar, faça login normalmente</li>
            </ul>
          </div>

          {/* Botões de ação */}
          <div className="mt-6 space-y-3">
            {success ? (
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
              >
                Ir para o Login
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
                >
                  Já tenho uma conta
                </Link>
                <Link
                  to="/cadastro"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
                >
                  Criar nova conta
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-xs text-slate-500">
            Problemas com verificação? Entre em contato com o suporte
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
