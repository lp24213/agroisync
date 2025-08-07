'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Wallet, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { loginWithEmail, loginWithMetamask, loading, error, clearError } = useAuth();
  
  const [loginMethod, setLoginMethod] = useState<'email' | 'metamask'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>('');

  // Clear errors when login method changes
  useEffect(() => {
    clearError();
    setErrors({});
    setSuccess('');
  }, [loginMethod, clearError]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (loginMethod === 'email') {
      if (!formData.email) {
        newErrors.email = t('auth.emailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('auth.emailInvalid');
      }

      if (!formData.password) {
        newErrors.password = t('auth.passwordRequired');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setErrors({});

    try {
      const result = await loginWithEmail(formData.email, formData.password);

      if (result.success) {
        setSuccess(t('auth.loginSuccess'));
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setErrors({ general: result.error || t('auth.loginError') });
      }
    } catch (error) {
      setErrors({ general: t('auth.networkError') });
    }
  };

  const handleMetamaskLogin = async () => {
    setErrors({});

    try {
      const result = await loginWithMetamask();

      if (result.success) {
        setSuccess(t('auth.metamaskLoginSuccess'));
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setErrors({ metamask: result.error || t('auth.metamaskLoginError') });
      }
    } catch (error) {
      console.error('Metamask login error:', error);
      setErrors({ metamask: t('auth.metamaskLoginError') });
    }
  };

  const handleForgotPassword = () => {
    // In production, implement forgot password flow
    setErrors({ general: t('auth.forgotPasswordNotImplemented') });
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
          <h1 className="text-3xl font-bold text-white mb-2">{t('auth.welcomeBack')}</h1>
          <p className="text-gray-400">{t('auth.signInToAGROTM')}</p>
        </div>

        {/* Login Method Toggle */}
        <div className="mb-6">
          <div className="flex bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-neon-green text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('auth.email')}
            </button>
            <button
              onClick={() => setLoginMethod('metamask')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'metamask'
                  ? 'bg-neon-green text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('auth.metamask')}
            </button>
          </div>
        </div>

        {/* Email/Password Login */}
        {loginMethod === 'email' && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleEmailLogin}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-neon-green"
          >
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-neon-green bg-gray-700 border-gray-600 rounded focus:ring-neon-green focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">{t('auth.rememberMe')}</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-neon-green hover:text-green-400 transition-colors"
              >
                {t('auth.forgotPassword')}
              </button>
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

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-400 text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {success}
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
                  {t('auth.signingIn')}
                </div>
            ) : (
                t('auth.signIn')
              )}
            </button>
          </motion.form>
        )}

        {/* Metamask Login */}
        {loginMethod === 'metamask' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-neon-green"
          >
            <div className="text-center mb-6">
              <Wallet className="w-16 h-16 text-neon-green mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">{t('auth.connectMetamask')}</h2>
              <p className="text-gray-400">{t('auth.metamaskDescription')}</p>
            </div>

            {/* Metamask Error */}
            {errors.metamask && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm flex items-center">
                  <XCircle className="w-4 h-4 mr-2" />
                  {errors.metamask}
                </p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-400 text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {success}
                </p>
              </div>
            )}

            {/* Connect Button */}
            <button
              onClick={handleMetamaskLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold py-3 px-6 rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  {t('auth.connecting')}
                </div>
              ) : (
                <>
                  <Wallet className="w-5 h-5 mr-2" />
                  {t('auth.connectMetamask')}
                </>
              )}
            </button>

            {/* Metamask Info */}
            <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2">{t('auth.metamaskInfo')}</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• {t('auth.metamaskInfo1')}</li>
                <li>• {t('auth.metamaskInfo2')}</li>
                <li>• {t('auth.metamaskInfo3')}</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Registration Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            {t('auth.dontHaveAccount')}{' '}
            <Link href="/cadastro" className="text-neon-green hover:text-green-400 transition-colors font-medium">
              {t('auth.createAccount')}
            </Link>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 space-y-3">
          <Link
            href="/marketplace"
            className="block w-full bg-gray-700/50 text-gray-300 font-medium py-3 px-6 rounded-lg hover:bg-gray-600/50 transition-all text-center"
          >
            {t('auth.browseMarketplace')}
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-700/50 text-gray-300 font-medium py-3 px-6 rounded-lg hover:bg-gray-600/50 transition-all text-center"
          >
            {t('auth.backToHome')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
