import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, MapPin, Calendar, Package, DollarSign, 
  Star, Phone, Mail, MessageCircle, Eye, Heart,
  Route, Clock, User, Shield, CheckCircle, AlertTriangle
} from 'lucide-react';

const FreightCard = ({ freight, onContact, onFavorite, onView, onApply, userType }) => {
  const [isFavorite, setIsFavorite] = useState(freight.isFavorite || false);
  const [showDetails, setShowDetails] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onFavorite) onFavorite(freight.id, !isFavorite);
  };

  const handleContact = () => {
    if (onContact) onContact(freight);
  };

  const handleView = () => {
    if (onView) onView(freight);
  };

  const handleApply = () => {
    if (onApply) onApply(freight);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return 'Indefinido';
    }
  };

  const getTruckTypeIcon = (truckType) => {
    switch (truckType) {
      case 'truck': return <Truck className="w-5 h-5" />;
      case 'truck_3_4': return <Truck className="w-5 h-5" />;
      case 'truck_toco': return <Truck className="w-5 h-5" />;
      case 'truck_truck': return <Truck className="w-5 h-5" />;
      case 'truck_carreta': return <Truck className="w-5 h-5" />;
      default: return <Truck className="w-5 h-5" />;
    }
  };

  const getTruckTypeText = (truckType) => {
    switch (truckType) {
      case 'truck': return 'Truck 3/4';
      case 'truck_3_4': return 'Truck 3/4';
      case 'truck_toco': return 'Truck Toco';
      case 'truck_truck': return 'Truck Truck';
      case 'truck_carreta': return 'Carreta';
      default: return 'Truck';
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `R$ ${price.toFixed(2).replace('.', ',')}`;
    }
    return price;
  };

  const formatDate = (date) => {
    if (!date) return 'Data flexível';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  };

  const formatWeight = (weight) => {
    if (!weight) return 'Peso não informado';
    if (typeof weight === 'number') {
      return `${weight} kg`;
    }
    return weight;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Header com status */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
              {getTruckTypeIcon(freight.truckType)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Frete #{freight.id}</h3>
              <p className="text-sm text-slate-600">{getTruckTypeText(freight.truckType)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isFavorite 
                  ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
            
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(freight.status)}`}>
              {getStatusText(freight.status)}
            </span>
          </div>
        </div>

        {/* Rota principal */}
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-slate-600">Rota</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-slate-800">{freight.origin}</span>
            <Route className="w-4 h-4 text-slate-400" />
            <span className="text-lg font-semibold text-slate-800">{freight.destination}</span>
          </div>
        </div>

        {/* Informações principais */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">{formatWeight(freight.weight)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">{formatDate(freight.date)}</span>
          </div>
        </div>

        {/* Preço */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {formatPrice(freight.price)}
            </span>
            {freight.negotiable && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                Negociável
              </span>
            )}
          </div>
        </div>

        {/* Informações do anunciante (limitadas) */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">
              {freight.announcerName || 'Anunciante'}
            </span>
            {freight.verified && (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          
          {freight.announcerRating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-slate-600">{freight.announcerRating}</span>
              <span className="text-xs text-slate-400">({freight.announcerReviews || 0} avaliações)</span>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleView}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Detalhes</span>
          </motion.button>
          
          {userType === 'freteiro' && freight.status === 'available' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Candidatar-se</span>
            </motion.button>
          )}
          
          {userType === 'anunciante' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContact}
              className="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Contatar</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Detalhes expandidos */}
      <motion.div
        initial={false}
        animate={{ height: showDetails ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {showDetails && (
          <div className="px-6 pb-6 border-t border-slate-200 pt-4">
            <div className="space-y-3 text-sm">
              {freight.description && (
                <div>
                  <span className="font-medium text-slate-700">Descrição:</span>
                  <p className="text-slate-600 mt-1">{freight.description}</p>
                </div>
              )}
              
              {freight.requirements && (
                <div>
                  <span className="font-medium text-slate-700">Requisitos:</span>
                  <p className="text-slate-600 mt-1">{freight.requirements}</p>
                </div>
              )}
              
              {freight.notes && (
                <div>
                  <span className="font-medium text-slate-700">Observações:</span>
                  <p className="text-slate-600 mt-1">{freight.notes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Criado há {freight.createdAt ? '2 dias' : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Seguro: {freight.insurance ? 'Sim' : 'Não'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Botão para expandir detalhes */}
      <div className="px-6 pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>{showDetails ? 'Ocultar detalhes' : 'Ver mais detalhes'}</span>
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Route className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FreightCard;
