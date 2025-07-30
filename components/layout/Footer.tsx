import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Footer() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <footer className="bg-agro-dark border-t border-gray-800 py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="grid-animation"></div>
      </div>
      
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-1 scanlines opacity-5"></div>
      
      {/* Digital Rain Effect */}
      <div className="absolute inset-0 z-0 opacity-5 digital-rain"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Logo and Description */}
          <motion.div className="col-span-1 md:col-span-2" variants={itemVariants}>
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-agro-green to-agro-blue rounded-lg flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-white font-bold text-sm relative z-10">A</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-agro-blue via-agro-purple to-agro-green opacity-0"
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              <motion.span 
                className="text-xl font-bold gradient-text relative"
                whileHover={{ scale: 1.05 }}
              >
                AGROTM
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-agro-blue via-agro-purple to-agro-green transform scale-x-0 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md leading-relaxed">
              Revolucionando a agricultura através da blockchain. Plataforma DeFi para agricultura sustentável com tecnologia de ponta e segurança garantida pela Solana.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              <motion.a 
                href="#" 
                className="w-8 h-8 rounded-full bg-agro-darker border border-agro-blue/30 flex items-center justify-center text-agro-blue hover:bg-agro-blue/20 transition-colors duration-300"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-sm">🐦</span>
              </motion.a>
              <motion.a 
                href="#" 
                className="w-8 h-8 rounded-full bg-agro-darker border border-agro-purple/30 flex items-center justify-center text-agro-purple hover:bg-agro-purple/20 transition-colors duration-300"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-sm">💬</span>
              </motion.a>
              <motion.a 
                href="#" 
                className="w-8 h-8 rounded-full bg-agro-darker border border-agro-green/30 flex items-center justify-center text-agro-green hover:bg-agro-green/20 transition-colors duration-300"
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-sm">📘</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4 text-glow-blue relative inline-block">
              Quick Links
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-agro-blue to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </h3>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Link href="/" className="text-gray-400 hover:text-agro-blue group flex items-center transition-colors duration-300">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                  <span>Home</span>
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Link href="/dashboard" className="text-gray-400 hover:text-agro-blue group flex items-center transition-colors duration-300">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                  <span>Dashboard</span>
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Link href="/staking" className="text-gray-400 hover:text-agro-blue group flex items-center transition-colors duration-300">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                  <span>Staking</span>
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Link href="#about" className="text-gray-400 hover:text-agro-blue group flex items-center transition-colors duration-300">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                  <span>About</span>
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-4 text-glow-purple relative inline-block">
              Resources
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-agro-purple to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </h3>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="#" className="text-gray-400 hover:text-agro-purple group flex items-center transition-colors duration-300">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                  <span>Whitepaper</span>
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="#" className="text-gray-400 hover:text-agro-purple group flex items-center transition-colors duration-300">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                  <span>Documentação</span>
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <a href="#" className="text-gray-400 hover:text-agro-purple group flex items-center transition-colors duration-300">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">›</span>
                  <span>GitHub</span>
                </a>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          className="border-t border-gray-800/50 mt-8 pt-8 text-center relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {/* Decorative line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-agro-blue to-transparent"></div>
          
          <p className="text-gray-400 relative inline-block">
            © 2024 AGROTM. All rights reserved.
            <motion.span 
              className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-agro-blue via-agro-purple to-agro-green opacity-50"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </p>
        </motion.div>
      </div>
    </footer>
  );
}