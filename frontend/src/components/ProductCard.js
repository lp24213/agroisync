import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Heart, Eye, ShoppingCart, 
  Star, Truck, Calendar, User, Shield, CheckCircle, Package 
} from 'lucide-react';

const ProductCard = ({ product, onContact, onFavorite, onView, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [imageError, setImageError] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onFavorite) onFavorite(product.id, !isFavorite);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `R$ ${price.toFixed(2).replace('.', ',')}`;
    }
    return price;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Sementes': 'from-emerald-500 to-emerald-600',
      'Fertilizantes': 'from-blue-500 to-blue-600',
      'Maquinários': 'from-orange-500 to-orange-600',
      'Serviços': 'from-purple-500 to-purple-600',
      'Tecnologia': 'from-cyan-500 to-cyan-600',
      'Insumos': 'from-green-500 to-green-600'
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
      <div className="absolute top-4 left-4 z-10">
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(product.category)} shadow-lg`}>
          {product.category}
        </span>
      </div>

      {/* Botão favorito */}
      <motion.button
        onClick={handleFavorite}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Heart 
          className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-slate-600'}`} 
        />
      </motion.button>

      {/* Imagem do produto */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
            <div className="text-center">
              <Package className="w-16 h-16 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Imagem não disponível</p>
            </div>
          </div>
        )}
        
        {/* Overlay de ações */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <motion.button
              onClick={() => onView && onView(product)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
            >
              <Eye className="w-5 h-5 text-slate-700" />
            </motion.button>
            <motion.button
              onClick={() => onAddToCart && onAddToCart(product)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Informações do produto */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Preço e avaliação */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-gradient-premium">
            {formatPrice(product.price)}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-slate-600">
              {product.rating || '4.5'}
            </span>
          </div>
        </div>

        {/* Detalhes técnicos */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          {product.quantity && (
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">
                {product.quantity} {product.unit || 'un'}
              </span>
            </div>
          )}
          {product.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600 truncate">
                {product.location}
              </span>
            </div>
          )}
        </div>

        {/* Informações do vendedor */}
        <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {product.seller?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {product.seller?.name || 'Vendedor'}
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span>Verificado</span>
            </div>
          </div>
        </div>

        {/* Data de publicação */}
        {product.createdAt && (
          <div className="flex items-center space-x-2 mb-4 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>Publicado em {formatDate(product.createdAt)}</span>
          </div>
        )}

        {/* Botões de ação */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={() => onContact && onContact(product)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>Contatar</span>
          </motion.button>
          
          <motion.button
            onClick={() => onView && onView(product)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-3 bg-white border-2 border-emerald-500 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 hover:border-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Ver</span>
          </motion.button>
        </div>

        {/* Informações adicionais */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>ID: #{product.id}</span>
            {product.verified && (
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span>Verificado</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
