// 🌟 VITRINE DE PRODUTOS/FRETES EM DESTAQUE
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Award, Sparkles } from 'lucide-react';
import { getApiUrl } from '../../config/constants';
import ProductCard from '../ProductCard';

const FeaturedShowcase = ({ type = 'product', title = 'Destaques da Semana', limit = 6 }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedItems();
  }, [type]);

  const fetchFeaturedItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getApiUrl('')}/monetization/sponsored?type=${type}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setItems(data.data.slice(0, limit));
      }
    } catch (error) {
      console.error('Error fetching featured items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent'></div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  const icons = {
    product: <Award size={28} />,
    freight: <TrendingUp size={28} />
  };

  return (
    <section
      style={{
        padding: 'clamp(2rem, 4vw, 4rem) 0',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
        borderTop: '2px solid rgba(34, 197, 94, 0.2)',
        borderBottom: '2px solid rgba(34, 197, 94, 0.2)'
      }}
    >
      <div className='container mx-auto px-4'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(2rem, 4vw, 3rem)'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              marginBottom: '1rem',
              boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
            }}
          >
            {icons[type]}
            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              {title}
            </span>
            <Sparkles size={22} />
          </div>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            {type === 'product' 
              ? 'Produtos selecionados e verificados. Vendedores com selo de confiança.'
              : 'Transportadores premium com avaliação máxima. Frete garantido.'}
          </p>
        </motion.div>

        {/* Grid de itens */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(1rem, 2vw, 1.5rem)'
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {type === 'product' ? (
                <ProductCard product={item} isFeatured={true} />
              ) : (
                <FreightCard freight={item} isFeatured={true} />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA para anunciar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            textAlign: 'center',
            marginTop: 'clamp(2rem, 4vw, 3rem)',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            border: '2px dashed rgba(34, 197, 94, 0.3)'
          }}
        >
          <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
            🚀 Quer aparecer aqui?
          </h4>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Destaque {type === 'product' ? 'seus produtos' : 'seus fretes'} e venda mais!
          </p>
          <a
            href='/user-dashboard?tab=sponsored'
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              borderRadius: '10px',
              fontWeight: '700',
              textDecoration: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)';
            }}
          >
            Patrocinar Agora
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// Componente simples de freight card (caso não exista)
const FreightCard = ({ freight, isFeatured }) => {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.25rem',
        border: isFeatured ? '2px solid #fbbf24' : '2px solid #e5e7eb',
        boxShadow: isFeatured 
          ? '0 8px 25px rgba(251, 191, 36, 0.25)' 
          : '0 4px 15px rgba(0, 0, 0, 0.08)',
        position: 'relative'
      }}
    >
      {isFeatured && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: '700'
          }}
        >
          ⭐ DESTAQUE
        </div>
      )}
      
      <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>
        {freight.title || 'Frete Disponível'}
      </h4>
      
      <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem' }}>
        {freight.origin_city} → {freight.dest_city}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#22c55e' }}>
          R$ {freight.price?.toFixed(2) || '0.00'}
        </span>
        <button
          style={{
            padding: '8px 16px',
            background: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default FeaturedShowcase;

