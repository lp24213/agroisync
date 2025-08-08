'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Globe, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/config';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  const [language, setLanguage] = useState('pt');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const router = useRouter();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('agrotm-language') || 'pt';
    setLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('agrotm-language', newLanguage);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = t('auth.errors.nameRequired');
    }

    if (!formData.email) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }

    if (!formData.phone) {
      newErrors.phone = t('auth.errors.phoneRequired');
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.errors.passwordMinLength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordsMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        createdAt: new Date().toISOString(),
        language: language
      });
      
      toast.success('Conta criada com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Register error:', error);
      
      let errorMessage = 'Erro inesperado. Tente novamente.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Operação não permitida.';
          break;
        default:
          errorMessage = error.message || 'Erro inesperado. Tente novamente.';
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
        {/* Language Selector */}
        <motion.div variants={itemVariants} className="flex justify-end mb-6">
          <div className="flex items-center bg-premium-black/50 backdrop-blur-xl border border-premium-neon-blue/20 rounded-xl p-1">
            <Globe className="w-4 h-4 text-premium-neon-blue mr-2 ml-2" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent text-premium-neon-blue font-orbitron text-sm focus:outline-none cursor-pointer"
            >
              <option value="pt">🇧🇷 PT</option>
              <option value="en">🇺🇸 EN</option>
              <option value="es">🇪🇸 ES</option>
              <option value="zh">🇨🇳 ZH</option>
            </select>
          </div>
        </motion.div>

        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Image
            src="/assets/images/logo/agrotm-logo-white.svg"
            alt="AGROTM Logo"
            width={120}
            height={120}
            className="mx-auto mb-4"
            priority
          />
          <h1 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-premium-neon-blue to-premium-neon-green bg-clip-text text-transparent">
            {t('auth.register.title')}
          </h1>
          <p className="text-gray-400 mt-2 font-orbitron">{t('auth.register.subtitle')}</p>
        </motion.div>

        {/* Register Form */}
        <motion.div
          variants={itemVariants}
          className="bg-premium-black/50 backdrop-blur-xl border border-premium-neon-blue/20 rounded-2xl p-8 shadow-2xl shadow-premium-neon-blue/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field */}
            <div>
              <label className="block text-premium-neon-blue font-orbitron font-medium mb-2">
                {t('auth.register.name')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-premium-black/30 border border-premium-neon-blue/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-premium-neon-blue transition-colors font-orbitron"
                  placeholder="Seu nome completo"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm mt-1 font-orbitron">{errors.name}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className="block text-premium-neon-blue font-orbitron font-medium mb-2">
                {t('auth.register.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-premium-black/30 border border-premium-neon-blue/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-premium-neon-blue transition-colors font-orbitron"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 font-orbitron">{errors.email}</p>
              )}
            </div>

            {/* Phone field */}
            <div>
              <label className="block text-premium-neon-blue font-orbitron font-medium mb-2">
                {t('auth.register.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-premium-black/30 border border-premium-neon-blue/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-premium-neon-blue transition-colors font-orbitron"
                  placeholder="(11) 99999-9999"
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1 font-orbitron">{errors.phone}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-premium-neon-blue font-orbitron font-medium mb-2">
                {t('auth.register.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full bg-premium-black/30 border border-premium-neon-blue/20 rounded-xl pl-11 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-premium-neon-blue transition-colors font-orbitron"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-premium-neon-green transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 font-orbitron">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label className="block text-premium-neon-blue font-orbitron font-medium mb-2">
                {t('auth.register.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full bg-premium-black/30 border border-premium-neon-blue/20 rounded-xl pl-11 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-premium-neon-blue transition-colors font-orbitron"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-premium-neon-green transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1 font-orbitron">{errors.confirmPassword}</p>
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
                  {t('auth.register.loading')}
                </div>
              ) : (
                <div className="flex items-center">
                  {t('auth.register.submit')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-premium-neon-blue/20">
            <p className="text-gray-400 font-orbitron">
              {t('auth.register.hasAccount')}{' '}
              <Link
                href="/login"
                className="text-premium-neon-blue hover:text-premium-neon-green font-medium transition-colors"
              >
                {t('auth.register.login')}
              </Link>
            </p>
          </div>
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
};

export default RegisterPage;
