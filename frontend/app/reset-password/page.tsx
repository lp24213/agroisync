'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase/config';
import { toast } from 'react-hot-toast';
import { Logo } from '../../components/ui/Logo';
import { LanguageSelector } from '../../components/ui/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setSuccess(true);
      toast.success(t('auth.resetPassword.success'));
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      let errorMessage = 'Erro inesperado. Tente novamente.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = t('auth.errors.userNotFound');
          break;
        case 'auth/invalid-email':
          errorMessage = t('auth.errors.emailInvalid');
          break;
        case 'auth/too-many-requests':
          errorMessage = t('auth.errors.tooManyRequests');
          break;
        case 'auth/network-request-failed':
          errorMessage = t('auth.errors.networkError');
          break;
        default:
          errorMessage = t('auth.errors.unknown');
      }
      
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-premium-black via-black to-premium-black flex items-center justify-center p-4">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-premium-neon-blue rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-premium-neon-green rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-premium-neon-purple rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-md text-center"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="mb-6">
              <Logo size="lg" className="justify-center" />
            </div>
            <div className="w-16 h-16 bg-premium-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-premium-neon-green" />
            </div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-2">
              Email Enviado!
            </h1>
            <p className="text-gray-400 font-orbitron">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-premium-black/50 backdrop-blur-xl border border-premium-neon-green/20 rounded-2xl p-8 shadow-2xl shadow-premium-neon-green/10"
          >
            <p className="text-gray-300 font-orbitron mb-6">
              Enviamos um link de recuperação para <strong className="text-premium-neon-green">{formData.email}</strong>
            </p>
            
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-premium-neon-blue to-premium-neon-green text-black font-orbitron font-medium py-3 px-6 rounded-xl hover:shadow-neon-green transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('auth.resetPassword.backToLogin')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-black via-black to-premium-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-premium-neon-blue rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-premium-neon-green rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-premium-neon-purple rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        {/* Language Selector & Back Button */}
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
          <Link
            href="/login"
            className="flex items-center gap-2 text-premium-neon-blue hover:text-premium-neon-green transition-colors font-orbitron"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('auth.resetPassword.backToLogin')}
          </Link>
          <LanguageSelector />
        </motion.div>

        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="mb-6">
            <Logo size="lg" className="justify-center" />
          </div>
          <h1 className="text-3xl font-orbitron font-bold text-white mb-2">
            {t('auth.resetPassword.title')}
          </h1>
          <p className="text-gray-400 font-orbitron">{t('auth.resetPassword.subtitle')}</p>
        </motion.div>

        {/* Reset Password Form */}
        <motion.div
          variants={itemVariants}
          className="bg-premium-black/50 backdrop-blur-xl border border-premium-neon-blue/20 rounded-2xl p-8 shadow-2xl shadow-premium-neon-blue/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <label className="block text-premium-neon-blue font-orbitron font-medium mb-2">
                {t('auth.resetPassword.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-premium-black/30 border border-premium-neon-blue/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-premium-neon-blue transition-colors font-orbitron"
                  placeholder={t('auth.resetPassword.emailPlaceholder')}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 font-orbitron">{errors.email}</p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-400 text-sm font-orbitron">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-premium-neon-blue to-premium-neon-green text-black font-orbitron font-medium py-3 px-6 rounded-xl hover:shadow-neon-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                  {t('auth.resetPassword.loading')}
                </div>
              ) : (
                <div className="flex items-center">
                  {t('auth.resetPassword.submit')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="text-center mt-6">
          <p className="text-gray-500 text-sm font-orbitron">
            © 2024 AGROTM. Todos os direitos reservados.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
