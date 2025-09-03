import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, Globe, 
  Facebook, Twitter, Instagram, Linkedin,
  Leaf, Shield, Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-agro-bg-secondary text-agro-text-primary border-t border-agro-border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-agro-accent-emerald to-agro-accent-sky rounded-lg flex items-center justify-center shadow-lg w-10 h-10">
                  <Leaf className="h-6 w-6 text-agro-text-primary" />
                </div>
                <span className="text-xl font-bold text-agro-text-primary">AgroSync</span>
              </div>
              <p className="text-agro-text-secondary mb-6 max-w-md">
                Conectando o agronegócio brasileiro através de tecnologia inovadora e soluções sustentáveis.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-agro-bg-card rounded-lg text-agro-text-tertiary hover:text-agro-accent-emerald transition-all duration-300"
                >
                  <Facebook className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-agro-bg-card rounded-lg text-agro-text-tertiary hover:text-agro-accent-emerald transition-all duration-300"
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-agro-bg-card rounded-lg text-agro-text-tertiary hover:text-agro-accent-emerald transition-all duration-300"
                >
                  <Instagram className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-agro-bg-card rounded-lg text-agro-text-tertiary hover:text-agro-accent-emerald transition-all duration-300"
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Links Rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-agro-text-primary mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-agro-text-tertiary hover:text-agro-accent-emerald transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-agro-text-tertiary hover:text-agro-accent-emerald transition-colors duration-300">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/loja" className="text-agro-text-tertiary hover:text-agro-accent-emerald transition-colors duration-300">
                  Loja
                </Link>
              </li>
              <li>
                <Link to="/agroconecta" className="text-agro-text-tertiary hover:text-agro-accent-emerald transition-colors duration-300">
                  AgroConecta
                </Link>
              </li>
              <li>
                <Link to="/planos" className="text-agro-text-tertiary hover:text-agro-accent-emerald transition-colors duration-300">
                  Planos
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Suporte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-agro-text-primary mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contato" className="text-agro-text-tertiary hover:text-agro-accent-emerald transition-colors duration-300">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-agro-text-tertiary hover:text-agro-accent-emerald transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/ajuda" className="text-agro-text-tertiary hover:text-agro-accent-emerald transition-colors duration-300">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-agro-text-tertiary hover:text-agro-accent-emerald transition-colors duration-300">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-agro-text-tertiary hover:text-agro-accent-emerald transition-colors duration-300">
                  Privacidade
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Informações de Contato */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-agro-border-primary"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-agro-accent-emerald" />
              <span className="text-agro-text-secondary">Sinop, MT - Brasil</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-agro-accent-emerald" />
              <span className="text-agro-text-secondary">+55 (66) 99999-9999</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-agro-accent-emerald" />
              <span className="text-agro-text-secondary">contato@agroisync.com</span>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 pt-6 border-t border-agro-border-primary text-center"
        >
          <p className="text-agro-text-tertiary text-sm">
            © {currentYear} AgroSync. Todos os direitos reservados. 
            <span className="inline-flex items-center ml-2">
              Feito com <Heart className="h-4 w-4 text-red-500 mx-1" /> no Brasil
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
