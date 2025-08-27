import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Package, Truck, DollarSign, BarChart3, 
  Settings, LogOut, Eye, EyeOff, Lock, Mail,
  TrendingUp, Activity, Shield, Database, Building,
  AlertTriangle, CheckCircle, Clock, Star, Zap,
  UserPlus, UserMinus, Edit, Trash, Ban, Unlock,
  Download, Upload, RefreshCw, Search, Filter
} from 'lucide-react';

const AdminCard = ({ 
  type, 
  data, 
  onAction, 
  onView, 
  onEdit, 
  onDelete, 
  onBan, 
  onUnban,
  onExport,
  onImport 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAction = (action, itemId) => {
    if (onAction) onAction(action, itemId);
  };

  const handleView = (itemId) => {
    if (onView) onView(itemId);
  };

  const handleEdit = (itemId) => {
    if (onEdit) onEdit(itemId);
  };

  const handleDelete = (itemId) => {
    if (onDelete) onDelete(itemId);
  };

  const handleBan = (itemId) => {
    if (onBan) onBan(itemId);
  };

  const handleUnban = (itemId) => {
    if (onUnban) onUnban(itemId);
  };

  const handleExport = (itemId) => {
    if (onExport) onExport(itemId);
  };

  const handleImport = () => {
    if (onImport) onImport();
  };

  const getCardIcon = (type) => {
    const icons = {
      'user': <Users className="w-6 h-6" />,
      'product': <Package className="w-6 h-6" />,
      'freight': <Truck className="w-6 h-6" />,
      'payment': <DollarSign className="w-6 h-6" />,
      'system': <Settings className="w-6 h-6" />,
      'activity': <Activity className="w-6 h-6" />,
      'security': <Shield className="w-6 h-6" />,
      'database': <Database className="w-6 h-6" />
    };
    return icons[type] || <BarChart3 className="w-6 h-6" />;
  };

  const getCardColor = (type) => {
    const colors = {
      'user': 'from-blue-500 to-cyan-500',
      'product': 'from-emerald-500 to-green-500',
      'freight': 'from-orange-500 to-yellow-500',
      'payment': 'from-green-500 to-emerald-500',
      'system': 'from-slate-500 to-gray-500',
      'activity': 'from-purple-500 to-pink-500',
      'security': 'from-red-500 to-pink-500',
      'database': 'from-indigo-500 to-blue-500'
    };
    return colors[type] || 'from-emerald-500 to-blue-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'online':
      case 'operational':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending':
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'inactive':
      case 'offline':
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'banned':
      case 'suspended':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'online':
      case 'operational':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'warning':
        return <Clock className="w-4 h-4" />;
      case 'inactive':
      case 'offline':
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      case 'banned':
      case 'suspended':
        return <Ban className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (typeof amount === 'number') {
      return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return amount;
  };

  const formatNumber = (number) => {
    if (typeof number === 'number') {
      return number.toLocaleString('pt-BR');
    }
    return number;
  };

  const renderCardContent = () => {
    switch (type) {
      case 'user':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">{data.name || 'Usuário'}</h3>
                <p className="text-sm text-slate-600">{data.email || 'email@exemplo.com'}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(data.status)} flex items-center space-x-1`}>
                {getStatusIcon(data.status)}
                <span>{data.status || 'Ativo'}</span>
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Plano:</span>
                <p className="font-medium text-slate-700">{data.plan || 'Básico'}</p>
              </div>
              <div>
                <span className="text-slate-500">Registrado:</span>
                <p className="font-medium text-slate-700">{formatDate(data.createdAt)}</p>
              </div>
            </div>
            
            {data.lastLogin && (
              <div className="text-xs text-slate-500">
                Último login: {formatDate(data.lastLogin)}
              </div>
            )}
          </div>
        );

      case 'product':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">{data.name || 'Produto'}</h3>
                <p className="text-sm text-slate-600">{data.category || 'Categoria'}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(data.status)} flex items-center space-x-1`}>
                {getStatusIcon(data.status)}
                <span>{data.status || 'Ativo'}</span>
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Preço:</span>
                <p className="font-medium text-slate-700">{formatCurrency(data.price)}</p>
              </div>
              <div>
                <span className="text-slate-500">Vendedor:</span>
                <p className="font-medium text-slate-700">{data.seller || 'N/A'}</p>
              </div>
            </div>
            
            {data.description && (
              <p className="text-sm text-slate-600 line-clamp-2">{data.description}</p>
            )}
          </div>
        );

      case 'freight':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">Frete #{data.id || 'N/A'}</h3>
                <p className="text-sm text-slate-600">{data.origin || 'Origem'} → {data.destination || 'Destino'}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(data.status)} flex items-center space-x-1`}>
                {getStatusIcon(data.status)}
                <span>{data.status || 'Disponível'}</span>
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Valor:</span>
                <p className="font-medium text-slate-700">{formatCurrency(data.price)}</p>
              </div>
              <div>
                <span className="text-slate-500">Peso:</span>
                <p className="font-medium text-slate-700">{data.weight || 'N/A'}</p>
              </div>
            </div>
            
            <div className="text-xs text-slate-500">
              Criado: {formatDate(data.createdAt)}
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">Pagamento #{data.id || 'N/A'}</h3>
                <p className="text-sm text-slate-600">{data.user || 'Usuário'}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(data.status)} flex items-center space-x-1`}>
                {getStatusIcon(data.status)}
                <span>{data.status || 'Pendente'}</span>
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Valor:</span>
                <p className="font-medium text-slate-700">{formatCurrency(data.amount)}</p>
              </div>
              <div>
                <span className="text-slate-500">Método:</span>
                <p className="font-medium text-slate-700">{data.method || 'Cartão'}</p>
              </div>
            </div>
            
            <div className="text-xs text-slate-500">
              Data: {formatDate(data.date)}
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">{data.name || 'Sistema'}</h3>
                <p className="text-sm text-slate-600">{data.description || 'Descrição do sistema'}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(data.status)} flex items-center space-x-1`}>
                {getStatusIcon(data.status)}
                <span>{data.status || 'Online'}</span>
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Versão:</span>
                <p className="font-medium text-slate-700">{data.version || '1.0.0'}</p>
              </div>
              <div>
                <span className="text-slate-500">Uptime:</span>
                <p className="font-medium text-slate-700">{data.uptime || '99.9%'}</p>
              </div>
            </div>
            
            {data.lastUpdate && (
              <div className="text-xs text-slate-500">
                Última atualização: {formatDate(data.lastUpdate)}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-slate-800">{data.title || 'Item'}</h3>
              <p className="text-sm text-slate-600">{data.description || 'Descrição do item'}</p>
            </div>
            
            <div className="text-xs text-slate-500">
              Criado: {formatDate(data.createdAt)}
            </div>
          </div>
        );
    }
  };

  const renderActions = () => {
    const actions = [];
    
    if (onView) actions.push({ label: 'Ver', icon: <Eye className="w-4 h-4" />, action: () => handleView(data.id) });
    if (onEdit) actions.push({ label: 'Editar', icon: <Edit className="w-4 h-4" />, action: () => handleEdit(data.id) });
    if (onDelete) actions.push({ label: 'Excluir', icon: <Trash className="w-4 h-4" />, action: () => handleDelete(data.id) });
    if (onBan && data.status !== 'banned') actions.push({ label: 'Banir', icon: <Ban className="w-4 h-4" />, action: () => handleBan(data.id) });
    if (onUnban && data.status === 'banned') actions.push({ label: 'Desbanir', icon: <Unlock className="w-4 h-4" />, action: () => handleUnban(data.id) });
    if (onExport) actions.push({ label: 'Exportar', icon: <Download className="w-4 h-4" />, action: () => handleExport(data.id) });

    return actions.map((action, index) => (
      <motion.button
        key={index}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={action.action}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors duration-200"
      >
        {action.icon}
        <span>{action.label}</span>
      </motion.button>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${getCardColor(type)} rounded-xl flex items-center justify-center text-white`}>
              {getCardIcon(type)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 capitalize">{type}</h2>
              <p className="text-sm text-slate-600">ID: {data.id || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowActions(!showActions)}
              className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-200"
            >
              <Settings className="w-4 h-4 text-slate-600" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors duration-200"
            >
              <BarChart3 className="w-4 h-4 text-slate-600" />
            </motion.button>
          </div>
        </div>

        {/* Conteúdo principal */}
        {renderCardContent()}

        {/* Ações rápidas */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t border-slate-200"
          >
            <div className="flex flex-wrap gap-2">
              {renderActions()}
            </div>
          </motion.div>
        )}
      </div>

      {/* Detalhes expandidos */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-slate-200 pt-4">
            <div className="space-y-3 text-sm">
              {/* Informações adicionais */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-slate-700">Criado em:</span>
                  <p className="text-slate-600 mt-1">{formatDate(data.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Atualizado em:</span>
                  <p className="text-slate-600 mt-1">{formatDate(data.updatedAt)}</p>
                </div>
              </div>
              
              {/* Estatísticas */}
              {data.stats && (
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="font-medium text-slate-700 mb-2">Estatísticas</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(data.stats).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-slate-500 capitalize">{key}:</span>
                        <p className="text-slate-600 font-medium">{formatNumber(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Metadados */}
              {data.metadata && (
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="font-medium text-slate-700 mb-2">Metadados</h4>
                  <div className="space-y-2">
                    {Object.entries(data.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-slate-500 capitalize">{key}:</span>
                        <span className="text-slate-600">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Botão para expandir detalhes */}
      <div className="px-6 pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>{isExpanded ? 'Ocultar detalhes' : 'Ver mais detalhes'}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <BarChart3 className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AdminCard;
