import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, Filter, MapPin, Star, ShoppingCart, Heart, Eye,
  Truck, Package, Leaf, Wrench, User, Circle, DollarSign, Plus
} from 'lucide-react';
import { productService } from '../services/productService';

const Loja = () => {
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedState, setSelectedState] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState(null);

  // Categorias reais do agronegócio
  const categories = [
    { id: 'all', name: 'Todas', icon: <Package className="w-5 h-5" />, count: 0 },
    { id: 'soja', name: 'Soja', icon: <Leaf className="w-5 h-5" />, count: 0 },
    { id: 'milho', name: 'Milho', icon: <Circle className="w-5 h-5" />, count: 0 },
    { id: 'café', name: 'Café', icon: <Leaf className="w-5 h-5" />, count: 0 },
    { id: 'algodão', name: 'Algodão', icon: <Leaf className="w-5 h-5" />, count: 0 },
    { id: 'insumo', name: 'Insumos', icon: <Wrench className="w-5 h-5" />, count: 0 },
    { id: 'maquinário', name: 'Maquinário', icon: <Truck className="w-5 h-5" />, count: 0 }
  ];

  // Estados brasileiros
  const states = [
    { id: 'all', name: 'Todos os Estados' },
    { id: 'MT', name: 'Mato Grosso' },
    { id: 'GO', name: 'Goiás' },
    { id: 'MS', name: 'Mato Grosso do Sul' },
    { id: 'PR', name: 'Paraná' },
    { id: 'RS', name: 'Rio Grande do Sul' },
    { id: 'SP', name: 'São Paulo' },
    { id: 'MG', name: 'Minas Gerais' },
    { id: 'BA', name: 'Bahia' },
    { id: 'TO', name: 'Tocantins' }
  ];

  // Função para buscar produtos do MongoDB
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      if (selectedCategory !== 'all') filters.type = selectedCategory;
      if (priceRange[0] > 0) filters.minPrice = priceRange[0];
      if (priceRange[1] < 10000) filters.maxPrice = priceRange[1];
      if (selectedState !== 'all') filters.state = selectedState;
      if (searchTerm) filters.search = searchTerm;
      
      const response = await productService.getProducts(filters);
      
      if (response.success) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        setError('Erro ao carregar produtos');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Erro ao carregar produtos');
      
      // Fallback para dados simulados em caso de erro
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar produtos ao montar o componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Atualizar produtos quando filtros mudarem
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceRange, selectedState, searchTerm]);

  // Atualizar contadores de categorias
  useEffect(() => {
    const updatedCategories = categories.map(cat => ({
      ...cat,
      count: cat.id === 'all' ? products.length : products.filter(p => p.type === cat.id).length
    }));
    
    // Filtrar produtos
    let filtered = products;

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.type === selectedCategory);
    }

    // Filtro por preço
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filtro por estado
    if (selectedState !== 'all') {
      filtered = filtered.filter(p => p.location?.state === selectedState);
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.seller?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, selectedState, searchTerm]);

  // Função para formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Função para obter ícone da categoria
  const getCategoryIcon = (type) => {
    switch (type) {
      case 'soja':
      case 'milho':
      case 'café':
      case 'algodão':
        return <Leaf className="w-5 h-5" />;
      case 'insumo':
        return <Wrench className="w-5 h-5" />;
      case 'maquinário':
        return <Truck className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  // Função para obter cor da categoria
  const getCategoryColor = (type) => {
    switch (type) {
      case 'soja':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'milho':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'café':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'algodão':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'insumo':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'maquinário':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
              <div className="absolute inset-0 bg-white opacity-95"></div>
            </div>
          )}
        </div>
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
                         Loja Agroisync
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Marketplace Completo de Produtos Agrícolas
          </motion.p>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="py-8 px-4 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Busca */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar produtos, vendedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4">
              {/* Categoria */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>

              {/* Estado */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>

              {/* Faixa de Preço */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Preço:</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Modo de Visualização */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-white text-gray-600'}`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Botão Cadastrar Produto */}
              <button
                onClick={() => window.location.href = '/cadastro'}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Cadastrar Produto
              </button>

              {/* Botão Assinar Plano */}
              <button
                onClick={() => window.location.href = '/planos'}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                Assinar Plano
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Estatísticas */}
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold text-green-600">{filteredProducts.length}</span> de{' '}
              <span className="font-semibold text-green-600">{products.length}</span> produtos
            </p>
          </div>

          {/* Grid de Produtos */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 overflow-hidden"
                >
                  {/* Imagem do Produto */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-6xl text-gray-400">
                      {getCategoryIcon(product.type)}
                    </div>
                    {product.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        DESTAQUE
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Informações do Produto */}
                  <div className="p-4">
                    {/* Categoria */}
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(product.type)} mb-2`}>
                      {getCategoryIcon(product.type)}
                      <span className="ml-1">{categories.find(c => c.id === product.type)?.name}</span>
                    </div>

                    {/* Nome */}
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                    {/* Preço */}
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {formatPrice(product.price)}
                    </div>

                    {/* Unidade */}
                    <p className="text-sm text-gray-600 mb-3">por {product.unit}</p>

                    {/* Vendedor e Localização */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{product.location?.city}, {product.location?.state}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>
                    </div>

                    {/* Vendedor */}
                    <p className="text-sm text-gray-700 mb-3 font-medium">{product.seller?.name}</p>

                    {/* Estoque */}
                    <p className="text-sm text-gray-600 mb-4">
                      Estoque: <span className="font-semibold text-green-600">{product.stock} {product.unit}</span>
                    </p>

                    {/* Botões */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Comprar</span>
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Lista de Produtos */
            <div className="space-y-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 p-6"
                >
                  <div className="flex items-center space-x-6">
                    {/* Imagem */}
                    <div className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-3xl text-gray-400">
                        {getCategoryIcon(product.type)}
                      </div>
                      {product.featured && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                          DESTAQUE
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(product.type)} mb-2`}>
                            {getCategoryIcon(product.type)}
                            <span className="ml-1">{categories.find(c => c.id === product.type)?.name}</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {formatPrice(product.price)}
                          </div>
                          <p className="text-sm text-gray-600">por {product.unit}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{product.location?.city}, {product.location?.state}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{product.rating}</span>
                            <span>({product.reviews})</span>
                          </div>
                          <span>Estoque: {product.stock} {product.unit}</span>
                        </div>

                        <div className="flex space-x-2">
                          <button className="bg-green-600 text-white py-2 px-6 rounded-xl hover:bg-green-700 transition-colors font-medium flex items-center space-x-2">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Comprar</span>
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Sem Produtos */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou termos de busca</p>
            </div>
          )}

          {/* Estado de Erro */}
          {error && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar produtos</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={fetchProducts}
                className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Estado de Carregamento */}
          {loading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Carregando produtos...</h3>
              <p className="text-gray-500">Aguarde enquanto buscamos os melhores produtos para você</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Loja;
