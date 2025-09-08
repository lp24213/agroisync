import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, MapPin, DollarSign, Package, X, ChevronDown, ChevronUp, Sliders, Star } from 'lucide-react'

const ProductFilters = ({ filters, onFiltersChange, categories, locations, priceRange, onPriceRangeChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    onFiltersChange(newFilters)
  }

  const handleCategoryChange = category => {
    const currentCategories = filters.categories || []
    let newCategories

    if (currentCategories.includes(category)) {
      newCategories = currentCategories.filter(c => c !== category)
    } else {
      newCategories = [...currentCategories, category]
    }

    handleFilterChange('categories', newCategories)
  }

  const handleLocationChange = location => {
    const currentLocations = filters.locations || []
    let newLocations

    if (currentLocations.includes(location)) {
      newLocations = currentLocations.filter(l => l !== location)
    } else {
      newLocations = [...currentLocations, location]
    }

    handleFilterChange('locations', newLocations)
  }

  const handleRatingChange = rating => {
    handleFilterChange('minRating', rating)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      categories: [],
      locations: [],
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      sortBy: 'relevance'
    }
    onFiltersChange(clearedFilters)
    if (onPriceRangeChange) {
      onPriceRangeChange({ min: 0, max: 10000 })
    }
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.categories?.length > 0) count += filters.categories.length
    if (filters.locations?.length > 0) count += filters.locations.length
    if (filters.minPrice || filters.maxPrice) count++
    if (filters.minRating > 0) count++
    if (filters.sortBy !== 'relevance') count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className='mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg'>
      {/* Header dos filtros */}
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white'>
            <Filter className='h-5 w-5' />
          </div>
          <div>
            <h3 className='text-lg font-bold text-slate-800'>Filtros</h3>
            <p className='text-sm text-slate-600'>Refine sua busca</p>
          </div>
        </div>

        <div className='flex items-center space-x-3'>
          {activeFiltersCount > 0 && (
            <span className='rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700'>
              {activeFiltersCount} ativo{activeFiltersCount !== 1 ? 's' : ''}
            </span>
          )}

          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors duration-200 hover:bg-slate-200'
          >
            {isExpanded ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
          </motion.button>
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className='mb-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-400' />
          <input
            type='text'
            placeholder='Buscar produtos...'
            value={filters.search || ''}
            onChange={e => handleFilterChange('search', e.target.value)}
            className='w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-slate-700 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
          />
        </div>
      </div>

      {/* Filtros expandidos */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className='space-y-6'
          >
            {/* Categorias */}
            <div>
              <h4 className='mb-3 flex items-center space-x-2 text-sm font-semibold text-slate-700'>
                <Package className='h-4 w-4' />
                <span>Categorias</span>
              </h4>
              <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
                {categories.map(category => (
                  <motion.button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
                      filters.categories?.includes(category)
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-300'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Localização */}
            <div>
              <h4 className='mb-3 flex items-center space-x-2 text-sm font-semibold text-slate-700'>
                <MapPin className='h-4 w-4' />
                <span>Localização</span>
              </h4>
              <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
                {locations.map(location => (
                  <motion.button
                    key={location}
                    onClick={() => handleLocationChange(location)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
                      filters.locations?.includes(location)
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    {location}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Faixa de preço */}
            <div>
              <h4 className='mb-3 flex items-center space-x-2 text-sm font-semibold text-slate-700'>
                <DollarSign className='h-4 w-4' />
                <span>Faixa de Preço</span>
              </h4>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='mb-1 block text-xs text-slate-500'>Mínimo</label>
                  <input
                    type='number'
                    placeholder='R$ 0'
                    value={filters.minPrice || ''}
                    onChange={e => handleFilterChange('minPrice', e.target.value)}
                    className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-xs text-slate-500'>Máximo</label>
                  <input
                    type='number'
                    placeholder='R$ 10.000'
                    value={filters.maxPrice || ''}
                    onChange={e => handleFilterChange('maxPrice', e.target.value)}
                    className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  />
                </div>
              </div>
            </div>

            {/* Avaliação mínima */}
            <div>
              <h4 className='mb-3 flex items-center space-x-2 text-sm font-semibold text-slate-700'>
                <Star className='h-4 w-4' />
                <span>Avaliação Mínima</span>
              </h4>
              <div className='flex space-x-2'>
                {[1, 2, 3, 4, 5].map(rating => (
                  <motion.button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
                      filters.minRating >= rating
                        ? 'border-yellow-500 bg-yellow-500 text-white'
                        : 'border-slate-300 bg-white text-slate-400 hover:border-yellow-300'
                    }`}
                  >
                    {rating}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Ordenação */}
            <div>
              <h4 className='mb-3 text-sm font-semibold text-slate-700'>Ordenar por</h4>
              <select
                value={filters.sortBy || 'relevance'}
                onChange={e => handleFilterChange('sortBy', e.target.value)}
                className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
              >
                <option value='relevance'>Relevância</option>
                <option value='price_asc'>Menor preço</option>
                <option value='price_desc'>Maior preço</option>
                <option value='rating'>Melhor avaliação</option>
                <option value='newest'>Mais recentes</option>
                <option value='oldest'>Mais antigos</option>
              </select>
            </div>

            {/* Botões de ação */}
            <div className='flex space-x-3 border-t border-slate-200 pt-4'>
              <motion.button
                onClick={clearAllFilters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-200'
              >
                <X className='h-4 w-4' />
                <span>Limpar Filtros</span>
              </motion.button>

              <motion.button
                onClick={() => setIsExpanded(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-2 font-medium text-white shadow-md transition-all duration-200 hover:from-emerald-600 hover:to-blue-600 hover:shadow-lg'
              >
                Aplicar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductFilters
