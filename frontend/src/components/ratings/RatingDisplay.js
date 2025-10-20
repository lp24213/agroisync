import React from 'react';
import { Star, Clock, MessageSquare, Shield, ThumbsUp, TrendingUp, Award } from 'lucide-react';

/**
 * 🌟 EXIBIÇÃO DE AVALIAÇÕES
 * Mostra score, estatísticas e avaliações individuais
 */

const RatingDisplay = ({ ratings = [], targetName, showStats = true }) => {
  // Calcular estatísticas
  const calculateStats = () => {
    if (ratings.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: [0, 0, 0, 0, 0],
        criteriaAverages: {
          punctuality: 0,
          communication: 0,
          professionalism: 0,
          cargoHandling: 0
        }
      };
    }

    const average = ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;
    
    const distribution = [0, 0, 0, 0, 0];
    ratings.forEach(r => distribution[r.stars - 1]++);

    const criteriaAverages = {
      punctuality: ratings.reduce((sum, r) => sum + (r.criteria?.punctuality || 0), 0) / ratings.length,
      communication: ratings.reduce((sum, r) => sum + (r.criteria?.communication || 0), 0) / ratings.length,
      professionalism: ratings.reduce((sum, r) => sum + (r.criteria?.professionalism || 0), 0) / ratings.length,
      cargoHandling: ratings.reduce((sum, r) => sum + (r.criteria?.cargoHandling || 0), 0) / ratings.length
    };

    return { average, total: ratings.length, distribution, criteriaAverages };
  };

  const stats = calculateStats();

  // Badge baseado na média
  const getBadge = (average) => {
    if (average >= 4.8) return { text: 'Top Performer', color: 'from-yellow-400 to-orange-500', icon: Award };
    if (average >= 4.5) return { text: 'Premium', color: 'from-purple-500 to-pink-500', icon: TrendingUp };
    if (average >= 4.0) return { text: 'Verificado', color: 'from-blue-500 to-cyan-500', icon: Shield };
    return null;
  };

  const badge = getBadge(stats.average);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      {showStats && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{targetName}</h3>
              <p className="text-gray-600 text-sm">{stats.total} avaliações</p>
            </div>
            {badge && (
              <div className={`bg-gradient-to-r ${badge.color} text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md`}>
                <badge.icon className="h-4 w-4" />
                {badge.text}
              </div>
            )}
          </div>

          {/* Average Rating */}
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">
                {stats.average.toFixed(1)}
              </div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={star <= Math.round(stats.average) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>

            {/* Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.distribution[star - 1];
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 w-12">
                      {star} ⭐
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Criteria Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-300">
            <div className="text-center">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.criteriaAverages.punctuality.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Pontualidade</div>
            </div>
            <div className="text-center">
              <MessageSquare className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.criteriaAverages.communication.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Comunicação</div>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.criteriaAverages.professionalism.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Profissionalismo</div>
            </div>
            <div className="text-center">
              <ThumbsUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.criteriaAverages.cargoHandling.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Carga</div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">
          Avaliações Recentes ({ratings.length})
        </h3>
        {ratings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma avaliação ainda</p>
            <p className="text-gray-500 text-sm">Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          ratings.map((rating, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {rating.userName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {rating.userName || 'Usuário Anônimo'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(rating.timestamp).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= rating.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              {rating.comment && (
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {rating.comment}
                </p>
              )}

              {/* Mini Criteria */}
              {rating.criteria && (
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    ⏰ {rating.criteria.punctuality}/5
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    💬 {rating.criteria.communication}/5
                  </span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    🛡️ {rating.criteria.professionalism}/5
                  </span>
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    👍 {rating.criteria.cargoHandling}/5
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingDisplay;

