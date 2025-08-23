import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loja = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    location: 'all',
    priceRange: 'all',
    quality: 'all',
    certification: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Dados profissionais do marketplace
  const categories = [
    { id: 'grains', name: 'Grãos', icon: '🌾', count: 156 },
    { id: 'vegetables', name: 'Hortifrúti', icon: '🥬', count: 89 },
    { id: 'fruits', name: 'Frutas', icon: '🍎', count: 67 },
    { id: 'dairy', name: 'Laticínios', icon: '🥛', count: 43 },
    { id: 'meat', name: 'Carnes', icon: '🥩', count: 78 },
    { id: 'seeds', name: 'Sementes', icon: '🌱', count: 34 }
  ];

  const locations = [
    { id: 'all', name: 'Todas as Regiões' },
    { id: 'south', name: 'Sul', count: 89 },
    { id: 'southeast', name: 'Sudeste', count: 156 },
    { id: 'central-west', name: 'Centro-Oeste', count: 234 },
    { id: 'northeast', name: 'Nordeste', count: 67 },
    { id: 'north', name: 'Norte', count: 45 }
  ];

  const qualityStandards = [
    { id: 'all', name: 'Todos os Padrões' },
    { id: 'premium', name: 'Premium', icon: '⭐' },
    { id: 'export', name: 'Exportação', icon: '🌍' },
    { id: 'organic', name: 'Orgânico', icon: '🌿' },
    { id: 'conventional', name: 'Convencional', icon: '📋' }
  ];

  const certifications = [
    { id: 'all', name: 'Todas as Certificações' },
    { id: 'iso', name: 'ISO 9001', icon: '🏆' },
    { id: 'haccp', name: 'HACCP', icon: '🔒' },
    { id: 'gmp', name: 'GMP', icon: '✅' },
    { id: 'brc', name: 'BRC', icon: '🇬🇧' },
    { id: 'fscc', name: 'FSSC 22000', icon: '🌐' }
  ];

  // Simular produtos profissionais
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Soja Premium Tipo 1',
        category: 'grains',
        location: 'central-west',
        quality: 'premium',
        certifications: ['iso', 'haccp', 'gmp'],
        price: 165.50,
        currency: 'BRL',
        unit: 'sc',
        quantity: 1000,
        unitType: 'sacas',
        supplier: {
          name: 'Fazenda Santa Clara Ltda',
          rating: 4.9,
          verified: true,
          location: 'Lucas do Rio Verde - MT',
          certifications: ['iso', 'haccp'],
          yearsActive: 15
        },
        specifications: {
          protein: '38-40%',
          moisture: '<14%',
          impurities: '<2%',
          color: 'Amarelo uniforme',
          origin: 'MT - Brasil'
        },
        images: ['/images/soja.svg'],
        description: 'Soja de alta qualidade, ideal para exportação e processamento industrial. Produzida com tecnologia de ponta e certificações internacionais.',
        availableFrom: '2024-03-15',
        deliveryOptions: ['FOB', 'CIF', 'EXW'],
        paymentTerms: ['30 dias', '60 dias', '90 dias'],
        minOrder: 100,
        stockStatus: 'available',
        lastUpdated: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'Milho Amarelo Tipo 1',
        category: 'grains',
        location: 'south',
        quality: 'export',
        certifications: ['iso', 'haccp', 'brc'],
        price: 78.90,
        currency: 'BRL',
        unit: 'sc',
        quantity: 2500,
        unitType: 'sacas',
        supplier: {
          name: 'Cooperativa Agroindustrial',
          rating: 4.8,
          verified: true,
          location: 'Cascavel - PR',
          certifications: ['iso', 'haccp', 'brc'],
          yearsActive: 25
        },
        specifications: {
          protein: '8-10%',
          moisture: '<13%',
          impurities: '<1%',
          color: 'Amarelo intenso',
          origin: 'PR - Brasil'
        },
        images: ['/images/milho.svg'],
        description: 'Milho de excelente qualidade para alimentação animal e processamento industrial. Atende aos mais rigorosos padrões internacionais.',
        availableFrom: '2024-03-01',
        deliveryOptions: ['FOB', 'CIF', 'EXW'],
        paymentTerms: ['30 dias', '45 dias', '60 dias'],
        minOrder: 200,
        stockStatus: 'available',
        lastUpdated: '2024-01-15T09:15:00Z'
      },
      {
        id: 3,
        name: 'Café Arábica Premium',
        category: 'fruits',
        location: 'southeast',
        quality: 'premium',
        certifications: ['iso', 'haccp', 'gmp'],
        price: 45.80,
        currency: 'BRL',
        unit: 'kg',
        quantity: 5000,
        unitType: 'kg',
        supplier: {
          name: 'Fazenda São João',
          rating: 4.9,
          verified: true,
          location: 'Franca - SP',
          certifications: ['iso', 'haccp', 'gmp'],
          yearsActive: 20
        },
        specifications: {
          altitude: '1200-1400m',
          process: 'Lavado',
          screen: '16-18',
          moisture: '<11%',
          origin: 'SP - Brasil'
        },
        images: ['/images/soja.svg'], // Placeholder
        description: 'Café arábica de altitude, produzido com técnicas tradicionais e certificações de qualidade. Ideal para torrefação premium.',
        availableFrom: '2024-02-15',
        deliveryOptions: ['FOB', 'CIF'],
        paymentTerms: ['30 dias', '60 dias'],
        minOrder: 100,
        stockStatus: 'available',
        lastUpdated: '2024-01-15T11:45:00Z'
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  // Filtros avançados
  useEffect(() => {
    let filtered = [...products];

    // Filtro por categoria
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Filtro por localização
    if (filters.location !== 'all') {
      filtered = filtered.filter(p => p.location === filters.location);
    }

    // Filtro por qualidade
    if (filters.quality !== 'all') {
      filtered = filtered.filter(p => p.quality === filters.quality);
    }

    // Filtro por certificação
    if (filters.certification !== 'all') {
      filtered = filtered.filter(p => p.certifications.includes(filters.certification));
    }

    // Filtro por preço
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }

    // Busca por texto
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenação
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.supplier.rating - a.supplier.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      default:
        // Relevância baseada em rating e verificação
        filtered.sort((a, b) => {
          const scoreA = (a.supplier.rating * 10) + (a.supplier.verified ? 50 : 0);
          const scoreB = (b.supplier.rating * 10) + (b.supplier.verified ? 50 : 0);
          return scoreB - scoreA;
        });
    }

    setFilteredProducts(filtered);
  }, [products, filters, searchTerm, sortBy]);

  const handleContactSupplier = (product) => {
    setSelectedProduct(product);
    // Aqui você implementaria a lógica de contato
    console.log('Contatando fornecedor:', product.supplier.name);
  };

  const formatPrice = (price, currency, unit) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(price) + `/${unit}`;
  };

  const getCertificationIcon = (certId) => {
    const cert = certifications.find(c => c.id === certId);
    return cert ? cert.icon : '📋';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Header Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-900/20 to-green-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent"
          >
            Marketplace Corporativo
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-4xl mx-auto"
          >
            Conectamos produtores certificados com compradores corporativos. 
            Qualidade garantida, transparência total e negociações seguras.
          </motion.p>
          
          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12"
          >
            {[
              { number: '2,500+', label: 'Produtos', icon: '📦' },
              { number: '500+', label: 'Fornecedores', icon: '🏭' },
              { number: '99.9%', label: 'Satisfação', icon: '⭐' },
              { number: '24/7', label: 'Suporte', icon: '🔄' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-blue-400">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 px-4 bg-neutral-900/50 border-b border-neutral-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos, fornecedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-neutral-700 text-gray-400 hover:bg-neutral-600'
                }`}
              >
                ⬜
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-neutral-700 text-gray-400 hover:bg-neutral-600'
                }`}
              >
                ☰
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
            >
              <option value="relevance">Mais Relevantes</option>
              <option value="price-low">Menor Preço</option>
              <option value="price-high">Maior Preço</option>
              <option value="rating">Melhor Avaliação</option>
              <option value="newest">Mais Recentes</option>
            </select>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
            >
              <span>🔧</span>
              <span>Filtros</span>
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-neutral-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Categoria
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">Todas as Categorias</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name} ({cat.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Localização
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} {loc.count ? `(${loc.count})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quality Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Qualidade
                    </label>
                    <select
                      value={filters.quality}
                      onChange={(e) => setFilters(prev => ({ ...prev, quality: e.target.value }))}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">Todos os Padrões</option>
                      {qualityStandards.map(qual => (
                        <option key={qual.id} value={qual.id}>
                          {qual.icon} {qual.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Certification Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Certificação
                    </label>
                    <select
                      value={filters.certification}
                      onChange={(e) => setFilters(prev => ({ ...prev, certification: e.target.value }))}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      {certifications.map(cert => (
                        <option key={cert.id} value={cert.id}>
                          {cert.icon} {cert.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Faixa de Preço
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">Todos os Preços</option>
                      <option value="0-50">Até R$ 50</option>
                      <option value="50-100">R$ 50 - R$ 100</option>
                      <option value="100-200">R$ 100 - R$ 200</option>
                      <option value="200-500">R$ 200 - R$ 500</option>
                      <option value="500-999999">Acima de R$ 500</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Results Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-gray-400">
              Mostrando <span className="text-white font-semibold">{filteredProducts.length}</span> de <span className="text-white font-semibold">{products.length}</span> produtos
            </div>
            <div className="text-gray-400 text-sm">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>

          {/* Products */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-700 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-neutral-800 overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {product.quality.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {formatPrice(product.price, product.currency, product.unit)}
                        </div>
                        <div className="text-sm text-gray-400">
                          Min: {product.minOrder} {product.unitType}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Supplier Info */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-neutral-800/50 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-semibold text-white">
                            {product.supplier.name}
                          </span>
                          {product.supplier.verified && (
                            <span className="text-blue-400 text-xs">✓ Verificado</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-sm text-gray-300">{product.supplier.rating}</span>
                          </div>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-400">{product.supplier.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400 capitalize">{key}:</span>
                          <span className="text-white font-medium">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Certifications */}
                    <div className="flex items-center space-x-2 mb-4">
                      {product.certifications.map(certId => (
                        <span key={certId} className="text-lg" title={certifications.find(c => c.id === certId)?.name}>
                          {getCertificationIcon(certId)}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleContactSupplier(product)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:scale-105"
                      >
                        📞 Contatar Fornecedor
                      </button>
                      <button className="p-3 bg-neutral-700 text-gray-300 rounded-lg hover:bg-neutral-600 transition-colors duration-300">
                        💾
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-start space-x-6">
                    {/* Product Image */}
                    <div className="relative w-32 h-32 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {product.quality.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-300 mb-3 max-w-2xl">
                            {product.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-400 mb-1">
                            {formatPrice(product.price, product.currency, product.unit)}
                          </div>
                          <div className="text-sm text-gray-400">
                            Min: {product.minOrder} {product.unitType}
                          </div>
                        </div>
                      </div>

                      {/* Supplier and Specs Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Supplier Info */}
                        <div className="bg-neutral-800/50 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Fornecedor</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-white">
                                {product.supplier.name}
                              </span>
                              {product.supplier.verified && (
                                <span className="text-blue-400 text-xs">✓ Verificado</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-yellow-400">⭐</span>
                              <span className="text-sm text-gray-300">{product.supplier.rating}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-sm text-gray-400">{product.supplier.yearsActive} anos</span>
                            </div>
                            <div className="text-sm text-gray-400">{product.supplier.location}</div>
                          </div>
                        </div>

                        {/* Specifications */}
                        <div className="bg-neutral-800/50 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Especificações</h4>
                          <div className="space-y-1 text-sm">
                            {Object.entries(product.specifications).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-400 capitalize">{key}:</span>
                                <span className="text-white font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Certifications & Actions */}
                        <div className="bg-neutral-800/50 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Certificações</h4>
                          <div className="flex items-center space-x-2 mb-4">
                            {product.certifications.map(certId => (
                              <span key={certId} className="text-2xl" title={certifications.find(c => c.id === certId)?.name}>
                                {getCertificationIcon(certId)}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => handleContactSupplier(product)}
                            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:scale-105"
                          >
                            📞 Contatar Fornecedor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-400 mb-6">
                Tente ajustar os filtros ou termos de busca
              </p>
              <button
                onClick={() => {
                  setFilters({
                    category: 'all',
                    location: 'all',
                    priceRange: 'all',
                    quality: 'all',
                    certification: 'all'
                  });
                  setSearchTerm('');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Limpar Filtros
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Contatar Fornecedor
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-neutral-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Produto</h3>
                  <p className="text-gray-300">{selectedProduct.name}</p>
                </div>

                <div className="bg-neutral-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Fornecedor</h3>
                  <div className="space-y-2">
                    <p className="text-white font-medium">{selectedProduct.supplier.name}</p>
                    <p className="text-gray-300">{selectedProduct.supplier.location}</p>
                    <p className="text-gray-400 text-sm">
                      Avaliação: ⭐ {selectedProduct.supplier.rating} • {selectedProduct.supplier.yearsActive} anos de experiência
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Preço e Disponibilidade</h3>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-green-400">
                      {formatPrice(selectedProduct.price, selectedProduct.currency, selectedProduct.unit)}
                    </p>
                    <p className="text-gray-300">
                      Quantidade disponível: {selectedProduct.quantity} {selectedProduct.unitType}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Pedido mínimo: {selectedProduct.minOrder} {selectedProduct.unitType}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300">
                    📧 Enviar Mensagem
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300">
                    📞 Ligar Agora
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Loja;
