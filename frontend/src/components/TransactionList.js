import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  Package, 
  Truck, 
  User,
  Calendar,
  MapPin,
  Eye,
  MoreVertical
} from 'lucide-react'

const TransactionList = ({ userId, onTransactionSelect }) => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    fetchTransactions()
  }, [userId])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/transactions?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'NEGOTIATING':
        return <MessageSquare className="w-4 h-4" />
      case 'AGREED':
        return <CheckCircle className="w-4 h-4" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      case 'DISPUTED':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'NEGOTIATING':
        return 'text-blue-600 dark:text-blue-400'
      case 'AGREED':
        return 'text-green-600 dark:text-green-400'
      case 'COMPLETED':
        return 'text-green-600 dark:text-green-400'
      case 'CANCELLED':
        return 'text-red-600 dark:text-red-400'
      case 'DISPUTED':
        return 'text-orange-600 dark:text-orange-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente'
      case 'NEGOTIATING':
        return 'Negociando'
      case 'AGREED':
        return 'Acordado'
      case 'COMPLETED':
        return 'Concluído'
      case 'CANCELLED':
        return 'Cancelado'
      case 'DISPUTED':
        return 'Em Disputa'
      default:
        return status
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
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

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'price':
        return b.totalPrice - a.totalPrice
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-emerald"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Transações
        </h2>
        
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Todas</option>
            <option value="PENDING">Pendentes</option>
            <option value="NEGOTIATING">Negociando</option>
            <option value="AGREED">Acordadas</option>
            <option value="COMPLETED">Concluídas</option>
            <option value="CANCELLED">Canceladas</option>
            <option value="DISPUTED">Em Disputa</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="date">Data</option>
            <option value="price">Preço</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Nenhuma transação encontrada
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTransactions.map((transaction) => (
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
                      {formatPrice(transaction.totalPrice)}
                    </p>
                    <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                      {getStatusText(transaction.status)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(transaction.createdAt)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.quantity} unidades
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onTransactionSelect?.(transaction)}
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

              {transaction.seller && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Vendedor: {transaction.seller.name}
                      </span>
                    </div>
                    
                    {transaction.shipping && (
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.shipping}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TransactionList