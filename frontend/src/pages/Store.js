import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  // ShoppingCart, // Removido para evitar warning
  Star, 
  Heart,
  Truck,
  Shield,
  Zap,
  ArrowRight,
  Grid,
  List
} from 'lucide-react';
import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt';

const Store = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos os Produtos' },
    { id: 'seeds', name: 'Sementes' },
    { id: 'fertilizers', name: 'Fertilizantes' },
    { id: 'equipment', name: 'Equipamentos' },
    { id: 'technology', name: 'Tecnologia' },
    { id: 'services', name: 'Serviços' }
  ];

  const products = [
    {
      id: 1,
      name: 'Sementes Premium Soja',
      category: 'seeds',
      price: 89.90,
      originalPrice: 120.00,
      rating: 4.8,
      reviews: 124,
      image: '/api/placeholder/300/200',
      badge: 'Mais Vendido',
      inStock: true,
      description: 'Sementes de soja de alta qualidade para máxima produtividade'
    },
    {
      id: 2,
      name: 'Fertilizante NPK 20-10-10',
      category: 'fertilizers',
      price: 45.50,
      originalPrice: 60.00,
      rating: 4.6,
      reviews: 89,
      image: '/api/placeholder/300/200',
      badge: 'Oferta',
      inStock: true,
      description: 'Fertilizante balanceado para todas as culturas'
    },
    {
      id: 3,
      name: 'Drone Agrícola DJI Agras',
      category: 'technology',
      price: 15990.00,
      originalPrice: 18990.00,
      rating: 4.9,
      reviews: 23,
      image: '/api/placeholder/300/200',
      badge: 'Novidade',
      inStock: true,
      description: 'Drone profissional para pulverização e monitoramento'
    },
    {
      id: 4,
      name: 'Trator John Deere 6110J',
      category: 'equipment',
      price: 185000.00,
      originalPrice: 210000.00,
      rating: 4.7,
      reviews: 15,
      image: '/api/placeholder/300/200',
      badge: 'Premium',
      inStock: false,
      description: 'Trator de alta performance para grandes propriedades'
    },
    {
      id: 5,
      name: 'Sistema de Irrigação Inteligente',
      category: 'technology',
      price: 2500.00,
      originalPrice: 3200.00,
      rating: 4.5,
      reviews: 67,
      image: '/api/placeholder/300/200',
      badge: 'Eco',
      inStock: true,
      description: 'Controle automático de irrigação com IoT'
    },
    {
      id: 6,
      name: 'Consultoria Agronômica Premium',
      category: 'services',
      price: 500.00,
      originalPrice: 750.00,
      rating: 4.9,
      reviews: 45,
      image: '/api/placeholder/300/200',
      badge: 'Especialista',
      inStock: true,
      description: 'Consultoria especializada para otimização da produção'
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

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
    <div className="min-h-screen">
      {/* HERO COM IMAGEM 4K DE MILHO/SOJA */}
      <AgroisyncHeroPrompt 
        title="Loja Agroisync"
        subtitle="Commodities Agrícolas em Tempo Real"
        heroImage="./images/Loja.png"
        showCTA={true}
      />

      {/* Features */}
      <section className="section-sm bg-secondary">
        <div className="container">
          <div className="grid-futuristic grid-cols-1 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-futuristic text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Content */}
      <section className="section bg-primary">
        <div className="container">
          {/* Filters and Search */}
          <div className="card-futuristic mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                <input
                  type="text"
                    placeholder="Buscar produtos..."
                    className="form-input pl-10 w-full"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-secondary hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'text-secondary hover:bg-gray-100'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'text-secondary hover:bg-gray-100'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

      {/* Products Grid */}
          <div className={`grid-futuristic ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                className={`card-futuristic group ${
                  viewMode === 'list' ? 'flex flex-row items-center gap-6' : ''
                }`}
              >
                {/* Product Image */}
                <div className={`relative ${
                  viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'w-full h-48'
                }`}>
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-muted">Imagem do Produto</span>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {product.badge}
                    </span>
                  </div>

                  {/* Wishlist */}
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform">
                    <Heart size={16} className="text-muted hover:text-red-500" />
                    </button>

                  {/* Out of Stock */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">Fora de Estoque</span>
                          </div>
                        )}
                      </div>

                {/* Product Info */}
                <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-primary group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm text-secondary">
                        {product.rating} ({product.reviews})
                      </span>
                        </div>
                      </div>

                  <p className="text-secondary text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-muted line-through">
                        R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                        </div>
                        
                  <div className="flex gap-2">
                          <button 
                      className={`btn flex-1 ${
                        product.inStock ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'
                      }`}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Contato / Negociar' : 'Indisponível'}
                          </button>
                    <button className="btn btn-secondary">
                      Ver Detalhes
                          </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="btn-futuristic btn-secondary btn-lg">
              Carregar Mais Produtos
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-secondary">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Não encontrou o que procura?
            </h2>
            <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
              Nossa equipe especializada pode ajudar você a encontrar exatamente o que precisa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-futuristic btn-primary btn-lg">
                Falar com Especialista
                <ArrowRight size={20} />
              </button>
              <button className="btn-futuristic btn-secondary btn-lg">
                Solicitar Produto
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Store;
