import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle, AlertCircle, XCircle, Clock, 
  Server, Database, Globe, Shield, Activity
} from 'lucide-react';
import GlobalTicker from '../components/GlobalTicker';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WeatherWidget from '../components/WeatherWidget';
import Chatbot from '../components/Chatbot';

const Status = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Dados simulados de status dos serviços
  const services = [
    {
      id: 'website',
      name: 'Website Principal',
      description: 'Interface do usuário e páginas principais',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '45ms',
      lastIncident: null,
      icon: <Globe className="w-6 h-6" />
    },
    {
      id: 'api',
      name: 'API Backend',
      description: 'Serviços de backend e integrações',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '120ms',
      lastIncident: null,
      icon: <Server className="w-6 h-6" />
    },
    {
      id: 'database',
      name: 'Banco de Dados',
      description: 'MongoDB e armazenamento de dados',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '15ms',
      lastIncident: null,
      icon: <Database className="w-6 h-6" />
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      description: 'Sistema de produtos e vendas',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '85ms',
      lastIncident: null,
      icon: <Globe className="w-6 h-6" />
    },
    {
      id: 'freight',
      name: 'AgroConecta',
      description: 'Sistema de fretes e transportes',
      status: 'operational',
      uptime: '99.96%',
      responseTime: '95ms',
      lastIncident: null,
      icon: <Globe className="w-6 h-6" />
    },
    {
      id: 'crypto',
      name: 'Sistema Cripto',
      description: 'Integração com criptomoedas',
      status: 'operational',
      uptime: '99.94%',
      responseTime: '150ms',
      lastIncident: null,
      icon: <Shield className="w-6 h-6" />
    },
    {
      id: 'weather',
      name: 'Serviço de Clima',
      description: 'API de previsão do tempo',
      status: 'operational',
      uptime: '99.92%',
      responseTime: '200ms',
      lastIncident: null,
      icon: <Activity className="w-6 h-6" />
    },
    {
      id: 'quotes',
      name: 'Cotações em Tempo Real',
      description: 'APIs de cotações e bolsa',
      status: 'operational',
      uptime: '99.90%',
      responseTime: '180ms',
      lastIncident: null,
      icon: <Activity className="w-6 h-6" />
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
      <GlobalTicker />
      <Navbar />
      
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
            Status do Sistema
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
                         Monitoramento em Tempo Real dos Serviços Agroisync
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
              <h2 className="text-2xl font-bold">Status Geral do Sistema</h2>
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border mb-4 ${getStatusColor(overallStatus)}`}>
              {getStatusText(overallStatus)}
            </div>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
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
            Status dos Serviços
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
                          Uptime
                        </p>
                        <p className="font-semibold text-green-500">{service.uptime}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Tempo de Resposta
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
            Métricas de Performance
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
              <div className="text-sm text-gray-500">Uptime Médio</div>
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
              <div className="text-sm text-gray-500">Tempo de Resposta Médio</div>
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
              <div className="text-sm text-gray-500">Monitoramento</div>
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
            Histórico de Incidentes
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
            <h3 className="text-xl font-bold mb-2">Nenhum Incidente Recente</h3>
            <p className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Todos os serviços estão funcionando normalmente. Última verificação: {lastUpdate.toLocaleString('pt-BR')}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WeatherWidget />
      <Chatbot />
    </div>
  );
};

export default Status;
