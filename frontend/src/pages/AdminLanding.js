import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, Users, Database, Activity, 
  BarChart3, Settings, ArrowRight, Building
} from 'lucide-react';

const AdminLanding = () => {
  return (
    <div className="min-h-screen bg-agro-bg-primary text-agro-text-primary pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mx-auto h-20 w-20 bg-gradient-to-r from-agro-accent-emerald to-agro-accent-sky rounded-2xl flex items-center justify-center mb-6 shadow-xl"
          >
            <Shield className="h-10 w-10 text-agro-text-primary" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-agro-text-primary mb-4">
            Painel Administrativo
          </h1>
          
          <p className="text-lg text-agro-text-secondary max-w-2xl mx-auto">
            Área de gerenciamento exclusiva para administradores do AgroSync
          </p>
        </motion.div>

        {/* Recursos do Admin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-agro-accent-emerald/20 rounded-lg">
                <Users className="h-6 w-6 text-agro-accent-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-agro-text-primary">Gestão de Usuários</h3>
            </div>
            <p className="text-agro-text-tertiary text-sm">
              Visualize e gerencie todos os usuários da plataforma, permissões e status de conta.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-agro-accent-sky/20 rounded-lg">
                <Database className="h-6 w-6 text-agro-accent-sky" />
              </div>
              <h3 className="text-lg font-semibold text-agro-text-primary">Controle de Dados</h3>
            </div>
            <p className="text-agro-text-tertiary text-sm">
              Acesse logs, auditoria e backup de dados críticos do sistema.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-agro-accent-amber/20 rounded-lg">
                <Activity className="h-6 w-6 text-agro-accent-amber" />
              </div>
              <h3 className="text-lg font-semibold text-agro-text-primary">Monitoramento</h3>
            </div>
            <p className="text-agro-text-tertiary text-sm">
              Monitore performance, status de serviços e métricas em tempo real.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-agro-text-primary">Relatórios</h3>
            </div>
            <p className="text-agro-text-tertiary text-sm">
              Gere relatórios detalhados de vendas, transações e atividades.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6 shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Settings className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-agro-text-primary">Configurações</h3>
            </div>
            <p className="text-agro-text-tertiary text-sm">
              Configure parâmetros do sistema, integrações e políticas de segurança.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card p-6 shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Building className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-agro-text-primary">Suporte</h3>
            </div>
            <p className="text-agro-text-tertiary text-sm">
              Acesse tickets de suporte e gerencie solicitações de usuários.
            </p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <div className="glass p-8">
            <h2 className="text-2xl font-bold text-agro-text-primary mb-4">
              Acesso Restrito
            </h2>
            <p className="text-agro-text-secondary mb-6 max-w-md mx-auto">
              Esta área é exclusiva para administradores autorizados. 
              Entre com suas credenciais para acessar o painel completo.
            </p>
            
            <Link
              to="/admin-login"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Shield className="h-5 w-5" />
              <span>Entrar no Painel</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 pt-8 border-t border-agro-border-primary"
        >
          <p className="text-sm text-agro-text-tertiary">
            © 2025 AgroSync. Todos os direitos reservados.
          </p>
          <p className="text-xs text-agro-text-muted mt-2">
            Acesso restrito a administradores autorizados
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLanding;
