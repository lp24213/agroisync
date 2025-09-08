import React from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Grid,
  List,
  ShoppingCart,
  Heart,
  Star,
  Package,
  Truck,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react'
import ProductCard from './ProductCard'

const MarketplaceContent = ({
  products,
  loading,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onAddToCart,
  onAddToWishlist
}) => {
  const categories = [
    'Todos',
    'Grãos',
    'Fertilizantes',
    'Maquinários',
    'Defensivos',
    'Sementes',
    'Rações',
    'Equipamentos'
  ]

  const locations = ['Todos os Estados', 'Mato Grosso', 'Paraná', 'São Paulo', 'Goiás', 'Rio Grande do Sul']

  if (loading) {
    return (
      <div className='space-y-8'>
        <div className='card p-8 text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent'></div>
          <h3 className='mb-2 text-xl font-bold text-white'>Carregando produtos...</h3>
          <p className='text-white/60'>Aguarde enquanto carregamos os produtos disponíveis.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='mb-8 text-center'>
        <h2 className='text-gradient-agro mb-4 text-3xl font-bold'>Marketplace de Produtos</h2>
        <p className='mx-auto max-w-2xl text-white/60'>
          Encontre os melhores produtos do agronegócio. Qualidade garantida e entrega segura em todo o Brasil.
        </p>
      </div>

      {/* Filters */}
      <div className='card p-6'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6'>
          {/* Search */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/50' />
            <input
              type='text'
              placeholder='Buscar produtos...'
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
          <select className='rounded-xl border border-emerald-500/20 bg-black/50 px-4 py-3 text-white transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'>
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
            <option value='price_low'>Menor Preço</option>
            <option value='price_high'>Maior Preço</option>
            <option value='rating'>Melhor Avaliação</option>
            <option value='recent'>Mais Recentes</option>
          </select>

          {/* View Mode */}
          <div className='flex items-center space-x-2'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-2 transition-colors duration-300 ${
                viewMode === 'grid'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-black/50 text-white/70 hover:bg-black/70 hover:text-white'
              }`}
            >
              <Grid className='h-5 w-5' />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-2 transition-colors duration-300 ${
                viewMode === 'list'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-black/50 text-white/70 hover:bg-black/70 hover:text-white'
              }`}
            >
              <List className='h-5 w-5' />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'
        }
      >
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product, index) => (
            <motion.div
              key={product?.id || Math.random()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <ProductCard
                product={product}
                onContact={() => console.log('Contato:', product?.id)}
                onFavorite={() => onAddToWishlist(product)}
                onView={() => console.log('Visualizar:', product?.id)}
                onAddToCart={() => onAddToCart(product)}
                viewMode={viewMode}
              />
            </motion.div>
          ))
        ) : (
          <div className='col-span-full py-12 text-center'>
            <Package className='mx-auto mb-4 h-16 w-16 text-white/40' />
            <h3 className='mb-2 text-lg font-medium text-white'>Nenhum produto encontrado</h3>
            <p className='text-white/60'>Tente ajustar os filtros ou fazer uma nova busca</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className='card p-8'>
        <h3 className='text-gradient-agro mb-6 text-center text-2xl font-bold'>Estatísticas do Marketplace</h3>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
          <div className='text-center'>
            <div className='text-gradient-emerald mb-2 text-3xl font-bold'>8.7K</div>
            <div className='text-white/60'>Produtos Ativos</div>
          </div>
          <div className='text-center'>
            <div className='text-gradient-emerald mb-2 text-3xl font-bold'>1.2K</div>
            <div className='text-white/60'>Vendedores Verificados</div>
          </div>
          <div className='text-center'>
            <div className='text-gradient-emerald mb-2 text-3xl font-bold'>15.8K</div>
            <div className='text-white/60'>Transações Realizadas</div>
          </div>
          <div className='text-center'>
            <div className='text-gradient-emerald mb-2 text-3xl font-bold'>99.5%</div>
            <div className='text-white/60'>Satisfação</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplaceContent
