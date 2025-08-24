import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Search, Filter, MapPin, Truck, Package, Clock, DollarSign,
  Star, Phone, Mail, Calendar, Weight, Route, User, Building
} from 'lucide-react';

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

  // Tipos de produtos agrícolas
  const productTypes = [
    { id: 'all', name: 'Todos os Produtos' },
    { id: 'soja', name: 'Soja' },
    { id: 'milho', name: 'Milho' },
    { id: 'algodao', name: 'Algodão' },
    { id: 'carne', name: 'Carne' },
    { id: 'insumo', name: 'Insumos' },
    { id: 'maquinario', name: 'Maquinário' }
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
    { id: 'graneleiro', name: 'Graneleiro' },
    { id: 'bitrem', name: 'Bitrem' },
    { id: 'bau', name: 'Baú' },
    { id: 'refrigerado', name: 'Refrigerado' },
    { id: 'carreta', name: 'Carreta' },
    { id: 'truck', name: 'Truck' }
  ];

  // Fretes simulados
  const mockFreights = [
    // Fretes de Soja
    {
      id: 1,
      product: 'soja',
      productName: 'Soja em Grãos',
      quantity: 30,
      unit: 'toneladas',
      origin: 'MT',
      originCity: 'Sinop',
      destination: 'SP',
      destinationCity: 'Santos',
      truckType: 'graneleiro',
      price: 180.00,
      priceUnit: 'por tonelada',
      totalPrice: 5400.00,
      deliveryTime: '3-4 dias',
      carrier: {
        name: 'Transportes Rápido MT',
        rating: 4.8,
        reviews: 156,
        verified: true,
        phone: '(66) 99999-9999',
        email: 'contato@rapidomt.com.br'
      },
      truck: {
        plate: 'MTU-1234',
        type: 'Graneleiro 30 ton',
        available: true
      },
      featured: true,
      urgent: false
    },
    {
      id: 2,
      product: 'soja',
      productName: 'Soja Tipo 1',
      quantity: 25,
      unit: 'toneladas',
      origin: 'GO',
      originCity: 'Rio Verde',
      destination: 'PR',
      destinationCity: 'Paranaguá',
      truckType: 'graneleiro',
      price: 165.00,
      priceUnit: 'por tonelada',
      totalPrice: 4125.00,
      deliveryTime: '2-3 dias',
      carrier: {
        name: 'Fretes Goiás Express',
        rating: 4.6,
        reviews: 89,
        verified: true,
        phone: '(62) 88888-8888',
        email: 'fretes@goiasexpress.com.br'
      },
      truck: {
        plate: 'GOI-5678',
        type: 'Graneleiro 25 ton',
        available: true
      },
      featured: false,
      urgent: true
    },

    // Fretes de Milho
    {
      id: 3,
      product: 'milho',
      productName: 'Milho em Grãos',
      quantity: 40,
      unit: 'toneladas',
      origin: 'MS',
      originCity: 'Dourados',
      destination: 'RS',
      destinationCity: 'Porto Alegre',
      truckType: 'graneleiro',
      price: 145.00,
      priceUnit: 'por tonelada',
      totalPrice: 5800.00,
      deliveryTime: '4-5 dias',
      carrier: {
        name: 'Transportadora Sul MS',
        rating: 4.7,
        reviews: 234,
        verified: true,
        phone: '(67) 77777-7777',
        email: 'contato@sulms.com.br'
      },
      truck: {
        plate: 'MSU-9012',
        type: 'Graneleiro 40 ton',
        available: true
      },
      featured: true,
      urgent: false
    },

    // Fretes de Carne
    {
      id: 4,
      product: 'carne',
      productName: 'Carne Bovina',
      quantity: 15,
      unit: 'toneladas',
      origin: 'MT',
      originCity: 'Cuiabá',
      destination: 'SP',
      destinationCity: 'São Paulo',
      truckType: 'refrigerado',
      price: 320.00,
      priceUnit: 'por tonelada',
      totalPrice: 4800.00,
      deliveryTime: '2-3 dias',
      carrier: {
        name: 'Frigorífico Express',
        rating: 4.9,
        reviews: 67,
        verified: true,
        phone: '(66) 66666-6666',
        email: 'frigo@express.com.br'
      },
      truck: {
        plate: 'MTU-3456',
        type: 'Refrigerado 15 ton',
        available: true
      },
      featured: true,
      urgent: false
    },

    // Fretes de Insumos
    {
      id: 5,
      product: 'insumo',
      productName: 'Fertilizantes',
      quantity: 20,
      unit: 'toneladas',
      origin: 'PR',
      originCity: 'Curitiba',
      destination: 'MT',
      destinationCity: 'Lucas do Rio Verde',
      truckType: 'bau',
      price: 280.00,
      priceUnit: 'por tonelada',
      totalPrice: 5600.00,
      deliveryTime: '5-6 dias',
      carrier: {
        name: 'Cargas Paraná',
        rating: 4.5,
        reviews: 123,
        verified: true,
        phone: '(41) 55555-5555',
        email: 'cargas@parana.com.br'
      },
      truck: {
        plate: 'PRU-7890',
        type: 'Baú 20 ton',
        available: true
      },
      featured: false,
      urgent: false
    },

    // Fretes de Maquinário
    {
      id: 6,
      product: 'maquinario',
      productName: 'Trator Agrícola',
      quantity: 1,
      unit: 'unidade',
      origin: 'SP',
      originCity: 'São Paulo',
      destination: 'GO',
      destinationCity: 'Goiânia',
      truckType: 'carreta',
      price: 2500.00,
      priceUnit: 'por carga',
      totalPrice: 2500.00,
      deliveryTime: '1-2 dias',
      carrier: {
        name: 'Transportes Especiais SP',
        rating: 4.8,
        reviews: 45,
        verified: true,
        phone: '(11) 44444-4444',
        email: 'especiais@sp.com.br'
      },
      truck: {
        plate: 'SPU-1111',
        type: 'Carreta Especial',
        available: true
      },
      featured: true,
      urgent: false
    }
  ];

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setFreights(mockFreights);
      setFilteredFreights(mockFreights);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filtrar fretes
    let filtered = freights;

    // Filtro por produto
    if (selectedProduct !== 'all') {
      filtered = filtered.filter(f => f.product === selectedProduct);
    }

    // Filtro por origem
    if (selectedOrigin !== 'all') {
      filtered = filtered.filter(f => f.origin === selectedOrigin);
    }

    // Filtro por destino
    if (selectedDestination !== 'all') {
      filtered = filtered.filter(f => f.destination === selectedDestination);
    }

    // Filtro por tipo de caminhão
    if (selectedTruckType !== 'all') {
      filtered = filtered.filter(f => f.truckType === selectedTruckType);
    }

    // Filtro por preço
    filtered = filtered.filter(f => f.totalPrice >= priceRange[0] && f.totalPrice <= priceRange[1]);

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.destinationCity.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFreights(filtered);
  }, [freights, selectedProduct, selectedOrigin, selectedDestination, selectedTruckType, priceRange, searchTerm]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getProductIcon = (product) => {
    switch (product) {
      case 'soja':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'milho':
        return <Package className="w-5 h-5 text-yellow-600" />;
      case 'algodao':
        return <Package className="w-5 h-5 text-white" />;
      case 'carne':
        return <Package className="w-5 h-5 text-red-600" />;
      case 'insumo':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'maquinario':
        return <Package className="w-5 h-5 text-gray-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTruckIcon = (truckType) => {
    switch (truckType) {
      case 'graneleiro':
        return <Truck className="w-5 h-5 text-orange-600" />;
      case 'bitrem':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'bau':
        return <Truck className="w-5 h-5 text-green-600" />;
      case 'refrigerado':
        return <Truck className="w-5 h-5 text-cyan-600" />;
      case 'carreta':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'truck':
        return <Truck className="w-5 h-5 text-gray-600" />;
      default:
        return <Truck className="w-5 h-5 text-gray-400" />;
    }
  };

  const getProductColor = (product) => {
    switch (product) {
      case 'soja':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'milho':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'algodao':
        return 'bg-white text-gray-800 border-gray-200';
      case 'carne':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'insumo':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maquinario':
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-900/20 to-green-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-600 to-cyan-600 bg-clip-text text-transparent"
          >
            AgroConecta
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Plataforma de fretes para o agronegócio brasileiro. Conecte produtores e transportadoras de forma rápida e segura.
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
                key={freight.id}
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
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getProductColor(freight.product)}`}>
                          {getProductIcon(freight.product)}
                          <span className="ml-2">{freight.productName}</span>
                        </div>
                        {freight.featured && (
                          <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                            DESTAQUE
                          </span>
                        )}
                        {freight.urgent && (
                          <span className="bg-red-400 text-red-900 px-2 py-1 rounded-full text-xs font-bold">
                            URGENTE
                          </span>
                        )}
                      </div>

                      {/* Rota */}
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{freight.originCity}</strong> ({freight.origin})
                          </span>
                        </div>
                        <Route className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{freight.destinationCity}</strong> ({freight.destination})
                          </span>
                        </div>
                      </div>

                      {/* Detalhes do Frete */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Weight className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{freight.quantity}</strong> {freight.unit}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{truckTypes.find(t => t.id === freight.truckType)?.name}</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{freight.deliveryTime}</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">
                            <strong>{freight.priceUnit}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {formatPrice(freight.totalPrice)}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {freight.priceUnit}
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
                          <span className="font-medium text-gray-900">{freight.carrier.name}</span>
                          {freight.carrier.verified && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              ✓ Verificado
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {freight.carrier.rating} ({freight.carrier.reviews} avaliações)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">
                            {freight.truck.plate} - {freight.truck.type}
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
          {filteredFreights.length === 0 && (
            <div className="text-center py-20">
              <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum frete encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou termos de busca</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AgroConecta;
