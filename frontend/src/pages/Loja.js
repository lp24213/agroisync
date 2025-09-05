import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Store, CheckCircle, UserPlus, 
  Building2, Search, Star, ShoppingCart, Leaf, User,
  Eye, Heart, Phone, Mail, Calendar, Package,
  Plus, Edit, Trash, Filter, Grid, List,
  TrendingUp, DollarSign, MapPin, Clock, Tag, MessageSquare, BarChart3,
  Map, FileText, Shield, Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import CartWidget from '../components/CartWidget';
import BuyersPanel from '../components/BuyersPanel';
import SellersPanel from '../components/SellersPanel';
import UserPanel from '../components/UserPanel';
import MarketplaceContent from '../components/MarketplaceContent';
import productService, { PRODUCT_CATEGORIES } from '../services/productService';
import cartService from '../services/cartService';
import transactionService, { TRANSACTION_STATUS, TRANSACTION_TYPES } from '../services/transactionService';
import EscrowBadge from '../components/EscrowBadge';
import DocumentValidator from '../components/DocumentValidator';
import baiduMapsService from '../services/baiduMapsService';
import receitaService from '../services/receitaService';
import AgroImages from '../components/AgroImages';

const Loja = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Guard para evitar piscar
  const [mounted, setMounted] = useState(true);
  
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

  // Estados para integrações de serviços
  const [showDocumentValidator, setShowDocumentValidator] = useState(false);
  const [showLocationValidator, setShowLocationValidator] = useState(false);
  const [documentValidationResult, setDocumentValidationResult] = useState(null);
  const [locationValidationResult, setLocationValidationResult] = useState(null);
  const [isValidatingDocument, setIsValidatingDocument] = useState(false);
  const [isValidatingLocation, setIsValidatingLocation] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    loadProducts();
    if (isAuthenticated) {
      loadUserData();
    }
    initializeServices();
  }, [isAuthenticated]);

  useEffect(() => {
    if (products && Array.isArray(products)) {
      applyFilters();
    }
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Carregando produtos...</h2>
            <p className="text-gray-600">Aguarde enquanto carregamos os produtos disponíveis.</p>
          </div>
        </div>
      </div>
    );
  }

  const initializeServices = async () => {
    try {
      console.log('Loja: Inicializando serviços...'); // Debug
      await baiduMapsService.initialize();
      await receitaService.initialize();
      console.log('Loja: Serviços inicializados com sucesso'); // Debug
    } catch (error) {
      console.error('Erro ao inicializar serviços:', error);
    }
  };

  const loadProducts = async () => {
    console.log('Loja: loadProducts iniciado'); // Debug
    setLoading(true);
    try {
      // Usar o serviço de produtos
      console.log('Loja: Chamando productService.getProducts()'); // Debug
      const productsData = await productService.getProducts();
      console.log('Loja: Produtos carregados:', productsData); // Debug
      
      // Safe-guard: garantir que productsData seja um array
      const safeProductsData = Array.isArray(productsData) ? productsData : [];
      setProducts(safeProductsData);
      setFilteredProducts(safeProductsData);
      console.log('Loja: Produtos definidos no estado'); // Debug
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      // Fallback: produtos mock básicos
      console.log('Loja: Usando produtos fallback'); // Debug
      const fallbackProducts = [
        {
          id: 1,
          name: 'Soja Premium Tipo 1',
          category: 'Grãos',
          price: 180.50,
          description: 'Soja de alta qualidade, ideal para processamento industrial.',
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
          rating: 4.8,
          reviews: 156,
          seller: 'Fazenda Santa Maria',
          location: 'Mato Grosso, MT',
          stock: 5000,
          unit: 'kg',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Milho Especial para Ração',
          category: 'Grãos',
          price: 85.30,
          description: 'Milho de alta qualidade para produção de ração animal.',
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
          rating: 4.6,
          reviews: 89,
          seller: 'Cooperativa Agro Norte',
          location: 'Paraná, PR',
          stock: 8000,
          unit: 'kg',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Fertilizante NPK 20-10-10',
          category: 'Fertilizantes',
          price: 89.90,
          description: 'Fertilizante balanceado para todas as culturas.',
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
          rating: 4.5,
          reviews: 234,
          seller: 'Agro Fertilizantes LTDA',
          location: 'São Paulo, SP',
          stock: 2000,
          unit: 'kg',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Trator Massey Ferguson 6713',
          category: 'Maquinários',
          price: 185000.00,
          description: 'Trator de 130cv, ideal para grandes propriedades.',
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
          rating: 4.9,
          reviews: 45,
          seller: 'Máquinas Agrícolas Center',
          location: 'Goiás, GO',
          stock: 1,
          unit: 'unidade',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
      setProducts(fallbackProducts);
      setFilteredProducts(fallbackProducts);
      console.log('Loja: Produtos fallback definidos'); // Debug
    } finally {
      setLoading(false);
      console.log('Loja: Loading finalizado'); // Debug
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
        txn.type === 'PRODUCT' && txn.buyerId === user.id
      );
      const salesTransactions = userTransactions.filter(txn => 
        txn.type === 'PRODUCT' && txn.sellerId === user.id
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
  };

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
    try {
      if (!product || !product.id) {
        console.error('Produto inválido para solicitar cotação:', product);
        return;
      }
      
      // Transformar em modelo de intermediação - "Solicitar Cotação"
      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        ));
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
      
      // Mostrar feedback de intermediação
      alert('Produto adicionado ao pedido de cotação! O vendedor será notificado.');
    } catch (error) {
      console.error('Erro ao solicitar cotação:', error);
    }
  };

  const removeFromCart = (productId) => {
    try {
      if (!productId) {
        console.error('ID do produto inválido para remover do carrinho');
        return;
      }
      setCart(cart.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
    }
  };

  const updateCartQuantity = (productId, quantity) => {
    try {
      if (!productId || quantity < 0) {
        console.error('Parâmetros inválidos para atualizar quantidade');
        return;
      }
      
      if (quantity === 0) {
        removeFromCart(productId);
      } else {
        setCart(cart.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade do carrinho:', error);
    }
  };

  const toggleWishlist = (product) => {
    try {
      if (!product || !product.id) {
        console.error('Produto inválido para favoritar:', product);
        return;
      }
      
      const isInWishlist = wishlist.find(item => item.id === product.id);
      if (isInWishlist) {
        setWishlist(wishlist.filter(item => item.id !== product.id));
      } else {
        setWishlist([...wishlist, product]);
      }
    } catch (error) {
      console.error('Erro ao favoritar produto:', error);
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
      if (!isAuthenticated) {
        alert('Faça login para registrar interesse em produtos');
        navigate('/login');
        return;
      }

      // Criar transação de intermediação (PRODUCT)
      const transaction = await transactionService.createTransaction({
        type: 'PRODUCT',
        itemId: purchaseData.items?.[0]?.id || cart[0]?.id,
        buyerId: user.id,
        sellerId: purchaseData.seller?.id || cart[0]?.seller?.id,
        status: 'PENDING',
        items: purchaseData.items || cart,
        total: purchaseData.total || cart.reduce((sum, item) => sum + item.totalPrice, 0),
        shipping: purchaseData.shipping
      });

      if (transaction) {
        // Notificar usuários
        await transactionService.notifyUsers(transaction);
        
        // Fechar carrinho
        setShowCart(false);
        
        // Redirecionar para painel com mensageria aberta
        navigate(`/painel?transactionId=${transaction.id}&tab=messages`);
        
        // Mostrar mensagem de sucesso
        alert('Intenção de compra registrada! Redirecionando para mensageria...');
      }
    } catch (error) {
      console.error('Erro ao processar intenção de compra:', error);
      alert('Erro ao registrar intenção de compra. Tente novamente.');
    }
  };

  // Funções de validação de documentos
  const handleDocumentValidation = async (documents) => {
    setIsValidatingDocument(true);
    try {
      const results = await receitaService.validateDocuments(documents);
      setDocumentValidationResult(results);
      setShowDocumentValidator(false);
    } catch (error) {
      console.error('Erro na validação de documentos:', error);
      alert('Erro ao validar documentos. Tente novamente.');
    } finally {
      setIsValidatingDocument(false);
    }
  };

  // Funções de validação de localização
  const handleLocationValidation = async (address) => {
    setIsValidatingLocation(true);
    try {
      const result = await baiduMapsService.validateBrazilianAddress(address);
      setLocationValidationResult(result);
      setShowLocationValidator(false);
    } catch (error) {
      console.error('Erro na validação de localização:', error);
      alert('Erro ao validar endereço. Tente novamente.');
    } finally {
      setIsValidatingLocation(false);
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
    { id: 'wishlist', name: 'Favoritos', icon: Heart, count: wishlist.length },
    { id: 'images', name: 'Galeria', icon: Globe }
  ];

  // Guard para evitar piscar - deve vir primeiro
  if (!mounted) {
    return null;
  }

  if (loading) {
    console.log('Loja: Renderizando loading...'); // Debug
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando marketplace...</p>
        </motion.div>
      </div>
    );
  }

  console.log('Loja: Renderizando página principal, products:', products.length, 'filteredProducts:', filteredProducts.length); // Debug

  return (
    <div className="min-h-screen bg-white text-gray-900 py-8 pt-16">
      
      {/* Header com Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Marketplace AgroSync
          </h1>
          <p className="text-lg text-gray-600">
            Compre e venda produtos agrícolas com segurança e confiança
          </p>
        </motion.div>

        {/* Navegação por Abas */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                    {tab.count > 0 && (
                      <span className="bg-emerald-600 text-white text-xs rounded-full px-2 py-1">
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
                  filters={{
                    search: searchTerm,
                    categories: selectedCategory ? [selectedCategory] : [],
                    locations: [],
                    minPrice: priceRange.min,
                    maxPrice: priceRange.max,
                    minRating: 0,
                    sortBy: sortBy
                  }}
                  onFiltersChange={(newFilters) => {
                    setSearchTerm(newFilters.search || '');
                    setSelectedCategory(newFilters.categories?.[0] || '');
                    setPriceRange({
                      min: newFilters.minPrice || 0,
                      max: newFilters.maxPrice || 10000
                    });
                    setSortBy(newFilters.sortBy || 'relevance');
                  }}
                  categories={Object.keys(PRODUCT_CATEGORIES)}
                  locations={['Mato Grosso', 'Paraná', 'São Paulo', 'Goiás']}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                />

                {/* Produtos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard
                        key={product?.id || Math.random()}
                        product={product}
                        onContact={() => console.log('Contato:', product?.id)}
                        onFavorite={() => toggleWishlist(product)}
                        onView={() => console.log('Visualizar:', product?.id)}
                        onAddToCart={() => addToCart(product)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum produto encontrado
                      </h3>
                      <p className="text-gray-600">
                        Tente ajustar os filtros ou fazer uma nova busca
                      </p>
                    </div>
                  )}
                </div>
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

                    <button
                      onClick={() => setShowDocumentValidator(true)}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-agro-green hover:bg-green-50 transition-colors text-left"
                    >
                      <FileText className="w-5 h-5 text-agro-green mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Validar Documentos</p>
                        <p className="text-sm text-gray-600">CPF, CNPJ e Inscrição Estadual</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setShowLocationValidator(true)}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-agro-green hover:bg-green-50 transition-colors text-left"
                    >
                      <Map className="w-5 h-5 text-agro-green mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Validar Endereço</p>
                        <p className="text-sm text-gray-600">CEP e localização via Baidu Maps</p>
                      </div>
                    </button>

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
                  
                  {myProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Você ainda não cadastrou produtos
                      </p>
                        </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.isArray(myProducts) && myProducts.length > 0 ? (
                        myProducts.map((product) => (
                          <div key={product?.id || Math.random()} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">{product?.name || 'Produto sem nome'}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product?.status)}`}>
                                {getStatusText(product?.status)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product?.description || 'Sem descrição'}</p>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-agro-green">{formatCurrency(product?.price || 0)}</span>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-700">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-700">
                                  <Trash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Você ainda não tem produtos cadastrados
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Minhas Compras */}
                <div className="card-premium p-6">
                  <h3 className="title-premium text-lg font-semibold mb-4">Minhas Compras</h3>
                  
                  {myPurchases.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Você ainda não fez compras
                      </p>
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {Array.isArray(myPurchases) && myPurchases.length > 0 ? (
                      myPurchases.map((purchase) => (
                        <div key={purchase?.id || Math.random()} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {purchase?.items?.[0]?.name || 'Produto'}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Vendedor: {purchase?.seller?.name || 'N/A'}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(purchase?.status)}`}>
                              {getStatusText(purchase?.status)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-agro-green">
                              {formatCurrency(purchase?.total || 0)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(purchase?.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Você ainda não fez compras
                        </p>
                      </div>
                    )}
                  </div>
                  )}
                </div>
              </div>
            )}

            {/* Carrinho */}
            {activeTab === 'cart' && (
              <div className="space-y-6">
                <h2 className="title-premium text-2xl font-bold">Carrinho de Interesse</h2>
                
                {Array.isArray(cart) && cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item?.id || Math.random()} className="card-premium p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{item?.name || 'Produto sem nome'}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Vendedor: {item?.seller?.name || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Quantidade: {item?.quantity || 1}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold text-agro-green">
                              {formatCurrency((item?.price || 0) * (item?.quantity || 1))}
                            </span>
                            <button
                              onClick={() => removeFromCart(item?.id)}
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
                          {formatCurrency(cart.reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 1)), 0))}
                        </span>
                      </div>
                      <button 
                        onClick={() => handlePurchaseIntent({
                          items: cart,
                          total: cart.reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 1)), 0)
                        })}
                        className="btn-accent-green w-full"
                      >
                        Registrar Intenção de Compra
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Carrinho vazio
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Adicione produtos ao carrinho para registrar seu interesse
                    </p>
                    <button
                      onClick={() => handleTabChange('marketplace')}
                      className="btn-accent-green"
                    >
                      Explorar Produtos
                    </button>
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

            {/* Galeria de Imagens */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <AgroImages />
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

      {/* Modal de Validação de Documentos */}
      <AnimatePresence>
        {showDocumentValidator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="title-premium text-lg font-semibold">Validação de Documentos</h3>
                  <button
                    onClick={() => setShowDocumentValidator(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Fechar</span>
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                <DocumentValidator onValidationComplete={handleDocumentValidation} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Validação de Localização */}
      <AnimatePresence>
        {showLocationValidator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="title-premium text-lg font-semibold">Validação de Endereço</h3>
                  <button
                    onClick={() => setShowLocationValidator(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Fechar</span>
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço para Validação
                    </label>
                    <input
                      type="text"
                      placeholder="Digite o endereço completo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => handleLocationValidation({ address: 'Endereço de teste' })}
                    disabled={isValidatingLocation}
                    className="btn-accent-green w-full"
                  >
                    {isValidatingLocation ? 'Validando...' : 'Validar Endereço'}
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
