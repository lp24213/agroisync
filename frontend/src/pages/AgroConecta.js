import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, Filter, MapPin, Truck, Package, Clock, DollarSign,
  Star, Phone, Mail, Calendar, Weight, Route, User, Building, Plus
} from 'lucide-react';
import { freightService } from '../services/freightService';

const AgroConecta = () => {
  const { isDark } = useTheme();
  const [freights, setFreights] = useState([]);
  const [filteredFreights, setFilteredFreights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedOrigin, setSelectedOrigin] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedTruckType, setSelectedTruckType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Tipos de produtos agrícolas
  const productTypes = [
    { id: 'all', name: 'Todos os Produtos' },
    { id: 'soja', name: 'Soja' },
    { id: 'milho', name: 'Milho' },
    { id: 'algodão', name: 'Algodão' },
    { id: 'café', name: 'Café' },
    { id: 'insumo', name: 'Insumos' },
    { id: 'maquinário', name: 'Maquinário' }
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

  // Tipos de caminhão
  const truckTypes = [
    { id: 'all', name: 'Todos os Tipos' },
    { id: 'truck', name: 'Truck' },
    { id: 'truck-truck', name: 'Truck-Truck' },
    { id: 'truck-truck-truck', name: 'Truck-Truck-Truck' },
    { id: 'truck-truck-truck-truck', name: 'Truck-Truck-Truck-Truck' }
  ];

  // Função para buscar fretes do MongoDB
  const fetchFreights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      if (selectedProduct !== 'all') filters.productType = selectedProduct;
      if (selectedOrigin !== 'all') filters.originState = selectedOrigin;
      if (selectedDestination !== 'all') filters.destinationState = selectedDestination;
      if (selectedTruckType !== 'all') filters.truckType = selectedTruckType;
      if (priceRange[0] > 0) filters.minValue = priceRange[0];
      if (priceRange[1] < 1000) filters.maxValue = priceRange[1];
      if (searchTerm) filters.search = searchTerm;
      
      const response = await freightService.getFreights(filters);
      
      if (response.success) {
        setFreights(response.data);
        setFilteredFreights(response.data);
      } else {
        setError('Erro ao carregar fretes');
      }
    } catch (error) {
      console.error('Error fetching freights:', error);
      setError(error.message || 'Erro ao carregar fretes');
      
      // Fallback para dados simulados em caso de erro
      setFreights([]);
      setFilteredFreights([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar fretes ao montar o componente
  useEffect(() => {
    fetchFreights();
  }, []);

  // Atualizar fretes quando filtros mudarem
  useEffect(() => {
    fetchFreights();
  }, [selectedProduct, selectedOrigin, selectedDestination, selectedTruckType, priceRange, searchTerm]);

  // Função para formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_negotiation':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Função para obter texto do status
  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'in_negotiation':
        return 'Em Negociação';
      case 'assigned':
        return 'Assignado';
      case 'in_transit':
        return 'Em Trânsito';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getProductIcon = (product) => {
    switch (product) {
      case 'Soja em Grão Tipo 1':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'Milho em Grão Seco':
        return <Package className="w-5 h-5 text-yellow-600" />;
      case 'Algodão em Pluma Premium':
        return <Package className="w-5 h-5 text-white" />;
      case 'Fertilizantes NPK':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'Máquinas Agrícolas':
        return <Package className="w-5 h-5 text-gray-600" />;
      case 'Bovinos Vivos Nelore':
        return <Package className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTruckIcon = (truckType) => {
    switch (truckType) {
      case 'Truck 3 eixos graneleiro':
        return <Truck className="w-5 h-5 text-orange-600" />;
      case 'Truck 2 eixos graneleiro':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'Truck 3 eixos baú':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'Truck boiadeiro 3 eixos':
        return <Truck className="w-5 h-5 text-cyan-600" />;
      default:
        return <Truck className="w-5 h-5 text-gray-400" />;
    }
  };

  const getProductColor = (product) => {
    switch (product) {
      case 'Soja em Grão Tipo 1':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Milho em Grão Seco':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Algodão em Pluma Premium':
        return 'bg-white text-gray-800 border-gray-200';
      case 'Fertilizantes NPK':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Máquinas Agrícolas':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Bovinos Vivos Nelore':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando fretes...</p>
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
            AgroConecta
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Plataforma de Fretes e Transportes Agrícolas
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
                  placeholder="Buscar fretes, transportadoras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4">
              {/* Produto */}
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {productTypes.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              {/* Origem */}
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>

              {/* Destino */}
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>

              {/* Tipo de Caminhão */}
              <select
                value={selectedTruckType}
                onChange={(e) => setSelectedTruckType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {truckTypes.map(truck => (
                  <option key={truck.id} value={truck.id}>
                    {truck.name}
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
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Botão Cadastrar Frete */}
              <button
                onClick={() => window.location.href = '/cadastro'}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Cadastrar Frete
              </button>

              {/* Botão Assinar Plano */}
              <button
                onClick={() => window.location.href = '/planos'}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                Assinar Plano
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fretes */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Estatísticas */}
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold text-blue-600">{filteredFreights.length}</span> de{' '}
              <span className="font-semibold text-blue-600">{freights.length}</span> fretes disponíveis
            </p>
          </div>

          {/* Lista de Fretes */}
          <div className="space-y-6">
            {filteredFreights.map((freight, index) => (
              <motion.div
                key={freight._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header do Frete */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Produto e Categoria */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getProductColor(freight.product?.type)}`}>
                          {getProductIcon(freight.product?.type)}
                          <span className="ml-2">{freight.product?.name}</span>
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(freight.status)}`}>
                          {getStatusText(freight.status)}
                        </div>
                      </div>

                      {/* Rota */}
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{freight.origin?.city}, {freight.origin?.state}</strong>
                          </span>
                        </div>
                        <Route className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{freight.destination?.city}, {freight.destination?.state}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Detalhes do Frete */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Weight className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{freight.quantity} {freight.product?.unit}</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{freight.truckType}</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{freight.deliveryTime} dias</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{formatPrice(freight.freightValue)}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {formatPrice(freight.freightValue)}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Valor por carga
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                        Solicitar Frete
                      </button>
                    </div>
                  </div>

                  {/* Informações da Transportadora */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-gray-900">{freight.carrier?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {freight.carrier?.rating || 'N/A'} ({freight.carrier?.reviews || 0} avaliações)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">
                            {freight.truckType}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <Phone className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <Mail className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sem Fretes */}
          {!loading && !error && filteredFreights.length === 0 && (
            <div className="text-center py-20">
              <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum frete encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou termos de busca</p>
            </div>
          )}

          {/* Estado de Erro */}
          {error && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar fretes</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                onClick={fetchFreights}
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
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Carregando fretes...</h3>
              <p className="text-gray-500">Aguarde enquanto buscamos os melhores fretes para você</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AgroConecta;
