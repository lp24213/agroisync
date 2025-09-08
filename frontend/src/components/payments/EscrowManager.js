import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  User, 
  Package, 
  Truck, 
  Calendar,
  Eye,
  MoreVertical,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'

const EscrowManager = ({ userId }) => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'completed', 'cancelled'
  const [stats, setStats] = useState({})

  useEffect(() => {
    loadEscrowData()
  }, [])

  const loadEscrowData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/escrow/transactions?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setTransactions(data.transactions)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do escrow:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRelease = async (transactionId) => {
    try {
      const response = await fetch(`/api/escrow/transactions/${transactionId}/release`, {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        loadEscrowData()
      }
    } catch (error) {
      console.error('Erro ao liberar pagamento:', error)
    }
  }

  const handleCancel = async (transactionId) => {
    try {
      const response = await fetch(`/api/escrow/transactions/${transactionId}/cancel`, {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        loadEscrowData()
      }
    } catch (error) {
      console.error('Erro ao cancelar transação:', error)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'disputed':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'cancelled':
        return 'text-red-600 dark:text-red-400'
      case 'disputed':
        return 'text-orange-600 dark:text-orange-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.status === filter
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Shield className="w-5 h-5 mr-2 text-agro-emerald" />
          Gerenciador de Escrow
        </h2>
        <button
          onClick={loadEscrowData}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total || 0}
              </p>
            </div>
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pending || 0}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Concluídas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completed || 0}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalValue || 0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">Todas</option>
          <option value="pending">Pendentes</option>
          <option value="completed">Concluídas</option>
          <option value="cancelled">Canceladas</option>
          <option value="disputed">Em Disputa</option>
        </select>
      </div>

      {/* Lista de transações */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(transaction.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      #{transaction.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.product?.name || 'Produto'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(transaction.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.buyer?.name || 'Comprador'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ações */}
            {transaction.status === 'pending' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Comprador: {transaction.buyer?.name}</p>
                    <p>Vendedor: {transaction.seller?.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRelease(transaction.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      Liberar Pagamento
                    </button>
                    <button
                      onClick={() => handleCancel(transaction.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma transação encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Não há transações de escrow para exibir
          </p>
        </div>
      )}
    </div>
  )
}

export default EscrowManager