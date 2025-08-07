'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Phone, User, Lock, Shield, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

// Fallback translations
const t = (key: string) => {
  const translations: Record<string, string> = {
    'auth.createAccount': 'Create Account',
    'auth.joinAGROTM': 'Join the digital agriculture revolution',
    'auth.fullName': 'Full Name',
    'auth.fullNamePlaceholder': 'Enter your full name',
    'auth.email': 'Email',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.phone': 'Phone',
    'auth.phonePlaceholder': '+5511999999999',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.confirmPasswordPlaceholder': 'Confirm your password',
    'auth.createAccount': 'Create Account',
    'auth.creatingAccount': 'Creating account...',
    'auth.verificationCode': 'Verification Code',
    'auth.verificationCodePlaceholder': 'Enter verification code',
    'auth.verifyAccount': 'Verify Account',
    'auth.verifying': 'Verifying...',
    'auth.resendVerification': 'Resend Code',
    'auth.resendIn': 'Resend in',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signIn': 'Sign In',
    'auth.backToRegistration': 'Back to Registration',
    'auth.registrationSuccess': 'Account created successfully! Check your email and phone.',
    'auth.verificationSuccess': 'Account verified successfully!',
    'auth.verificationResent': 'Code resent successfully!',
    'auth.registrationError': 'Error creating account',
    'auth.verificationError': 'Error verifying account',
    'auth.resendError': 'Error resending code',
    'auth.fullNameRequired': 'Full name is required',
    'auth.fullNameMinLength': 'Name must be at least 2 characters',
    'auth.emailRequired': 'Email is required',
    'auth.emailInvalid': 'Invalid email',
    'auth.phoneRequired': 'Phone is required',
    'auth.phoneInvalid': 'Phone must be in international format (+5511999999999)',
    'auth.passwordRequired': 'Password is required',
    'auth.passwordMinLength': 'Password must be at least 8 characters',
    'auth.confirmPasswordRequired': 'Password confirmation is required',
    'auth.passwordsDoNotMatch': 'Passwords do not match',
    'auth.verificationCodeRequired': 'Verification code is required',
    'auth.recaptchaNotice': 'Security validation active',
    'common.backToHome': 'Back to Home'
  };
  return translations[key] || key;
};

export default function CadastroPage() {
  const router = useRouter();
  const { registerWithEmail, sendSMSVerification, verifySMSCode, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    recaptchaToken: 'mock-token' // In production, integrate real reCAPTCHA
  });
  
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationType, setVerificationType] = useState<'email' | 'sms'>('email');
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>('');

  // Clear errors when step changes
  useEffect(() => {
    clearError();
    setErrors({});
    setSuccess('');
  }, [step, clearError]);

  // Countdown timer for resend verification
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('auth.fullNameRequired');
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = t('auth.fullNameMinLength');
    }

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (!formData.phone) {
      newErrors.phone = t('auth.phoneRequired');
    } else if (!/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = t('auth.phoneInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.passwordMinLength');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setErrors({});

    try {
      const result = await registerWithEmail(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone
      );

      if (result.success) {
        setSuccess(t('auth.registrationSuccess'));
        setStep(2);
        setCountdown(60); // 60 seconds countdown
      } else {
        setErrors({ general: result.error || t('auth.registrationError') });
      }
    } catch (error) {
      setErrors({ general: t('auth.networkError') });
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setErrors({ verification: t('auth.verificationCodeRequired') });
      return;
    }

    setErrors({});

    try {
      let result;

      if (verificationType === 'sms') {
        result = await verifySMSCode(verificationCode);
      } else {
        // For email verification, we'll use a different approach
        // This is a placeholder - in a real implementation, you'd verify the email code
        result = { success: true };
      }

      if (result.success) {
        setSuccess(t('auth.verificationSuccess'));
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setErrors({ verification: result.error || t('auth.verificationError') });
      }
    } catch (error) {
      setErrors({ verification: t('auth.networkError') });
    }
  };

  const handleResendVerification = async () => {
    if (countdown > 0) return;

    setErrors({});

    try {
      // For now, we'll simulate resend success
      // In a real implementation, you'd call the resend API
      setSuccess(t('auth.verificationResent'));
      setCountdown(60);
    } catch (error) {
      setErrors({ general: t('auth.networkError') });
    }
  };

  const switchVerificationType = () => {
    setVerificationType(verificationType === 'email' ? 'sms' : 'email');
    setVerificationCode('');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-neon-green hover:text-green-400 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.backToHome')}
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{t('auth.createAccount')}</h1>
          <p className="text-gray-400">{t('auth.joinAGROTM')}</p>
        </div>

        {/* Registration Form */}
        {step === 1 && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-neon-green"
          >
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.fullName')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder={t('auth.fullNamePlaceholder')}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder={t('auth.emailPlaceholder')}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all ${
                    errors.phone ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder={t('auth.phonePlaceholder')}
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder={t('auth.passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* reCAPTCHA Placeholder */}
            <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-neon-green mr-3" />
                <span className="text-gray-300 text-sm">{t('auth.recaptchaNotice')}</span>
              </div>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm flex items-center">
                  <XCircle className="w-4 h-4 mr-2" />
                  {errors.general}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-neon-green to-green-500 text-black font-semibold py-3 px-6 rounded-lg hover:from-green-400 hover:to-neon-green transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  {t('auth.creatingAccount')}
                </div>
              ) : (
                t('auth.createAccount')
              )}
            </button>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link href="/login" className="text-neon-green hover:text-green-400 transition-colors font-medium">
                  {t('auth.signIn')}
                </Link>
              </p>
            </div>
          </motion.form>
        )}

        {/* Verification Step */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-neon-green"
          >
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-neon-green mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">{t('auth.verifyAccount')}</h2>
              <p className="text-gray-400">
                {t('auth.verificationSent')} {verificationType === 'email' ? formData.email : formData.phone}
              </p>
            </div>

            {/* Verification Type Toggle */}
            <div className="mb-6">
              <div className="flex bg-gray-700/50 rounded-lg p-1">
                <button
                  onClick={switchVerificationType}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    verificationType === 'email'
                      ? 'bg-neon-green text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t('auth.email')}
                </button>
                <button
                  onClick={switchVerificationType}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    verificationType === 'sms'
                      ? 'bg-neon-green text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t('auth.sms')}
                </button>
              </div>
            </div>

            {/* Verification Code Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.verificationCode')}
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all text-center text-2xl tracking-widest ${
                  errors.verification ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="000000"
                maxLength={6}
              />
              {errors.verification && (
                <p className="text-red-400 text-sm mt-1 text-center">
                  {errors.verification}
                </p>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-400 text-sm text-center">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  {success}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleVerify}
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-gradient-to-r from-neon-green to-green-500 text-black font-semibold py-3 px-6 rounded-lg hover:from-green-400 hover:to-neon-green transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    {t('auth.verifying')}
                  </div>
                ) : (
                  t('auth.verifyAccount')
                )}
              </button>

              <button
                onClick={handleResendVerification}
                disabled={countdown > 0 || loading}
                className="w-full bg-gray-700/50 text-gray-300 font-medium py-3 px-6 rounded-lg hover:bg-gray-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {countdown > 0
                  ? `${t('auth.resendIn')} ${countdown}s`
                  : t('auth.resendVerification')}
              </button>
            </div>

            {/* Back to Registration */}
            <div className="text-center mt-6">
              <button
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t('auth.backToRegistration')}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
