import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Eye, 
  MessageSquare, 
  ShoppingCart, 
  Package,
  MapPin,
  Calendar,
  User
} from 'lucide-react';

const ProductCard = ({ product, onContact, onFavorite, onView, onAddToCart }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!product || typeof product !== 'object') {
    return (
      <div className="card-premium p-6 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">Produto inválido</p>
      </div>
    );
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (onFavorite) {
      onFavorite(product, !isFavorited);
    }
  };

  const handleContact = () => {
    if (onContact) {
      onContact(product);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(product);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const getCategoryGradient = (category) => {
    const colors = {
      'grãos': 'from-amber-500 to-orange-600',
      'carnes': 'from-red-500 to-pink-600',
      'frutas': 'from-green-500 to-emerald-600',
      'vegetais': 'from-lime-500 to-green-600',
      'laticínios': 'from-blue-500 to-indigo-600',
      'bebidas': 'from-purple-500 to-violet-600',
      'outros': 'from-gray-500 to-slate-600'
    };
    return colors[category] || 'from-slate-500 to-slate-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="card-premium overflow-hidden group relative"
    >
      {/* Badge de categoria */}
      <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryGradient(product.category)}`}>
        {product.category || 'Produto'}
      </div>

      {/* Botão de favorito */}
      <button
        onClick={handleFavorite}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 ${
          isFavorited 
            ? 'bg-red-500 text-white shadow-lg' 
            : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
        }`}
      >
        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
      </button>

      {/* Imagem do produto */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Overlay de ações */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={handleView}
              className="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors"
              title="Ver detalhes"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              title="Adicionar ao carrinho"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="truncate">{product.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Disponível até {product.availableUntil}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4 mr-1" />
            <span>{product.seller}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              R$ {product.price?.toFixed(2) || '0,00'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              /{product.unit || 'unidade'}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {product.quantity} {product.unit || 'unidades'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              em estoque
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleContact}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contatar</span>
          </button>
          <button
            onClick={handleView}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;