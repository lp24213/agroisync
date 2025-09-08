import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, 
  Award, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Edit
} from 'lucide-react'

const UserReputationProfile = ({ userId, onEdit }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showBadges, setShowBadges] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/users/${userId}/profile`)
      const data = await response.json()

      if (data.success) {
        setUser(data.user)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao carregar dados do usuário')
    } finally {
      setLoading(false)
    }
  }

  const getReputationLevel = (score) => {
    if (score >= 90) return { level: 'Excelente', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 80) return { level: 'Muito Bom', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 70) return { level: 'Bom', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (score >= 60) return { level: 'Regular', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { level: 'Ruim', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Usuário não encontrado</p>
      </div>
    )
  }

  const reputation = getReputationLevel(user.reputationScore || 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Perfil de Reputação
        </h2>
        {onEdit && (
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Edit className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Header do perfil */}
      <div className="flex items-start space-x-6 mb-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {user.name?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          {user.verified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {user.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {user.bio || 'Usuário do AgroSync'}
          </p>

          <div className="flex items-center space-x-4 mb-4">
            <div className={`px-3 py-1 rounded-full ${reputation.bg} ${reputation.color}`}>
              <span className="text-sm font-medium">{reputation.level}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user.reputationScore || 0}/100
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            {user.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Membro desde {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {['overview', 'reviews', 'transactions', 'badges'].map((tab) => (
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
              {tab === 'reviews' && 'Avaliações'}
              {tab === 'transactions' && 'Transações'}
              {tab === 'badges' && 'Conquistas'}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das tabs */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Transações</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.totalTransactions || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avaliações</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.totalReviews || 0}
                </p>
              </div>
              <Star className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.successRate || 0}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {user.reviews?.map((review) => (
            <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {review.reviewer.name?.charAt(0) || 'R'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {review.reviewer.name}
                    </p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {user.recentTransactions?.map((transaction) => (
            <div key={transaction.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.product?.name || 'Produto'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    R$ {transaction.totalPrice?.toFixed(2) || '0,00'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {user.badges?.map((badge) => (
            <div key={badge.id} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {badge.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserReputationProfile