'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Globe,
  Check,
  AlertCircle
} from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase/config';
import { toast } from 'react-hot-toast';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [language, setLanguage] = useState('pt');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const router = useRouter();
  const { t, i18n } = useTranslation();

  // Initialize language
  useEffect(() => {
    const savedLanguage = localStorage.getItem('agrotm-language') || 'pt';
    setLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('agrotm-language', newLanguage);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }

    // Password validation (for login and register)
    if (activeTab !== 'reset') {
      if (!formData.password) {
        newErrors.password = t('auth.errors.passwordRequired');
      } else if (formData.password.length < 6) {
        newErrors.password = t('auth.errors.passwordMinLength');
      }
    }

    // Register-specific validations
    if (activeTab === 'register') {
      if (!formData.name) {
        newErrors.name = t('auth.errors.nameRequired');
      }
      
      if (!formData.phone) {
        newErrors.phone = t('auth.errors.phoneRequired');
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.errors.confirmPasswordRequired');
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.errors.passwordsMismatch');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      if (activeTab === 'login') {
        // Login with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success('Login realizado com sucesso!');
        router.push('/dashboard');
        
      } else if (activeTab === 'register') {
        // Register with Firebase Auth
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
        
      } else if (activeTab === 'reset') {
        // Send password reset email
        await sendPasswordResetEmail(auth, formData.email);
        setSuccess(true);
        toast.success(t('auth.resetPassword.success'));
      }
      
    } catch (error) {
      console.error('Auth error:', error);
      
      let errorMessage = 'Erro inesperado. Tente novamente.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
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

  // Animation variants
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

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (success && activeTab === 'reset') {
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
            <Image
              src="/assets/images/logo/agrotm-logo-white.svg"
              alt="AGROTM Logo"
              width={120}
              height={120}
              className="mx-auto mb-4"
              priority
            />
            <div className="w-16 h-16 bg-premium-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-premium-neon-green" />
            </div>
            <h1 className="text-3xl font-orbitron font-bold bg-gradient-to-r from-premium-neon-blue to-premium-neon-green bg-clip-text text-transparent">
              Email Enviado!
            </h1>
            <p className="text-gray-400 mt-2 font-orbitron">
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
            
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-gradient-to-r from-premium-neon-blue to-premium-neon-green text-black font-orbitron font-medium py-3 px-6 rounded-xl hover:shadow-neon-green transition-all duration-300"
            >
              {t('auth.resetPassword.backToLogin')}
            </button>
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
        className="relative w-full max-w-lg"
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
            AGROTM
          </h1>
        </motion.div>

        {/* Auth Container */}
        <motion.div
          variants={itemVariants}
          className="bg-premium-black/50 backdrop-blur-xl border border-premium-neon-blue/20 rounded-2xl shadow-2xl shadow-premium-neon-blue/10 overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-premium-neon-blue/20">
            {['login', 'register', 'reset'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-orbitron font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-premium-neon-blue/10 text-premium-neon-blue border-b-2 border-premium-neon-blue'
                    : 'text-gray-400 hover:text-premium-neon-blue hover:bg-premium-neon-blue/5'
                }`}
              >
                {t(`auth.tabs.${tab}`)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {/* Tab Title */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-orbitron font-bold text-white mb-2">
                    {t(`auth.${activeTab}.title`)}
                  </h2>
                  <p className="text-gray-400 font-orbitron">
                    {t(`auth.${activeTab}.subtitle`)}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name field (register only) */}
                  {activeTab === 'register' && (
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
                  )}

                  {/* Email field */}
                  <div>
                    <label className="block text-premium-neon-blue font-orbitron font-medium mb-2">
                      {t(`auth.${activeTab}.email`)}
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

                  {/* Phone field (register only) */}
                  {activeTab === 'register' && (
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
                  )}

                  {/* Password field (login and register) */}
                  {activeTab !== 'reset' && (
                    <div>
                      <label className="block text-premium-neon-blue font-orbitron font-medium mb-2">
                        {t(`auth.${activeTab}.password`)}
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
                  )}

                  {/* Confirm Password field (register only) */}
                  {activeTab === 'register' && (
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
                  )}

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
                        {t(`auth.${activeTab}.loading`)}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {t(`auth.${activeTab}.submit`)}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    )}
                  </button>

                  {/* Additional Links */}
                  {activeTab === 'login' && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('reset')}
                        className="text-premium-neon-blue hover:text-premium-neon-green font-orbitron text-sm transition-colors"
                      >
                        {t('auth.login.forgotPassword')}
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            </AnimatePresence>
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

export default AuthPage;
