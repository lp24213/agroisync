import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { useTranslation } from 'react-i18next';
import {
  Store, Package, Truck, Users, CheckCircle, ArrowRight, 
  UserPlus, Building2, Search, Star, ShoppingCart, Leaf, User,
  Plus, Grid, List, Eye, Heart, Phone, Mail, MapPin, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';

const Loja = () => {
  const { isDark } = useTheme();
  const { user, isAdmin } = useAuth();
  const { isPaid, planActive } = usePayment();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Estados para funcionalidades da loja
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    locations: [],
    minPrice: '',
    maxPrice: '',
    minRating: 0,
    sortBy: 'relevance'
  });

  // Dados simulados de produtos (serão substituídos por API real)
  const mockProducts = [
    {
      id: 1,
      name: 'Sementes de Soja RR2 PRO',
      description: 'Sementes certificadas de soja Roundup Ready 2 PRO, alta produtividade e resistência a herbicidas',
      price: 89.90,
      quantity: 1000,
      unit: 'kg',
      category: 'Sementes',
      location: 'Sinop, MT',
      rating: 4.8,
      verified: true,
      createdAt: '2024-01-15',
      seller: { name: 'AgroTech Solutions' },
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      images: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
      ]
    },
    {
      id: 2,
      name: 'Fertilizante NPK 20-20-20',
      description: 'Fertilizante balanceado para todas as culturas, formulação completa com micronutrientes',
      price: 156.75,
      quantity: 500,
      unit: 'kg',
      category: 'Fertilizantes',
      location: 'Lucas do Rio Verde, MT',
      rating: 4.6,
      verified: true,
      createdAt: '2024-01-14',
      seller: { name: 'GreenHarvest Corp' },
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    },
    {
      id: 3,
      name: 'Pulverizador Costal Manual',
      description: 'Pulverizador costal manual 20L, ideal para pequenas propriedades e aplicações pontuais',
      price: 89.90,
      quantity: 50,
      unit: 'un',
      category: 'Maquinários',
      location: 'Sorriso, MT',
      rating: 4.4,
      verified: false,
      createdAt: '2024-01-13',
      seller: { name: 'FarmEquip' },
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    },
    {
      id: 4,
      name: 'Consultoria Agronômica Especializada',
      description: 'Acompanhamento técnico completo para otimização da produção, análise de solo e recomendações',
      price: 150.00,
      quantity: 1,
      unit: 'hora',
      category: 'Serviços',
      location: 'Cuiabá, MT',
      rating: 4.9,
      verified: true,
      createdAt: '2024-01-12',
      seller: { name: 'AgroConsult' },
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    },
    {
      id: 5,
      name: 'Sistema de Irrigação por Gotejamento',
      description: 'Sistema completo de irrigação por gotejamento para 1 hectare, com timer automático',
      price: 2890.00,
      quantity: 1,
      unit: 'kit',
      category: 'Tecnologia',
      location: 'Nova Mutum, MT',
      rating: 4.7,
      verified: true,
      createdAt: '2024-01-11',
      seller: { name: 'SmartIrrigation' },
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    },
    {
      id: 6,
      name: 'Análise de Solo Completa',
      description: 'Análise química e física do solo com recomendações de fertilização e correção',
      price: 89.90,
      quantity: 1,
      unit: 'análise',
      category: 'Serviços',
      location: 'Rondonópolis, MT',
      rating: 4.5,
      verified: true,
      createdAt: '2024-01-10',
      seller: { name: 'LabAgro' },
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    }
  ];

  const categories = ['Sementes', 'Fertilizantes', 'Maquinários', 'Serviços', 'Tecnologia', 'Insumos'];
  const locations = ['Sinop, MT', 'Lucas do Rio Verde, MT', 'Sorriso, MT', 'Cuiabá, MT', 'Nova Mutum, MT', 'Rondonópolis, MT'];

  useEffect(() => {
    setMounted(true);
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Simular carregamento de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filtro de busca
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro de categorias
    if (filters.categories?.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Filtro de localização
    if (filters.locations?.length > 0) {
      filtered = filtered.filter(product =>
        filters.locations.includes(product.location)
      );
    }

    // Filtro de preço
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
    }

    // Filtro de avaliação
    if (filters.minRating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.minRating);
    }

    // Ordenação
    switch (filters.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        // Relevância (mantém ordem original)
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleProductContact = (product) => {
    // Implementar sistema de contato
    console.log('Contatar produto:', product);
    // Redirecionar para página de contato ou abrir modal
  };

  const handleProductFavorite = (productId, isFavorite) => {
    // Implementar sistema de favoritos
    console.log('Favoritar produto:', productId, isFavorite);
  };

  const handleProductView = (product) => {
    // Implementar visualização detalhada do produto
    console.log('Ver produto:', product);
    // Redirecionar para página do produto
  };

  const handleAddToCart = (product) => {
    // Implementar sistema de carrinho
    console.log('Adicionar ao carrinho:', product);
  };

  const handleCreateProduct = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isPaid) {
      navigate('/planos');
      return;
    }
    navigate('/cadastro-produto');
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      categories: [],
      locations: [],
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      sortBy: 'relevance'
    });
  };

  // Animações de entrada
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-slate-900">
      {/* Hero Section - DESIGN PREMIUM */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-24 px-4 header-premium relative overflow-hidden"
      >
        {/* Linha gradiente sutil no topo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-agro-green-500 via-agro-yellow-500 to-web3-neon-blue opacity-60"></div>
        {/* Elementos decorativos premium */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-agro-green-600 to-web3-neon-blue rounded-full opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-agro-yellow-500 to-web3-neon-blue rounded-full opacity-10 blur-xl animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold title-premium mb-6"
          >
            Marketplace Agroisync
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto mb-8"
          >
            A maior plataforma de produtos e serviços para o agronegócio brasileiro. 
            Compre, venda e conecte-se com produtores de todo o país.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.button
              onClick={handleCreateProduct}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 text-lg flex items-center justify-center space-x-2 btn-accent-green relative overflow-hidden group"
            >
              {/* Efeito de glow no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-agro-green-400 via-agro-yellow-400 to-web3-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Anunciar Produto</span>
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/sobre')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold border-2 border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Efeito de glow no hover */}
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <span className="relative z-10">Como Funciona</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Estatísticas da plataforma */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Produtos Ativos', value: '2.847', icon: <Package className="w-8 h-8" /> },
              { label: 'Vendedores', value: '156', icon: <Users className="w-8 h-8" /> },
              { label: 'Categorias', value: '24', icon: <Grid className="w-8 h-8" /> },
              { label: 'Estados', value: '27', icon: <MapPin className="w-8 h-8" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gradient-premium mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Filtros e Produtos */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filtros */}
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories}
            locations={locations}
          />

          {/* Controles de visualização */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Produtos ({filteredProducts.length})
              </h2>
              {loading && (
                <div className="flex items-center space-x-2 text-slate-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
                  <span>Carregando...</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Botões de visualização */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-emerald-600 shadow-md' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-emerald-600 shadow-md' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <List className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Grid de Produtos */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
              >
                <ProductCard
                  product={product}
                  onContact={handleProductContact}
                  onFavorite={handleProductFavorite}
                  onView={handleProductView}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Mensagem quando não há produtos */}
          {filteredProducts.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-slate-500 mb-6">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
              <motion.button
                onClick={clearAllFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200"
              >
                Limpar Filtros
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-agro-green-600/20 via-agro-yellow-500/20 to-web3-neon-blue/20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-agro-green-500 via-agro-yellow-500 to-web3-neon-blue"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-6"
          >
            Quer vender seus produtos?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-200 mb-8"
          >
            Junte-se a milhares de vendedores e alcance produtores de todo o Brasil
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={handleCreateProduct}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-yellow-500 to-blue-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:via-yellow-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              {/* Efeito de glow no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-yellow-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Começar a Vender</span>
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/contato')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-slate-700 transition-all duration-300"
            >
              Falar com Consultor
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Loja;
