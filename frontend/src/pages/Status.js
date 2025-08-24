import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle, AlertCircle, XCircle, Clock, 
  Server, Database, Globe, Shield, Activity
} from 'lucide-react';
import { 
  CheckCircle, AlertCircle, XCircle, Clock, 
  Server, Database, Globe, Shield, Activity,
  Wifi, WifiOff, Settings
} from 'lucide-react';

const Status = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Dados simulados de status dos serviços
  const services = [
    {
      id: 'blockchain',
      name: t('status.services.blockchain.name'),
      description: t('status.services.blockchain.description'),
      status: 'operational',
      uptime: '99.98%',
      responseTime: '45ms',
      lastIncident: null,
      icon: <Shield className="w-6 h-6" />
    },
    {
      id: 'marketplace',
      name: t('status.services.marketplace.name'),
      description: t('status.services.marketplace.description'),
      status: 'operational',
      uptime: '99.95%',
      responseTime: '120ms',
      lastIncident: null,
      icon: <Globe className="w-6 h-6" />
    },
    {
      id: 'chatbot',
      name: t('status.services.chatbot.name'),
      description: t('status.services.chatbot.description'),
      status: 'operational',
      uptime: '99.99%',
      responseTime: '15ms',
      lastIncident: null,
      icon: <Activity className="w-6 h-6" />
    },
    {
      id: 'api',
      name: t('status.services.api.name'),
      description: t('status.services.api.description'),
      status: 'operational',
      uptime: '99.97%',
      responseTime: '85ms',
      lastIncident: null,
      icon: <Server className="w-6 h-6" />
    },
    {
      id: 'database',
      name: t('status.services.database.name'),
      description: t('status.services.database.description'),
      status: 'operational',
      uptime: '99.96%',
      responseTime: '95ms',
      lastIncident: null,
      icon: <Database className="w-6 h-6" />
    },
    {
      id: 'auth',
      name: t('status.services.auth.name'),
      description: t('status.services.auth.description'),
      status: 'operational',
      uptime: '99.94%',
      responseTime: '150ms',
      lastIncident: null,
      icon: <Shield className="w-6 h-6" />
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'outage':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'Operacional';
      case 'degraded':
        return 'Degradado';
      case 'outage':
        return 'Indisponível';
      case 'maintenance':
        return 'Manutenção';
      default:
        return 'Desconhecido';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const overallStatus = services.every(service => service.status === 'operational') 
    ? 'operational' 
    : services.some(service => service.status === 'outage') 
    ? 'outage' 
    : 'degraded';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      
      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
              <div className="absolute inset-0 bg-white opacity-95"></div>
            </div>
          )}
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            {t('status.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('status.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Overall Status */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-6 rounded-xl border text-center ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              {getStatusIcon(overallStatus)}
              <h2 className="text-2xl font-bold">{t('status.overallTitle')}</h2>
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border mb-4 ${getStatusColor(overallStatus)}`}>
              {getStatusText(overallStatus)}
            </div>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t('status.lastUpdate')}: {lastUpdate.toLocaleTimeString('pt-BR')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t('status.servicesTitle')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{service.name}</h3>
                      {getStatusIcon(service.status)}
                    </div>
                    <p className={`text-sm mb-4 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {t('status.uptime')}
                        </p>
                        <p className="font-semibold text-green-500">{service.uptime}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {t('status.responseTime')}
                        </p>
                        <p className="font-semibold text-blue-500">{service.responseTime}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                        {getStatusText(service.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t('status.performanceTitle')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`p-6 rounded-xl border text-center ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="text-3xl font-bold text-green-500 mb-2">99.96%</div>
              <div className="text-sm text-gray-500">{t('status.metrics.uptime')}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`p-6 rounded-xl border text-center ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="text-3xl font-bold text-blue-500 mb-2">110ms</div>
              <div className="text-sm text-gray-500">{t('status.metrics.responseTime')}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`p-6 rounded-xl border text-center ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
              <div className="text-sm text-gray-500">{t('status.metrics.monitoring')}</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Incident History */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12"
          >
            {t('status.incidentTitle')}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-6 rounded-xl border text-center ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-bold mb-2">{t('status.noIncidents')}</h3>
            <p className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t('status.allServicesNormal')} {t('status.lastCheck')}: {lastUpdate.toLocaleString('pt-BR')}
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Status;
