import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, Search, MapPin, DollarSign, Package, 
  X, ChevronDown, ChevronUp, Truck, Calendar, Star,
  Route, Weight, Clock
} from 'lucide-react';

const FreightFilters = ({ 
  filters, 
  onFiltersChange, 
  truckTypes,
  locations,
  priceRange,
  onPriceRangeChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleTruckTypeChange = (truckType) => {
    const currentTypes = filters.truckTypes || [];
    let newTypes;
    
    if (currentTypes.includes(truckType)) {
      newTypes = currentTypes.filter(t => t !== truckType);
    } else {
      newTypes = [...currentTypes, truckType];
    }
    
    handleFilterChange('truckTypes', newTypes);
  };

  const handleLocationChange = (location) => {
    const currentLocations = filters.locations || [];
    let newLocations;
    
    if (currentLocations.includes(location)) {
      newLocations = currentLocations.filter(l => l !== location);
    } else {
      newLocations = [...currentLocations, location];
    }
    
    handleFilterChange('locations', newLocations);
  };

  const handleRatingChange = (rating) => {
    handleFilterChange('minRating', rating);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      truckTypes: [],
      locations: [],
      minPrice: '',
      maxPrice: '',
      minWeight: '',
      maxWeight: '',
      minRating: 0,
      sortBy: 'relevance',
      dateRange: 'any'
    };
    onFiltersChange(clearedFilters);
    if (onPriceRangeChange) {
      onPriceRangeChange({ min: 0, max: 10000 });
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.truckTypes?.length > 0) count += filters.truckTypes.length;
    if (filters.locations?.length > 0) count += filters.locations.length;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minWeight || filters.maxWeight) count++;
    if (filters.minRating > 0) count++;
    if (filters.sortBy !== 'relevance') count++;
    if (filters.dateRange !== 'any') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
      {/* Header dos filtros */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Filtros de Fretes</h3>
            <p className="text-sm text-slate-600">Refine sua busca</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {activeFiltersCount > 0 && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
              {activeFiltersCount} ativo{activeFiltersCount !== 1 ? 's' : ''}
            </span>
          )}
          
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors duration-200"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar fretes por origem, destino ou descrição..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
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
            className="space-y-6"
          >
            {/* Tipos de caminhão */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Tipos de Caminhão</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {truckTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    onClick={() => handleTruckTypeChange(type.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                      filters.truckTypes?.includes(type.value)
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-300'
                    }`}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Localização */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Localização</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {locations.map((location) => (
                  <motion.button
                    key={location}
                    onClick={() => handleLocationChange(location)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                      filters.locations?.includes(location)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300'
                    }`}
                  >
                    {location}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Faixa de preço */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Faixa de Preço</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Mínimo</label>
                  <input
                    type="number"
                    placeholder="R$ 0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Máximo</label>
                  <input
                    type="number"
                    placeholder="R$ 10.000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Faixa de peso */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
                <Weight className="w-4 h-4" />
                <span>Faixa de Peso (kg)</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Mínimo</label>
                  <input
                    type="number"
                    placeholder="0 kg"
                    value={filters.minWeight || ''}
                    onChange={(e) => handleFilterChange('minWeight', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Máximo</label>
                  <input
                    type="number"
                    placeholder="50.000 kg"
                    value={filters.maxWeight || ''}
                    onChange={(e) => handleFilterChange('maxWeight', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Data */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Data de Coleta</span>
              </h4>
              <select
                value={filters.dateRange || 'any'}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
              >
                <option value="any">Qualquer data</option>
                <option value="today">Hoje</option>
                <option value="tomorrow">Amanhã</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mês</option>
              </select>
            </div>

            {/* Avaliação mínima */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Avaliação Mínima do Anunciante</span>
              </h4>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                      filters.minRating >= rating
                        ? 'bg-yellow-500 border-yellow-500 text-white'
                        : 'bg-white border-slate-300 text-slate-400 hover:border-yellow-300'
                    }`}
                  >
                    {rating}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Ordenação */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Ordenar por</h4>
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
              >
                <option value="relevance">Relevância</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
                <option value="weight_asc">Menor peso</option>
                <option value="weight_desc">Maior peso</option>
                <option value="date_asc">Data mais próxima</option>
                <option value="date_desc">Data mais distante</option>
                <option value="rating">Melhor avaliação</option>
              </select>
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-3 pt-4 border-t border-slate-200">
              <motion.button
                onClick={clearAllFilters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Limpar Filtros</span>
              </motion.button>
              
              <motion.button
                onClick={() => setIsExpanded(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Aplicar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FreightFilters;
