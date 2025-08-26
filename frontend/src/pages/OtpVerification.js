import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone, ArrowLeft, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const OtpVerification = () => {
  const { verify2FA, sendOTP, loading, error, clearError, userId } = useAuth();
  const navigate = useNavigate();
  
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    document.title = 'Verificação 2FA - AgroSync';
    clearError();
    
    // Se não há userId, redirecionar para login
    if (!userId) {
      navigate('/login');
    }
  }, [clearError, userId, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otpCode];
      newOtp[index] = value;
      setOtpCode(newOtp);

      // Auto-focus no próximo campo
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Voltar para o campo anterior ao pressionar backspace
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    clearError();

    const code = otpCode.join('');
    if (code.length !== 6) {
      return;
    }

    const result = await verify2FA(code);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  const handleSendOTP = async () => {
    setOtpSent(false);
    clearError();

    const result = await sendOTP();
    
    if (result.success) {
      setOtpSent(true);
      setCountdown(60); // 60 segundos de espera
    }
  };

  const canResend = countdown === 0;

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🔐</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-slate-900">
            Verificação 2FA
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Digite o código de 6 dígitos enviado para seu telefone
          </p>
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-card border border-slate-200 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Código OTP */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4 text-center">
                Código de Verificação
              </label>
              <div className="flex justify-center space-x-2">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200"
                    placeholder="•"
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500 text-center">
                Digite o código de 6 dígitos
              </p>
            </div>

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

            {/* Botão de verificação */}
            <button
              type="submit"
              disabled={loading || otpCode.join('').length !== 6}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                'Verificar Código'
              )}
            </button>
          </form>

          {/* Reenviar OTP */}
          <div className="mt-6 text-center">
            {otpSent ? (
              <div className="text-sm text-slate-600">
                Código enviado! Aguarde {countdown}s para reenviar
              </div>
            ) : (
              <button
                onClick={handleSendOTP}
                disabled={!canResend}
                className="text-sm text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reenviar código</span>
              </button>
            )}
          </div>

          {/* Informações importantes */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2 flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>Verificação por SMS</span>
            </h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• O código expira em 5 minutos</li>
              <li>• Verifique se o número está correto</li>
              <li>• Aguarde alguns segundos para receber</li>
              <li>• Verifique sua pasta de spam</li>
            </ul>
          </div>

          {/* Botão de voltar */}
          <div className="mt-6">
            <Link
              to="/login"
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para o Login</span>
            </Link>
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
            Problemas com 2FA? Entre em contato com o suporte
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OtpVerification;
