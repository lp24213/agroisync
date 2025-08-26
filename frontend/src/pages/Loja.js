import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import {
  Store,
  Package,
  ShoppingCart,
  Users,
  Shield,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  UserPlus,
  Building2,
  Truck,
  Eye,
  Lock,
  Filter,
  Search,
  MapPin,
  DollarSign,
  Leaf,
  Calendar,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Loja = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { user, isAdmin } = useAuth();
  const { isPaid, planActive } = usePayment();
  const [activeTab, setActiveTab] = useState('products');
  const [showSecretPanel, setShowSecretPanel] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    priceMin: '',
    priceMax: '',
    category: '',
    culture: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Loja - AgroSync';
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Buscar produtos reais do backend
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        setError('Erro ao carregar produtos');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredProducts = products.filter(product => {
    if (filters.city && !product.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.priceMin && product.price < parseFloat(filters.priceMin)) return false;
    if (filters.priceMax && product.price > parseFloat(filters.priceMax)) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (filters.culture && product.culture !== filters.culture) return false;
    return true;
  });

  const getProductImage = (category) => {
    const images = {
      'soja': '/images/products/soja.jpg',
      'milho': '/images/products/milho.jpg',
      'cafe': '/images/products/cafe.jpg',
      'algodao': '/images/products/algodao.jpg',
      'default': '/images/products/default.jpg'
    };
    return images[category] || images.default;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleProductClick = (product) => {
    if (isPaid || isAdmin) {
      setSelectedProduct(product);
    } else {
      navigate('/planos');
    }
  };

  const categories = ['Soja', 'Milho', 'Café', 'Algodão', 'Trigo', 'Arroz', 'Feijão'];
  const cultures = ['Grãos', 'Frutas', 'Hortaliças', 'Raízes', 'Leguminosas'];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background - Branco neutro */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-stone-50">
            <div className="absolute inset-0 bg-white opacity-95"></div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-slate-800"
          >
            Marketplace AgroSync
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8"
          >
            Compre e venda produtos agrícolas com segurança e transparência
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/cadastro')}
              className="px-8 py-4 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors duration-300"
            >
              Cadastrar Produto
            </button>
            <button
              onClick={() => navigate('/planos')}
              className="px-8 py-4 bg-transparent border-2 border-slate-600 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors duration-300"
            >
              Ver Planos
            </button>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-card p-6 border border-slate-200"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <Filter className="w-6 h-6 mr-3" />
              Filtros de Busca
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cidade
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder="Digite a cidade"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Preço Mínimo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preço Mínimo
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    placeholder="R$ 0,00"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Preço Máximo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preço Máximo
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    placeholder="R$ 999,99"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categoria
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Cultura */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cultura
                </label>
                <select
                  value={filters.culture}
                  onChange={(e) => handleFilterChange('culture', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  {cultures.map(culture => (
                    <option key={culture} value={culture}>{culture}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Produtos Disponíveis
            </h2>
            <p className="text-xl text-slate-600">
              {filteredProducts.length} produtos encontrados
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Carregando produtos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                Tentar Novamente
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden hover:shadow-elevated transition-all duration-300 cursor-pointer group"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={getProductImage(product.category?.toLowerCase())}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-slate-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      {/* Preço */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-slate-800">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-slate-500">
                          por {product.unit}
                        </span>
                      </div>

                      {/* Localização */}
                      <div className="flex items-center text-slate-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{product.city}, {product.state}</span>
                      </div>

                      {/* Cultura */}
                      <div className="flex items-center text-slate-600">
                        <Leaf className="w-4 h-4 mr-2" />
                        <span className="text-sm">{product.culture}</span>
                      </div>

                      {/* Data */}
                      <div className="flex items-center text-slate-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors duration-200 flex items-center justify-center">
                      {isPaid || isAdmin ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Login Necessário
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Por que escolher o Marketplace AgroSync?
            </h2>
            <p className="text-xl text-slate-600">
              Segurança, transparência e eficiência para suas transações
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Segurança Total',
                description: 'Dados protegidos e transações verificadas'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Comunidade Ativa',
                description: 'Milhares de produtores confiáveis'
              },
              {
                icon: <CreditCard className="w-8 h-8" />,
                title: 'Pagamentos Seguros',
                description: 'Stripe e Metamask integrados'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-600 to-slate-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-6"
          >
            Pronto para vender seus produtos?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-200 mb-8"
          >
            Junte-se a milhares de produtores que já estão usando o AgroSync
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/cadastro')}
              className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors duration-300"
            >
              Começar a Vender
            </button>
            <button
              onClick={() => navigate('/planos')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-slate-700 transition-colors duration-300"
            >
              Ver Planos
            </button>
          </motion.div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600">Preço</label>
                    <p className="text-lg font-bold text-slate-800">
                      {formatPrice(selectedProduct.price)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600">Categoria</label>
                    <p className="text-slate-800">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600">Cultura</label>
                    <p className="text-slate-800">{selectedProduct.culture}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600">Localização</label>
                    <p className="text-slate-800">{selectedProduct.city}, {selectedProduct.state}</p>
                  </div>
                </div>

                {/* Dados privados - apenas para usuários pagos */}
                {(isPaid || isAdmin) && (
                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Informações de Contato</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600">Telefone</label>
                        <p className="text-slate-800">{selectedProduct.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600">E-mail</label>
                        <p className="text-slate-800">{selectedProduct.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600">CNPJ</label>
                        <p className="text-slate-800">{selectedProduct.cnpj}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600">Empresa</label>
                        <p className="text-slate-800">{selectedProduct.companyName}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => navigate('/mensageria')}
                    className="flex-1 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors duration-200"
                  >
                    Enviar Mensagem
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors duration-200"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Loja;
