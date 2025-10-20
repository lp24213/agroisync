import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, Shield, Clock, MessageSquare, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * 🌟 SISTEMA DE AVALIAÇÕES 5 ESTRELAS
 * Componente completo para avaliar motoristas e empresas
 */

const RatingSystem = ({ 
  targetId, 
  targetType = 'driver', // 'driver' | 'company' | 'product'
  targetName,
  onSubmit,
  existingRating = null 
}) => {
  const [rating, setRating] = useState(existingRating?.stars || 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existingRating?.comment || '');
  const [criteria, setCriteria] = useState({
    punctuality: existingRating?.criteria?.punctuality || 0,
    communication: existingRating?.criteria?.communication || 0,
    professionalism: existingRating?.criteria?.professionalism || 0,
    cargoHandling: existingRating?.criteria?.cargoHandling || 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const criteriaLabels = {
    driver: {
      punctuality: 'Pontualidade',
      communication: 'Comunicação',
      professionalism: 'Profissionalismo',
      cargoHandling: 'Cuidado com a Carga'
    },
    company: {
      punctuality: 'Prazo de Pagamento',
      communication: 'Clareza na Negociação',
      professionalism: 'Profissionalismo',
      cargoHandling: 'Qualidade da Carga'
    },
    product: {
      punctuality: 'Entrega no Prazo',
      communication: 'Qualidade',
      professionalism: 'Embalagem',
      cargoHandling: 'Custo-Benefício'
    }
  };

  const labels = criteriaLabels[targetType];

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Selecione uma avaliação de 1 a 5 estrelas');
      return;
    }

    if (Object.values(criteria).some(v => v === 0)) {
      toast.error('Avalie todos os critérios');
      return;
    }

    setIsSubmitting(true);

    try {
      const ratingData = {
        targetId,
        targetType,
        stars: rating,
        criteria,
        comment: comment.trim(),
        timestamp: new Date().toISOString()
      };

      // Enviar para API
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      
      const response = await fetch(`${apiUrl}/ratings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ratingData)
      });

      if (!response.ok) throw new Error('Erro ao enviar avaliação');

      const result = await response.json();

      toast.success('✅ Avaliação enviada com sucesso!');
      
      if (onSubmit) {
        onSubmit(ratingData);
      }

      // Reset form
      setRating(0);
      setComment('');
      setCriteria({
        punctuality: 0,
        communication: 0,
        professionalism: 0,
        cargoHandling: 0
      });

    } catch (error) {
      console.error('Rating error:', error);
      toast.error('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {existingRating ? 'Editar Avaliação' : 'Avaliar'}: {targetName}
        </h2>
        <p className="text-gray-600">Sua opinião ajuda a comunidade!</p>
      </div>

      {/* Rating Stars */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
          Avaliação Geral
        </label>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none transition-all duration-200"
            >
              <Star
                size={48}
                className={`${
                  star <= (hover || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                } transition-colors duration-200`}
              />
            </motion.button>
          ))}
        </div>
        <p className="text-center mt-3 text-lg font-semibold text-gray-700">
          {rating === 0 && 'Selecione sua avaliação'}
          {rating === 1 && '😞 Muito Ruim'}
          {rating === 2 && '😕 Ruim'}
          {rating === 3 && '😐 Regular'}
          {rating === 4 && '😊 Bom'}
          {rating === 5 && '🤩 Excelente'}
        </p>
      </div>

      {/* Detailed Criteria */}
      <div className="space-y-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Critérios Detalhados</h3>
        
        {Object.keys(criteria).map((key) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                {key === 'punctuality' && <Clock className="h-4 w-4 text-blue-500" />}
                {key === 'communication' && <MessageSquare className="h-4 w-4 text-green-500" />}
                {key === 'professionalism' && <Shield className="h-4 w-4 text-purple-500" />}
                {key === 'cargoHandling' && <ThumbsUp className="h-4 w-4 text-orange-500" />}
                {labels[key]}
              </label>
              <span className="text-sm font-semibold text-gray-600">
                {criteria[key]}/5
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCriteria({ ...criteria, [key]: value })}
                  className={`flex-1 h-10 rounded-lg transition-all duration-200 ${
                    value <= criteria[key]
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-500'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Comentário (opcional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua experiência detalhada..."
          maxLength={500}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {comment.length}/500 caracteres
        </p>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Send className="h-5 w-5" />
        {isSubmitting ? 'Enviando...' : existingRating ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
      </motion.button>

      {/* Info Footer */}
      <p className="text-xs text-gray-500 text-center mt-4">
        ⚠️ Avaliações são públicas e não podem ser excluídas após 24 horas.
      </p>
    </div>
  );
};

export default RatingSystem;

