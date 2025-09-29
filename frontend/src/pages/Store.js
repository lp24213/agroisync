import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import productService from '../services/productService';
import { Search, Star, Heart, Truck, Shield, Zap, ArrowRight, Grid, List } from 'lucide-react';

const Store = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar produtos reais do backend
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getProducts();
      setProducts(productsData.products || productsData || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === 'all' ? products : products.filter(product => product.category === selectedCategory);

  const features = [
    {
      icon: Truck,
      title: 'Entrega Rápida',
      description: 'Entrega em até 48h para todo o Brasil'
    },
    {
      icon: Shield,
      title: 'Garantia Total',
      description: 'Garantia de 30 dias em todos os produtos'
    },
    {
      icon: Zap,
      title: 'Suporte 24/7',
      description: 'Atendimento especializado sempre disponível'
    }
  ];

  return (
    <div className='min-h-screen'>
      {/* HERO COM IMAGEM 4K DE MILHO/SOJA */}
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h1 className='mb-6 text-5xl font-bold text-gray-800'>LOJA AGROISYNC</h1>
          <p className='mb-8 text-xl text-gray-600'>Commodities Agrícolas em Tempo Real</p>
          <div className='rounded-lg bg-white p-8 shadow-lg'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-700'>Hero Section em Desenvolvimento</h2>
            <p className='text-gray-500'>Em breve teremos uma seção hero completa disponível!</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className='section-sm bg-secondary'>
        <div className='container'>
          <div className='grid-futuristic grid-cols-1 md:grid-cols-3'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='card-futuristic text-center'
              >
                <div className='bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl'>
                  <feature.icon size={32} className='text-white' />
                </div>
                <h3 className='text-primary mb-2 text-xl font-bold'>{feature.title}</h3>
                <p className='text-secondary'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Content */}
      <section className='section bg-primary'>
        <div className='container'>
          {/* Filters and Search */}
          <div className='card-futuristic mb-8'>
            <div className='flex flex-col items-center justify-between gap-6 lg:flex-row'>
              {/* Search */}
              <div className='max-w-md flex-1'>
                <div className='relative'>
                  <Search size={20} className='text-muted absolute left-3 top-1/2 -translate-y-1/2 transform' />
                  <input type='text' placeholder='Buscar produtos...' className='form-input w-full pl-10' />
                </div>
              </div>

              {/* Categories */}
              <div className='flex flex-wrap gap-2'>
                {[
                  { id: 'all', name: 'Todos' },
                  { id: 'grains', name: 'Grãos' },
                  { id: 'vegetables', name: 'Vegetais' },
                  { id: 'fruits', name: 'Frutas' },
                  { id: 'seeds', name: 'Sementes' }
                ].map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'text-secondary bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* View Mode */}
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'text-secondary hover:bg-gray-100'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'text-secondary hover:bg-gray-100'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className={`grid-futuristic ${
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card-futuristic group ${viewMode === 'list' ? 'flex flex-row items-center gap-6' : ''}`}
              >
                {/* Product Image */}
                <div className={`relative ${viewMode === 'list' ? 'h-32 w-48 flex-shrink-0' : 'h-48 w-full'}`}>
                  <div className='flex h-full w-full items-center justify-center rounded-lg bg-gray-200'>
                    <span className='text-muted'>Imagem do Produto</span>
                  </div>

                  {/* Badge */}
                  <div className='absolute left-3 top-3'>
                    <span className='bg-primary rounded-full px-2 py-1 text-xs font-semibold text-white'>
                      {product.badge}
                    </span>
                  </div>

                  {/* Wishlist */}
                  <button className='absolute right-3 top-3 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110'>
                    <Heart size={16} className='text-muted hover:text-red-500' />
                  </button>

                  {/* Out of Stock */}
                  {!product.inStock && (
                    <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50'>
                      <span className='font-semibold text-white'>Fora de Estoque</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className='mb-2 flex items-start justify-between'>
                    <h3 className='text-primary group-hover:text-primary text-lg font-bold transition-colors'>
                      {product.name}
                    </h3>
                    <div className='flex items-center gap-1'>
                      <Star size={16} className='fill-current text-yellow-400' />
                      <span className='text-secondary text-sm'>
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>

                  <p className='text-secondary mb-4 line-clamp-2 text-sm'>{product.description}</p>

                  <div className='mb-4 flex items-center gap-2'>
                    <span className='text-primary text-2xl font-bold'>
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className='text-muted text-sm line-through'>
                        R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>

                  <div className='flex gap-2'>
                    <button
                      className={`btn flex-1 ${
                        product.inStock ? 'btn-primary' : 'btn-secondary cursor-not-allowed opacity-50'
                      }`}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Contato / Negociar' : 'Indisponível'}
                    </button>
                    <button
                      className='btn btn-secondary'
                      onClick={() => window.open(`/produto/${product.id}`, '_blank')}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className='mt-12 text-center'>
            <button className='btn-futuristic btn-secondary btn-lg'>
              Carregar Mais Produtos
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='section bg-secondary'>
        <div className='container text-center'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='text-primary mb-6 text-4xl font-bold md:text-5xl'>Não encontrou o que procura?</h2>
            <p className='text-secondary mx-auto mb-8 max-w-2xl text-xl'>
              Nossa equipe especializada pode ajudar você a encontrar exatamente o que precisa
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <button className='btn-futuristic btn-primary btn-lg'>
                Falar com Especialista
                <ArrowRight size={20} />
              </button>
              <button className='btn-futuristic btn-secondary btn-lg'>Solicitar Produto</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Store;
