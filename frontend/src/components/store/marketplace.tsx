'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield,
  Eye,
  Plus
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

export function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Todos', icon: '🌾' },
    { id: 'seeds', name: 'Sementes', icon: '🌱' },
    { id: 'fertilizers', name: 'Fertilizantes', icon: '🧪' },
    { id: 'machinery', name: 'Maquinário', icon: '🚜' },
    { id: 'tools', name: 'Ferramentas', icon: '🔧' },
    { id: 'pesticides', name: 'Defensivos', icon: '🛡️' }
  ];

  useEffect(() => {
    // Mock data - replace with real API call
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Sementes de Soja Premium',
        description: 'Sementes de soja de alta qualidade para máxima produtividade',
        price: 89.90,
        originalPrice: 119.90,
        image: '/api/placeholder/300/200',
        category: 'seeds',
        rating: 4.8,
        reviews: 156,
        inStock: true,
        isNew: true,
        isFeatured: true
      },
      {
        id: '2',
        name: 'Fertilizante NPK 20-20-20',
        description: 'Fertilizante balanceado para todas as culturas',
        price: 45.50,
        image: '/api/placeholder/300/200',
        category: 'fertilizers',
        rating: 4.6,
        reviews: 89,
        inStock: true
      },
      {
        id: '3',
        name: 'Pulverizador Manual 20L',
        description: 'Pulverizador de alta pressão para aplicação precisa',
        price: 189.90,
        image: '/api/placeholder/300/200',
        category: 'tools',
        rating: 4.7,
        reviews: 234,
        inStock: true
      },
      {
        id: '4',
        name: 'Trator Agrícola Compacto',
        description: 'Trator versátil para pequenas e médias propriedades',
        price: 45900.00,
        image: '/api/placeholder/300/200',
        category: 'machinery',
        rating: 4.9,
        reviews: 67,
        inStock: false
      },
      {
        id: '5',
        name: 'Sementes de Milho Híbrido',
        description: 'Milho híbrido com alta resistência e produtividade',
        price: 67.80,
        image: '/api/placeholder/300/200',
        category: 'seeds',
        rating: 4.5,
        reviews: 123,
        inStock: true
      },
      {
        id: '6',
        name: 'Defensivo Biológico Natural',
        description: 'Controle biológico sustentável para pragas',
        price: 78.90,
        image: '/api/placeholder/300/200',
        category: 'pesticides',
        rating: 4.4,
        reviews: 78,
        inStock: true
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        filtered = [...filtered].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Marketplace AgroSync</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Encontre os melhores produtos agrícolas com preços competitivos e entrega rápida
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 transition-colors duration-200"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-cyan-400 text-black'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex justify-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-colors duration-200"
          >
            <option value="featured">Destaques</option>
            <option value="price-low">Menor Preço</option>
            <option value="price-high">Maior Preço</option>
            <option value="rating">Melhor Avaliação</option>
            <option value="newest">Mais Recentes</option>
          </select>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(34, 211, 238, 0.1)" }}
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center">
                <span className="text-4xl">🌾</span>
              </div>
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    NOVO
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-2 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">
                    DESTAQUE
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  product.inStock 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {product.inStock ? 'EM ESTOQUE' : 'ESGOTADO'}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200">
                  <Eye className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200">
                  <Heart className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-200">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {product.description}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  ({product.reviews} avaliações)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-white">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through ml-2">
                      R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                <span className="text-cyan-400 text-sm font-medium">
                  {product.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                                 <motion.button
                   disabled={!product.inStock}
                   className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-semibold rounded-lg hover:from-cyan-500 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                 >
                   <ShoppingCart className="w-4 h-4" />
                   Adicionar
                 </motion.button>
                <button className="px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-200">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-400">Tente ajustar os filtros ou termos de busca</p>
        </motion.div>
      )}

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
      >
        <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Entrega Rápida</h3>
          <p className="text-gray-400 text-sm">Entrega em todo o Brasil com rastreamento</p>
        </div>

        <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Garantia de Qualidade</h3>
          <p className="text-gray-400 text-sm">Produtos certificados e testados</p>
        </div>

        <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Suporte 24/7</h3>
          <p className="text-gray-400 text-sm">Atendimento especializado sempre disponível</p>
        </div>
      </motion.div>
    </div>
  );
}
