import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Star,
  Package,
  Truck,
  Shield,
  CheckCircle,
  Clock
} from 'lucide-react'

const BuyersPanel = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [location, setLocation] = useState('')
  const [sortBy, setSortBy] = useState('relevance')

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
        phone: '(66) 99236-2830',
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
        phone: '(66) 99236-2830',
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
        phone: '(66) 99236-2830',
        email: 'vendas@agrofert.com.br'
      }
    }
  ]

  const categories = ['Todos', 'Cooperativas', 'Produtores', 'Distribuidores', 'Indústrias', 'Exportadores']

  const locations = ['Todos os Estados', 'Mato Grosso', 'Paraná', 'São Paulo', 'Goiás', 'Rio Grande do Sul']

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='mb-8 text-center'>
        <h2 className='text-gradient-agro mb-4 text-3xl font-bold'>Painel de Compradores</h2>
        <p className='mx-auto max-w-2xl text-white/60'>
          Encontre os melhores compradores do agronegócio brasileiro. Conecte-se diretamente com cooperativas,
          produtores e distribuidores verificados.
        </p>
      </div>

      {/* Filters */}
      <div className='card p-6'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {/* Search */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/50' />
            <input
              type='text'
              placeholder='Buscar compradores...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full rounded-xl border border-emerald-500/20 bg-black/50 py-3 pl-10 pr-4 text-white placeholder-white/50 transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className='rounded-xl border border-emerald-500/20 bg-black/50 px-4 py-3 text-white transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Location */}
          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            className='rounded-xl border border-emerald-500/20 bg-black/50 px-4 py-3 text-white transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className='rounded-xl border border-emerald-500/20 bg-black/50 px-4 py-3 text-white transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
          >
            <option value='relevance'>Relevância</option>
            <option value='rating'>Melhor Avaliação</option>
            <option value='products'>Mais Produtos</option>
            <option value='recent'>Mais Recentes</option>
          </select>
        </div>
      </div>

      {/* Buyers Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {buyers.map((buyer, index) => (
          <motion.div
            key={buyer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className='card hover-agro p-6'
          >
            {/* Header */}
            <div className='mb-4 flex items-start justify-between'>
              <div className='flex-1'>
                <div className='mb-2 flex items-center space-x-2'>
                  <h3 className='text-lg font-bold text-white'>{buyer.name}</h3>
                  {buyer.verified && <CheckCircle className='h-5 w-5 text-emerald-400' />}
                </div>
                <div className='flex items-center space-x-2 text-sm text-white/60'>
                  <Package className='h-4 w-4' />
                  <span>{buyer.type}</span>
                </div>
              </div>
              <div className='flex items-center space-x-1'>
                <Star className='h-4 w-4 fill-current text-amber-400' />
                <span className='font-semibold text-white'>{buyer.rating}</span>
                <span className='text-sm text-white/60'>({buyer.reviews})</span>
              </div>
            </div>

            {/* Location and Activity */}
            <div className='mb-4 flex items-center space-x-4 text-sm'>
              <div className='flex items-center space-x-1 text-white/60'>
                <MapPin className='h-4 w-4' />
                <span>{buyer.location}</span>
              </div>
              <div className='flex items-center space-x-1 text-white/60'>
                <Clock className='h-4 w-4' />
                <span>{buyer.lastActive}</span>
              </div>
            </div>

            {/* Description */}
            <p className='mb-4 line-clamp-2 text-sm text-white/70'>{buyer.description}</p>

            {/* Specialties */}
            <div className='mb-4'>
              <h4 className='mb-2 text-sm font-semibold text-white'>Especialidades:</h4>
              <div className='flex flex-wrap gap-2'>
                {buyer.specialties.map(specialty => (
                  <span
                    key={specialty}
                    className='rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400'
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className='mb-4 grid grid-cols-2 gap-4'>
              <div className='text-center'>
                <div className='text-gradient-emerald text-lg font-bold'>{buyer.products}</div>
                <div className='text-xs text-white/60'>Produtos</div>
              </div>
              <div className='text-center'>
                <div className='text-gradient-emerald text-lg font-bold'>{buyer.reviews}</div>
                <div className='text-xs text-white/60'>Avaliações</div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center space-x-2'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-black transition-colors duration-300 hover:bg-emerald-400'
              >
                <MessageSquare className='mr-2 inline h-4 w-4' />
                Contatar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='rounded-lg border border-emerald-500/20 bg-black/50 p-2 text-emerald-400 transition-colors duration-300 hover:bg-emerald-500/10'
              >
                <Eye className='h-4 w-4' />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='rounded-lg border border-emerald-500/20 bg-black/50 p-2 text-emerald-400 transition-colors duration-300 hover:bg-emerald-500/10'
              >
                <Heart className='h-4 w-4' />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <div className='card p-8'>
        <h3 className='text-gradient-agro mb-6 text-center text-2xl font-bold'>Estatísticas dos Compradores</h3>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
          <div className='text-center'>
            <div className='text-gradient-emerald mb-2 text-3xl font-bold'>2.5K</div>
            <div className='text-white/60'>Compradores Ativos</div>
          </div>
          <div className='text-center'>
            <div className='text-gradient-emerald mb-2 text-3xl font-bold'>15.8K</div>
            <div className='text-white/60'>Produtos Comprados</div>
          </div>
          <div className='text-center'>
            <div className='text-gradient-emerald mb-2 text-3xl font-bold'>R$ 45M</div>
            <div className='text-white/60'>Volume de Negócios</div>
          </div>
          <div className='text-center'>
            <div className='text-gradient-emerald mb-2 text-3xl font-bold'>98.5%</div>
            <div className='text-white/60'>Satisfação</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyersPanel
