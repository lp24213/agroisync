import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Users, 
  TrendingUp,
  Award,
  Target,
  Zap,
  Fire,
  ChevronDown,
  ChevronUp,
  Filter,
  Calendar,
  RefreshCw,
  Eye,
  User,
  ShoppingCart,
  Truck,
  MessageSquare,
  BarChart3
} from 'lucide-react'

const Leaderboard = () => {
  const { t } = useTranslation()
  const [leaderboardData, setLeaderboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('overall')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [expandedUser, setExpandedUser] = useState(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [selectedType, selectedPeriod])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/gamification/leaderboard?type=${selectedType}&period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setLeaderboardData(data.data)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">
          {position}
        </span>
    }
  }

  const getRankColor = (position) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
      default:
        return 'bg-white border border-gray-200 text-gray-900'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'overall':
        return <BarChart3 className="w-5 h-5" />
      case 'buyers':
        return <ShoppingCart className="w-5 h-5" />
      case 'sellers':
        return <Users className="w-5 h-5" />
      case 'drivers':
        return <Truck className="w-5 h-5" />
      case 'reviews':
        return <MessageSquare className="w-5 h-5" />
      default:
        return <Trophy className="w-5 h-5" />
    }
  }

  const getTypeName = (type) => {
    const names = {
      overall: t('gamification.overall', 'Geral'),
      buyers: t('gamification.buyers', 'Compradores'),
      sellers: t('gamification.sellers', 'Vendedores'),
      drivers: t('gamification.drivers', 'Entregadores'),
      reviews: t('gamification.reviews', 'Avaliações')
    }
    return names[type] || type
  }

  const getPeriodName = (period) => {
    const names = {
      week: t('gamification.week', 'Semana'),
      month: t('gamification.month', 'Mês'),
      year: t('gamification.year', 'Ano')
    }
    return names[period] || period
  }

  const formatScore = (score) => {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`
    } else if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}K`
    }
    return score.toString()
  }

  const formatValue = (value, type) => {
    switch (type) {
      case 'buyers':
        return `R$ ${value.toLocaleString()}`
      case 'sellers':
        return `R$ ${value.toLocaleString()}`
      case 'drivers':
        return `${value} entregas`
      case 'reviews':
        return `${value} avaliações`
      default:
        return formatScore(value)
    }
  }

  const getValueLabel = (type) => {
    const labels = {
      buyers: t('gamification.totalSpent', 'Total Gasto'),
      sellers: t('gamification.totalEarned', 'Total Ganho'),
      drivers: t('gamification.deliveries', 'Entregas'),
      reviews: t('gamification.reviews', 'Avaliações'),
      overall: t('gamification.score', 'Pontuação')
    }
    return labels[type] || t('gamification.value', 'Valor')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('gamification.loading', 'Carregando leaderboard...')}</p>
        </div>
      </div>
    )
  }

  if (!leaderboardData) {
    return (
      <div className="text-center p-8">
        <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">{t('gamification.errorLoading', 'Erro ao carregar leaderboard')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('gamification.leaderboard', 'Leaderboard')}
              </h2>
              <p className="text-sm text-gray-600">
                {t('gamification.competitionDescription', 'Competição entre usuários da plataforma')}
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchLeaderboard}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={t('gamification.refresh', 'Atualizar')}
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="overall">{t('gamification.overall', 'Geral')}</option>
              <option value="buyers">{t('gamification.buyers', 'Compradores')}</option>
              <option value="sellers">{t('gamification.sellers', 'Vendedores')}</option>
              <option value="drivers">{t('gamification.drivers', 'Entregadores')}</option>
              <option value="reviews">{t('gamification.reviews', 'Avaliações')}</option>
            </select>
          </div>

          {/* Period Filter */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">{t('gamification.week', 'Semana')}</option>
              <option value="month">{t('gamification.month', 'Mês')}</option>
              <option value="year">{t('gamification.year', 'Ano')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Position */}
      {leaderboardData.userPosition && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">
                  {t('gamification.yourPosition', 'Sua Posição')}
                </h3>
                <p className="text-blue-100">
                  {t('gamification.positionDescription', 'Você está em')} #{leaderboardData.userPosition.position} {t('gamification.of', 'de')} {leaderboardData.userPosition.total}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-3xl font-bold">
                #{leaderboardData.userPosition.position}
              </p>
              <p className="text-blue-100">
                {t('gamification.outOf', 'de')} {leaderboardData.userPosition.total}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getTypeIcon(selectedType)}
            <h3 className="text-lg font-semibold text-gray-900">
              {getTypeName(selectedType)} - {getPeriodName(selectedPeriod)}
            </h3>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {leaderboardData.leaderboard.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                expandedUser === user._id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(user.position)}`}>
                    {getRankIcon(user.position)}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">{user.name || 'Usuário'}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                          {user.role}
                        </span>
                        {user.gamification?.level && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Nível {user.gamification.level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score/Value */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatValue(
                      selectedType === 'overall' ? user.gamification?.score || 0 :
                      selectedType === 'buyers' ? user.totalSpent || 0 :
                      selectedType === 'sellers' ? user.totalEarned || 0 :
                      selectedType === 'drivers' ? user.deliveryCount || 0 :
                      selectedType === 'reviews' ? user.reviewCount || 0 : 0,
                      selectedType
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getValueLabel(selectedType)}
                  </p>
                </div>

                {/* Expand Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {expandedUser === user._id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </motion.button>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedUser === user._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Badges */}
                      {user.gamification?.badges && user.gamification.badges.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">
                            {t('gamification.badges', 'Badges')}
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {user.gamification.badges.slice(0, 5).map((badge, badgeIndex) => (
                              <span
                                key={badgeIndex}
                                className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                              >
                                {badge.name}
                              </span>
                            ))}
                            {user.gamification.badges.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                +{user.gamification.badges.length - 5}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Additional Stats */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">
                          {t('gamification.stats', 'Estatísticas')}
                        </h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>{t('gamification.level', 'Nível')}: {user.gamification?.level || 1}</p>
                          <p>{t('gamification.score', 'Pontuação')}: {formatScore(user.gamification?.score || 0)}</p>
                          {user.gamification?.rank && (
                            <p>{t('gamification.rank', 'Rank')}: {user.gamification.rank}</p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">
                          {t('gamification.actions', 'Ações')}
                        </h5>
                        <div className="space-y-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="w-4 h-4 inline mr-1" />
                            {t('gamification.viewProfile', 'Ver Perfil')}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Badges */}
      {leaderboardData.userBadges && leaderboardData.userBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('gamification.yourBadges', 'Seus Badges')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaderboardData.userBadges.map((badge, index) => (
              <motion.div
                key={badge._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${badge.color}-100 rounded-full flex items-center justify-center`}>
                    <Star className={`w-5 h-5 text-${badge.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{badge.name}</h4>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Leaderboard
