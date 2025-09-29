import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Leaf, Droplets, Zap } from 'lucide-react';

const Insumos = () => {
  const insumosCategories = [
    {
      icon: <Package size={32} />,
      title: 'Sementes',
      description: 'Sementes híbridas de alta qualidade para máxima produtividade.',
      products: [
        {
          name: 'Sementes Híbridas de Soja',
          price: 'R$ 180/bag',
          image:
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Sementes de Milho',
          price: 'R$ 120/bag',
          image:
            'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Sementes de Algodão',
          price: 'R$ 95/bag',
          image:
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ]
    },
    {
      icon: <Droplets size={32} />,
      title: 'Fertilizantes',
      description: 'Fertilizantes orgânicos e químicos para nutrição completa do solo.',
      products: [
        {
          name: 'NPK 20-10-10',
          price: 'R$ 45/kg',
          image:
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Ureia Granulada',
          price: 'R$ 38/kg',
          image:
            'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Superfosfato',
          price: 'R$ 42/kg',
          image:
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ]
    },
    {
      icon: <Leaf size={32} />,
      title: 'Defensivos',
      description: 'Defensivos agrícolas para proteção eficaz contra pragas e doenças.',
      products: [
        {
          name: 'Herbicida Glifosato',
          price: 'R$ 25/L',
          image:
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Fungicida Cobre',
          price: 'R$ 35/L',
          image:
            'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Inseticida Piretróide',
          price: 'R$ 28/L',
          image:
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ]
    },
    {
      icon: <Zap size={32} />,
      title: 'Tecnologia',
      description: 'Insumos tecnológicos para agricultura de precisão e automação.',
      products: [
        {
          name: 'Sensores IoT',
          price: 'R$ 450/un',
          image:
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Drones Agrícolas',
          price: 'R$ 15.000/un',
          image:
            'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          name: 'Software AgTech',
          price: 'R$ 200/mês',
          image:
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ]
    }
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <div className='insumos-page'>
      {/* Hero Section */}
      <section className='insumos-hero'>
        <div className='container'>
          <motion.div
            className='text-center'
            variants={sectionVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            <motion.h1 variants={itemVariants}>Insumos Agrícolas</motion.h1>
            <motion.p variants={itemVariants}>
              Encontre os melhores insumos para sua produção agrícola com qualidade garantida e preços competitivos.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='insumos-categories'>
        <div className='container'>
          <motion.div
            className='insumos-grid'
            variants={sectionVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            {insumosCategories.map((category, index) => (
              <motion.div key={index} className='insumo-category' variants={itemVariants}>
                <div className='category-header'>
                  <div className='category-icon' style={{ color: 'var(--agro-organic-green)' }}>
                    {category.icon}
                  </div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>

                <div className='category-products'>
                  {category.products.map((product, productIndex) => (
                    <div key={productIndex} className='product-item'>
                      <div className='product-image'>
                        <img src={product.image} alt={product.name} loading='lazy' />
                      </div>
                      <div className='product-info'>
                        <h4>{product.name}</h4>
                        <p className='product-price'>{product.price}</p>
                        <button className='product-btn'>COMPRAR AGORA</button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='insumos-cta'>
        <div className='container'>
          <div className='cta-content'>
            <h2>Precisa de ajuda para escolher os insumos ideais?</h2>
            <p>
              Nossa equipe de especialistas está pronta para te ajudar a encontrar os melhores insumos para sua
              produção.
            </p>
            <div className='cta-buttons'>
              <Link to='/contact' className='btn-primary'>
                Falar com Especialista
                <ArrowRight size={20} />
              </Link>
              <Link to='/marketplace' className='btn-secondary'>
                Ver Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .insumos-page {
          background: #f5ede4;
          min-height: 100vh;
        }

        .insumos-hero {
          padding: 4rem 0 2rem;
          background: #f5ede4;
        }

        .insumos-hero h1 {
          font-size: 3rem;
          font-weight: 800;
          color: #3b5d2a;
          margin-bottom: 1rem;
        }

        .insumos-hero p {
          font-size: 1.2rem;
          color: #666666;
          max-width: 600px;
          margin: 0 auto;
        }

        .insumos-categories {
          padding: 2rem 0 4rem;
        }

        .insumos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .insumo-category {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .insumo-category:hover {
          transform: translateY(-5px);
        }

        .category-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .category-icon {
          margin-bottom: 1rem;
        }

        .category-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3b5d2a;
          margin-bottom: 0.5rem;
        }

        .category-header p {
          color: #666666;
          font-size: 0.9rem;
        }

        .category-products {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .product-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f5ede4;
          border-radius: 12px;
          align-items: center;
        }

        .product-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          flex: 1;
        }

        .product-info h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #3b5d2a;
          margin-bottom: 0.25rem;
        }

        .product-price {
          font-size: 1rem;
          font-weight: 700;
          color: #3b5d2a;
          margin-bottom: 0.5rem;
        }

        .product-btn {
          background: #3b5d2a;
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .product-btn:hover {
          background: #6c8c55;
        }

        .insumos-cta {
          padding: 4rem 0;
          background: white;
        }

        .cta-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #3b5d2a;
          margin-bottom: 1rem;
        }

        .cta-content p {
          color: #666666;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .insumos-hero h1 {
            font-size: 2.5rem;
          }

          .insumos-grid {
            grid-template-columns: 1fr;
          }

          .product-item {
            flex-direction: column;
            text-align: center;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
      <div className='mt-8 flex justify-center'></div>
    </div>
  );
};

export default Insumos;
