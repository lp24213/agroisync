import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Target, 
  Award, 
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Star,
  CheckCircle,
  Sparkles,
  Heart
} from 'lucide-react';

const PremiumAbout = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('about.values.security'),
      description: t('about.values.securityDesc'),
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-primary)',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('about.values.performance'),
      description: t('about.values.performanceDesc'),
      color: 'var(--premium-petroleum)',
      gradient: 'var(--premium-gradient-hover)',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('about.values.connectivity'),
      description: t('about.values.connectivityDesc'),
      color: 'var(--premium-yellow)',
      gradient: 'var(--premium-gradient-cta)',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('about.values.innovation'),
      description: t('about.values.innovationDesc'),
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-accent)',
    },
  ];

  const achievements = [
    { 
      number: '10K+', 
      label: t('about.achievements.users'),
      icon: <Users className="w-6 h-6" />,
    },
    { 
      number: 'R$ 50M+', 
      label: t('about.achievements.volume'),
      icon: <TrendingUp className="w-6 h-6" />,
    },
    { 
      number: '99.9%', 
      label: t('about.achievements.uptime'),
      icon: <Shield className="w-6 h-6" />,
    },
    { 
      number: '24/7', 
      label: t('about.achievements.support'),
      icon: <Heart className="w-6 h-6" />,
    },
    { 
      number: '15+', 
      label: t('about.achievements.countries'),
      icon: <Globe className="w-6 h-6" />,
    },
    { 
      number: '100+', 
      label: t('about.achievements.partners'),
      icon: <Award className="w-6 h-6" />,
    },
  ];

  const team = [
    {
      icon: <Users className="w-8 h-8" />,
      title: t('about.team.technology'),
      subtitle: t('about.team.technologySub'),
      description: t('about.team.technologyDesc'),
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-primary)',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: t('about.team.agricultural'),
      subtitle: t('about.team.agriculturalSub'),
      description: t('about.team.agriculturalDesc'),
      color: 'var(--premium-petroleum)',
      gradient: 'var(--premium-gradient-hover)',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t('about.team.support'),
      subtitle: t('about.team.supportSub'),
      description: t('about.team.supportDesc'),
      color: 'var(--premium-yellow)',
      gradient: 'var(--premium-gradient-cta)',
    },
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: t('about.contact.email'),
      details: ['contato@agrosync.com', 'suporte@agrosync.com'],
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-primary)',
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: t('about.contact.phone'),
      details: ['+55 (66) 99236-2830'],
      color: 'var(--premium-petroleum)',
      gradient: 'var(--premium-gradient-hover)',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: t('about.contact.location'),
      details: ['Sinop - MT, Brasil'],
      color: 'var(--premium-yellow)',
      gradient: 'var(--premium-gradient-cta)',
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

  return (
    <div className="premium-about">
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
              {t('about.title')}
            </motion.h1>
            
            <motion.p className="premium-hero-subtitle" variants={itemVariants}>
              {t('about.subtitle')}
            </motion.p>

            <motion.div className="premium-hero-actions" variants={itemVariants}>
              <Link to="/register" className="premium-btn premium-btn-primary premium-btn-lg">
                {t('about.getStarted')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="premium-btn premium-btn-secondary premium-btn-lg">
                {t('about.contactUs')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="premium-mission-vision">
        <div className="premium-container">
          <motion.div
            className="premium-mission-vision-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-mission-vision-grid">
              <motion.div
                className="premium-mission-card"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="premium-mission-icon">
                  <Target className="w-12 h-12" />
                </div>
                <h2 className="premium-mission-title">{t('about.mission.title')}</h2>
                <p className="premium-mission-description">{t('about.mission.description')}</p>
              </motion.div>

              <motion.div
                className="premium-vision-card"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="premium-vision-icon">
                  <Award className="w-12 h-12" />
                </div>
                <h2 className="premium-vision-title">{t('about.vision.title')}</h2>
                <p className="premium-vision-description">{t('about.vision.description')}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="premium-values">
        <div className="premium-container">
          <motion.div
            className="premium-values-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-values-header">
              <Sparkles className="w-12 h-12 premium-values-icon" />
              <h2 className="premium-values-title">
                {t('about.values.title')}
              </h2>
              <p className="premium-values-subtitle">
                {t('about.values.subtitle')}
              </p>
            </div>

            <div className="premium-values-grid">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="premium-value-card"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  style={{ '--value-gradient': value.gradient }}
                >
                  <div className="premium-value-icon" style={{ color: value.color }}>
                    {value.icon}
                  </div>
                  <h3 className="premium-value-title">{value.title}</h3>
                  <p className="premium-value-description">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="premium-team">
        <div className="premium-container">
          <motion.div
            className="premium-team-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-team-header">
              <h2 className="premium-team-title">
                {t('about.team.title')}
              </h2>
              <p className="premium-team-subtitle">
                {t('about.team.subtitle')}
              </p>
            </div>

            <div className="premium-team-grid">
              {team.map((member, index) => (
                <motion.div
                  key={member.title}
                  className="premium-team-card"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{ '--team-gradient': member.gradient }}
                >
                  <div className="premium-team-icon" style={{ color: member.color }}>
                    {member.icon}
                  </div>
                  <h3 className="premium-team-name">{member.title}</h3>
                  <p className="premium-team-subtitle">{member.subtitle}</p>
                  <p className="premium-team-description">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="premium-achievements">
        <div className="premium-container">
          <motion.div
            className="premium-achievements-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-achievements-header">
              <TrendingUp className="w-12 h-12 premium-achievements-icon" />
              <h2 className="premium-achievements-title">
                {t('about.achievements.title')}
              </h2>
              <p className="premium-achievements-subtitle">
                {t('about.achievements.subtitle')}
              </p>
            </div>

            <div className="premium-achievements-grid">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  className="premium-achievement-card"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="premium-achievement-icon">
                    {achievement.icon}
                  </div>
                  <div className="premium-achievement-number">{achievement.number}</div>
                  <div className="premium-achievement-label">{achievement.label}</div>
                </motion.div>
              ))}
            </div>
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
            <div className="premium-contact-info-header">
              <h2 className="premium-contact-info-title">
                {t('about.contact.title')}
              </h2>
              <p className="premium-contact-info-subtitle">
                {t('about.contact.subtitle')}
              </p>
            </div>

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
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="premium-cta">
        <div className="premium-container">
          <motion.div
            className="premium-cta-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-cta-header">
              <CheckCircle className="w-12 h-12 premium-cta-icon" />
              <h2 className="premium-cta-title">
                {t('about.cta.title')}
              </h2>
              <p className="premium-cta-subtitle">
                {t('about.cta.subtitle')}
              </p>
            </div>

            <motion.div
              className="premium-cta-actions"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link to="/register" className="premium-btn premium-btn-cta premium-btn-lg">
                {t('about.cta.getStarted')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="premium-btn premium-btn-ghost premium-btn-lg">
                {t('about.cta.contactExpert')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .premium-about {
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="about-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%2356B8B9" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23about-grain)"/></svg>');
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
          animation: premium-glow 2s ease-in-out infinite alternate;
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

        .premium-mission-vision {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-white);
        }

        .premium-mission-vision-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-mission-vision-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: var(--premium-space-3xl);
        }

        .premium-mission-card,
        .premium-vision-card {
          background: var(--premium-white);
          border-radius: var(--premium-radius-3xl);
          padding: var(--premium-space-4xl);
          box-shadow: var(--premium-shadow-lg);
          border: 1px solid var(--premium-gray-200);
          transition: all var(--premium-transition-normal);
          position: relative;
          overflow: hidden;
        }

        .premium-mission-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--premium-gradient-primary);
        }

        .premium-vision-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--premium-gradient-accent);
        }

        .premium-mission-card:hover,
        .premium-vision-card:hover {
          box-shadow: var(--premium-shadow-2xl);
        }

        .premium-mission-icon,
        .premium-vision-icon {
          width: 80px;
          height: 80px;
          margin-bottom: var(--premium-space-xl);
          background: var(--premium-gradient-primary);
          border-radius: var(--premium-radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-vision-icon {
          background: var(--premium-gradient-accent);
        }

        .premium-mission-title,
        .premium-vision-title {
          font-size: var(--premium-text-4xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-mission-title,
        [data-theme="dark"] .premium-vision-title {
          color: var(--premium-teal);
        }

        .premium-mission-description,
        .premium-vision-description {
          color: var(--premium-gray-600);
          line-height: var(--premium-leading-relaxed);
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-medium);
        }

        [data-theme="dark"] .premium-mission-description,
        [data-theme="dark"] .premium-vision-description {
          color: var(--premium-gray-300);
        }

        .premium-values {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-secondary);
        }

        .premium-values-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-values-header {
          text-align: center;
          margin-bottom: var(--premium-space-5xl);
        }

        .premium-values-icon {
          margin: 0 auto var(--premium-space-lg);
          color: var(--premium-teal);
          filter: drop-shadow(0 4px 8px rgba(86, 184, 185, 0.3));
        }

        .premium-values-title {
          font-size: var(--premium-text-6xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.04em;
        }

        [data-theme="dark"] .premium-values-title {
          color: var(--premium-teal);
        }

        .premium-values-subtitle {
          font-size: var(--premium-text-xl);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-values-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--premium-space-2xl);
        }

        .premium-value-card {
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

        .premium-value-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--value-gradient);
        }

        .premium-value-card:hover {
          box-shadow: var(--premium-shadow-2xl);
        }

        .premium-value-icon {
          margin: 0 auto var(--premium-space-xl);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .premium-value-title {
          font-size: var(--premium-text-2xl);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-value-title {
          color: var(--premium-teal);
        }

        .premium-value-description {
          color: var(--premium-gray-600);
          line-height: var(--premium-leading-relaxed);
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-medium);
        }

        [data-theme="dark"] .premium-value-description {
          color: var(--premium-gray-300);
        }

        .premium-team {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-white);
        }

        .premium-team-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-team-header {
          text-align: center;
          margin-bottom: var(--premium-space-5xl);
        }

        .premium-team-title {
          font-size: var(--premium-text-6xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.04em;
        }

        [data-theme="dark"] .premium-team-title {
          color: var(--premium-teal);
        }

        .premium-team-subtitle {
          font-size: var(--premium-text-xl);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-team-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--premium-space-2xl);
        }

        .premium-team-card {
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

        .premium-team-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--team-gradient);
        }

        .premium-team-card:hover {
          box-shadow: var(--premium-shadow-2xl);
        }

        .premium-team-icon {
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

        .premium-team-name {
          font-size: var(--premium-text-2xl);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-sm);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-team-name {
          color: var(--premium-teal);
        }

        .premium-team-subtitle {
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-gray-600);
          margin-bottom: var(--premium-space-lg);
        }

        [data-theme="dark"] .premium-team-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-team-description {
          color: var(--premium-gray-600);
          line-height: var(--premium-leading-relaxed);
          font-size: var(--premium-text-base);
          font-weight: var(--premium-font-medium);
        }

        [data-theme="dark"] .premium-team-description {
          color: var(--premium-gray-300);
        }

        .premium-achievements {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-primary);
          color: var(--premium-white);
          position: relative;
          overflow: hidden;
        }

        .premium-achievements::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="achievements-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23FFFFFF" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23achievements-grain)"/></svg>');
          opacity: 0.8;
        }

        .premium-achievements-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .premium-achievements-header {
          text-align: center;
          margin-bottom: var(--premium-space-5xl);
        }

        .premium-achievements-icon {
          margin: 0 auto var(--premium-space-lg);
          color: var(--premium-yellow);
          filter: drop-shadow(0 4px 8px rgba(248, 172, 0, 0.3));
        }

        .premium-achievements-title {
          font-size: var(--premium-text-6xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-white);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.04em;
        }

        .premium-achievements-subtitle {
          font-size: var(--premium-text-xl);
          opacity: 0.95;
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        .premium-achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--premium-space-xl);
        }

        .premium-achievement-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--premium-radius-2xl);
          padding: var(--premium-space-2xl);
          box-shadow: var(--premium-shadow-lg);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all var(--premium-transition-normal);
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .premium-achievement-card:hover {
          box-shadow: var(--premium-shadow-2xl);
          background: rgba(255, 255, 255, 0.15);
        }

        .premium-achievement-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto var(--premium-space-lg);
          background: var(--premium-gradient-accent);
          border-radius: var(--premium-radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-achievement-number {
          font-size: var(--premium-text-4xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-white);
          margin-bottom: var(--premium-space-sm);
        }

        .premium-achievement-label {
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-white);
          opacity: 0.9;
        }

        .premium-contact-info {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-white);
        }

        .premium-contact-info-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .premium-contact-info-header {
          text-align: center;
          margin-bottom: var(--premium-space-5xl);
        }

        .premium-contact-info-title {
          font-size: var(--premium-text-6xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.04em;
        }

        [data-theme="dark"] .premium-contact-info-title {
          color: var(--premium-teal);
        }

        .premium-contact-info-subtitle {
          font-size: var(--premium-text-xl);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-contact-info-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

        .premium-cta {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-secondary);
        }

        .premium-cta-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .premium-cta-header {
          margin-bottom: var(--premium-space-3xl);
        }

        .premium-cta-icon {
          margin: 0 auto var(--premium-space-lg);
          color: var(--premium-teal);
          filter: drop-shadow(0 4px 8px rgba(86, 184, 185, 0.3));
        }

        .premium-cta-title {
          font-size: var(--premium-text-6xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.04em;
        }

        [data-theme="dark"] .premium-cta-title {
          color: var(--premium-teal);
        }

        .premium-cta-subtitle {
          font-size: var(--premium-text-xl);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-cta-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-cta-actions {
          display: flex;
          gap: var(--premium-space-xl);
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .premium-hero-title {
            font-size: var(--premium-text-5xl);
          }

          .premium-mission-vision-grid {
            grid-template-columns: 1fr;
          }

          .premium-values-grid,
          .premium-team-grid,
          .premium-achievements-grid,
          .premium-contact-info-grid {
            grid-template-columns: 1fr;
          }

          .premium-hero-actions,
          .premium-cta-actions {
            flex-direction: column;
            align-items: center;
          }

          .premium-values-title,
          .premium-team-title,
          .premium-achievements-title,
          .premium-contact-info-title,
          .premium-cta-title {
            font-size: var(--premium-text-4xl);
          }
        }

        @media (max-width: 480px) {
          .premium-hero-title {
            font-size: var(--premium-text-4xl);
          }

          .premium-values-title,
          .premium-team-title,
          .premium-achievements-title,
          .premium-contact-info-title,
          .premium-cta-title {
            font-size: var(--premium-text-3xl);
          }

          .premium-hero-subtitle {
            font-size: var(--premium-text-lg);
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumAbout;
