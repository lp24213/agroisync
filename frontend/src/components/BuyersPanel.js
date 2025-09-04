import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, MapPin, Calendar, DollarSign, 
  TrendingUp, Eye, Heart, MessageSquare, Star,
  Package, Truck, Shield, CheckCircle, Clock
} from 'lucide-react';

const BuyersPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // Mock data para demonstração
  const buyers = [
    {
      id: 1,
      name: 'Cooperativa Agro Norte',
      type: 'Cooperativa',
      location: 'Paraná, PR',
      rating: 4.8,
      reviews: 156,
      products: 45,
      verified: true,
      lastActive: '2 horas atrás',
      specialties: ['Soja', 'Milho', 'Trigo'],
      description: 'Cooperativa com mais de 30 anos de experiência no agronegócio',
      contact: {
        phone: '(41) 99999-9999',
        email: 'contato@agronorte.com.br'
      }
    },
    {
      id: 2,
      name: 'Fazenda Santa Maria',
      type: 'Produtor',
      location: 'Mato Grosso, MT',
      rating: 4.6,
      reviews: 89,
      products: 23,
      verified: true,
      lastActive: '1 hora atrás',
      specialties: ['Algodão', 'Milho', 'Gado'],
      description: 'Produtor familiar com foco em sustentabilidade',
      contact: {
        phone: '(66) 88888-8888',
        email: 'contato@santamaria.com.br'
      }
    },
    {
      id: 3,
      name: 'Agro Fertilizantes LTDA',
      type: 'Distribuidor',
      location: 'São Paulo, SP',
      rating: 4.9,
      reviews: 234,
      products: 67,
      verified: true,
      lastActive: '30 min atrás',
      specialties: ['Fertilizantes', 'Defensivos', 'Sementes'],
      description: 'Distribuidor autorizado das principais marcas do mercado',
      contact: {
        phone: '(11) 77777-7777',
        email: 'vendas@agrofert.com.br'
      }
    }
  ];

  const categories = [
    'Todos',
    'Cooperativas',
    'Produtores',
    'Distribuidores',
    'Indústrias',
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
          Painel de Compradores
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Encontre os melhores compradores do agronegócio brasileiro. 
          Conecte-se diretamente com cooperativas, produtores e distribuidores verificados.
        </p>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Buscar compradores..."
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

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-black/50 border border-emerald-500/20 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
          >
            <option value="relevance">Relevância</option>
            <option value="rating">Melhor Avaliação</option>
            <option value="products">Mais Produtos</option>
            <option value="recent">Mais Recentes</option>
          </select>
        </div>
      </div>

      {/* Buyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buyers.map((buyer, index) => (
          <motion.div
            key={buyer.id}
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
                  <h3 className="text-lg font-bold text-white">{buyer.name}</h3>
                  {buyer.verified && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-white/60 text-sm">
                  <Package className="w-4 h-4" />
                  <span>{buyer.type}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span className="text-white font-semibold">{buyer.rating}</span>
                <span className="text-white/60 text-sm">({buyer.reviews})</span>
              </div>
            </div>

            {/* Location and Activity */}
            <div className="flex items-center space-x-4 mb-4 text-sm">
              <div className="flex items-center space-x-1 text-white/60">
                <MapPin className="w-4 h-4" />
                <span>{buyer.location}</span>
              </div>
              <div className="flex items-center space-x-1 text-white/60">
                <Clock className="w-4 h-4" />
                <span>{buyer.lastActive}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/70 text-sm mb-4 line-clamp-2">
              {buyer.description}
            </p>

            {/* Specialties */}
            <div className="mb-4">
              <h4 className="text-white font-semibold text-sm mb-2">Especialidades:</h4>
              <div className="flex flex-wrap gap-2">
                {buyer.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gradient-emerald">{buyer.products}</div>
                <div className="text-xs text-white/60">Produtos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gradient-emerald">{buyer.reviews}</div>
                <div className="text-xs text-white/60">Avaliações</div>
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
                <Heart className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="card p-8">
        <h3 className="text-2xl font-bold text-gradient-agro mb-6 text-center">
          Estatísticas dos Compradores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-emerald mb-2">2.5K</div>
            <div className="text-white/60">Compradores Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-emerald mb-2">15.8K</div>
            <div className="text-white/60">Produtos Comprados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-emerald mb-2">R$ 45M</div>
            <div className="text-white/60">Volume de Negócios</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-emerald mb-2">98.5%</div>
            <div className="text-white/60">Satisfação</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyersPanel;
