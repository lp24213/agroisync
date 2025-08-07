'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Logo } from '@/components/ui/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { resetPassword } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setSuccess(true);
        toast.success(t('auth.forgotPassword.success'));
      } else {
        setErrors({ general: result.error || 'Erro ao enviar email de recuperação' });
        toast.error(result.error || 'Erro ao enviar email de recuperação');
      }
    } catch (error) {
      setErrors({ general: 'Erro inesperado. Tente novamente.' });
      toast.error('Erro inesperado. Tente novamente.');
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
          className="relative w-full max-w-md"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <Logo size="lg" />
            </Link>
            <div className="w-16 h-16 bg-premium-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-premium-neon-green" />
            </div>
            <h1 className="text-3xl font-orbitron font-bold bg-gradient-to-r from-premium-neon-blue to-premium-neon-green bg-clip-text text-transparent">
              Email Enviado!
            </h1>
            <p className="text-gray-400 mt-2 font-orbitron">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
          </motion.div>

          {/* Success Message */}
          <motion.div
            variants={itemVariants}
            className="bg-premium-black/50 backdrop-blur-xl border border-premium-neon-green/20 rounded-2xl p-8 shadow-2xl shadow-premium-neon-green/10 text-center"
          >
            <p className="text-gray-300 font-orbitron mb-6">
              Enviamos um link de recuperação para <strong className="text-premium-neon-green">{email}</strong>
            </p>
            
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-premium-neon-blue to-premium-neon-green text-black font-orbitron font-medium rounded-xl hover:shadow-neon-green transition-all duration-300"
            >
              <ArrowLeft size={20} className="mr-2" />
              {t('auth.forgotPassword.backToLogin')}
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
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Logo size="lg" />
          </Link>
          <h1 className="text-3xl font-orbitron font-bold bg-gradient-to-r from-premium-neon-blue to-premium-neon-green bg-clip-text text-transparent">
            {t('auth.forgotPassword.title')}
          </h1>
          <p className="text-gray-400 mt-2 font-orbitron">{t('auth.forgotPassword.subtitle')}</p>
        </motion.div>

        {/* Forgot Password Form */}
        <motion.div
          variants={itemVariants}
          className="bg-premium-black/50 backdrop-blur-xl border border-premium-neon-blue/20 rounded-2xl p-8 shadow-2xl shadow-premium-neon-blue/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthInput
              label={t('auth.forgotPassword.email')}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={setEmail}
              error={errors.email}
              required
              icon={<Mail size={20} />}
            />

            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                <p className="text-red-400 text-sm font-orbitron">{errors.general}</p>
              </motion.div>
            )}

            <AuthButton
              type="submit"
              loading={loading}
              fullWidth
              icon={<ArrowRight size={20} />}
            >
              {loading ? t('auth.forgotPassword.loading') : t('auth.forgotPassword.submit')}
            </AuthButton>
          </form>

          {/* Back to Login */}
          <motion.div variants={itemVariants} className="text-center mt-6">
            <Link
              href="/login"
              className="inline-flex items-center text-premium-neon-blue hover:text-premium-neon-green transition-colors font-orbitron"
            >
              <ArrowLeft size={16} className="mr-2" />
              {t('auth.forgotPassword.backToLogin')}
            </Link>
          </motion.div>
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
