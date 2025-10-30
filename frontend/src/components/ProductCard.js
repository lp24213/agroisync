import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <motion.article
      className='product-card'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: '0 12px 40px rgba(42, 127, 79, 0.2)' }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'var(--card-bg)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '2px solid rgba(42, 127, 79, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }}
    >
      <div style={{ 
        position: 'relative', 
        width: '100%',
        paddingTop: '60%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(42, 127, 79, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)'
      }}>
        <img
          src={product.image}
          alt={product.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          loading='lazy'
          onError={e => {
            e.target.src = 'https://images.unsplash.com/photo-1600747476236-76579658b1b1?w=400&auto=format&fit=crop&q=60';
          }}
        />
      </div>
      <div style={{ 
        padding: 'clamp(1rem, 3vw, 1.25rem)', 
        display: 'flex', 
        flexDirection: 'column',
        flex: 1,
        gap: '0.75rem'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', 
          fontWeight: '700',
          color: 'var(--text)',
          lineHeight: '1.3',
          minHeight: '2.6em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.title}
        </h3>
        <p
          style={{
            margin: 0,
            color: 'var(--muted)',
            fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
            lineHeight: '1.5',
            flex: 1,
            minHeight: '3em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.description}
        </p>
        <div
          style={{
            padding: '0.5rem 0.75rem',
            background: 'rgba(42, 127, 79, 0.05)',
            borderRadius: '8px',
            fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
            color: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '1.1em' }}>📍</span>
          <span style={{ fontWeight: '500' }}>{product.location}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '2px solid rgba(42, 127, 79, 0.1)',
            marginTop: 'auto'
          }}
        >
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ 
              fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)', 
              color: 'var(--muted)',
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              Preço
            </div>
            <strong style={{ 
              color: 'var(--accent)', 
              fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
              fontWeight: '800'
            }}>
              {product.price}
            </strong>
          </div>
          <Link
            to={`/produto/${product.id}`}
            style={{
              padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.25rem)',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              fontWeight: '700',
              background: 'linear-gradient(135deg, var(--accent) 0%, #2e7d32 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(42, 127, 79, 0.3)',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(42, 127, 79, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(42, 127, 79, 0.3)';
            }}
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
