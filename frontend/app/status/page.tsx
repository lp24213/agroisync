'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Server, Wifi, Database } from 'lucide-react';
import { apiClient } from '../../lib/api';

interface ServiceStatus {
  name: string;
  status: 'loading' | 'online' | 'offline';
  response?: any;
  error?: string;
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Backend Health Check', status: 'loading' },
    { name: 'API Status', status: 'loading' },
    { name: 'Root Endpoint', status: 'loading' },
  ]);

  useEffect(() => {
    const checkServices = async () => {
      // Check health endpoint
      try {
        const healthResponse = await apiClient.healthCheck();
        setServices(prev => prev.map(service => 
          service.name === 'Backend Health Check' 
            ? { 
                name: service.name, 
                status: healthResponse.success ? 'online' : 'offline',
                response: healthResponse.data,
                error: healthResponse.error
              }
            : service
        ));
      } catch (error) {
        setServices(prev => prev.map(service => 
          service.name === 'Backend Health Check' 
            ? { name: service.name, status: 'offline', error: 'Connection failed' }
            : service
        ));
      }

      // Check API status
      try {
        const statusResponse = await apiClient.getStatus();
        setServices(prev => prev.map(service => 
          service.name === 'API Status' 
            ? { 
                name: service.name, 
                status: statusResponse.success ? 'online' : 'offline',
                response: statusResponse.data,
                error: statusResponse.error
              }
            : service
        ));
      } catch (error) {
        setServices(prev => prev.map(service => 
          service.name === 'API Status' 
            ? { name: service.name, status: 'offline', error: 'Connection failed' }
            : service
        ));
      }

      // Check root endpoint
      try {
        const rootResponse = await apiClient.getRoot();
        setServices(prev => prev.map(service => 
          service.name === 'Root Endpoint' 
            ? { 
                name: service.name, 
                status: rootResponse.success ? 'online' : 'offline',
                response: rootResponse.data,
                error: rootResponse.error
              }
            : service
        ));
      } catch (error) {
        setServices(prev => prev.map(service => 
          service.name === 'Root Endpoint' 
            ? { name: service.name, status: 'offline', error: 'Connection failed' }
            : service
        ));
      }
    };

    checkServices();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'border-green-500/30 bg-green-500/10';
      case 'offline':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Server className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Status do Sistema
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Monitoramento em tempo real dos serviços AGROTM
            </p>
          </div>

          {/* Services Status */}
          <div className="space-y-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border ${getStatusColor(service.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {service.status === 'loading' && 'Verificando...'}
                        {service.status === 'online' && 'Operacional'}
                        {service.status === 'offline' && 'Indisponível'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'online' ? 'bg-green-400' :
                      service.status === 'offline' ? 'bg-red-400' :
                      'bg-blue-400 animate-pulse'
                    }`} />
                    <span className={`text-sm font-medium ${
                      service.status === 'online' ? 'text-green-400' :
                      service.status === 'offline' ? 'text-red-400' :
                      'text-blue-400'
                    }`}>
                      {service.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Response Details */}
                {service.response && (
                  <div className="mt-4 p-4 bg-black/20 rounded-lg">
                    <h4 className="text-sm font-semibold text-white mb-2">Resposta:</h4>
                    <pre className="text-xs text-gray-300 overflow-x-auto">
                      {JSON.stringify(service.response, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Error Details */}
                {service.error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Erro:</h4>
                    <p className="text-xs text-red-300">{service.error}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Backend Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-gray-900/50 rounded-xl border border-gray-800"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <Wifi className="w-6 h-6 text-blue-400" />
              Informações do Backend
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">URL do Backend:</h3>
                <p className="text-white font-mono text-sm">
                  {process.env.NEXT_PUBLIC_API_URL || 'https://api.seu-dominio-aws.com'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Status:</h3>
                <p className="text-green-400 font-semibold">AWS - Ativo</p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16 pt-8 border-t border-gray-800"
          >
            <p className="text-gray-400 text-sm">
              Última verificação: {new Date().toLocaleString('pt-BR')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 