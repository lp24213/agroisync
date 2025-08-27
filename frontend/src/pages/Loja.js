import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Store, Truck, CheckCircle, ArrowRight, UserPlus, 
  Building2, Search, Star, ShoppingCart, Leaf, User,
  Eye, Heart, Phone, Mail, Calendar, Package,
  Plus, Edit, Trash, Filter, Grid, List,
  TrendingUp, DollarSign, MapPin, Clock, Tag, MessageSquare, BarChart3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import CartWidget from '../components/CartWidget';
import productService, { PRODUCT_CATEGORIES, PRODUCT_STATUS } from '../services/productService';
import cartService from '../services/cartService';
import transactionService, { TRANSACTION_STATUS, TRANSACTION_TYPES } from '../services/transactionService';

const Loja = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('marketplace');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  
  // Estados para painéis de usuário
  const [myProducts, setMyProducts] = useState([]);
  const [myPurchases, setMyPurchases] = useState([]);
  const [myStock, setMyStock] = useState([]);
  const [myMessages, setMyMessages] = useState([]);
  const [showUserPanel, setShowUserPanel] = useState(false);

  // Estados para funcionalidades de e-commerce
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  useEffect(() => {
    loadProducts();
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Usar o serviço de produtos
      const productsData = await productService.getProducts();
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      if (!user?.id) return;
      
      // Carregar produtos do usuário
      const userProducts = await productService.getUserProducts(user.id);
      setMyProducts(userProducts);
      
      // Carregar transações do usuário
      const userTransactions = await transactionService.getUserTransactions(user.id);
      
      // Separar por tipo
      const purchaseTransactions = userTransactions.filter(txn => 
        txn.type === 'purchase_intent' && txn.buyer?.id === user.id
      );
      const salesTransactions = userTransactions.filter(txn => 
        txn.type === 'purchase_intent' && txn.seller?.id === user.id
      );
      
      setMyPurchases(purchaseTransactions);
      setMyStock(salesTransactions);
      
      // Carregar mensagens das transações
      const allMessages = [];
      for (const txn of userTransactions) {
        const messages = await transactionService.getTransactionMessages(txn.id);
        allMessages.push(...messages);
      }
      setMyMessages(allMessages);
      
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }


  const applyFilters = () => {
    let filtered = [...products];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtro por preço
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Ordenação
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Relevância (padrão)
        break;
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.find(item => item.id === product.id);
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'user-panel') {
      setShowUserPanel(true);
    } else {
      setShowUserPanel(false);
    }
  };

  const handlePurchaseIntent = async (purchaseData) => {
    try {
      // Criar transação de intermediação
      const transaction = await transactionService.createTransaction({
        type: 'purchase_intent',
        buyer: purchaseData.buyer,
        seller: purchaseData.seller,
        items: purchaseData.items || cart,
        total: purchaseData.total || cart.reduce((sum, item) => sum + item.totalPrice, 0),
        shipping: purchaseData.shipping,
        status: 'pending_negotiation'
      });

      if (transaction) {
        // Notificar usuários
        await transactionService.notifyUsers(transaction);
        
        // Fechar carrinho
        setShowCart(false);
        
        // Mostrar mensagem de sucesso
        alert('Intenção de compra registrada! O vendedor será notificado e entrará em contato.');
      }
    } catch (error) {
      console.error('Erro ao processar intenção de compra:', error);
      alert('Erro ao registrar intenção de compra. Tente novamente.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'delivered':
        return 'Entregue';
      case 'in_transit':
        return 'Em Trânsito';
      case 'in_stock':
        return 'Em Estoque';
      case 'low_stock':
        return 'Estoque Baixo';
      default:
        return status;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const tabs = [
    { id: 'marketplace', name: 'Marketplace', icon: Store },
    { id: 'user-panel', name: 'Meu Painel', icon: User },
    { id: 'cart', name: 'Carrinho', icon: ShoppingCart, count: cart.length },
    { id: 'wishlist', name: 'Favoritos', icon: Heart, count: wishlist.length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-agro-green mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando marketplace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="title-premium text-4xl font-bold mb-4">
            Marketplace AgroSync
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Compre e venda produtos agrícolas com segurança e confiança
          </p>
        </motion.div>

        {/* Navegação por Abas */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-agro-green text-agro-green'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                    {tab.count > 0 && (
                      <span className="bg-agro-green text-white text-xs rounded-full px-2 py-1">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.nav>

        {/* Conteúdo das Abas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Marketplace */}
            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                {/* Filtros e Busca */}
                <ProductFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />

                {/* Produtos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => addToCart(product)}
                      onToggleWishlist={() => toggleWishlist(product)}
                      isInWishlist={wishlist.some(item => item.id === product.id)}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tente ajustar os filtros ou fazer uma nova busca
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Painel do Usuário */}
            {activeTab === 'user-panel' && isAuthenticated && (
              <div className="space-y-6">
                {/* Estatísticas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-premium p-6 text-center"
                  >
                    <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{myProducts.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Produtos Ativos</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-premium p-6 text-center"
                  >
                    <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {myPurchases.filter(p => p.status === 'delivered').length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compras Realizadas</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-premium p-6 text-center"
                  >
                    <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {myMessages.filter(m => m.unread).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mensagens Não Lidas</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-premium p-6 text-center"
                  >
                    <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(myProducts.reduce((sum, p) => sum + p.revenue, 0))}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
                  </motion.div>
                </div>

                {/* Ações Rápidas */}
                <div className="card-premium p-6">
                  <h3 className="title-premium text-lg font-semibold mb-4">Ações Rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      to="/cadastro-produto"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-agro-green hover:bg-green-50 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-agro-green mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Cadastrar Produto</p>
                        <p className="text-sm text-gray-600">Adicione um novo produto</p>
                      </div>
                    </Link>

                    <Link
                      to="/mensageria"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-agro-green hover:bg-green-50 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-agro-green mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Ver Mensagens</p>
                        <p className="text-sm text-gray-600">Acesse sua caixa de entrada</p>
                      </div>
                    </Link>

                    <Link
                      to="/dashboard"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-agro-green hover:bg-green-50 transition-colors"
                    >
                      <BarChart3 className="w-5 h-5 text-agro-green mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Painel Completo</p>
                        <p className="text-sm text-gray-600">Acesse todas as funcionalidades</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Meus Produtos */}
                <div className="card-premium p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="title-premium text-lg font-semibold">Meus Produtos</h3>
                    <Link
                      to="/cadastro-produto"
                      className="btn-accent-green flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Produto</span>
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {myProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                        </div>
                        <div className="text-center mx-4">
                          <p className="font-semibold text-agro-green">{formatCurrency(product.price)}</p>
                          <p className="text-xs text-gray-500">por {product.unit}</p>
                        </div>
                        <div className="text-center mx-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
                            {getStatusText(product.status)}
                          </span>
                        </div>
                        <div className="text-center mx-4">
                          <p className="text-sm text-gray-600">👁️ {product.views}</p>
                          <p className="text-sm text-gray-600">❤️ {product.favorites}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-600 hover:text-agro-green transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-agro-green transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-700 transition-colors">
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Minhas Compras */}
                <div className="card-premium p-6">
                  <h3 className="title-premium text-lg font-semibold mb-4">Minhas Compras</h3>
                  <div className="space-y-4">
                    {myPurchases.map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{purchase.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Vendedor: {purchase.seller}</p>
                        </div>
                        <div className="text-center mx-4">
                          <p className="font-semibold text-agro-green">{formatCurrency(purchase.price)}</p>
                          <p className="text-xs text-gray-500">Qtd: {purchase.quantity}</p>
                        </div>
                        <div className="text-center mx-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(purchase.status)}`}>
                            {getStatusText(purchase.status)}
                          </span>
                        </div>
                        <div className="text-center mx-4">
                          <p className="text-xs text-gray-500">Compra: {formatDate(purchase.purchaseDate)}</p>
                          {purchase.deliveryDate && (
                            <p className="text-xs text-gray-500">Entrega: {formatDate(purchase.deliveryDate)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estoque */}
                <div className="card-premium p-6">
                  <h3 className="title-premium text-lg font-semibold mb-4">Controle de Estoque</h3>
                  <div className="space-y-4">
                    {myStock.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                        </div>
                        <div className="text-center mx-4">
                          <p className="font-semibold text-gray-900 dark:text-white">{item.currentStock}</p>
                          <p className="text-xs text-gray-500">{item.unit}</p>
                        </div>
                        <div className="text-center mx-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </div>
                        <div className="text-center mx-4">
                          <p className="text-xs text-gray-500">Mín: {item.minStock}</p>
                          <p className="text-xs text-gray-500">Atualizado: {formatDate(item.lastUpdated)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mensagens */}
                <div className="card-premium p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="title-premium text-lg font-semibold">Mensagens</h3>
                    <Link
                      to="/mensageria"
                      className="text-sm text-agro-green hover:text-agro-yellow transition-colors"
                    >
                      Ver todas →
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {myMessages.slice(0, 3).map((message) => (
                      <div key={message.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{message.from}</h4>
                            {message.unread && (
                              <span className="w-2 h-2 bg-agro-green rounded-full"></span>
                            )}
                          </div>
                          <p className="font-medium text-gray-800">{message.subject}</p>
                          <p className="text-sm text-gray-600">{message.preview}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            message.type === 'inquiry' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {message.type === 'inquiry' ? 'Consulta' : 'Suporte'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Carrinho */}
            {activeTab === 'cart' && (
              <div className="space-y-6">
                <h2 className="title-premium text-2xl font-bold">Carrinho de Compras</h2>
                
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Seu carrinho está vazio
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Adicione produtos para começar suas compras
                    </p>
                    <button
                      onClick={() => handleTabChange('marketplace')}
                      className="btn-accent-green"
                    >
                      Continuar Comprando
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="card-premium p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.seller}</p>
                            <p className="text-lg font-bold text-agro-green">{formatCurrency(item.price)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-600 hover:text-agro-green transition-colors">
                              -
                            </button>
                            <span className="px-3 py-1 border border-gray-300 rounded">{item.quantity}</span>
                            <button className="p-1 text-gray-600 hover:text-agro-green transition-colors">
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="card-premium p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-agro-green">
                          {formatCurrency(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                        </span>
                      </div>
                      <button 
                        onClick={() => handlePurchaseIntent({
                          buyer: { id: user?.id || 'guest', name: user?.name || 'Visitante' },
                          seller: { id: cart[0]?.seller?.id || 'seller', name: cart[0]?.seller?.name || 'Vendedor' },
                          items: cart,
                          total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                        })}
                        className="btn-accent-green w-full"
                      >
                        Registrar Intenção de Compra
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Favoritos */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="title-premium text-2xl font-bold">Meus Favoritos</h2>
                
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Nenhum favorito adicionado
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Adicione produtos aos favoritos para acompanhá-los
                    </p>
                    <button
                      onClick={() => handleTabChange('marketplace')}
                      className="btn-accent-green"
                    >
                      Explorar Produtos
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => addToCart(product)}
                        onToggleWishlist={() => toggleWishlist(product)}
                        isInWishlist={true}
                        viewMode="grid"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Painel de Usuário não autenticado */}
            {activeTab === 'user-panel' && !isAuthenticated && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Acesso Restrito
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Faça login para acessar seu painel de controle
                </p>
                <div className="space-x-4">
                  <Link to="/login" className="btn-accent-green">
                    Fazer Login
                  </Link>
                  <Link to="/cadastro" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Criar Conta
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Loja;
