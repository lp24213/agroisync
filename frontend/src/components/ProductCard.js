import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <motion.article
      className='product-card card'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className='product-image'>
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: '100%',
            height: 180,
            objectFit: 'cover',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px'
          }}
          loading='lazy'
          onError={e => {
            e.target.src =
              'https://images.unsplash.com/photo-1600747476236-76579658b1b1?w=300&auto=format&fit=crop&q=60';
          }}
        />
      </div>
      <div style={{ padding: 16 }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600' }}>{product.title}</h3>
        <p
          style={{
            margin: '0 0 12px 0',
            color: 'var(--muted)',
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}
        >
          {product.description}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12
          }}
        >
          <strong style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>{product.price}</strong>
          <Link
            to={`/produto/${product.id}`}
            className='btn small'
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            Ver Detalhes
          </Link>
        </div>
        <div
          style={{
            marginTop: '8px',
            fontSize: '0.8rem',
            color: 'var(--muted)'
          }}
        >
          📍 {product.location}
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
