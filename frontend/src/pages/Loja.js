import React, { useState } from 'react';
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
  Truck
} from 'lucide-react';

const Loja = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { user, isAdmin } = useAuth();
  const { isPaid, planActive } = usePayment();
  const [activeTab, setActiveTab] = useState('overview');

  // Dados mock para demonstração
  const mockProducts = [
    {
      id: 1,
      name: 'Soja Premium',
      category: 'grains',
      price: 180.00,
      description: 'Soja de alta qualidade para exportação',
      city: 'Londrina',
      state: 'PR',
      seller: 'Fazenda Santa Maria',
      isPaid: true
    },
    {
      id: 2,
      name: 'Milho Especial',
      category: 'grains',
      price: 95.50,
      description: 'Milho especial para ração animal',
      city: 'Cascavel',
      state: 'PR',
      seller: 'Cooperativa Agro',
      isPaid: false
    },
    {
      id: 3,
      name: 'Trigo Orgânico',
      category: 'grains',
      price: 220.00,
      description: 'Trigo orgânico certificado',
      city: 'Passo Fundo',
      state: 'RS',
      seller: 'Produtor Orgânico',
      isPaid: true
    }
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      grains: '🌾',
      inputs: '🧪',
      machinery: '🚜',
      livestock: '🐄',
      fruits: '🍎',
      vegetables: '🥬'
    };
    return icons[category] || '📦';
  };

  const getCategoryName = (category) => {
    const names = {
      grains: 'Grãos',
      inputs: 'Insumos',
      machinery: 'Maquinário',
      livestock: 'Pecuária',
      fruits: 'Frutas',
      vegetables: 'Vegetais'
    };
    return names[category] || category;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header da Loja */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Store className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AgroSync Loja
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              Conectando produtores e compradores em uma plataforma segura e transparente
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navegação por Abas */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Store },
              { id: 'products', label: 'Produtos', icon: Package },
              { id: 'registration', label: 'Cadastro', icon: UserPlus },
              { id: 'plans', label: 'Planos', icon: CreditCard }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Conteúdo das Abas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Aba: Visão Geral */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Produtos</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,247</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vendedores Ativos</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">89</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                    <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Transações Hoje</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">23</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Produtos em Destaque */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Produtos em Destaque
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.isPaid 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {product.isPaid ? 'Verificado' : 'Pendente'}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {product.city}, {product.state}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Aba: Produtos */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Todas as Categorias</option>
                  <option value="grains">Grãos</option>
                  <option value="inputs">Insumos</option>
                  <option value="machinery">Maquinário</option>
                  <option value="livestock">Pecuária</option>
                </select>
                <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Todos os Estados</option>
                  <option value="PR">Paraná</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                </select>
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                  Buscar
                </button>
              </div>
            </div>

            {/* Lista de Produtos */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Produtos Disponíveis
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.isPaid 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {product.isPaid ? 'Verificado' : 'Pendente'}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {product.city}, {product.state}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Vendedor: {product.seller}
                        </span>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Aba: Cadastro */}
        {activeTab === 'registration' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Tipos de Cadastro */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cadastro de Anunciante */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center mb-6">
                  <Building2 className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Anunciante
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cadastre-se para vender seus produtos agrícolas
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Publicar produtos ilimitados</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Painel de gestão completo</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Mensageria com compradores</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Relatórios de visualizações</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <span>Cadastrar como Anunciante</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Cadastro de Comprador */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center mb-6">
                  <ShoppingCart className="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Comprador
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cadastre-se para comprar produtos agrícolas
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Acesso a todos os produtos</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">3 produtos gratuitos por mês</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Mensageria com vendedores</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Painel de favoritos</span>
                  </div>
                </div>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <span>Cadastrar como Comprador</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Regras de Privacidade */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Regras de Privacidade e Dados
                  </h4>
                  <div className="space-y-2 text-blue-800 dark:text-blue-200">
                    <p>• <strong>Dados Públicos:</strong> Nome do produto, categoria, preço, cidade e estado ficam visíveis para todos</p>
                    <p>• <strong>Dados Privados:</strong> CPF/CNPJ, telefone, endereço completo e documentos só são liberados após pagamento</p>
                    <p>• <strong>Compradores:</strong> Têm acesso a 3 produtos gratuitos por mês, após isso precisam de plano ativo</p>
                    <p>• <strong>Anunciantes:</strong> Precisam de plano ativo para publicar produtos e acessar dados dos compradores</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Aba: Planos */}
        {activeTab === 'plans' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Planos Disponíveis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plano Comprador */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center mb-6">
                  <ShoppingCart className="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Comprador Básico
                  </h3>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    R$ 25
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">por mês</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Acesso a todos os produtos</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Mensageria ilimitada</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Dados completos dos vendedores</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Painel de favoritos</span>
                  </div>
                </div>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  Escolher Plano
                </button>
              </div>

              {/* Plano Anunciante */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-blue-500 dark:border-blue-400 p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
                
                <div className="text-center mb-6">
                  <Building2 className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Anunciante Premium
                  </h3>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    R$ 49,90
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">por mês</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Publicar até 10 produtos</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Mensageria ilimitada</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Dados completos dos compradores</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Painel de gestão completo</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Relatórios de visualizações</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  Escolher Plano
                </button>
              </div>

              {/* Plano Freteiro */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center mb-6">
                  <Truck className="w-16 h-16 mx-auto text-purple-600 dark:text-purple-400 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Freteiro Premium
                  </h3>
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    R$ 79,90
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">por mês</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Publicar até 20 fretes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Mensageria ilimitada</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Dados completos dos contratantes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Painel de gestão completo</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Relatórios de rotas</span>
                  </div>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  Escolher Plano
                </button>
              </div>
            </div>

            {/* Informações de Pagamento */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-6">
              <div className="flex items-start space-x-3">
                <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    Formas de Pagamento Aceitas
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-800 dark:text-green-200">
                    <div>
                      <h5 className="font-medium mb-2">💳 Cartão de Crédito/Débito</h5>
                      <p className="text-sm">Via Stripe - todas as bandeiras principais</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">₿ Criptomoedas</h5>
                      <p className="text-sm">Via Metamask - ETH, USDC, BNB</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">📱 PIX</h5>
                      <p className="text-sm">Pagamento instantâneo</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">🏦 Boleto Bancário</h5>
                      <p className="text-sm">Vencimento em 3 dias úteis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Loja;
