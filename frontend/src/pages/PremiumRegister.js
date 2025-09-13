import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  User, 
  Mail, 
  FileText,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  Phone,
  Building
} from 'lucide-react';
import validationService from '../services/validationService';
import logger from '../services/logger';

const PremiumRegister = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    documentType: 'cpf',
    document: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    userType: 'producer',
    companyName: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      text: t('register.benefits.security'),
    },
    {
      icon: <Zap className="w-6 h-6" />,
      text: t('register.benefits.performance'),
    },
    {
      icon: <Globe className="w-6 h-6" />,
      text: t('register.benefits.global'),
    },
  ];

  const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulário
    const validation = validationService.validateForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Validar confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: t('register.errors.passwordMismatch') }));
      return;
    }

    // Validar termos
    if (!formData.acceptTerms) {
      setErrors(prev => ({ ...prev, acceptTerms: t('register.errors.termsRequired') }));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você integraria com a API de cadastro
      console.log('Dados do cadastro:', formData);
      
      // Sucesso
      alert(t('register.success.message'));
      
    } catch (error) {
      logger.error('Erro no cadastro', error, { formData: { ...formData, password: '[REDACTED]' } });
      setErrors({ submit: t('register.errors.submit') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="premium-register">
      {/* Hero Section */}
      <section className="premium-hero">
        <div className="premium-container">
          <motion.div
            className="premium-hero-content"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="premium-hero-icon"
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="premium-icon-container">
                <Star className="w-16 h-16" />
              </div>
            </motion.div>

            <motion.h1 className="premium-hero-title" variants={itemVariants}>
              {t('register.title')}
            </motion.h1>
            
            <motion.p className="premium-hero-subtitle" variants={itemVariants}>
              {t('register.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Register Form Section */}
      <section className="premium-register-form">
        <div className="premium-container">
          <motion.div
            className="premium-register-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-register-grid">
              {/* Form */}
              <motion.div
                className="premium-form-container"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="premium-form-card">
                  <div className="premium-form-header">
                    <FileText className="w-8 h-8 premium-form-icon" />
                    <h2 className="premium-form-title">
                      {t('register.form.title')}
                    </h2>
                    <p className="premium-form-subtitle">
                      {t('register.form.subtitle')}
                    </p>
                  </div>

                  {errors.submit && (
                    <motion.div
                      className="premium-form-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-5 h-5 premium-form-error-icon" />
                      <p className="premium-form-error-text">{errors.submit}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="premium-form">
                    {/* Basic Info */}
                    <div className="premium-form-section">
                      <h3 className="premium-form-section-title">
                        {t('register.form.basicInfo')}
                      </h3>
                      
                      <div className="premium-form-row">
                        <div className="premium-form-group">
                          <label className="premium-form-label">
                            {t('register.form.name')} *
                          </label>
                          <div className="premium-form-input-container">
                            <User className="w-5 h-5 premium-form-input-icon" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="premium-form-input"
                              placeholder={t('register.form.namePlaceholder')}
                            />
                          </div>
                          {errors.name && (
                            <p className="premium-form-error-text">{errors.name}</p>
                          )}
                        </div>
                        
                        <div className="premium-form-group">
                          <label className="premium-form-label">
                            {t('register.form.email')} *
                          </label>
                          <div className="premium-form-input-container">
                            <Mail className="w-5 h-5 premium-form-input-icon" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="premium-form-input"
                              placeholder={t('register.form.emailPlaceholder')}
                            />
                          </div>
                          {errors.email && (
                            <p className="premium-form-error-text">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="premium-form-row">
                        <div className="premium-form-group">
                          <label className="premium-form-label">
                            {t('register.form.phone')}
                          </label>
                          <div className="premium-form-input-container">
                            <Phone className="w-5 h-5 premium-form-input-icon" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="premium-form-input"
                              placeholder={t('register.form.phonePlaceholder')}
                            />
                          </div>
                        </div>
                        
                        <div className="premium-form-group">
                          <label className="premium-form-label">
                            {t('register.form.company')}
                          </label>
                          <div className="premium-form-input-container">
                            <Building className="w-5 h-5 premium-form-input-icon" />
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              className="premium-form-input"
                              placeholder={t('register.form.companyPlaceholder')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="premium-form-section">
                      <h3 className="premium-form-section-title">
                        {t('register.form.passwordSection')}
                      </h3>
                      
                      <div className="premium-form-row">
                        <div className="premium-form-group">
                          <label className="premium-form-label">
                            {t('register.form.password')} *
                          </label>
                          <div className="premium-form-input-container">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="premium-form-input"
                              placeholder={t('register.form.passwordPlaceholder')}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="premium-form-password-toggle"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {errors.password && (
                            <div className="premium-form-error-text">
                              {Array.isArray(errors.password) ? (
                                errors.password.map((error, index) => (
                                  <p key={index}>{error}</p>
                                ))
                              ) : (
                                <p>{errors.password}</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="premium-form-group">
                          <label className="premium-form-label">
                            {t('register.form.confirmPassword')} *
                          </label>
                          <div className="premium-form-input-container">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="premium-form-input"
                              placeholder={t('register.form.confirmPasswordPlaceholder')}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="premium-form-password-toggle"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="premium-form-error-text">{errors.confirmPassword}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Terms Section */}
                    <div className="premium-form-section">
                      <div className="premium-form-group">
                        <label className="premium-form-checkbox">
                          <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleInputChange}
                            className="premium-form-checkbox-input"
                          />
                          <span className="premium-form-checkbox-text">
                            {t('register.form.acceptTerms')}{' '}
                            <button type="button" className="premium-form-link">
                              {t('register.form.termsOfUse')}
                            </button>{' '}
                            {t('register.form.and')}{' '}
                            <button type="button" className="premium-form-link">
                              {t('register.form.privacyPolicy')}
                            </button>{' '}
                            {t('register.form.ofAgroSync')} *
                          </span>
                        </label>
                        {errors.acceptTerms && (
                          <p className="premium-form-error-text">{errors.acceptTerms}</p>
                        )}
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="premium-form-submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="premium-form-spinner"></div>
                          {t('register.form.creating')}
                        </>
                      ) : (
                        <>
                          {t('register.form.createAccount')}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="premium-form-footer">
                    <p className="premium-form-footer-text">
                      {t('register.form.haveAccount')}{' '}
                      <Link
                        to="/login"
                        className="premium-form-footer-link"
                      >
                        {t('register.form.login')}
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Benefits Sidebar */}
              <motion.div
                className="premium-register-sidebar"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="premium-sidebar-card">
                  <h3 className="premium-sidebar-title">
                    {t('register.benefits.title')}
                  </h3>
                  <div className="premium-sidebar-benefits">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={benefit.text}
                        className="premium-sidebar-benefit"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ x: 8 }}
                      >
                        <div className="premium-sidebar-benefit-icon">
                          {benefit.icon}
                        </div>
                        <span className="premium-sidebar-benefit-text">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="premium-sidebar-card">
                  <h3 className="premium-sidebar-title">
                    {t('register.security.title')}
                  </h3>
                  <div className="premium-sidebar-security">
                    <div className="premium-sidebar-security-item">
                      <CheckCircle className="w-5 h-5 premium-sidebar-security-icon" />
                      <div className="premium-sidebar-security-info">
                        <p className="premium-sidebar-security-title">
                          {t('register.security.encryption')}
                        </p>
                        <p className="premium-sidebar-security-desc">
                          {t('register.security.encryptionDesc')}
                        </p>
                      </div>
                    </div>
                    <div className="premium-sidebar-security-item">
                      <CheckCircle className="w-5 h-5 premium-sidebar-security-icon" />
                      <div className="premium-sidebar-security-info">
                        <p className="premium-sidebar-security-title">
                          {t('register.security.compliance')}
                        </p>
                        <p className="premium-sidebar-security-desc">
                          {t('register.security.complianceDesc')}
                        </p>
                      </div>
                    </div>
                    <div className="premium-sidebar-security-item">
                      <CheckCircle className="w-5 h-5 premium-sidebar-security-icon" />
                      <div className="premium-sidebar-security-info">
                        <p className="premium-sidebar-security-title">
                          {t('register.security.support')}
                        </p>
                        <p className="premium-sidebar-security-desc">
                          {t('register.security.supportDesc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .premium-register {
          padding-top: 88px; /* Account for fixed header */
        }

        .premium-hero {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-hero);
          position: relative;
          overflow: hidden;
        }

        .premium-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="register-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%2356B8B9" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23register-grain)"/></svg>');
          opacity: 0.6;
        }

        .premium-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .premium-hero-icon {
          margin-bottom: var(--premium-space-xl);
        }

        .premium-icon-container {
          width: 100px;
          height: 100px;
          margin: 0 auto;
          background: var(--premium-gradient-primary);
          border-radius: var(--premium-radius-3xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-xl);
        }

        .premium-hero-title {
          font-size: var(--premium-text-6xl);
          font-weight: var(--premium-font-black);
          background: var(--premium-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--premium-space-lg);
          line-height: var(--premium-leading-tight);
          letter-spacing: -0.04em;
        }

        .premium-hero-subtitle {
          font-size: var(--premium-text-xl);
          color: var(--premium-gray-600);
          line-height: var(--premium-leading-relaxed);
          font-weight: var(--premium-font-medium);
        }

        [data-theme="dark"] .premium-hero-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-register-form {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-white);
        }

        .premium-register-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-register-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--premium-space-4xl);
          align-items: start;
        }

        .premium-form-container {
          display: flex;
          flex-direction: column;
        }

        .premium-form-card {
          background: var(--premium-white);
          border-radius: var(--premium-radius-3xl);
          padding: var(--premium-space-4xl);
          box-shadow: var(--premium-shadow-lg);
          border: 1px solid var(--premium-gray-200);
          position: relative;
          overflow: hidden;
        }

        .premium-form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--premium-gradient-primary);
        }

        .premium-form-header {
          text-align: center;
          margin-bottom: var(--premium-space-3xl);
        }

        .premium-form-icon {
          margin: 0 auto var(--premium-space-lg);
          color: var(--premium-teal);
          filter: drop-shadow(0 4px 8px rgba(86, 184, 185, 0.3));
        }

        .premium-form-title {
          font-size: var(--premium-text-4xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-form-title {
          color: var(--premium-teal);
        }

        .premium-form-subtitle {
          font-size: var(--premium-text-lg);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-form-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-form-error {
          display: flex;
          align-items: center;
          gap: var(--premium-space-sm);
          padding: var(--premium-space-lg);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: var(--premium-radius-lg);
          margin-bottom: var(--premium-space-xl);
        }

        .premium-form-error-icon {
          color: #ef4444;
          flex-shrink: 0;
        }

        .premium-form-error-text {
          color: #ef4444;
          font-size: var(--premium-text-sm);
          font-weight: var(--premium-font-medium);
        }

        .premium-form {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-2xl);
        }

        .premium-form-section {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-xl);
          padding: var(--premium-space-xl);
          background: var(--premium-gray-50);
          border-radius: var(--premium-radius-xl);
          border: 1px solid var(--premium-gray-200);
        }

        .premium-form-section-title {
          font-size: var(--premium-text-xl);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          margin: 0;
          letter-spacing: -0.01em;
        }

        [data-theme="dark"] .premium-form-section-title {
          color: var(--premium-teal);
        }

        .premium-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--premium-space-lg);
        }

        .premium-form-group {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-sm);
        }

        .premium-form-label {
          font-size: var(--premium-text-base);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-petroleum);
        }

        [data-theme="dark"] .premium-form-label {
          color: var(--premium-teal);
        }

        .premium-form-input-container {
          position: relative;
        }

        .premium-form-input-icon {
          position: absolute;
          left: var(--premium-space-lg);
          top: 50%;
          transform: translateY(-50%);
          color: var(--premium-gray-400);
          z-index: 2;
        }

        .premium-form-input {
          width: 100%;
          padding: var(--premium-space-lg) var(--premium-space-lg) var(--premium-space-lg) var(--premium-space-4xl);
          border: 2px solid var(--premium-gray-200);
          border-radius: var(--premium-radius-lg);
          font-size: var(--premium-text-base);
          background: var(--premium-white);
          color: var(--premium-petroleum);
          transition: all var(--premium-transition-fast);
        }

        .premium-form-input:focus {
          outline: none;
          border-color: var(--premium-teal);
          box-shadow: 0 0 0 4px rgba(86, 184, 185, 0.1);
        }

        .premium-form-input::placeholder {
          color: var(--premium-gray-400);
        }

        .premium-form-password-toggle {
          position: absolute;
          right: var(--premium-space-lg);
          top: 50%;
          transform: translateY(-50%);
          color: var(--premium-gray-400);
          background: none;
          border: none;
          cursor: pointer;
          transition: color var(--premium-transition-fast);
        }

        .premium-form-password-toggle:hover {
          color: var(--premium-teal);
        }

        .premium-form-checkbox {
          display: flex;
          align-items: flex-start;
          gap: var(--premium-space-sm);
          cursor: pointer;
        }

        .premium-form-checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: var(--premium-teal);
          margin-top: 2px;
        }

        .premium-form-checkbox-text {
          font-size: var(--premium-text-sm);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-form-checkbox-text {
          color: var(--premium-gray-300);
        }

        .premium-form-link {
          color: var(--premium-teal);
          font-weight: var(--premium-font-semibold);
          text-decoration: none;
          transition: color var(--premium-transition-fast);
        }

        .premium-form-link:hover {
          color: var(--premium-petroleum);
        }

        .premium-form-submit {
          width: 100%;
          padding: var(--premium-space-lg);
          background: var(--premium-gradient-primary);
          color: var(--premium-white);
          border: none;
          border-radius: var(--premium-radius-lg);
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-bold);
          transition: all var(--premium-transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--premium-space-sm);
          cursor: pointer;
          box-shadow: var(--premium-shadow-md);
        }

        .premium-form-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--premium-shadow-lg);
        }

        .premium-form-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .premium-form-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid var(--premium-white);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .premium-form-footer {
          text-align: center;
          margin-top: var(--premium-space-2xl);
          padding-top: var(--premium-space-xl);
          border-top: 1px solid var(--premium-gray-200);
        }

        .premium-form-footer-text {
          font-size: var(--premium-text-sm);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
        }

        [data-theme="dark"] .premium-form-footer-text {
          color: var(--premium-gray-300);
        }

        .premium-form-footer-link {
          color: var(--premium-teal);
          font-weight: var(--premium-font-semibold);
          text-decoration: none;
          transition: color var(--premium-transition-fast);
        }

        .premium-form-footer-link:hover {
          color: var(--premium-petroleum);
        }

        .premium-register-sidebar {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-2xl);
        }

        .premium-sidebar-card {
          background: var(--premium-white);
          border-radius: var(--premium-radius-3xl);
          padding: var(--premium-space-3xl);
          box-shadow: var(--premium-shadow-lg);
          border: 1px solid var(--premium-gray-200);
          position: relative;
          overflow: hidden;
        }

        .premium-sidebar-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--premium-gradient-accent);
        }

        .premium-sidebar-title {
          font-size: var(--premium-text-2xl);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-xl);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-sidebar-title {
          color: var(--premium-teal);
        }

        .premium-sidebar-benefits {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-lg);
        }

        .premium-sidebar-benefit {
          display: flex;
          align-items: center;
          gap: var(--premium-space-md);
          padding: var(--premium-space-md);
          background: var(--premium-gray-50);
          border-radius: var(--premium-radius-lg);
          transition: all var(--premium-transition-fast);
        }

        .premium-sidebar-benefit:hover {
          background: var(--premium-gray-100);
        }

        .premium-sidebar-benefit-icon {
          width: 40px;
          height: 40px;
          background: var(--premium-gradient-primary);
          border-radius: var(--premium-radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          flex-shrink: 0;
        }

        .premium-sidebar-benefit-text {
          font-size: var(--premium-text-base);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-petroleum);
        }

        [data-theme="dark"] .premium-sidebar-benefit-text {
          color: var(--premium-teal);
        }

        .premium-sidebar-security {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-lg);
        }

        .premium-sidebar-security-item {
          display: flex;
          align-items: flex-start;
          gap: var(--premium-space-md);
          padding: var(--premium-space-md);
          background: var(--premium-gray-50);
          border-radius: var(--premium-radius-lg);
        }

        .premium-sidebar-security-icon {
          color: var(--premium-teal);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .premium-sidebar-security-info {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-xs);
        }

        .premium-sidebar-security-title {
          font-size: var(--premium-text-base);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-petroleum);
          margin: 0;
        }

        [data-theme="dark"] .premium-sidebar-security-title {
          color: var(--premium-teal);
        }

        .premium-sidebar-security-desc {
          font-size: var(--premium-text-sm);
          color: var(--premium-gray-600);
          margin: 0;
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-sidebar-security-desc {
          color: var(--premium-gray-300);
        }

        @media (max-width: 768px) {
          .premium-hero-title {
            font-size: var(--premium-text-5xl);
          }

          .premium-register-grid {
            grid-template-columns: 1fr;
            gap: var(--premium-space-2xl);
          }

          .premium-form-row {
            grid-template-columns: 1fr;
          }

          .premium-form-title {
            font-size: var(--premium-text-3xl);
          }
        }

        @media (max-width: 480px) {
          .premium-hero-title {
            font-size: var(--premium-text-4xl);
          }

          .premium-form-title {
            font-size: var(--premium-text-2xl);
          }

          .premium-hero-subtitle {
            font-size: var(--premium-text-lg);
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumRegister;
