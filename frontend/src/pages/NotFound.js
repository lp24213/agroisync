import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className='flex min-h-screen items-center justify-center p-8'>
      <div className='mx-auto max-w-2xl text-center'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-8'>
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className='relative'
          >
            <div className='text-primary mb-4 text-8xl font-extrabold md:text-9xl'>404</div>
            <div className='absolute -right-4 -top-4'>
              <div className='bg-primary flex h-16 w-16 items-center justify-center rounded-full'>
                <AlertCircle size={32} className='text-white' />
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h1 className='text-primary mb-4 text-4xl font-bold md:text-5xl'>Página não encontrada</h1>
            <p className='text-secondary mx-auto max-w-lg text-lg leading-relaxed'>
              A página que você está procurando não existe ou foi movida. Não se preocupe, vamos te ajudar a encontrar o
              que precisa.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className='flex flex-col justify-center gap-4 sm:flex-row'
          >
            <Link to='/' className='btn-futuristic btn-primary flex items-center justify-center gap-2 px-8 py-4'>
              <Home size={20} />
              <span>Voltar ao Início</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className='btn-futuristic btn-secondary flex items-center justify-center gap-2 px-8 py-4'
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className='card-futuristic mt-12'
          >
            <div className='bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl'>
              <Search size={32} className='text-white' />
            </div>
            <h2 className='text-primary mb-4 text-2xl font-bold'>Precisa de ajuda?</h2>
            <p className='text-secondary mb-6'>
              Nossa equipe está sempre pronta para ajudar você a encontrar o que precisa.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link to='/contact' className='btn-futuristic btn-primary'>
                Falar com Suporte
              </Link>
              <Link to='/about' className='btn-futuristic btn-secondary'>
                Conhecer o AgroSync
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className='mt-8'
          >
            <h3 className='text-primary mb-4 text-lg font-semibold'>Links Úteis</h3>
            <div className='flex flex-wrap justify-center gap-4'>
              <Link to='/marketplace' className='text-secondary hover:text-primary transition-colors'>
                Marketplace
              </Link>
              <span className='text-muted'>•</span>
              <Link to='/agroconecta' className='text-secondary hover:text-primary transition-colors'>
                AgroConecta
              </Link>
              <span className='text-muted'>•</span>
              <Link to='/plans' className='text-secondary hover:text-primary transition-colors'>
                Planos
              </Link>
              <span className='text-muted'>•</span>
              <Link to='/contact' className='text-secondary hover:text-primary transition-colors'>
                Contato
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
