import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Shield, 
  MessageSquare,
  Mail,
  Bell,
  Download,
  Upload,
  Settings,
  Activity,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Search,
  MoreVertical,
  RefreshCw,
  Zap,
  Database,
  Server,
  Mail as MailIcon,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

const PowerModeDashboard = () => {
  const { t } = useTranslation()
  const [powerModeData, setPowerModeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [exportLoading, setExportLoading] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)

  useEffect(() => {
    fetchPowerModeData()
    const interval = setInterval(fetchPowerModeData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchPowerModeData = async () => {
    try {
      const response = await fetch('/api/admin/power-mode', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setPowerModeData(data.data)
      }
    } catch (error) {
      console.error('Error fetching power mode data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (dataType, format) => {
    setExportLoading(true)
    try {
      const response = await fetch('/api/admin/power-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          dataType,
          format,
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            end: new Date()
          }
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${dataType}_export_${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setExportLoading(false)
    }
  }

  const handleBulkOperation = async (operation, targetIds, data) => {
    setBulkLoading(true)
    try {
      const response = await fetch('/api/admin/power-mode', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          operation,
          targetIds,
          data
        })
      })
      
      const result = await response.json()
      if (result.success) {
        // Refresh data
        await fetchPowerModeData()
      }
    } catch (error) {
      console.error('Bulk operation error:', error)
    } finally {
      setBulkLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg border-2 ${color} shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Icon className="w-8 h-8 text-gray-600" />
          {trend && (
            <div className={`flex items-center ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {trend > 0 ? <ArrowUp className="w-4 h-4" /> : trend < 0 ? <ArrowDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  const tabs = [
    { id: 'overview', name: t('admin.overview', 'Visão Geral'), icon: BarChart3 },
    { id: 'users', name: t('admin.users', 'Usuários'), icon: Users },
    { id: 'orders', name: t('admin.orders', 'Pedidos'), icon: ShoppingCart },
    { id: 'payments', name: t('admin.payments', 'Pagamentos'), icon: CreditCard },
    { id: 'kyc', name: t('admin.kyc', 'KYC'), icon: Shield },
    { id: 'messages', name: t('admin.messages', 'Mensagens'), icon: MessageSquare },
    { id: 'system', name: t('admin.system', 'Sistema'), icon: Server }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.loading', 'Carregando dados...')}</p>
        </div>
      </div>
    )
  }

  if (!powerModeData) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">{t('admin.errorLoading', 'Erro ao carregar dados')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-yellow-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('admin.powerMode', 'Admin Power Mode')}
                </h1>
                <p className="text-sm text-gray-600">
                  {t('admin.comprehensiveAnalytics', 'Análise abrangente e controle total do sistema')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchPowerModeData}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('admin.refresh', 'Atualizar dados')}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Activity className="w-4 h-4" />
                <span>{t('admin.lastUpdate', 'Última atualização')}: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title={t('admin.totalUsers', 'Total de Usuários')}
                  value={powerModeData.userStats.total}
                  icon={Users}
                  color="bg-white border-gray-200"
                  trend={5.2}
                  subtitle={`${powerModeData.userStats.active} ativos`}
                />
                
                <StatCard
                  title={t('admin.totalOrders', 'Total de Pedidos')}
                  value={powerModeData.orderStats.total}
                  icon={ShoppingCart}
                  color="bg-white border-gray-200"
                  trend={12.5}
                  subtitle={`R$ ${powerModeData.orderStats.revenue.toLocaleString()}`}
                />
                
                <StatCard
                  title={t('admin.totalPayments', 'Total de Pagamentos')}
                  value={powerModeData.paymentStats.total}
                  icon={CreditCard}
                  color="bg-white border-gray-200"
                  trend={8.7}
                  subtitle={`R$ ${powerModeData.paymentStats.totalAmount.toLocaleString()}`}
                />
                
                <StatCard
                  title={t('admin.kycDocuments', 'Documentos KYC')}
                  value={powerModeData.kycStats.total}
                  icon={Shield}
                  color="bg-white border-gray-200"
                  trend={-2.1}
                  subtitle={`${powerModeData.kycStats.approved} aprovados`}
                />
              </div>

              {/* Real-time Metrics */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('admin.realTimeMetrics', 'Métricas em Tempo Real')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">
                      {powerModeData.realTimeMetrics.activeUsers}
                    </p>
                    <p className="text-sm text-blue-700">
                      {t('admin.activeUsers', 'Usuários Ativos')}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">
                      {powerModeData.realTimeMetrics.newOrders}
                    </p>
                    <p className="text-sm text-green-700">
                      {t('admin.newOrders', 'Novos Pedidos')}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <CreditCard className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-900">
                      {powerModeData.realTimeMetrics.newPayments}
                    </p>
                    <p className="text-sm text-yellow-700">
                      {t('admin.newPayments', 'Novos Pagamentos')}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-900">
                      {powerModeData.realTimeMetrics.newMessages}
                    </p>
                    <p className="text-sm text-purple-700">
                      {t('admin.newMessages', 'Novas Mensagens')}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('admin.systemHealth', 'Saúde do Sistema')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(powerModeData.systemHealth).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {value === 'healthy' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{key}</p>
                        <p className="text-sm text-gray-600 capitalize">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('admin.quickActions', 'Ações Rápidas')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExport('users', 'excel')}
                    disabled={exportLoading}
                    className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                  >
                    <Download className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-blue-900">
                      {t('admin.exportUsers', 'Exportar Usuários')}
                    </p>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExport('orders', 'pdf')}
                    disabled={exportLoading}
                    className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                  >
                    <Download className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-900">
                      {t('admin.exportOrders', 'Exportar Pedidos')}
                    </p>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExport('payments', 'csv')}
                    disabled={exportLoading}
                    className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors"
                  >
                    <Download className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="font-medium text-yellow-900">
                      {t('admin.exportPayments', 'Exportar Pagamentos')}
                    </p>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* User Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title={t('admin.activeUsers', 'Usuários Ativos')}
                  value={powerModeData.userStats.active}
                  icon={Users}
                  color="bg-green-50 border-green-200"
                />
                
                <StatCard
                  title={t('admin.suspendedUsers', 'Usuários Suspensos')}
                  value={powerModeData.userStats.suspended}
                  icon={AlertTriangle}
                  color="bg-red-50 border-red-200"
                />
                
                <StatCard
                  title={t('admin.verifiedUsers', 'Usuários Verificados')}
                  value={powerModeData.userStats.verified}
                  icon={Shield}
                  color="bg-blue-50 border-blue-200"
                />
              </div>

              {/* Role Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('admin.roleDistribution', 'Distribuição por Função')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {powerModeData.userStats.roleDistribution.map((role) => (
                    <div key={role._id} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 capitalize">{role._id}</p>
                      <p className="text-2xl font-bold text-gray-900">{role.count}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('admin.recentUsers', 'Usuários Recentes')}
                </h3>
                
                <div className="space-y-3">
                  {powerModeData.userStats.recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 capitalize">{user.role}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Add more tabs as needed */}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PowerModeDashboard
