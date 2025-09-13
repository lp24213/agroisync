import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock, 
  User, 
  Building, 
  CheckCircle,
  MessageSquare,
  ArrowRight,
  Star,
  Globe,
  Shield
} from 'lucide-react';

const PremiumContact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subjects = [
    t('contact.subjects.support'),
    t('contact.subjects.sales'),
    t('contact.subjects.partnerships'),
    t('contact.subjects.feedback'),
    t('contact.subjects.other'),
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: t('contact.info.email'),
      details: ['contato@agrosync.com', 'suporte@agrosync.com'],
      description: t('contact.info.emailDesc'),
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-primary)',
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: t('contact.info.phone'),
      details: ['+55 (66) 99236-2830'],
      description: t('contact.info.phoneDesc'),
      color: 'var(--premium-petroleum)',
      gradient: 'var(--premium-gradient-hover)',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: t('contact.info.location'),
      details: ['Sinop - MT, Brasil'],
      description: t('contact.info.locationDesc'),
      color: 'var(--premium-yellow)',
      gradient: 'var(--premium-gradient-cta)',
    },
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      text: t('contact.benefits.support'),
    },
    {
      icon: <Shield className="w-6 h-6" />,
      text: t('contact.benefits.technology'),
    },
    {
      icon: <Globe className="w-6 h-6" />,
      text: t('contact.benefits.security'),
    },
  ];

  const workingHours = [
    {
      day: t('contact.hours.weekdays'),
      hours: t('contact.hours.weekdaysHours'),
    },
    {
      day: t('contact.hours.saturday'),
      hours: t('contact.hours.saturdayHours'),
    },
    {
      day: t('contact.hours.sunday'),
      hours: t('contact.hours.sundayHours'),
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="premium-contact">
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
                <MessageSquare className="w-16 h-16" />
              </div>
            </motion.div>

            <motion.h1 className="premium-hero-title" variants={itemVariants}>
              {t('contact.title')}
            </motion.h1>
            
            <motion.p className="premium-hero-subtitle" variants={itemVariants}>
              {t('contact.subtitle')}
            </motion.p>

            <motion.div className="premium-hero-actions" variants={itemVariants}>
              <a href="mailto:contato@agrosync.com" className="premium-btn premium-btn-primary premium-btn-lg">
                {t('contact.emailUs')}
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="https://wa.me/5566992362830" className="premium-btn premium-btn-secondary premium-btn-lg">
                {t('contact.whatsapp')}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="premium-contact-info">
        <div className="premium-container">
          <motion.div
            className="premium-contact-info-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-contact-info-grid">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  className="premium-contact-card"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{ '--contact-gradient': info.gradient }}
                >
                  <div className="premium-contact-icon" style={{ color: info.color }}>
                    {info.icon}
                  </div>
                  <h3 className="premium-contact-title">{info.title}</h3>
                  <div className="premium-contact-details">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="premium-contact-detail">{detail}</p>
                    ))}
                  </div>
                  <p className="premium-contact-description">{info.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="premium-contact-form">
        <div className="premium-container">
          <motion.div
            className="premium-contact-form-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-contact-form-grid">
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
                    <Star className="w-8 h-8 premium-form-icon" />
                    <h2 className="premium-form-title">
                      {t('contact.form.title')}
                    </h2>
                    <p className="premium-form-subtitle">
                      {t('contact.form.subtitle')}
                    </p>
                  </div>
                  
                  {isSubmitted ? (
                    <motion.div
                      className="premium-form-success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="premium-form-success-icon">
                        <CheckCircle className="w-16 h-16" />
                      </div>
                      <h3 className="premium-form-success-title">
                        {t('contact.form.success.title')}
                      </h3>
                      <p className="premium-form-success-message">
                        {t('contact.form.success.message')}
                      </p>
                      <motion.button
                        onClick={() => setIsSubmitted(false)}
                        className="premium-btn premium-btn-primary premium-btn-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t('contact.form.success.newMessage')}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="premium-form">
                      <div className="premium-form-row">
                        <div className="premium-form-group">
                          <label className="premium-form-label">
                            {t('contact.form.name')} *
                          </label>
                          <div className="premium-form-input-container">
                            <User className="w-5 h-5 premium-form-input-icon" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="premium-form-input"
                              placeholder={t('contact.form.namePlaceholder')}
                            />
                          </div>
                        </div>
                        
                        <div className="premium-form-group">
                          <label className="premium-form-label">
                            {t('contact.form.email')} *
                          </label>
                          <div className="premium-form-input-container">
                            <Mail className="w-5 h-5 premium-form-input-icon" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="premium-form-input"
                              placeholder={t('contact.form.emailPlaceholder')}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="premium-form-row">
                        <div className="premium-form-group">
                          <label className="premium-form-label">
                            {t('contact.form.phone')}
                          </label>
                          <div className="premium-form-input-container">
                            <Phone className="w-5 h-5 premium-form-input-icon" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="premium-form-input"
                              placeholder={t('contact.form.phonePlaceholder')}
                            />
                          </div>
                        </div>
                        
                        <div className="premium-form-group">
                          <label className="premium-form-label">
                            {t('contact.form.company')}
                          </label>
                          <div className="premium-form-input-container">
                            <Building className="w-5 h-5 premium-form-input-icon" />
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              className="premium-form-input"
                              placeholder={t('contact.form.companyPlaceholder')}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="premium-form-group">
                        <label className="premium-form-label">
                          {t('contact.form.subject')} *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="premium-form-select"
                        >
                          <option value="">{t('contact.form.subjectPlaceholder')}</option>
                          {subjects.map((subject) => (
                            <option key={subject} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="premium-form-group">
                        <label className="premium-form-label">
                          {t('contact.form.message')} *
                        </label>
                        <div className="premium-form-textarea-container">
                          <MessageSquare className="w-5 h-5 premium-form-textarea-icon" />
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={6}
                            className="premium-form-textarea"
                            placeholder={t('contact.form.messagePlaceholder')}
                          />
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
                            {t('contact.form.sending')}
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            {t('contact.form.send')}
                          </>
                        )}
                      </motion.button>
                    </form>
                  )}
                </div>
              </motion.div>

              {/* Info & Benefits */}
              <motion.div
                className="premium-contact-sidebar"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="premium-sidebar-card">
                  <h3 className="premium-sidebar-title">
                    {t('contact.why.title')}
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
                    {t('contact.hours.title')}
                  </h3>
                  <div className="premium-sidebar-hours">
                    {workingHours.map((schedule, index) => (
                      <motion.div
                        key={schedule.day}
                        className="premium-sidebar-hour"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Clock className="w-5 h-5 premium-sidebar-hour-icon" />
                        <div className="premium-sidebar-hour-info">
                          <p className="premium-sidebar-hour-day">{schedule.day}</p>
                          <p className="premium-sidebar-hour-time">{schedule.hours}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .premium-contact {
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="contact-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%2356B8B9" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23contact-grain)"/></svg>');
          opacity: 0.6;
        }

        .premium-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .premium-hero-icon {
          margin-bottom: var(--premium-space-xl);
        }

        .premium-icon-container {
          width: 120px;
          height: 120px;
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
          font-size: var(--premium-text-7xl);
          font-weight: var(--premium-font-black);
          background: var(--premium-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--premium-space-xl);
          line-height: var(--premium-leading-tight);
          letter-spacing: -0.05em;
        }

        .premium-hero-subtitle {
          font-size: var(--premium-text-2xl);
          color: var(--premium-gray-600);
          margin-bottom: var(--premium-space-3xl);
          line-height: var(--premium-leading-relaxed);
          font-weight: var(--premium-font-medium);
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        [data-theme="dark"] .premium-hero-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-hero-actions {
          display: flex;
          gap: var(--premium-space-xl);
          justify-content: center;
          flex-wrap: wrap;
        }

        .premium-contact-info {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-white);
        }

        .premium-contact-info-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--premium-space-2xl);
        }

        .premium-contact-card {
          background: var(--premium-white);
          border-radius: var(--premium-radius-3xl);
          padding: var(--premium-space-3xl);
          box-shadow: var(--premium-shadow-lg);
          border: 1px solid var(--premium-gray-200);
          transition: all var(--premium-transition-normal);
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .premium-contact-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--contact-gradient);
        }

        .premium-contact-card:hover {
          box-shadow: var(--premium-shadow-2xl);
        }

        .premium-contact-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto var(--premium-space-lg);
          background: var(--premium-gradient-primary);
          border-radius: var(--premium-radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-contact-title {
          font-size: var(--premium-text-2xl);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-contact-title {
          color: var(--premium-teal);
        }

        .premium-contact-details {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-sm);
          margin-bottom: var(--premium-space-lg);
        }

        .premium-contact-detail {
          color: var(--premium-gray-600);
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-contact-detail {
          color: var(--premium-gray-300);
        }

        .premium-contact-description {
          color: var(--premium-gray-500);
          font-size: var(--premium-text-sm);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-contact-description {
          color: var(--premium-gray-400);
        }

        .premium-contact-form {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-secondary);
        }

        .premium-contact-form-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-contact-form-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--premium-space-3xl);
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

        .premium-form {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-xl);
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

        .premium-form-select {
          width: 100%;
          padding: var(--premium-space-lg);
          border: 2px solid var(--premium-gray-200);
          border-radius: var(--premium-radius-lg);
          font-size: var(--premium-text-base);
          background: var(--premium-white);
          color: var(--premium-petroleum);
          transition: all var(--premium-transition-fast);
        }

        .premium-form-select:focus {
          outline: none;
          border-color: var(--premium-teal);
          box-shadow: 0 0 0 4px rgba(86, 184, 185, 0.1);
        }

        .premium-form-textarea-container {
          position: relative;
        }

        .premium-form-textarea-icon {
          position: absolute;
          left: var(--premium-space-lg);
          top: var(--premium-space-lg);
          color: var(--premium-gray-400);
          z-index: 2;
        }

        .premium-form-textarea {
          width: 100%;
          padding: var(--premium-space-lg) var(--premium-space-lg) var(--premium-space-lg) var(--premium-space-4xl);
          border: 2px solid var(--premium-gray-200);
          border-radius: var(--premium-radius-lg);
          font-size: var(--premium-text-base);
          background: var(--premium-white);
          color: var(--premium-petroleum);
          transition: all var(--premium-transition-fast);
          resize: none;
          min-height: 150px;
        }

        .premium-form-textarea:focus {
          outline: none;
          border-color: var(--premium-teal);
          box-shadow: 0 0 0 4px rgba(86, 184, 185, 0.1);
        }

        .premium-form-textarea::placeholder {
          color: var(--premium-gray-400);
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

        .premium-form-success {
          text-align: center;
          padding: var(--premium-space-4xl) 0;
        }

        .premium-form-success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto var(--premium-space-xl);
          background: var(--premium-gradient-accent);
          border-radius: var(--premium-radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-form-success-title {
          font-size: var(--premium-text-3xl);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
        }

        [data-theme="dark"] .premium-form-success-title {
          color: var(--premium-teal);
        }

        .premium-form-success-message {
          font-size: var(--premium-text-lg);
          color: var(--premium-gray-600);
          margin-bottom: var(--premium-space-2xl);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-form-success-message {
          color: var(--premium-gray-300);
        }

        .premium-contact-sidebar {
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

        .premium-sidebar-hours {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-md);
        }

        .premium-sidebar-hour {
          display: flex;
          align-items: center;
          gap: var(--premium-space-md);
          padding: var(--premium-space-md);
          background: var(--premium-gray-50);
          border-radius: var(--premium-radius-lg);
        }

        .premium-sidebar-hour-icon {
          color: var(--premium-gray-500);
          flex-shrink: 0;
        }

        .premium-sidebar-hour-info {
          display: flex;
          flex-direction: column;
        }

        .premium-sidebar-hour-day {
          font-size: var(--premium-text-base);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-petroleum);
          margin: 0;
        }

        [data-theme="dark"] .premium-sidebar-hour-day {
          color: var(--premium-teal);
        }

        .premium-sidebar-hour-time {
          font-size: var(--premium-text-sm);
          color: var(--premium-gray-600);
          margin: 0;
        }

        [data-theme="dark"] .premium-sidebar-hour-time {
          color: var(--premium-gray-300);
        }

        @media (max-width: 768px) {
          .premium-hero-title {
            font-size: var(--premium-text-5xl);
          }

          .premium-contact-form-grid {
            grid-template-columns: 1fr;
          }

          .premium-form-row {
            grid-template-columns: 1fr;
          }

          .premium-hero-actions {
            flex-direction: column;
            align-items: center;
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

export default PremiumContact;
