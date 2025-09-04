import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, MapPin, Calendar, DollarSign, 
  TrendingUp, Eye, Heart, MessageSquare, Star,
  Package, Truck, Shield, CheckCircle, Clock,
  Plus, Edit, BarChart3, Users, ShoppingCart
} from 'lucide-react';

const SellersPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // Mock data para demonstração
  const sellers = [
    {
      id: 1,
      name: 'Fazenda Modelo',
      type: 'Produtor',
      location: 'Mato Grosso, MT',
      rating: 4.9,
      reviews: 89,
      products: 12,
      verified: true,
      lastActive: '1 hora atrás',
      specialties: ['Soja', 'Milho', 'Algodão'],
      description: 'Produtor com mais de 20 anos de experiência, certificado pela RTRS',
      contact: {
        phone: '(66) 99999-9999',
        email: 'contato@fazendamodelo.com.br'
      },
      stats: {
        totalSales: 'R$ 2.5M',
        completedOrders: 156,
        responseTime: '2h',
        satisfaction: '98%'
      }
    },
    {
      id: 2,
      name: 'Cooperativa Central',
      type: 'Cooperativa',
      location: 'Paraná, PR',
      rating: 4.8,
      reviews: 234,
      products: 45,
      verified: true,
      lastActive: '30 min atrás',
      specialties: ['Trigo', 'Milho', 'Feijão'],
      description: 'Cooperativa com mais de 50 anos, líder no mercado paranaense',
      contact: {
        phone: '(41) 88888-8888',
        email: 'vendas@coopcentral.com.br'
      },
      stats: {
        totalSales: 'R$ 8.2M',
        completedOrders: 423,
        responseTime: '1h',
        satisfaction: '97%'
      }
    },
    {
      id: 3,
      name: 'Agro Indústria Silva',
      type: 'Indústria',
      location: 'São Paulo, SP',
      rating: 4.7,
      reviews: 167,
      products: 28,
      verified: true,
      lastActive: '2 horas atrás',
      specialties: ['Processados', 'Fertilizantes', 'Defensivos'],
      description: 'Indústria processadora com certificação ISO 9001',
      contact: {
        phone: '(11) 77777-7777',
        email: 'comercial@agrosilva.com.br'
      },
      stats: {
        totalSales: 'R$ 5.8M',
        completedOrders: 298,
        responseTime: '3h',
        satisfaction: '96%'
      }
    }
  ];

  const categories = [
    'Todos',
    'Produtores',
    'Cooperativas',
    'Indústrias',
    'Distribuidores',
    'Exportadores'
  ];

  const locations = [
    'Todos os Estados',
    'Mato Grosso',
    'Paraná',
    'São Paulo',
    'Goiás',
    'Rio Grande do Sul'
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-agro mb-4">
          Painel de Vendedores
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Conecte-se com os melhores vendedores do agronegócio. 
          Produtores, cooperativas e indústrias verificados e com histórico comprovado.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-gradient-emerald mb-2">1.8K</div>
          <div className="text-white/60">Vendedores Ativos</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-gradient-emerald mb-2">12.5K</div>
          <div className="text-white/60">Produtos Disponíveis</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-gradient-emerald mb-2">R$ 28M</div>
          <div className="text-white/60">Volume Mensal</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-gradient-emerald mb-2">99.2%</div>
          <div className="text-white/60">Taxa de Entrega</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Buscar vendedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-emerald-500/20 rounded-xl text-white placeholder-white/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-black/50 border border-emerald-500/20 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Location */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-3 bg-black/50 border border-emerald-500/20 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
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
              className="w-full px-3 py-3 bg-black/50 border border-emerald-500/20 rounded-xl text-white placeholder-white/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
            />
            <span className="text-white/50">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="w-full px-3 py-3 bg-black/50 border border-emerald-500/20 rounded-xl text-white placeholder-white/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-black/50 border border-emerald-500/20 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
          >
            <option value="relevance">Relevância</option>
            <option value="rating">Melhor Avaliação</option>
            <option value="sales">Maior Volume</option>
            <option value="response">Melhor Resposta</option>
          </select>
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sellers.map((seller, index) => (
          <motion.div
            key={seller.id}
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
                  <h3 className="text-xl font-bold text-white">{seller.name}</h3>
                  {seller.verified && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <Package className="w-4 h-4" />
                  <span>{seller.type}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span className="text-white font-semibold">{seller.rating}</span>
                <span className="text-white/60 text-sm">({seller.reviews})</span>
              </div>
            </div>

            {/* Location and Activity */}
            <div className="flex items-center space-x-4 mb-4 text-sm">
              <div className="flex items-center space-x-1 text-white/60">
                <MapPin className="w-4 h-4" />
                <span>{seller.location}</span>
              </div>
              <div className="flex items-center space-x-1 text-white/60">
                <Clock className="w-4 h-4" />
                <span>{seller.lastActive}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/70 text-sm mb-4">
              {seller.description}
            </p>

            {/* Specialties */}
            <div className="mb-4">
              <h4 className="text-white font-semibold text-sm mb-2">Especialidades:</h4>
              <div className="flex flex-wrap gap-2">
                {seller.specialties.map((specialty) => (
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
                <div className="text-lg font-bold text-gradient-emerald">{seller.stats.totalSales}</div>
                <div className="text-xs text-white/60">Vendas Totais</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gradient-emerald">{seller.stats.completedOrders}</div>
                <div className="text-xs text-white/60">Pedidos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gradient-emerald">{seller.stats.responseTime}</div>
                <div className="text-xs text-white/60">Resposta</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gradient-emerald">{seller.stats.satisfaction}</div>
                <div className="text-xs text-white/60">Satisfação</div>
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
                className="p-2 bg-black/50 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors duration-300"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-black/50 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors duration-300"
              >
                <BarChart3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-black/50 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors duration-300"
              >
                <Heart className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Become a Seller CTA */}
      <div className="card p-8 text-center">
        <h3 className="text-2xl font-bold text-gradient-agro mb-4">
          Seja um Vendedor Verificado
        </h3>
        <p className="text-white/60 mb-6 max-w-2xl mx-auto">
          Cadastre seus produtos e conecte-se com milhares de compradores qualificados. 
          Processo de verificação rápido e seguro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary px-8 py-3"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Cadastrar Produtos
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary px-8 py-3"
          >
            <Shield className="w-5 h-5 inline mr-2" />
            Processo de Verificação
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SellersPanel;
