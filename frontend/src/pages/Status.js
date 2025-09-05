import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  CheckCircle, AlertCircle, XCircle, Clock, 
  Server, Database, Globe, Shield, Activity,
  Wifi, WifiOff, Settings, Zap, Cpu, Lock, Store, Truck
} from 'lucide-react';

const Status = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [services, setServices] = useState([]);

  // Dados simulados de status dos serviços com atualizações em tempo real
  useEffect(() => {
    const initialServices = [
      {
        id: 'loja',
        name: 'Loja / Marketplace',
        description: 'Plataforma de compra e venda de produtos agropecuários',
        status: 'operational',
        uptime: '99.95%',
        responseTime: '120ms',
        lastIncident: null,
        icon: <Store className="w-6 h-6" />,
        details: {
          activeUsers: '12,847',
          products: '45,623',
          transactions: '89,234',
          revenue: 'R$ 2.4M'
        }
      },
      {
        id: 'agroconecta',
        name: 'AgroConecta (Fretes)',
        description: 'Sistema de fretes e logística agropecuária',
        status: 'operational',
        uptime: '99.97%',
        responseTime: '95ms',
        lastIncident: null,
        icon: <Truck className="w-6 h-6" />,
        details: {
          activeFreights: '3,456',
          transportCompanies: '1,234',
          completedDeliveries: '67,890',
          avgResponseTime: '2.3h'
        }
      },
      {
        id: 'blockchain',
        name: 'Blockchain Solana',
        description: 'Rede blockchain descentralizada para transações seguras',
        status: 'operational',
        uptime: '99.98%',
        responseTime: '45ms',
        lastIncident: null,
        icon: <Zap className="w-6 h-6" />,
        details: {
          network: 'Mainnet Beta',
          validators: '1,747',
          tps: '65,000',
          blockHeight: '234,567,890'
        }
      },
      {
        id: 'chatbot',
        name: 'Chatbot IA',
        description: 'Assistente virtual inteligente com suporte multilíngue',
        status: 'operational',
        uptime: '99.99%',
        responseTime: '15ms',
        lastIncident: null,
        icon: <Activity className="w-6 h-6" />,
        details: {
          conversations: '23,456',
          languages: '4',
          accuracy: '94.2%',
          responseTime: '0.8s'
        }
      },
      {
        id: 'apis',
        name: 'APIs',
        description: 'Interface de programação para integrações - usado apenas para APIs',
        status: 'operational',
        uptime: '99.97%',
        responseTime: '85ms',
        lastIncident: null,
        icon: <Server className="w-6 h-6" />,
        details: {
          endpoints: '156',
          requests: '2.3M/h',
          successRate: '99.8%',
          avgLatency: '85ms'
        }
      },
      {
        id: 'database',
        name: 'Banco de Dados Inteligente',
        description: 'Banco de dados NoSQL para armazenamento flexível',
        status: 'operational',
        uptime: '99.96%',
        responseTime: '95ms',
        lastIncident: null,
        icon: <Database className="w-6 h-6" />,
        details: {
          collections: '89',
          documents: '12.4M',
          storage: '2.8TB',
          connections: '1,247'
        }
      },
      {
        id: 'auth',
        name: 'Autenticação',
        description: 'Sistema de autenticação e autorização - usado apenas para autenticação',
        status: 'operational',
        uptime: '99.94%',
        responseTime: '150ms',
        lastIncident: null,
        icon: <Lock className="w-6 h-6" />,
        details: {
          users: '45,892',
          activeSessions: '8,234',
          authMethods: '5',
          securityScore: '98.7%'
        }
      }
    ];

    setServices(initialServices);

    // Simular atualizações em tempo real
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simular mudanças de status ocasionais
      setServices(prevServices => 
        prevServices.map(service => {
          // 1% de chance de mudança de status
          if (Math.random() < 0.01) {
            const statuses = ['operational', 'degraded', 'maintenance'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return { ...service, status: newStatus };
          }
          return service;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'outage':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-6 h-6 text-blue-500" />;
      default:
        return <CheckCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'border-green-500 bg-green-500/10';
      case 'degraded':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'outage':
        return 'border-red-500 bg-red-500/10';
      case 'maintenance':
        return 'border-blue-500 bg-blue-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
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

  const getOverallStatus = () => {
    const operational = services.filter(s => s.status === 'operational').length;
    const total = services.length;
    return {
      percentage: Math.round((operational / total) * 100),
      status: operational === total ? 'operational' : 
              operational >= total * 0.8 ? 'degraded' : 'outage'
    };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-16">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <div className="absolute inset-0 bg-white opacity-95"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Status dos Serviços
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monitoramento em tempo real da infraestrutura Agroisync
            </p>
          </motion.div>

          {/* Overall Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className={`inline-flex items-center space-x-4 p-6 rounded-2xl border-2 ${getStatusColor(overallStatus.status)}`}>
              {getStatusIcon(overallStatus.status)}
              <div className="text-left">
                <h2 className="text-2xl font-bold">Status Geral</h2>
                <p className="text-lg text-gray-600">
                  {overallStatus.percentage}% dos serviços operacionais
                </p>
              </div>
            </div>
          </motion.div>

          {/* Last Update */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm text-gray-500"
          >
            Última atualização: {lastUpdate.toLocaleString('pt-BR')}
          </motion.div>
        </div>
      </section>

      {/* Services Status Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-6 rounded-2xl border-2 ${getStatusColor(service.status)} hover:shadow-xl transition-all duration-300`}
              >
                {/* Service Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  {getStatusIcon(service.status)}
                </div>

                {/* Status Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${
                      service.status === 'operational' ? 'text-green-600' :
                      service.status === 'degraded' ? 'text-yellow-600' :
                      service.status === 'outage' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {getStatusText(service.status)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-semibold">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tempo de resposta:</span>
                    <span className="font-semibold">{service.responseTime}</span>
                  </div>
                </div>

                {/* Service Details */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-semibold mb-2 text-gray-600">Métricas em tempo real:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(service.details).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500 capitalize">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Health */}
      <section className={`py-20 px-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Saúde do Sistema
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monitoramento contínuo e alertas automáticos para garantir a estabilidade
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Monitoramento 24/7</h3>
              <p className="text-gray-600">Vigilância contínua com alertas em tempo real</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Manutenção Preventiva</h3>
              <p className="text-gray-600">Atualizações programadas para evitar interrupções</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6 rounded-2xl bg-white dark:bg-gray-700 shadow-lg"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Segurança Avançada</h3>
              <p className="text-gray-600">Proteção contra ameaças e vulnerabilidades</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Status;
