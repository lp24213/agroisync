import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <div className="text-8xl md:text-9xl font-extrabold text-primary mb-4">
              404
            </div>
            <div className="absolute -top-4 -right-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-white" />
              </div>
            </div>
          </motion.div>
          
          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Página não encontrada
            </h1>
            <p className="text-lg text-secondary leading-relaxed max-w-lg mx-auto">
              A página que você está procurando não existe ou foi movida. 
              Não se preocupe, vamos te ajudar a encontrar o que precisa.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="btn-futuristic btn-primary px-8 py-4 flex items-center justify-center gap-2"
            >
              <Home size={20} />
              <span>Voltar ao Início</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn-futuristic btn-secondary px-8 py-4 flex items-center justify-center gap-2"
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
            className="card-futuristic mt-12"
          >
            <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Search size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-4">
              Precisa de ajuda?
            </h2>
            <p className="text-secondary mb-6">
              Nossa equipe está sempre pronta para ajudar você a encontrar o que precisa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-futuristic btn-primary"
              >
                Falar com Suporte
              </Link>
              <Link
                to="/about"
                className="btn-futuristic btn-secondary"
              >
                Conhecer o AgroSync
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-8"
          >
            <h3 className="text-lg font-semibold text-primary mb-4">
              Links Úteis
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/marketplace"
                className="text-secondary hover:text-primary transition-colors"
              >
                Marketplace
              </Link>
              <span className="text-muted">•</span>
              <Link
                to="/agroconecta"
                className="text-secondary hover:text-primary transition-colors"
              >
                AgroConecta
              </Link>
              <span className="text-muted">•</span>
              <Link
                to="/plans"
                className="text-secondary hover:text-primary transition-colors"
              >
                Planos
              </Link>
              <span className="text-muted">•</span>
              <Link
                to="/contact"
                className="text-secondary hover:text-primary transition-colors"
              >
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
