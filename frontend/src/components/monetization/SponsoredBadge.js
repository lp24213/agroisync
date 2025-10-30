// 💼 BADGE DE ITEM PATROCINADO
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';

const SponsoredBadge = ({ type = 'featured', size = 'normal' }) => {
  const badges = {
    featured: {
      icon: <Star size={size === 'small' ? 14 : 16} />,
      text: 'Destaque',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      emoji: '⭐'
    },
    top_listing: {
      icon: <Zap size={size === 'small' ? 14 : 16} />,
      text: 'Top',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      emoji: '🔥'
    },
    premium_badge: {
      icon: <Star size={size === 'small' ? 14 : 16} />,
      text: 'Premium',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
      emoji: '💎'
    },
    highlighted: {
      icon: <Zap size={size === 'small' ? 14 : 16} />,
      text: 'Patrocinado',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      emoji: '💼'
    }
  };

  const badge = badges[type] || badges.featured;
  const isSmall = size === 'small';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '4px' : '6px',
        background: badge.gradient,
        color: 'white',
        padding: isSmall ? '4px 10px' : '6px 14px',
        borderRadius: isSmall ? '6px' : '8px',
        fontSize: isSmall ? '0.7rem' : '0.75rem',
        fontWeight: '700',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        letterSpacing: '0.3px',
        textTransform: 'uppercase'
      }}
    >
      <span style={{ fontSize: isSmall ? '12px' : '14px' }}>{badge.emoji}</span>
      {badge.text}
    </motion.div>
  );
};

export default SponsoredBadge;

