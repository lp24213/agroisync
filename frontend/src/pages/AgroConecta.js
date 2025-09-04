import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, MapPin, Clock, 
  Search, Star, Eye, Heart, MessageSquare,
  Plus, BarChart3, Users, Package,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AgroConecta = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('freights');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState('relevance');

  // Mock data para demonstração
  const freights = [
        {
          id: 1,
      title: 'Transporte de Soja - MT para SP',
      origin: 'Sinop, MT',
      destination: 'Santos, SP',
      distance: '1.850 km',
      weight: '25 toneladas',
      volume: '45 m³',
      price: 'R$ 8.500',
      deadline: '3 dias',
      type: 'Granel',
      vehicle: 'Carreta',
      advertiser: {
        name: 'Cooperativa Agro Norte',
        rating: 4.8,
          verified: true,
        phone: '(66) 99236-2830',
        email: 'contato@agronorte.com.br'
      },
      description: 'Transporte de soja em grãos, embalagem big bag, carregamento em silo',
      requirements: ['Documentação completa', 'Seguro de carga', 'Rastreamento GPS'],
      status: 'active',
      createdAt: '2 horas atrás'
        },
        {
          id: 2,
      title: 'Fertilizantes - PR para GO',
      origin: 'Londrina, PR',
      destination: 'Goiânia, GO',
      distance: '1.200 km',
      weight: '30 toneladas',
      volume: '60 m³',
      price: 'R$ 6.800',
      deadline: '2 dias',
      type: 'Granel',
      vehicle: 'Truck',
      advertiser: {
        name: 'Agro Fertilizantes LTDA',
        rating: 4.9,
          verified: true,
        phone: '(66) 99236-2830',
        email: 'vendas@agrofert.com.br'
      },
      description: 'Transporte de fertilizantes NPK, embalagem sacos 50kg',
      requirements: ['Certificado de transporte', 'Cobertura contra umidade'],
      status: 'active',
      createdAt: '1 hora atrás'
        },
        {
          id: 3,
      title: 'Milho - RS para SC',
      origin: 'Passo Fundo, RS',
      destination: 'Blumenau, SC',
      distance: '450 km',
      weight: '20 toneladas',
      volume: '35 m³',
      price: 'R$ 3.200',
      deadline: '1 dia',
      type: 'Granel',
      vehicle: 'Truck',
      advertiser: {
        name: 'Fazenda Santa Maria',
        rating: 4.7,
        verified: true,
        phone: '(66) 99236-2830',
        email: 'contato@santamaria.com.br'
      },
      description: 'Transporte de milho em grãos, embalagem big bag',
      requirements: ['Controle de temperatura', 'Documentação fitossanitária'],
      status: 'active',
      createdAt: '30 min atrás'
    }
  ];

  const drivers = [
    {
      id: 1,
      name: 'João Silva',
      rating: 4.9,
      reviews: 156,
          verified: true,
      experience: '8 anos',
      vehicle: 'Carreta 3/4',
      capacity: '25 toneladas',
      location: 'Mato Grosso, MT',
      lastActive: '1 hora atrás',
      specialties: ['Grãos', 'Fertilizantes', 'Defensivos'],
      description: 'Motorista profissional com experiência em transporte de cargas agrícolas',
      contact: {
        phone: '(66) 99236-2830',
        email: 'joao.silva@email.com'
      },
      stats: {
        completedFreights: 234,
        totalDistance: '125.000 km',
        satisfaction: '98%',
        responseTime: '2h'
      },
      documents: ['CNH E', 'Carteira de Motorista', 'Certificado de Transporte'],
      availability: 'Disponível'
    },
    {
      id: 2,
      name: 'Maria Santos',
      rating: 4.8,
      reviews: 89,
          verified: true,
      experience: '5 anos',
      vehicle: 'Truck',
      capacity: '15 toneladas',
      location: 'Paraná, PR',
      lastActive: '2 horas atrás',
      specialties: ['Fertilizantes', 'Sementes', 'Defensivos'],
      description: 'Motorista especializada em cargas sensíveis e controle de temperatura',
      contact: {
        phone: '(66) 99236-2830',
        email: 'maria.santos@email.com'
      },
      stats: {
        completedFreights: 167,
        totalDistance: '85.000 km',
        satisfaction: '97%',
        responseTime: '1h'
      },
      documents: ['CNH E', 'Carteira de Motorista', 'Certificado de Transporte'],
      availability: 'Disponível'
    },
    {
      id: 3,
      name: 'Carlos Oliveira',
      rating: 4.7,
      reviews: 203,
      verified: true,
      experience: '12 anos',
      vehicle: 'Carreta Truck',
      capacity: '30 toneladas',
      location: 'São Paulo, SP',
      lastActive: '30 min atrás',
      specialties: ['Grãos', 'Fertilizantes', 'Máquinas'],
      description: 'Motorista experiente com foco em segurança e pontualidade',
          contact: {
        phone: '(66) 99236-2830',
        email: 'carlos.oliveira@email.com'
      },
      stats: {
        completedFreights: 456,
        totalDistance: '280.000 km',
        satisfaction: '99%',
        responseTime: '3h'
      },
      documents: ['CNH E', 'Carteira de Motorista', 'Certificado de Transporte'],
      availability: 'Disponível'
    }
  ];

  const categories = [
    'Todos',
    'Grãos',
    'Fertilizantes',
    'Defensivos',
    'Sementes',
    'Máquinas',
    'Animais'
  ];

  const locations = [
    'Todos os Estados',
    'Mato Grosso',
    'Paraná',
    'São Paulo',
    'Goiás',
    'Rio Grande do Sul',
    'Santa Catarina'
  ];

  const vehicleTypes = [
    'Todos',
    'Truck',
    'Carreta',
    'Carreta Truck',
    'Bitruck',
    'Truck 3/4'
  ];

    return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-gray-900 mb-6"
            >
                AgroConecta
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Conecte-se com os melhores motoristas e encontre as melhores cargas do agronegócio. 
            Transporte seguro, rápido e confiável para suas necessidades logísticas.
          </motion.p>
                  </div>
                
        {/* Quick Stats */}
                <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-emerald mb-2">2.8K</div>
            <div className="text-gray-600">Fretes Ativos</div>
                  </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-emerald mb-2">1.5K</div>
            <div className="text-gray-600">Motoristas</div>
                  </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-emerald mb-2">R$ 15M</div>
            <div className="text-gray-600">Volume Mensal</div>
                  </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-gradient-emerald mb-2">99.1%</div>
            <div className="text-gray-600">Taxa de Entrega</div>
              </div>
            </motion.div>
            
        {/* Tabs */}
            <motion.div
          initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-2 mb-8"
        >
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('freights')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'freights'
                  ? 'bg-emerald-500 text-black'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Fretes Disponíveis
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'drivers'
                  ? 'bg-emerald-500 text-black'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Truck className="w-5 h-5 inline mr-2" />
              Motoristas
            </button>
            <button
              onClick={() => setActiveTab('my-freights')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'my-freights'
                  ? 'bg-emerald-500 text-black'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline mr-2" />
              Meus Fretes
            </button>
          </div>
              </motion.div>
              
        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'freights' && (
              <motion.div
              key="freights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Filters */}
              <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar fretes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    />
                </div>

                  {/* Category */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  {/* Location */}
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>

                  {/* Price Range */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full px-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full px-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    />
              </div>
              
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  >
                    <option value="relevance">Relevância</option>
                    <option value="price">Menor Preço</option>
                    <option value="distance">Menor Distância</option>
                    <option value="deadline">Prazo Menor</option>
                  </select>
                </div>
                </div>

              {/* Freights Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {freights.map((freight, index) => (
                    <motion.div
                      key={freight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    className="card p-6 hover-agro"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{freight.title}</h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{freight.origin}</span>
                      </div>
                          <div className="text-gray-400">→</div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{freight.destination}</span>
                      </div>
                </div>
                </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gradient-emerald">{freight.price}</div>
                        <div className="text-sm text-gray-600">{freight.deadline}</div>
          </div>
      </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{freight.distance}</div>
                        <div className="text-xs text-gray-600">Distância</div>
              </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{freight.weight}</div>
                        <div className="text-xs text-gray-600">Peso</div>
            </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{freight.volume}</div>
                        <div className="text-xs text-gray-600">Volume</div>
          </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{freight.vehicle}</div>
                        <div className="text-xs text-gray-600">Veículo</div>
        </div>
      </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-4">
                      {freight.description}
                    </p>

                    {/* Requirements */}
                    <div className="mb-4">
                      <h4 className="text-gray-900 font-semibold text-sm mb-2">Requisitos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {freight.requirements.map((req) => (
                          <span
                            key={req}
                            className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
              </div>

                    {/* Advertiser */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                  <div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-900 font-semibold">{freight.advertiser.name}</span>
                            {freight.advertiser.verified && (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            )}
                        </div>
                          <div className="flex items-center space-x-1 text-sm">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span className="text-gray-600">{freight.advertiser.rating}</span>
                        </div>
                      </div>
                    </div>
                      <div className="text-sm text-gray-600">
                        {freight.createdAt}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-emerald-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-emerald-400 transition-colors duration-300"
                      >
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Fazer Proposta
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-gray-200 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors duration-300"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-gray-200 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors duration-300"
                      >
                        <Heart className="w-4 h-4" />
                      </motion.button>
                              </div>
                  </motion.div>
                ))}
                            </div>
            </motion.div>
          )}

          {activeTab === 'drivers' && (
            <motion.div
              key="drivers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Filters */}
              <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900/50" />
                          <input 
                            type="text" 
                      placeholder="Buscar motoristas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-200 border border-emerald-500/20 rounded-xl text-gray-900 placeholder-white/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    />
                      </div>
                      
                  {/* Vehicle Type */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  >
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  {/* Location */}
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>

                  {/* Capacity */}
                  <div className="flex items-center space-x-2">
                          <input 
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full px-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full px-3 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    />
                      </div>
                      
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  >
                    <option value="relevance">Relevância</option>
                    <option value="rating">Melhor Avaliação</option>
                    <option value="experience">Mais Experiência</option>
                    <option value="recent">Mais Recentes</option>
                  </select>
                      </div>
                      </div>
                      
              {/* Drivers Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {drivers.map((driver, index) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="card p-6 hover-agro"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{driver.name}</h3>
                          {driver.verified && (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 text-sm">
                          <Truck className="w-4 h-4" />
                          <span>{driver.vehicle} - {driver.capacity}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-gray-900 font-semibold">{driver.rating}</span>
                        <span className="text-gray-600 text-sm">({driver.reviews})</span>
                      </div>
                    </div>

                    {/* Location and Activity */}
                    <div className="flex items-center space-x-4 mb-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{driver.location}</span>
                          </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{driver.lastActive}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-400">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>{driver.availability}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-4">
                      {driver.description}
                    </p>

                    {/* Specialties */}
                    <div className="mb-4">
                      <h4 className="text-gray-900 font-semibold text-sm mb-2">Especialidades:</h4>
                      <div className="flex flex-wrap gap-2">
                        {driver.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30"
                          >
                            {specialty}
                          </span>
                        ))}
                          </div>
                      </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gradient-emerald">{driver.stats.completedFreights}</div>
                        <div className="text-xs text-gray-600">Fretes</div>
                    </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gradient-emerald">{driver.stats.totalDistance}</div>
                        <div className="text-xs text-gray-600">Distância</div>
                  </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gradient-emerald">{driver.stats.satisfaction}</div>
                        <div className="text-xs text-gray-600">Satisfação</div>
              </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gradient-emerald">{driver.stats.responseTime}</div>
                        <div className="text-xs text-gray-600">Resposta</div>
            </div>
                    </div>

                    {/* Documents */}
                    <div className="mb-4">
                      <h4 className="text-gray-900 font-semibold text-sm mb-2">Documentação:</h4>
                      <div className="flex flex-wrap gap-2">
                        {driver.documents.map((doc) => (
                          <span
                            key={doc}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30"
                          >
                            {doc}
                  </span>
                        ))}
                      </div>
                </div>
                
                    {/* Actions */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-emerald-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-emerald-400 transition-colors duration-300"
                      >
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Contatar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                        className="p-2 bg-gray-200 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors duration-300"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-gray-200 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors duration-300"
                      >
                        <Heart className="w-4 h-4" />
                  </motion.button>
                </div>
                  </motion.div>
                  ))}
                </div>
            </motion.div>
          )}

          {activeTab === 'my-freights' && (
          <motion.div
              key="my-freights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {!isAuthenticated ? (
                <div className="card p-12 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Acesse sua Conta
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Faça login para visualizar e gerenciar seus fretes, acompanhar propostas 
                    e manter histórico completo das suas operações logísticas.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary px-8 py-3"
                    >
                      <Users className="w-5 h-5 inline mr-2" />
                      Fazer Login
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary px-8 py-3"
                    >
                      <Plus className="w-5 h-5 inline mr-2" />
                      Criar Conta
                    </motion.button>
                </div>
              </div>
              ) : (
                <div className="card p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Meus Fretes
                  </h3>
                  <div className="text-center text-gray-600">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-900/20" />
                    <p>Nenhum frete encontrado. Publique seu primeiro frete para começar!</p>
                  </div>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>

        {/* CTA Section */}
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-8 text-center mt-12"
        >
          <h3 className="text-2xl font-bold text-gradient-agro mb-4">
            Comece a Usar o AgroConecta
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Publique seus fretes ou encontre motoristas qualificados. 
            Processo simples, seguro e com suporte completo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-8 py-3"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Publicar Frete
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary px-8 py-3"
            >
              <Truck className="w-5 h-5 inline mr-2" />
              Cadastrar como Motorista
            </motion.button>
              </div>
            </motion.div>
      </div>
    </div>
  );
};

export default AgroConecta;
