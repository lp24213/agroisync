import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import {
  ShoppingCart,
  Star,
  Heart,
  Filter,
  Search,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Package,
  UserPlus,
  MapPin,
  Eye,
  X
} from 'lucide-react';
import CryptoHash from '../components/CryptoHash';

const AgroisyncLoja = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [sortBy, setSortBy] = useState('relevancia');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(true);

  // Carregar produtos reais do backend
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // setLoading(true);
      const productsData = await productService.getProducts();
      setProducts(productsData.products || productsData || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProducts([]);
    } finally {
      // setLoading(false);
    }
  };

  const categories = [
    { value: 'todos', label: 'Todos os Produtos' },
    { value: 'maquinas', label: 'Máquinas Agrícolas' },
    { value: 'insumos', label: 'Insumos Agrícolas' },
    { value: 'defensivos', label: 'Defensivos' },
    { value: 'ferramentas', label: 'Ferramentas' }
  ];

  const sortOptions = [
    { value: 'relevancia', label: 'Mais Relevantes' },
    { value: 'preco-menor', label: 'Menor Preço' },
    { value: 'preco-maior', label: 'Maior Preço' },
    { value: 'avaliacao', label: 'Melhor Avaliação' },
    { value: 'novidade', label: 'Mais Novos' }
  ];

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const features = [
    {
      icon: <Shield size={32} />,
      title: 'Garantia Total',
      description: 'Todos os produtos com garantia estendida e suporte técnico especializado'
    },
    {
      icon: <Truck size={32} />,
      title: 'Entrega Rápida',
      description: 'Entrega em todo o Brasil com rastreamento em tempo real'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Produtos Originais',
      description: '100% originais com certificação e procedência garantida'
    },
    {
      icon: <Clock size={32} />,
      title: 'Suporte 24/7',
      description: 'Atendimento especializado disponível 24 horas por dia'
    }
  ];

  // Função para buscar cadastros públicos
  // const fetchPublicRegistrations = async () => {
  //   try {
  //     const response = await fetch('/api/registration/loja/public');
  //     const data = await response.json();
  //     if (data.success) {
  //       setPublicRegistrations(data.data);
  //     }
  //   } catch (error) {
  //     console.error('Erro ao buscar cadastros públicos:', error);
  //   }
  // };

  useEffect(() => {
    // Buscar cadastros públicos
    // fetchPublicRegistrations();
  }, []);

  return (
    <div className='agro-loja-container' data-page='loja'>
      {/* Hero Section */}
      <section
        className='relative flex min-h-screen items-center justify-center'
        style={{
          backgroundImage: `url('https://media.istockphoto.com/id/2235929731/pt/foto/e-commerce-business-with-digital-shopping-cart-icons-for-online-store-digital-marketing-and.jpg?s=612x612&w=0&k=20&c=PuPwyebMsSW7UFTurrlronetuOOwQBbcB_zT8Jki7VM=')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll'
        }}
      >
        <div className='absolute inset-0 bg-black/50'></div>
        <div className='relative z-10 mx-auto max-w-4xl px-4 text-center'>
          <motion.h1
            className='mb-6 text-6xl font-bold text-white'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            AGROISYNC LOJA
          </motion.h1>
          <motion.p
            className='mb-8 text-2xl text-white/90'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A maior loja online do agronegócio brasileiro
          </motion.p>
          <motion.div
            className='flex justify-center gap-4'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to='/register'
              className='rounded-lg bg-green-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-green-700'
            >
              Começar a Vender
            </Link>
            <Link
              to='/marketplace'
              className='rounded-lg bg-white px-8 py-4 font-semibold text-green-600 transition-colors hover:bg-gray-100'
            >
              Explorar Produtos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='agro-features-section'>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='agro-text-center'
            style={{ marginBottom: '3rem' }}
          >
            <h2 className='agro-section-title'>Por que Comprar na Agroisync?</h2>
            <p className='agro-section-subtitle'>Garantia de qualidade, preços competitivos e tecnologia de ponta</p>
          </motion.div>

          <div className='agro-features-grid'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className='agro-feature-card agro-card-animated'
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className='agro-feature-icon'>{feature.icon}</div>
                <h3 className='agro-feature-title'>{feature.title}</h3>
                <p className='agro-feature-description'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className='agro-products-section' style={{ background: 'var(--bg-gradient)' }}>
        <div className='agro-container'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='agro-text-center'
            style={{ marginBottom: '2rem' }}
          >
            <h2 className='agro-section-title'>Produtos em Destaque</h2>
            <p className='agro-section-subtitle'>Encontre os melhores produtos para seu agronegócio</p>
          </motion.div>

          {/* Filtros */}
          <motion.div
            className='agro-filters-container agro-card-animated'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className='agro-filters-grid'>
              {/* Busca */}
              <div className='agro-filter-group'>
                <label className='agro-filter-label'>
                  <Search size={16} />
                  Buscar Produtos
                </label>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder='Digite o produto...'
                  className='agro-btn-animated'
                />
              </div>

              {/* Categoria */}
              <div className='agro-filter-group'>
                <label className='agro-filter-label'>
                  <Filter size={16} />
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className='agro-btn-animated'
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenação */}
              <div className='agro-filter-group'>
                <label className='agro-filter-label'>
                  <Package size={16} />
                  Ordenar por
                </label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className='agro-btn-animated'>
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Botão de Cadastro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={() => setShowRegistrationModal(true)}
              className='agro-btn-animated'
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, var(--accent) 0%, #2e7d32 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(42, 127, 79, 0.3)'
              }}
            >
              <UserPlus size={20} />
              Cadastrar como Vendedor
            </button>

            <button
              onClick={() => setShowPlansModal(true)}
              className='agro-btn-animated'
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
              }}
            >
              <Star size={20} />
              Ver Planos Premium
            </button>
          </motion.div>

          {/* Grid de Produtos */}
          <motion.div
            className='agro-products-grid'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className='agro-product-card agro-card-animated'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Badge de Destaque */}
                {product.featured && (
                  <div className='agro-product-badge'>
                    <Star size={16} />
                    Destaque
                  </div>
                )}

                {/* Imagem do Produto */}
                <div className='agro-product-image'>
                  <img src={product.image} alt={product.name} loading='lazy' />
                  <div className='agro-product-overlay'>
                    <button className='agro-product-quick-view'>
                      <Eye size={20} />
                    </button>
                    <button className='agro-product-favorite'>
                      <Heart size={20} />
                    </button>
                  </div>
                </div>

                {/* Informações do Produto */}
                <div className='agro-product-info'>
                  <div className='agro-product-category'>{product.category}</div>
                  <h3 className='agro-product-name'>{product.name}</h3>
                  <p className='agro-product-description'>{product.description}</p>

                  {/* Avaliação */}
                  <div className='agro-product-rating'>
                    <div className='agro-stars'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(product.rating) ? '#FFD700' : 'none'}
                          color={i < Math.floor(product.rating) ? '#FFD700' : '#E5E5E5'}
                        />
                      ))}
                    </div>
                    <span className='agro-rating-text'>
                      {product.rating} ({product.reviews} avaliações)
                    </span>
                  </div>

                  {/* Localização */}
                  <div className='agro-product-location'>
                    <MapPin size={14} />
                    <span>{product.location}</span>
                  </div>

                  {/* Preços */}
                  <div className='agro-product-pricing'>
                    <div className='agro-price-current'>{product.price}</div>
                    {product.originalPrice && <div className='agro-price-original'>{product.originalPrice}</div>}
                    {product.discount && <div className='agro-discount-badge'>{product.discount}</div>}
                  </div>

                  {/* Botões de Ação */}
                  <div className='agro-product-actions'>
                    <button className='agro-btn-primary agro-btn-animated'>
                      <ShoppingCart size={16} />
                      Comprar Agora
                    </button>
                    <button
                      className='agro-btn-secondary agro-btn-animated'
                      onClick={() => window.open(`/produto/${product.id}`, '_blank')}
                    >
                      <ArrowRight size={16} />
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='agro-text-center'
              style={{ padding: '3rem', color: 'var(--muted)' }}
            >
              <h3>Nenhum produto encontrado</h3>
              <p>Tente ajustar os filtros para encontrar o que você procura.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className='agro-cta-section'>
        <div className='agro-container'>
          <motion.div
            className='agro-cta-content agro-card-animated'
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Precisa de Ajuda para Escolher?</h2>
            <p>
              Nossa equipe de especialistas está pronta para ajudar você a encontrar os melhores produtos para seu
              agronegócio.
            </p>
            <div className='agro-cta-buttons'>
              <Link to='/contact' className='agro-btn-primary agro-btn-animated'>
                <Shield size={20} />
                Falar com Especialista
              </Link>
              <Link to='/marketplace' className='agro-btn-secondary agro-btn-animated'>
                <Package size={20} />
                Ver Produtos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .agro-loja-container {
          background: #ffffff;
          min-height: 100vh;
        }

        .agro-features-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .agro-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .agro-feature-card {
          background: #ffffff;
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(76, 175, 80, 0.1);
          transition: all 0.3s ease;
        }

        .agro-feature-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem auto;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        .agro-feature-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
          font-family: 'Inter', sans-serif;
        }

        .agro-feature-description {
          color: #6c757d;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .agro-products-section {
          padding: 4rem 0;
        }

        .agro-filters-container {
          background: #ffffff;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 3rem;
          border: 1px solid rgba(76, 175, 80, 0.1);
        }

        .agro-filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          align-items: end;
        }

        .agro-filter-group {
          display: flex;
          flex-direction: column;
        }

        .agro-filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }

        .agro-filter-group input,
        .agro-filter-group select {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid rgba(76, 175, 80, 0.2);
          border-radius: 12px;
          font-size: 1rem;
          background: rgba(76, 175, 80, 0.05);
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .agro-filter-group input:focus,
        .agro-filter-group select:focus {
          outline: none;
          border-color: #4caf50;
          background: rgba(76, 175, 80, 0.1);
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .agro-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .agro-product-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.1);
          transition: all 0.3s ease;
          position: relative;
        }

        .agro-product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .agro-product-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          z-index: 2;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }

        .agro-product-image {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .agro-product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .agro-product-card:hover .agro-product-image img {
          transform: scale(1.05);
        }

        .agro-product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .agro-product-card:hover .agro-product-overlay {
          opacity: 1;
        }

        .agro-product-quick-view,
        .agro-product-favorite {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          color: #2c3e50;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .agro-product-quick-view:hover,
        .agro-product-favorite:hover {
          background: #4caf50;
          color: #ffffff;
          transform: scale(1.1);
        }

        .agro-product-info {
          padding: 1.5rem;
        }

        .agro-product-category {
          color: #4caf50;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .agro-product-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          font-family: 'Inter', sans-serif;
        }

        .agro-product-description {
          color: #6c757d;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .agro-product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .agro-stars {
          display: flex;
          gap: 2px;
        }

        .agro-rating-text {
          color: #6c757d;
          font-size: 0.85rem;
        }

        .agro-product-location {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #6c757d;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .agro-product-pricing {
          margin-bottom: 1.5rem;
        }

        .agro-price-current {
          font-size: 1.4rem;
          font-weight: 700;
          color: #4caf50;
          font-family: 'Inter', sans-serif;
        }

        .agro-price-original {
          font-size: 1rem;
          color: #6c757d;
          text-decoration: line-through;
          margin-top: 0.25rem;
        }

        .agro-discount-badge {
          display: inline-block;
          background: #ff6b35;
          color: #ffffff;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .agro-product-actions {
          display: flex;
          gap: 0.75rem;
        }

        .agro-btn-primary,
        .agro-btn-secondary {
          flex: 1;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }

        .agro-btn-primary {
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: #ffffff;
        }

        .agro-btn-primary:hover {
          background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        .agro-btn-secondary {
          background: transparent;
          color: #4caf50;
          border: 2px solid #4caf50;
        }

        .agro-btn-secondary:hover {
          background: #4caf50;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        .agro-cta-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        }

        .agro-cta-content {
          background: rgba(255, 255, 255, 0.95);
          padding: 3rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .agro-cta-content h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2c3e50;
          margin-bottom: 1rem;
          font-family: 'Inter', sans-serif;
        }

        .agro-cta-content p {
          font-size: 1.2rem;
          color: #6c757d;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .agro-cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .agro-cta-buttons .agro-btn-primary,
        .agro-cta-buttons .agro-btn-secondary {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .agro-features-grid {
            grid-template-columns: 1fr;
          }

          .agro-products-grid {
            grid-template-columns: 1fr;
          }

          .agro-filters-grid {
            grid-template-columns: 1fr;
          }

          .agro-product-actions {
            flex-direction: column;
          }

          .agro-cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .agro-cta-content h2 {
            font-size: 2rem;
          }

          .agro-cta-content p {
            font-size: 1rem;
          }
        }
      `}</style>

      {/* Modal de Cadastro */}
      {showRegistrationModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='mx-4 max-w-md rounded-lg bg-white p-8'>
            <h3 className='text-xl font-semibold text-gray-600'>Sistema de Registro em Desenvolvimento</h3>
            <p className='mt-2 text-gray-500'>Em breve teremos sistema de registro disponível!</p>
            <button
              onClick={() => setShowRegistrationModal(false)}
              className='mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Planos */}
      {showPlansModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <div className='max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-white'>
            <div className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-gray-800'>Planos Premium - Loja</h2>
                <button onClick={() => setShowPlansModal(false)} className='text-gray-500 hover:text-gray-700'>
                  <X size={24} />
                </button>
              </div>
              <div className='py-8 text-center'>
                <h3 className='text-xl font-semibold text-gray-600'>Sistema de Planos em Desenvolvimento</h3>
                <p className='mt-2 text-gray-500'>Em breve teremos planos disponíveis para você!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='mt-8 flex justify-center'>
        <CryptoHash pageName='loja' style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default AgroisyncLoja;
