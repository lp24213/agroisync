import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Heart, Star, ShoppingCart, MapPin, Truck, Calendar, DollarSign } from 'lucide-react'

const ProductCard = ({ product, onFavorite, onAddToCart, onViewDetails }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (!product) {
    return (
      <div className="card-premium p-6 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">Produto inválido</p>
      </div>
    )
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    if (onFavorite) onFavorite(product.id, !isFavorite)
  }

  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(product)
  }

  const handleViewDetails = () => {
    if (onViewDetails) onViewDetails(product)
  }

  return (
    <motion.div
      className="card-premium overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagem do produto */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Badge de favorito */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400'
            }`}
          />
        </button>

        {/* Badge de desconto */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        {/* Categoria */}
        {product.category && (
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {product.category}
          </span>
        )}

        {/* Nome do produto */}
        <h3 className="font-semibold text-gray-900 dark:text-white mt-1 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Descrição */}
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Preço */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              R$ {product.price?.toFixed(2) || '0,00'}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.unit && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              /{product.unit}
            </span>
          )}
        </div>

        {/* Informações adicionais */}
        <div className="space-y-2 mb-4">
          {product.location && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-2" />
              {product.location}
            </div>
          )}
          
          {product.shipping && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Truck className="w-4 h-4 mr-2" />
              {product.shipping}
            </div>
          )}
          
          {product.availableUntil && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              Disponível até {product.availableUntil}
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex space-x-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Ver Detalhes
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-agro-emerald text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-emerald-600 flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar
          </button>
        </div>

        {/* Informações do vendedor */}
        {product.seller && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {product.seller.name?.charAt(0) || 'V'}
                  </span>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.seller.name || 'Vendedor'}
                  </p>
                  {product.seller.rating && (
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                        {product.seller.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {product.seller.verified && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                  Verificado
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProductCard