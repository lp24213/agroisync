import React, { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
// import { useTheme } from '../../contexts/ThemeContext'
// import { useAuth } from '../../contexts/AuthContext'
// import { usePayment } from '../../contexts/PaymentContext'
import { useAgrolinkGrains } from '../../services/agrolinkAPI'
import GrainsPriceCard from './GrainsPriceCard'
import GrainsChart from './GrainsChart'
import FuturesMarket from './FuturesMarket'
import ExportData from './ExportData'

const GrainsDashboard = () => {
  const { grainsData, loading: grainsLoading, error: grainsError, refreshData, userLocation } = useAgrolinkGrains()

  // const [lastUpdate, setLastUpdate] = useState(new Date())

  // Atualizar timestamp da última atualização
  useEffect(() => {
    if (grainsData.length > 0) {
      // setLastUpdate(new Date())
    }
  }, [grainsData])

  const handleRefresh = useCallback(() => {
    refreshData()
    // setLastUpdate(new Date())
  }, [refreshData])

  const isLoading = grainsLoading
  const hasError = grainsError

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  if (hasError) {
    return (
      <motion.div
        className='min-h-screen bg-black p-6 pt-16 text-white'
        initial='hidden'
        animate='visible'
        variants={containerVariants}
      >
        <div className='mx-auto max-w-4xl text-center'>
          <div className='rounded-lg border border-red-500 bg-red-900/20 p-8'>
            <svg
              className='mx-auto mb-4 h-16 w-16 text-red-500'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <circle cx='12' cy='12' r='10' />
              <line x1='15' y1='9' x2='9' y2='15' />
              <line x1='9' y1='9' x2='15' y2='15' />
            </svg>
            <h2 className='mb-4 text-2xl font-bold text-red-400'>Erro ao Carregar Dados</h2>
            <p className='mb-6 text-gray-300'>{grainsError || 'Erro desconhecido'}</p>
            <button
              onClick={handleRefresh}
              className='rounded-lg bg-red-600 px-6 py-3 text-white transition-colors duration-300 hover:bg-red-700'
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className='min-h-screen bg-black p-6 pt-16 text-white'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <div className='mx-auto max-w-7xl'>
        {/* Header com localização */}
        <motion.div className='mb-8'>
          {userLocation && (
            <div className='mb-6 rounded-lg border border-gray-700 bg-gray-800/50 p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <svg
                    className='h-5 w-5 text-blue-400'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
                    <circle cx='12' cy='10' r='3' />
                  </svg>
                  <span className='text-gray-300'>Localização detectada:</span>
                  <span className='font-semibold text-white'>{userLocation.region}</span>
                </div>
                <span className='text-sm text-gray-400'>IP: {userLocation.ip}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Header */}
        <motion.div className='mb-8' variants={itemVariants}>
          <div className='mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between'>
            <div className='mb-4 flex items-center space-x-4 lg:mb-0'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-500'>
                <svg
                  className='h-6 w-6 text-white'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M12 2L8 8l4 4 4-4-4-6z' />
                  <path d='M8 8v8a4 4 0 0 0 8 0V8' />
                  <path d='M6 16h12' />
                </svg>
              </div>
              <div>
                <h1 className='bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-3xl font-bold text-transparent'>
                  Dashboard de Grãos
                </h1>
                <p className='text-gray-400'>Cotações em tempo real baseadas na sua localização</p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className='flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <svg
                  className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' />
                  <path d='M21 3v5h-5' />
                  <path d='M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' />
                  <path d='M3 21v-5h5' />
                </svg>
                <span>{isLoading ? 'Atualizando...' : 'Atualizar'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div className='py-12 text-center' variants={itemVariants}>
            <div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-green-500'></div>
            <p className='text-gray-400'>Carregando dados de cotações...</p>
          </motion.div>
        )}

        {/* Grains Cards */}
        {!isLoading && grainsData.length > 0 && (
          <motion.div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3' variants={itemVariants}>
            {grainsData.map(grain => (
              <GrainsPriceCard key={grain.id} grain={grain} location={userLocation} />
            ))}
          </motion.div>
        )}

        {/* Charts and Analysis */}
        {!isLoading && grainsData.length > 0 && (
          <div className='mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <motion.div variants={itemVariants}>
              <GrainsChart data={grainsData} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FuturesMarket />
            </motion.div>
          </div>
        )}

        {/* Export Data */}
        {!isLoading && (
          <motion.div variants={itemVariants}>
            <ExportData />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default GrainsDashboard
