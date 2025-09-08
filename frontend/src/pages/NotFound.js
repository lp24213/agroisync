import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-8xl font-bold text-accent-primary">404</div>
          
          <div>
            <h1 className="text-4xl font-bold text-primary mb-4">Página não encontrada</h1>
            <p className="text-secondary text-lg leading-relaxed">
              A página que você está procurando não existe ou foi movida.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary px-8 py-4 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Voltar ao Início</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary px-8 py-4 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
