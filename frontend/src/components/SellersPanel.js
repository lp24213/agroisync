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
  Clock,
  Plus,
  Edit,
  BarChart3,
  Users,
  ShoppingCart
} from 'lucide-react'

const SellersPanel = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [location, setLocation] = useState('')
  const [sortBy, setSortBy] = useState('relevance')

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
        phone: '(66) 99236-2830',
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
        phone: '(66) 99236-2830',
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
        phone: '(66) 99236-2830',
        email: 'comercial@agrosilva.com.br'
      },
      stats: {
        totalSales: 'R$ 5.8M',
        completedOrders: 298,
        responseTime: '3h',
        satisfaction: '96%'
      }
    }
  ]

  const categories = ['Todos', 'Produtores', 'Cooperativas', 'Indústrias', 'Distribuidores', 'Exportadores']

  const locations = ['Todos os Estados', 'Mato Grosso', 'Paraná', 'São Paulo', 'Goiás', 'Rio Grande do Sul']

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='mb-8 text-center'>
        <h2 className='text-gradient-agro mb-4 text-3xl font-bold'>Painel de Vendedores</h2>
        <p className='mx-auto max-w-2xl text-white/60'>
          Conecte-se com os melhores vendedores do agronegócio. Produtores, cooperativas e indústrias verificados e com
          histórico comprovado.
        </p>
      </div>

      {/* Quick Stats */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
        <div className='card p-6 text-center'>
          <div className='text-gradient-emerald mb-2 text-3xl font-bold'>1.8K</div>
          <div className='text-white/60'>Vendedores Ativos</div>
        </div>
        <div className='card p-6 text-center'>
          <div className='text-gradient-emerald mb-2 text-3xl font-bold'>12.5K</div>
          <div className='text-white/60'>Produtos Disponíveis</div>
        </div>
        <div className='card p-6 text-center'>
          <div className='text-gradient-emerald mb-2 text-3xl font-bold'>R$ 28M</div>
          <div className='text-white/60'>Volume Mensal</div>
        </div>
        <div className='card p-6 text-center'>
          <div className='text-gradient-emerald mb-2 text-3xl font-bold'>99.2%</div>
          <div className='text-white/60'>Taxa de Entrega</div>
        </div>
      </div>

      {/* Filters */}
      <div className='card p-6'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
          {/* Search */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/50' />
            <input
              type='text'
              placeholder='Buscar vendedores...'
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

          {/* Price Range */}
          <div className='flex items-center space-x-2'>
            <input
              type='number'
              placeholder='Min'
              value={priceRange.min}
              onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
              className='w-full rounded-xl border border-emerald-500/20 bg-black/50 px-3 py-3 text-white placeholder-white/50 transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            />
            <span className='text-white/50'>-</span>
            <input
              type='number'
              placeholder='Max'
              value={priceRange.max}
              onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
              className='w-full rounded-xl border border-emerald-500/20 bg-black/50 px-3 py-3 text-white placeholder-white/50 transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className='rounded-xl border border-emerald-500/20 bg-black/50 px-4 py-3 text-white transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
          >
            <option value='relevance'>Relevância</option>
            <option value='rating'>Melhor Avaliação</option>
            <option value='sales'>Maior Volume</option>
            <option value='response'>Melhor Resposta</option>
          </select>
        </div>
      </div>

      {/* Sellers Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {sellers.map((seller, index) => (
          <motion.div
            key={seller.id}
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
                  <h3 className='text-xl font-bold text-white'>{seller.name}</h3>
                  {seller.verified && <CheckCircle className='h-5 w-5 text-emerald-400' />}
                </div>
                <div className='flex items-center space-x-2 text-sm text-white/60'>
                  <Package className='h-4 w-4' />
                  <span>{seller.type}</span>
                </div>
              </div>
              <div className='flex items-center space-x-1'>
                <Star className='h-4 w-4 fill-current text-amber-400' />
                <span className='font-semibold text-white'>{seller.rating}</span>
                <span className='text-sm text-white/60'>({seller.reviews})</span>
              </div>
            </div>

            {/* Location and Activity */}
            <div className='mb-4 flex items-center space-x-4 text-sm'>
              <div className='flex items-center space-x-1 text-white/60'>
                <MapPin className='h-4 w-4' />
                <span>{seller.location}</span>
              </div>
              <div className='flex items-center space-x-1 text-white/60'>
                <Clock className='h-4 w-4' />
                <span>{seller.lastActive}</span>
              </div>
            </div>

            {/* Description */}
            <p className='mb-4 text-sm text-white/70'>{seller.description}</p>

            {/* Specialties */}
            <div className='mb-4'>
              <h4 className='mb-2 text-sm font-semibold text-white'>Especialidades:</h4>
              <div className='flex flex-wrap gap-2'>
                {seller.specialties.map(specialty => (
                  <span
                    key={specialty}
                    className='rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-1 text-xs text-emerald-400'
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className='mb-4 grid grid-cols-2 gap-4'>
              <div className='text-center'>
                <div className='text-gradient-emerald text-lg font-bold'>{seller.stats.totalSales}</div>
                <div className='text-xs text-white/60'>Vendas Totais</div>
              </div>
              <div className='text-center'>
                <div className='text-gradient-emerald text-lg font-bold'>{seller.stats.completedOrders}</div>
                <div className='text-xs text-white/60'>Pedidos</div>
              </div>
              <div className='text-center'>
                <div className='text-gradient-emerald text-lg font-bold'>{seller.stats.responseTime}</div>
                <div className='text-xs text-white/60'>Resposta</div>
              </div>
              <div className='text-center'>
                <div className='text-gradient-emerald text-lg font-bold'>{seller.stats.satisfaction}</div>
                <div className='text-xs text-white/60'>Satisfação</div>
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
                <BarChart3 className='h-4 w-4' />
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

      {/* Become a Seller CTA */}
      <div className='card p-8 text-center'>
        <h3 className='text-gradient-agro mb-4 text-2xl font-bold'>Seja um Vendedor Verificado</h3>
        <p className='mx-auto mb-6 max-w-2xl text-white/60'>
          Cadastre seus produtos e conecte-se com milhares de compradores qualificados. Processo de verificação rápido e
          seguro.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='btn-primary px-8 py-3'>
            <Plus className='mr-2 inline h-5 w-5' />
            Cadastrar Produtos
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='btn-secondary px-8 py-3'>
            <Shield className='mr-2 inline h-5 w-5' />
            Processo de Verificação
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default SellersPanel
