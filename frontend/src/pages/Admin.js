import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Users, Package, Truck, DollarSign, BarChart3, 
  Settings, LogOut, Eye, EyeOff, Lock, Mail,
  TrendingUp, Activity, Shield, Database, Building
} from 'lucide-react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    freights: 0,
    revenue: 0,
    systemStatus: 'Operacional'
  });
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // CAMADA 3: Sistema de Admin Exclusivo
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(null);

  // CAMADA 3: Lista de emails autorizados como admin
  const authorizedEmails = [
    'luispaulooliveira767@gmail.com',
    'admin@agroisync.com',
    'suporte@agroisync.com'
  ];

  // CAMADA 3: Verificar se o usuário é admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setAdminLoading(true);
        
        // Verificar se o usuário está logado
        if (!user) {
          setIsAdmin(false);
          setAdminLoading(false);
          return;
        }

        // Verificar se o email está na lista de autorizados
        const isAuthorized = authorizedEmails.includes(user.email);
        
        if (isAuthorized) {
          setIsAdmin(true);
          // Carregar dados do admin (placeholders por enquanto)
          setAdminData({
            stats: {
              totalUsers: 0,
              activeUsers: 0,
              totalRevenue: 0,
              pendingPayments: 0
            },
            recentActivity: [],
            systemStatus: 'operational'
          });
        } else {
          setIsAdmin(false);
          setAdminError('Acesso negado. Apenas administradores autorizados.');
        }
        
        setAdminLoading(false);
      } catch (error) {
        console.error('Erro ao verificar status de admin:', error);
        setAdminError('Erro ao verificar permissões de administrador');
        setAdminLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // CAMADA 3: Redirecionar usuários não autorizados
  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      // Usuário logado mas não é admin - redirecionar para dashboard
      navigate('/dashboard');
    } else if (!adminLoading && !isAdmin && !user) {
      // Usuário não logado - redirecionar para login comum
      navigate('/login');
    }
  }, [isAdmin, adminLoading, user, navigate]);

  // CAMADA 3: Carregar estatísticas do admin
  const loadAdminStats = async () => {
    try {
      // Placeholder: dados simulados para demonstração
      const mockStats = {
        stats: {
          totalUsers: 1247,
          activeUsers: 892,
          totalRevenue: 45678.90,
          pendingPayments: 12
        },
        recentActivity: [
          {
            id: 1,
            type: 'user_registration',
            description: 'Novo usuário registrado',
            timestamp: new Date(Date.now() - 300000), // 5 minutos atrás
            user: 'usuario@exemplo.com'
          },
          {
            id: 2,
            type: 'payment_received',
            description: 'Pagamento recebido',
            timestamp: new Date(Date.now() - 900000), // 15 minutos atrás
            user: 'cliente@exemplo.com',
            amount: 99.90
          },
          {
            id: 3,
            type: 'support_ticket',
            description: 'Ticket de suporte aberto',
            timestamp: new Date(Date.now() - 1800000), // 30 minutos atrás
            user: 'suporte@exemplo.com'
          }
        ],
        systemStatus: 'operational'
      };

      setAdminData(mockStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setAdminError('Erro ao carregar dados do painel');
    }
  };

  // CAMADA 3: Atualizar status do sistema
  const updateSystemStatus = async (status) => {
    try {
      // Placeholder: simular atualização de status
      setAdminData(prev => ({
        ...prev,
        systemStatus: status
      }));
      
      // Aqui seria feita a chamada real para a API
      console.log(`Status do sistema atualizado para: ${status}`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setAdminError('Erro ao atualizar status do sistema');
    }
  };

  // CAMADA 3: Processar pagamento pendente
  const processPayment = async (paymentId) => {
    try {
      // Placeholder: simular processamento de pagamento
      console.log(`Processando pagamento: ${paymentId}`);
      
      // Aqui seria feita a chamada real para a API de pagamentos
      setAdminData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          pendingPayments: Math.max(0, prev.stats.pendingPayments - 1)
        }
      }));
      
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setAdminError('Erro ao processar pagamento');
    }
  };

  // CAMADA 3: Sistema de login admin exclusivo
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // CAMADA 3: Fazer login como admin
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoginLoading(true);
      setLoginError('');

      // Validar se o email está na lista de autorizados
      if (!authorizedEmails.includes(loginEmail)) {
        setLoginError('Email não autorizado para acesso administrativo');
        setLoginLoading(false);
        return;
      }

      // Aqui seria feita a validação real com a API
      // Por enquanto, simulamos um login bem-sucedido
      console.log('Tentativa de login admin:', loginEmail);
      
      // Simular delay de validação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Se chegou até aqui, o email está autorizado
      // Em produção, aqui seria feita a validação real de senha
      setIsAdmin(true);
      setAdminData({
        stats: {
          totalUsers: 1247,
          activeUsers: 892,
          totalRevenue: 45678.90,
          pendingPayments: 12
        },
        recentActivity: [],
        systemStatus: 'operational'
      });
      
    } catch (error) {
      console.error('Erro no login admin:', error);
      setLoginError('Erro interno do sistema');
    } finally {
      setLoginLoading(false);
    }
  };

  // CAMADA 3: Logout do admin
  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminData(null);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    // Redirecionar para a página inicial
    navigate('/');
  };

  // Página de Login Admin
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo e Título - DESIGN PREMIUM */}
          <div className="text-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 flex items-center justify-center shadow-lg"
            >
              <Building className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gradient-agro mb-2">Painel Administrativo</h1>
            <p className="text-slate-600">Agroisync - Sistema de Gestão</p>
          </div>

          {/* Formulário de Login */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Acesso Restrito</h2>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  E-mail Administrativo
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="admin@agroisync.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Acessar Painel'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Acesso restrito apenas para administradores autorizados
              </p>
            </div>
          </div>

          {/* Voltar ao site */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-slate-800 transition-colors duration-200"
            >
              ← Voltar ao site principal
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Painel Administrativo
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Painel Administrativo</h1>
                <p className="text-sm text-slate-600">Agroisync</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Logado como: {email}
              </span>
              <button
                onClick={handleAdminLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Usuários Ativos</p>
                <p className="text-3xl font-bold text-slate-800">{stats.users.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Produtos</p>
                <p className="text-3xl font-bold text-slate-800">{stats.products.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Fretes</p>
                <p className="text-3xl font-bold text-slate-800">{stats.freights.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Receita Total</p>
                <p className="text-3xl font-bold text-slate-800">R$ {stats.revenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Status do Sistema</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${stats.systemStatus === 'Operacional' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-slate-600">{stats.systemStatus}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600">API</p>
              <p className="font-semibold text-slate-800">Online</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Database className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Banco de Dados</p>
              <p className="font-semibold text-slate-800">Online</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <Shield className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Segurança</p>
              <p className="font-semibold text-slate-800">Ativo</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6">Ações Rápidas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors duration-200 text-left">
              <Users className="w-6 h-6 text-slate-600 mb-2" />
              <h3 className="font-semibold text-slate-800">Gerenciar Usuários</h3>
              <p className="text-sm text-slate-600">Visualizar e editar usuários</p>
            </button>
            
            <button className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors duration-200 text-left">
              <Package className="w-6 h-6 text-slate-600 mb-2" />
              <h3 className="font-semibold text-slate-800">Gerenciar Produtos</h3>
              <p className="text-sm text-slate-600">Adicionar e remover produtos</p>
            </button>
            
            <button className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors duration-200 text-left">
              <Settings className="w-6 h-6 text-slate-600 mb-2" />
              <h3 className="font-semibold text-slate-800">Configurações</h3>
              <p className="text-sm text-slate-600">Configurar sistema</p>
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
