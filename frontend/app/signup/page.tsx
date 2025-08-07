'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from 'lucide-react';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Logo } from '@/components/ui/Logo';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { signUp } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
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
      const result = await signUp(email, password, fullName, phone);
      
      if (result.success) {
        toast.success('Conta criada com sucesso!');
        router.push('/dashboard');
      } else {
        setErrors({ general: result.error || 'Erro ao criar conta' });
        toast.error(result.error || 'Erro ao criar conta');
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
            {t('auth.signup.title')}
          </h1>
          <p className="text-gray-400 mt-2 font-orbitron">{t('auth.signup.subtitle')}</p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          variants={itemVariants}
          className="bg-premium-black/50 backdrop-blur-xl border border-premium-neon-blue/20 rounded-2xl p-8 shadow-2xl shadow-premium-neon-blue/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthInput
              label={t('auth.signup.fullName')}
              type="text"
              placeholder="Seu nome completo"
              value={fullName}
              onChange={setFullName}
              error={errors.fullName}
              required
              icon={<User size={20} />}
            />

            <AuthInput
              label={t('auth.signup.email')}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={setEmail}
              error={errors.email}
              required
              icon={<Mail size={20} />}
            />

            <AuthInput
              label={t('auth.signup.phone')}
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={setPhone}
              error={errors.phone}
              required
              icon={<Phone size={20} />}
            />

            <div className="relative">
              <AuthInput
                ref={passwordRef}
                label={t('auth.signup.password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                value={password}
                onChange={setPassword}
                error={errors.password}
                required
                icon={<Lock size={20} />}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-premium-neon-green transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <AuthInput
                ref={confirmPasswordRef}
                label={t('auth.signup.confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={errors.confirmPassword}
                required
                icon={<Lock size={20} />}
              />
              
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-premium-neon-green transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

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
              {loading ? t('auth.signup.loading') : t('auth.signup.submit')}
            </AuthButton>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-premium-neon-blue/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-premium-black/50 text-gray-400 font-orbitron">{t('auth.signup.or')}</span>
            </div>
          </div>

          {/* Login Link */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-gray-400 font-orbitron">
              {t('auth.signup.hasAccount')}{' '}
              <Link
                href="/login"
                className="text-premium-neon-blue hover:text-premium-neon-green font-medium transition-colors"
              >
                {t('auth.signup.login')}
              </Link>
            </p>
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
