import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Truck,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Star,
  Phone,
  Mail,
  MessageCircle,
  Eye,
  Heart,
  Route,
  Clock,
  User,
  Shield,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

const FreightCard = ({ freight, onContact, onFavorite, onView, onApply, userType }) => {
  const [isFavorite, setIsFavorite] = useState(freight.isFavorite || false)
  const [showDetails, setShowDetails] = useState(false)

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    if (onFavorite) onFavorite(freight.id, !isFavorite)
  }

  const handleContact = () => {
    if (onContact) onContact(freight)
  }

  const handleView = () => {
    if (onView) onView(freight)
  }

  const handleApply = () => {
    if (onApply) onApply(freight)
  }

  const getStatusColor = status => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed':
        return 'bg-slate-100 text-slate-700 border-slate-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusText = status => {
    switch (status) {
      case 'available':
        return 'Disponível'
      case 'in_progress':
        return 'Em Andamento'
      case 'completed':
        return 'Concluído'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Indefinido'
    }
  }

  const getTruckTypeIcon = truckType => {
    switch (truckType) {
      case 'truck':
        return <Truck className='h-5 w-5' />
      case 'truck_3_4':
        return <Truck className='h-5 w-5' />
      case 'truck_toco':
        return <Truck className='h-5 w-5' />
      case 'truck_truck':
        return <Truck className='h-5 w-5' />
      case 'truck_carreta':
        return <Truck className='h-5 w-5' />
      default:
        return <Truck className='h-5 w-5' />
    }
  }

  const getTruckTypeText = truckType => {
    switch (truckType) {
      case 'truck':
        return 'Truck 3/4'
      case 'truck_3_4':
        return 'Truck 3/4'
      case 'truck_toco':
        return 'Truck Toco'
      case 'truck_truck':
        return 'Truck Truck'
      case 'truck_carreta':
        return 'Carreta'
      default:
        return 'Truck'
    }
  }

  const formatPrice = price => {
    if (typeof price === 'number') {
      return `R$ ${price.toFixed(2).replace('.', ',')}`
    }
    return price
  }

  const formatDate = date => {
    if (!date) return 'Data flexível'
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('pt-BR')
  }

  const formatWeight = weight => {
    if (!weight) return 'Peso não informado'
    if (typeof weight === 'number') {
      return `${weight} kg`
    }
    return weight
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className='group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:border-emerald-300 hover:shadow-xl'
    >
      {/* Header com status */}
      <div className='p-6 pb-4'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white'>
              {getTruckTypeIcon(freight.truckType)}
            </div>
            <div>
              <h3 className='text-lg font-bold text-slate-800'>Frete #{freight.id}</h3>
              <p className='text-sm text-slate-600'>{getTruckTypeText(freight.truckType)}</p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className={`rounded-lg p-2 transition-colors duration-200 ${
                isFavorite
                  ? 'bg-red-100 text-red-500 hover:bg-red-200'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>

            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(freight.status)}`}>
              {getStatusText(freight.status)}
            </span>
          </div>
        </div>

        {/* Rota principal */}
        <div className='mb-4'>
          <div className='mb-2 flex items-center space-x-3'>
            <MapPin className='h-5 w-5 text-emerald-500' />
            <span className='text-sm text-slate-600'>Rota</span>
          </div>
          <div className='flex items-center space-x-2'>
            <span className='text-lg font-semibold text-slate-800'>{freight.origin}</span>
            <Route className='h-4 w-4 text-slate-400' />
            <span className='text-lg font-semibold text-slate-800'>{freight.destination}</span>
          </div>
        </div>

        {/* Informações principais */}
        <div className='mb-4 grid grid-cols-2 gap-4'>
          <div className='flex items-center space-x-2'>
            <Package className='h-4 w-4 text-slate-400' />
            <span className='text-sm text-slate-600'>{formatWeight(freight.weight)}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <Calendar className='h-4 w-4 text-slate-400' />
            <span className='text-sm text-slate-600'>{formatDate(freight.date)}</span>
          </div>
        </div>

        {/* Preço */}
        <div className='mb-4'>
          <div className='flex items-center justify-between'>
            <span className='bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent'>
              {formatPrice(freight.price)}
            </span>
            {freight.negotiable && (
              <span className='rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700'>
                Negociável
              </span>
            )}
          </div>
        </div>

        {/* Informações do anunciante (limitadas) */}
        <div className='mb-4 rounded-lg bg-slate-50 p-3'>
          <div className='mb-2 flex items-center space-x-2'>
            <User className='h-4 w-4 text-slate-400' />
            <span className='text-sm font-medium text-slate-700'>{freight.announcerName || 'Anunciante'}</span>
            {freight.verified && <CheckCircle className='h-4 w-4 text-emerald-500' />}
          </div>

          {freight.announcerRating && (
            <div className='flex items-center space-x-1'>
              <Star className='h-4 w-4 fill-current text-yellow-400' />
              <span className='text-sm text-slate-600'>{freight.announcerRating}</span>
              <span className='text-xs text-slate-400'>({freight.announcerReviews || 0} avaliações)</span>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div className='flex space-x-3'>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleView}
            className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-200'
          >
            <Eye className='h-4 w-4' />
            <span>Ver Detalhes</span>
          </motion.button>

          {userType === 'freteiro' && freight.status === 'available' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApply}
              className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:from-emerald-600 hover:to-blue-600 hover:shadow-lg'
            >
              <MessageCircle className='h-4 w-4' />
              <span>Candidatar-se</span>
            </motion.button>
          )}

          {userType === 'anunciante' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContact}
              className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600'
            >
              <Phone className='h-4 w-4' />
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
        className='overflow-hidden'
      >
        {showDetails && (
          <div className='border-t border-slate-200 px-6 pb-6 pt-4'>
            <div className='space-y-3 text-sm'>
              {freight.description && (
                <div>
                  <span className='font-medium text-slate-700'>Descrição:</span>
                  <p className='mt-1 text-slate-600'>{freight.description}</p>
                </div>
              )}

              {freight.requirements && (
                <div>
                  <span className='font-medium text-slate-700'>Requisitos:</span>
                  <p className='mt-1 text-slate-600'>{freight.requirements}</p>
                </div>
              )}

              {freight.notes && (
                <div>
                  <span className='font-medium text-slate-700'>Observações:</span>
                  <p className='mt-1 text-slate-600'>{freight.notes}</p>
                </div>
              )}

              <div className='grid grid-cols-2 gap-4 pt-3'>
                <div className='flex items-center space-x-2'>
                  <Clock className='h-4 w-4 text-slate-400' />
                  <span className='text-slate-600'>Criado há {freight.createdAt ? '2 dias' : 'N/A'}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Shield className='h-4 w-4 text-slate-400' />
                  <span className='text-slate-600'>Seguro: {freight.insurance ? 'Sim' : 'Não'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Botão para expandir detalhes */}
      <div className='px-6 pb-4'>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDetails(!showDetails)}
          className='flex w-full items-center justify-center space-x-2 py-2 text-sm text-slate-500 transition-colors duration-200 hover:text-slate-700'
        >
          <span>{showDetails ? 'Ocultar detalhes' : 'Ver mais detalhes'}</span>
          <motion.div animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <Route className='h-4 w-4' />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default FreightCard
