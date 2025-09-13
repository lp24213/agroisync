import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package,
  Truck,
  DollarSign,
  Activity,
  Plus,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Globe,
  Clock
} from 'lucide-react';

const PremiumDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: t('dashboard.stats.revenue'),
      value: 'R$ 125.430',
      change: '+12.5%',
      changeType: 'positive',
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-primary)',
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: t('dashboard.stats.products'),
      value: '1,247',
      change: '+8.2%',
      changeType: 'positive',
      color: 'var(--premium-petroleum)',
      gradient: 'var(--premium-gradient-hover)',
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: t('dashboard.stats.freights'),
      value: '89',
      change: '+15.3%',
      changeType: 'positive',
      color: 'var(--premium-yellow)',
      gradient: 'var(--premium-gradient-cta)',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('dashboard.stats.customers'),
      value: '342',
      change: '+5.7%',
      changeType: 'positive',
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-accent)',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'freight',
      title: t('dashboard.activities.newFreight'),
      description: t('dashboard.activities.newFreightDesc'),
      time: '2 min ago',
      icon: <Truck className="w-5 h-5" />,
      color: 'var(--premium-teal)',
    },
    {
      id: 2,
      type: 'payment',
      title: t('dashboard.activities.paymentReceived'),
      description: t('dashboard.activities.paymentReceivedDesc'),
      time: '15 min ago',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'var(--premium-yellow)',
    },
    {
      id: 3,
      type: 'product',
      title: t('dashboard.activities.productAdded'),
      description: t('dashboard.activities.productAddedDesc'),
      time: '1 hour ago',
      icon: <Package className="w-5 h-5" />,
      color: 'var(--premium-petroleum)',
    },
    {
      id: 4,
      type: 'customer',
      title: t('dashboard.activities.newCustomer'),
      description: t('dashboard.activities.newCustomerDesc'),
      time: '2 hours ago',
      icon: <Users className="w-5 h-5" />,
      color: 'var(--premium-teal)',
    },
  ];

  const quickActions = [
    {
      icon: <Plus className="w-6 h-6" />,
      title: t('dashboard.actions.addProduct'),
      description: t('dashboard.actions.addProductDesc'),
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-primary)',
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: t('dashboard.actions.createFreight'),
      description: t('dashboard.actions.createFreightDesc'),
      color: 'var(--premium-petroleum)',
      gradient: 'var(--premium-gradient-hover)',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('dashboard.actions.inviteCustomer'),
      description: t('dashboard.actions.inviteCustomerDesc'),
      color: 'var(--premium-yellow)',
      gradient: 'var(--premium-gradient-cta)',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: t('dashboard.actions.viewReports'),
      description: t('dashboard.actions.viewReportsDesc'),
      color: 'var(--premium-teal)',
      gradient: 'var(--premium-gradient-accent)',
    },
  ];

  const tabs = [
    { id: 'overview', label: t('dashboard.tabs.overview'), icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'products', label: t('dashboard.tabs.products'), icon: <Package className="w-5 h-5" /> },
    { id: 'freights', label: t('dashboard.tabs.freights'), icon: <Truck className="w-5 h-5" /> },
    { id: 'analytics', label: t('dashboard.tabs.analytics'), icon: <TrendingUp className="w-5 h-5" /> },
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
    <div className="premium-dashboard">
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
                <BarChart3 className="w-16 h-16" />
              </div>
            </motion.div>

            <motion.h1 className="premium-hero-title" variants={itemVariants}>
              {t('dashboard.title')}
            </motion.h1>
            
            <motion.p className="premium-hero-subtitle" variants={itemVariants}>
              {t('dashboard.subtitle')}
            </motion.p>

            <motion.div className="premium-hero-actions" variants={itemVariants}>
              <button className="premium-btn premium-btn-primary premium-btn-lg">
                {t('dashboard.getStarted')}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="premium-btn premium-btn-secondary premium-btn-lg">
                {t('dashboard.viewReports')}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="premium-tabs">
        <div className="premium-container">
          <motion.div
            className="premium-tabs-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="premium-tabs-container">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`premium-tab ${activeTab === tab.id ? 'premium-tab-active' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.icon}
                  <span className="premium-tab-label">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="premium-stats">
        <div className="premium-container">
          <motion.div
            className="premium-stats-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-stats-header">
              <TrendingUp className="w-8 h-8 premium-stats-icon" />
              <h2 className="premium-stats-title">
                {t('dashboard.stats.title')}
              </h2>
              <p className="premium-stats-subtitle">
                {t('dashboard.stats.subtitle')}
              </p>
            </div>

            <div className="premium-stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="premium-stat-card"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{ '--stat-gradient': stat.gradient }}
                >
                  <div className="premium-stat-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="premium-stat-content">
                    <h3 className="premium-stat-title">{stat.title}</h3>
                    <div className="premium-stat-value">{stat.value}</div>
                    <div className={`premium-stat-change ${stat.changeType}`}>
                      {stat.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="premium-main-content">
        <div className="premium-container">
          <motion.div
            className="premium-main-grid"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {/* Quick Actions */}
            <motion.div
              className="premium-quick-actions"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="premium-section-card">
                <div className="premium-section-header">
                  <Zap className="w-6 h-6 premium-section-icon" />
                  <h3 className="premium-section-title">
                    {t('dashboard.actions.title')}
                  </h3>
                </div>
                <div className="premium-actions-grid">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.title}
                      className="premium-action-card"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      style={{ '--action-gradient': action.gradient }}
                    >
                      <div className="premium-action-icon" style={{ color: action.color }}>
                        {action.icon}
                      </div>
                      <h4 className="premium-action-title">{action.title}</h4>
                      <p className="premium-action-description">{action.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              className="premium-recent-activities"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="premium-section-card">
                <div className="premium-section-header">
                  <Activity className="w-6 h-6 premium-section-icon" />
                  <h3 className="premium-section-title">
                    {t('dashboard.activities.title')}
                  </h3>
                </div>
                <div className="premium-activities-list">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="premium-activity-item"
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ x: 8 }}
                    >
                      <div className="premium-activity-icon" style={{ color: activity.color }}>
                        {activity.icon}
                      </div>
                      <div className="premium-activity-content">
                        <h4 className="premium-activity-title">{activity.title}</h4>
                        <p className="premium-activity-description">{activity.description}</p>
                        <div className="premium-activity-time">
                          <Clock className="w-4 h-4" />
                          {activity.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="premium-performance">
        <div className="premium-container">
          <motion.div
            className="premium-performance-content"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="premium-performance-header">
              <Star className="w-8 h-8 premium-performance-icon" />
              <h2 className="premium-performance-title">
                {t('dashboard.performance.title')}
              </h2>
              <p className="premium-performance-subtitle">
                {t('dashboard.performance.subtitle')}
              </p>
            </div>

            <div className="premium-performance-grid">
              <motion.div
                className="premium-performance-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="premium-performance-icon-large">
                  <Shield className="w-12 h-12" />
                </div>
                <h3 className="premium-performance-card-title">
                  {t('dashboard.performance.security')}
                </h3>
                <p className="premium-performance-card-description">
                  {t('dashboard.performance.securityDesc')}
                </p>
                <div className="premium-performance-metric">
                  <span className="premium-performance-metric-value">99.9%</span>
                  <span className="premium-performance-metric-label">
                    {t('dashboard.performance.uptime')}
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="premium-performance-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="premium-performance-icon-large">
                  <Zap className="w-12 h-12" />
                </div>
                <h3 className="premium-performance-card-title">
                  {t('dashboard.performance.speed')}
                </h3>
                <p className="premium-performance-card-description">
                  {t('dashboard.performance.speedDesc')}
                </p>
                <div className="premium-performance-metric">
                  <span className="premium-performance-metric-value">0.2s</span>
                  <span className="premium-performance-metric-label">
                    {t('dashboard.performance.responseTime')}
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="premium-performance-card"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="premium-performance-icon-large">
                  <Globe className="w-12 h-12" />
                </div>
                <h3 className="premium-performance-card-title">
                  {t('dashboard.performance.global')}
                </h3>
                <p className="premium-performance-card-description">
                  {t('dashboard.performance.globalDesc')}
                </p>
                <div className="premium-performance-metric">
                  <span className="premium-performance-metric-value">15+</span>
                  <span className="premium-performance-metric-label">
                    {t('dashboard.performance.countries')}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .premium-dashboard {
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
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dashboard-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%2356B8B9" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23dashboard-grain)"/></svg>');
          opacity: 0.6;
        }

        .premium-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 800px;
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
          animation: premium-glow 2s ease-in-out infinite alternate;
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
          margin-bottom: var(--premium-space-3xl);
          line-height: var(--premium-leading-relaxed);
          font-weight: var(--premium-font-medium);
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

        .premium-tabs {
          padding: var(--premium-space-2xl) 0;
          background: var(--premium-white);
          border-bottom: 1px solid var(--premium-gray-200);
        }

        .premium-tabs-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-tabs-container {
          display: flex;
          gap: var(--premium-space-sm);
          background: var(--premium-gray-50);
          border-radius: var(--premium-radius-xl);
          padding: var(--premium-space-sm);
        }

        .premium-tab {
          display: flex;
          align-items: center;
          gap: var(--premium-space-sm);
          padding: var(--premium-space-lg) var(--premium-space-xl);
          border-radius: var(--premium-radius-lg);
          font-size: var(--premium-text-base);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-gray-600);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all var(--premium-transition-fast);
        }

        .premium-tab:hover {
          color: var(--premium-petroleum);
          background: var(--premium-white);
        }

        .premium-tab-active {
          color: var(--premium-white);
          background: var(--premium-gradient-primary);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-tab-label {
          font-size: var(--premium-text-sm);
        }

        .premium-stats {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-white);
        }

        .premium-stats-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-stats-header {
          text-align: center;
          margin-bottom: var(--premium-space-5xl);
        }

        .premium-stats-icon {
          margin: 0 auto var(--premium-space-lg);
          color: var(--premium-teal);
          filter: drop-shadow(0 4px 8px rgba(86, 184, 185, 0.3));
        }

        .premium-stats-title {
          font-size: var(--premium-text-5xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.04em;
        }

        [data-theme="dark"] .premium-stats-title {
          color: var(--premium-teal);
        }

        .premium-stats-subtitle {
          font-size: var(--premium-text-xl);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-stats-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--premium-space-xl);
        }

        .premium-stat-card {
          background: var(--premium-white);
          border-radius: var(--premium-radius-3xl);
          padding: var(--premium-space-3xl);
          box-shadow: var(--premium-shadow-lg);
          border: 1px solid var(--premium-gray-200);
          transition: all var(--premium-transition-normal);
          position: relative;
          overflow: hidden;
        }

        .premium-stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--stat-gradient);
        }

        .premium-stat-card:hover {
          box-shadow: var(--premium-shadow-2xl);
        }

        .premium-stat-icon {
          width: 60px;
          height: 60px;
          margin-bottom: var(--premium-space-lg);
          background: var(--premium-gradient-primary);
          border-radius: var(--premium-radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-stat-content {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-sm);
        }

        .premium-stat-title {
          font-size: var(--premium-text-base);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-gray-600);
        }

        [data-theme="dark"] .premium-stat-title {
          color: var(--premium-gray-300);
        }

        .premium-stat-value {
          font-size: var(--premium-text-3xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-stat-value {
          color: var(--premium-teal);
        }

        .premium-stat-change {
          font-size: var(--premium-text-sm);
          font-weight: var(--premium-font-semibold);
          padding: var(--premium-space-xs) var(--premium-space-sm);
          border-radius: var(--premium-radius-sm);
          width: fit-content;
        }

        .premium-stat-change.positive {
          color: #059669;
          background: rgba(5, 150, 105, 0.1);
        }

        .premium-stat-change.negative {
          color: #dc2626;
          background: rgba(220, 38, 38, 0.1);
        }

        .premium-main-content {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-gradient-secondary);
        }

        .premium-main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--premium-space-3xl);
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-section-card {
          background: var(--premium-white);
          border-radius: var(--premium-radius-3xl);
          padding: var(--premium-space-3xl);
          box-shadow: var(--premium-shadow-lg);
          border: 1px solid var(--premium-gray-200);
          position: relative;
          overflow: hidden;
        }

        .premium-section-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--premium-gradient-accent);
        }

        .premium-section-header {
          display: flex;
          align-items: center;
          gap: var(--premium-space-md);
          margin-bottom: var(--premium-space-2xl);
        }

        .premium-section-icon {
          color: var(--premium-teal);
          filter: drop-shadow(0 2px 4px rgba(86, 184, 185, 0.3));
        }

        .premium-section-title {
          font-size: var(--premium-text-2xl);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-section-title {
          color: var(--premium-teal);
        }

        .premium-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--premium-space-lg);
        }

        .premium-action-card {
          background: var(--premium-gray-50);
          border-radius: var(--premium-radius-xl);
          padding: var(--premium-space-xl);
          border: 1px solid var(--premium-gray-200);
          transition: all var(--premium-transition-fast);
          cursor: pointer;
          text-align: left;
        }

        .premium-action-card:hover {
          background: var(--premium-white);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-action-icon {
          width: 48px;
          height: 48px;
          margin-bottom: var(--premium-space-md);
          background: var(--premium-gradient-primary);
          border-radius: var(--premium-radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-sm);
        }

        .premium-action-title {
          font-size: var(--premium-text-lg);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-sm);
          letter-spacing: -0.01em;
        }

        [data-theme="dark"] .premium-action-title {
          color: var(--premium-teal);
        }

        .premium-action-description {
          font-size: var(--premium-text-sm);
          color: var(--premium-gray-600);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-action-description {
          color: var(--premium-gray-300);
        }

        .premium-activities-list {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-lg);
        }

        .premium-activity-item {
          display: flex;
          align-items: flex-start;
          gap: var(--premium-space-md);
          padding: var(--premium-space-lg);
          background: var(--premium-gray-50);
          border-radius: var(--premium-radius-lg);
          border: 1px solid var(--premium-gray-200);
          transition: all var(--premium-transition-fast);
        }

        .premium-activity-item:hover {
          background: var(--premium-white);
          box-shadow: var(--premium-shadow-sm);
        }

        .premium-activity-icon {
          width: 40px;
          height: 40px;
          background: var(--premium-gradient-primary);
          border-radius: var(--premium-radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          flex-shrink: 0;
          box-shadow: var(--premium-shadow-sm);
        }

        .premium-activity-content {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-xs);
          flex: 1;
        }

        .premium-activity-title {
          font-size: var(--premium-text-base);
          font-weight: var(--premium-font-semibold);
          color: var(--premium-petroleum);
          margin: 0;
        }

        [data-theme="dark"] .premium-activity-title {
          color: var(--premium-teal);
        }

        .premium-activity-description {
          font-size: var(--premium-text-sm);
          color: var(--premium-gray-600);
          margin: 0;
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-activity-description {
          color: var(--premium-gray-300);
        }

        .premium-activity-time {
          display: flex;
          align-items: center;
          gap: var(--premium-space-xs);
          font-size: var(--premium-text-xs);
          color: var(--premium-gray-500);
          font-weight: var(--premium-font-medium);
        }

        .premium-performance {
          padding: var(--premium-space-6xl) 0;
          background: var(--premium-white);
        }

        .premium-performance-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-performance-header {
          text-align: center;
          margin-bottom: var(--premium-space-5xl);
        }

        .premium-performance-icon {
          margin: 0 auto var(--premium-space-lg);
          color: var(--premium-yellow);
          filter: drop-shadow(0 4px 8px rgba(248, 172, 0, 0.3));
        }

        .premium-performance-title {
          font-size: var(--premium-text-5xl);
          font-weight: var(--premium-font-black);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.04em;
        }

        [data-theme="dark"] .premium-performance-title {
          color: var(--premium-teal);
        }

        .premium-performance-subtitle {
          font-size: var(--premium-text-xl);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-medium);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-performance-subtitle {
          color: var(--premium-gray-300);
        }

        .premium-performance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--premium-space-2xl);
        }

        .premium-performance-card {
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

        .premium-performance-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--premium-gradient-primary);
        }

        .premium-performance-card:hover {
          box-shadow: var(--premium-shadow-2xl);
        }

        .premium-performance-icon-large {
          width: 80px;
          height: 80px;
          margin: 0 auto var(--premium-space-xl);
          background: var(--premium-gradient-primary);
          border-radius: var(--premium-radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--premium-white);
          box-shadow: var(--premium-shadow-md);
        }

        .premium-performance-card-title {
          font-size: var(--premium-text-2xl);
          font-weight: var(--premium-font-bold);
          color: var(--premium-petroleum);
          margin-bottom: var(--premium-space-lg);
          letter-spacing: -0.02em;
        }

        [data-theme="dark"] .premium-performance-card-title {
          color: var(--premium-teal);
        }

        .premium-performance-card-description {
          font-size: var(--premium-text-base);
          color: var(--premium-gray-600);
          margin-bottom: var(--premium-space-xl);
          line-height: var(--premium-leading-relaxed);
        }

        [data-theme="dark"] .premium-performance-card-description {
          color: var(--premium-gray-300);
        }

        .premium-performance-metric {
          display: flex;
          flex-direction: column;
          gap: var(--premium-space-xs);
        }

        .premium-performance-metric-value {
          font-size: var(--premium-text-4xl);
          font-weight: var(--premium-font-black);
          background: var(--premium-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .premium-performance-metric-label {
          font-size: var(--premium-text-sm);
          color: var(--premium-gray-600);
          font-weight: var(--premium-font-semibold);
        }

        [data-theme="dark"] .premium-performance-metric-label {
          color: var(--premium-gray-300);
        }

        @media (max-width: 768px) {
          .premium-hero-title {
            font-size: var(--premium-text-5xl);
          }

          .premium-main-grid {
            grid-template-columns: 1fr;
          }

          .premium-actions-grid {
            grid-template-columns: 1fr;
          }

          .premium-hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .premium-stats-title,
          .premium-performance-title {
            font-size: var(--premium-text-4xl);
          }

          .premium-tabs-container {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .premium-hero-title {
            font-size: var(--premium-text-4xl);
          }

          .premium-stats-title,
          .premium-performance-title {
            font-size: var(--premium-text-3xl);
          }

          .premium-hero-subtitle {
            font-size: var(--premium-text-lg);
          }

          .premium-tabs-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumDashboard;
