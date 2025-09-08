import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wallet, 
  Link, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Download,
  Upload,
  Settings,
  Shield,
  TrendingUp,
  DollarSign,
  Coins
} from 'lucide-react'

const Web3Wallet = ({ userId }) => {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadWalletData()
  }, [userId])

  const loadWalletData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/wallet/${userId}`)
      const data = await response.json()

      if (data.success) {
        setWallet(data.wallet)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao carregar dados da carteira')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // Aqui você pode adicionar uma notificação de sucesso
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(balance)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-emerald"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="text-center py-8">
        <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Carteira não encontrada</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Wallet className="w-5 h-5 mr-2 text-agro-emerald" />
          Carteira Web3
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadWalletData}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status da carteira */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${wallet.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {wallet.connected ? 'Conectada' : 'Desconectada'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {wallet.network || 'Ethereum'}
          </span>
          <Shield className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Endereço da carteira */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Endereço da Carteira
        </label>
        <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="flex-1 text-sm font-mono text-gray-900 dark:text-white">
            {formatAddress(wallet.address)}
          </span>
          <button
            onClick={() => copyToClipboard(wallet.address)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {['overview', 'tokens', 'transactions', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-agro-emerald text-agro-emerald'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab === 'overview' && 'Visão Geral'}
              {tab === 'tokens' && 'Tokens'}
              {tab === 'transactions' && 'Transações'}
              {tab === 'settings' && 'Configurações'}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das tabs */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Saldo total */}
          <div className="bg-gradient-to-r from-agro-emerald to-emerald-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Saldo Total</h3>
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">
              ${formatBalance(wallet.totalBalance || 0)}
            </p>
            <p className="text-sm opacity-90 mt-2">
              +2.5% nas últimas 24h
            </p>
          </div>

          {/* Tokens principais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tokens Principais
            </h3>
            <div className="space-y-3">
              {wallet.tokens?.slice(0, 3).map((token) => (
                <div key={token.symbol} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <Coins className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {token.symbol}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {token.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatBalance(token.balance)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${formatBalance(token.usdValue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tokens' && (
        <div className="space-y-4">
          {wallet.tokens?.map((token) => (
            <div key={token.symbol} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <Coins className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {token.symbol}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {token.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatBalance(token.balance)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ${formatBalance(token.usdValue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {wallet.transactions?.map((transaction) => (
            <div key={transaction.hash} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'send' ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'
                }`}>
                  {transaction.type === 'send' ? (
                    <Upload className="w-5 h-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {transaction.type === 'send' ? 'Enviado' : 'Recebido'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatAddress(transaction.hash)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatBalance(transaction.amount)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(transaction.timestamp).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Configurações de Segurança
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Chave Privada
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {showPrivateKey ? wallet.privateKey : '••••••••••••••••'}
                  </p>
                </div>
                <button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Backup da Carteira
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Faça backup da sua carteira
                  </p>
                </div>
                <button className="px-4 py-2 bg-agro-emerald text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                  Backup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Web3Wallet