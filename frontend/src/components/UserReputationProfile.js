import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Target, Gift, Shield, Star, Award, ShoppingCart, Truck, MessageCircle, TrendingUp } from 'lucide-react';
import gamificationService, { 
  BADGE_RARITY_COLORS, 
  BADGE_RARITY_NAMES 
} from '../services/gamificationService';

const UserReputationProfile = ({ userId, className = '' }) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBadges, setShowBadges] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar dados em paralelo
      const [profileData, statsData, badgesData] = await Promise.all([
        gamificationService.getUserProfile(),
        gamificationService.getUserStats(),
        gamificationService.getUserBadges()
      ]);

      setProfile(profileData.data);
      setStats(statsData.data);
      setBadges(badgesData.data.earnedBadges || []);

    } catch (error) {
      console.error('Erro ao carregar dados de reputação:', error);
      setError('Erro ao carregar dados de reputação');
    } finally {
      // setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    if (level >= 50) return 'text-yellow-600';
    if (level >= 30) return 'text-purple-600';
    if (level >= 20) return 'text-blue-600';
    if (level >= 10) return 'text-green-600';
    return 'text-gray-600';
  };

  const getLevelIcon = (level) => {
    if (level >= 50) return <Crown className="w-5 h-5" />;
    if (level >= 30) return <Shield className="w-5 h-5" />;
    if (level >= 20) return <Star className="w-5 h-5" />;
    if (level >= 10) return <Award className="w-5 h-5" />;
    return <Target className="w-5 h-5" />;
  };


  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-premium p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-premium-platinum rounded mb-4"></div>
          <div className="h-4 bg-premium-platinum rounded mb-2"></div>
          <div className="h-4 bg-premium-platinum rounded mb-4"></div>
          <div className="h-32 bg-premium-platinum rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-premium p-6 ${className}`}>
        <div className="text-center text-premium-gray">
          <p className="text-sm">{error}</p>
          <button 
            onClick={loadUserData}
            className="mt-2 text-accent-emerald hover:text-accent-emerald/80 text-sm"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const progressToNextLevel = stats?.progressToNextLevel || {
    current: profile.experience,
    required: profile.experienceToNextLevel,
    percentage: 0
  };

  return (
    <div className={`bg-white rounded-lg shadow-premium p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-premium rounded-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-premium-dark-gray">
              Perfil de Reputação
            </h3>
            <p className="text-sm text-premium-gray">
              Nível {profile.level} • {gamificationService.formatScore(profile.totalScore)} pontos
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowBadges(!showBadges)}
          className="p-2 text-premium-gray hover:text-premium-dark-gray hover:bg-premium-platinum rounded-lg transition-premium"
        >
          <Award className="w-5 h-5" />
        </button>
      </div>

      {/* Nível e Progresso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={getLevelColor(profile.level)}>
              {getLevelIcon(profile.level)}
            </span>
            <span className="font-semibold text-premium-dark-gray">
              Nível {profile.level}
            </span>
          </div>
          <span className="text-sm text-premium-gray">
            {progressToNextLevel.current} / {progressToNextLevel.required} XP
          </span>
        </div>
        
        {/* Barra de Progresso */}
        <div className="w-full bg-premium-platinum rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-accent-emerald to-accent-blue h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextLevel.percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <p className="text-xs text-premium-gray mt-2">
          {progressToNextLevel.percentage}% para o próximo nível
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-premium-platinum rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-accent-emerald" />
            <span className="text-sm font-medium text-premium-dark-gray">Produtos</span>
          </div>
          <div className="text-2xl font-bold text-premium-dark-gray">
            {profile.productStats?.totalProducts || 0}
          </div>
          <div className="text-xs text-premium-gray">
            {profile.productStats?.activeProducts || 0} ativos
          </div>
        </div>

        <div className="bg-premium-platinum rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Truck className="w-4 h-4 text-accent-blue" />
            <span className="text-sm font-medium text-premium-dark-gray">Fretes</span>
          </div>
          <div className="text-2xl font-bold text-premium-dark-gray">
            {profile.freightStats?.totalFreights || 0}
          </div>
          <div className="text-xs text-premium-gray">
            {profile.freightStats?.completedFreights || 0} completos
          </div>
        </div>

        <div className="bg-premium-platinum rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-medium text-premium-dark-gray">Contatos</span>
          </div>
          <div className="text-2xl font-bold text-premium-dark-gray">
            {profile.productStats?.totalContacts || 0}
          </div>
          <div className="text-xs text-premium-gray">
            {profile.productStats?.totalViews || 0} visualizações
          </div>
        </div>

        <div className="bg-premium-platinum rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-premium-dark-gray">Avaliação</span>
          </div>
          <div className="text-2xl font-bold text-premium-dark-gray">
            {profile.transactionStats?.averageRating?.toFixed(1) || '0.0'}
          </div>
          <div className="text-xs text-premium-gray">
            {profile.transactionStats?.successfulTransactions || 0} transações
          </div>
        </div>
      </div>

      {/* Badges */}
      <AnimatePresence>
        {showBadges && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="border-// t border-premium-platinum pt-6"
          >
            <h4 className="font-semibold text-premium-dark-gray mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-accent-gold" />
              <span>Conquistas ({badges.length})</span>
            </h4>
            
            {badges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-premium-platinum rounded-lg p-3 flex items-center space-x-3"
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-premium-dark-gray text-sm">
                        {badge.name}
                      </div>
                      <div className="text-xs text-premium-gray">
                        {badge.description}
                      </div>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${BADGE_RARITY_COLORS[badge.rarity]}`}>
                        {BADGE_RARITY_NAMES[badge.rarity]}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-premium-gray py-8">
                <Gift className="w-12 h-12 mx-auto mb-3 text-premium-light-gray" />
                <p className="text-sm">Nenhuma conquista ainda</p>
                <p className="text-xs">Continue usando a plataforma para ganhar badges!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ranking */}
      {stats?.ranking && (
        <div className="mt-6 pt-6 border-// t border-premium-platinum">
          <h4 className="font-semibold text-premium-dark-gray mb-3 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-accent-emerald" />
            <span>Ranking</span>
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-premium-platinum rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-premium-dark-gray">
                #{stats.ranking.global || 'N/A'}
              </div>
              <div className="text-xs text-premium-gray">Global</div>
            </div>
            
            <div className="bg-premium-platinum rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-premium-dark-gray">
                #{stats.ranking.regional || 'N/A'}
              </div>
              <div className="text-xs text-premium-gray">Regional</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReputationProfile;
