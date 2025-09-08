import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8'>
      <div className='mx-auto max-w-2xl text-center'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-8'>
          <div className='text-gradient text-8xl font-bold'>404</div>

          <div>
            <h1 className='mb-4 text-4xl font-bold text-white'>Página não encontrada</h1>
            <p className='text-lg leading-relaxed text-gray-400'>
              A página que você está procurando não existe ou foi movida.
            </p>
          </div>

          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Link to='/' className='btn-primary flex items-center justify-center space-x-2 px-8 py-4'>
              <Home className='h-5 w-5' />
              <span>Voltar ao Início</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className='btn-secondary flex items-center justify-center space-x-2 px-8 py-4'
            >
              <ArrowLeft className='h-5 w-5' />
              <span>Voltar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound
