import React from 'react';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: { 
      scale: 1.05,
      color: "#64ffda",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };
  
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-agro-darker/80 backdrop-blur-md border-b border-gray-800/50 overflow-hidden">
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-0 scanlines opacity-5"></div>
      
      {/* Glowing border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-agro-blue to-transparent opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="w-8 h-8 relative overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image 
                src="/assets/img/agrotm-logo.svg" 
                alt="AGROTM Logo" 
                width={32} 
                height={32}
                className="w-full h-full"
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.div
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={navItemVariants}
            >
              <Link href="/" className="text-gray-300 hover:text-agro-blue transition-colors duration-300 relative group">
                Home
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-agro-blue transform scale-x-0 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
            
            <motion.div
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={navItemVariants}
              transition={{ delay: 0.1 }}
            >
              <Link href="/dashboard" className="text-gray-300 hover:text-agro-blue transition-colors duration-300 relative group">
                Dashboard
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-agro-blue transform scale-x-0 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
            
            <motion.div
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={navItemVariants}
              transition={{ delay: 0.2 }}
            >
              <Link href="/staking" className="text-gray-300 hover:text-agro-purple transition-colors duration-300 relative group">
                Staking
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-agro-purple transform scale-x-0 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
            
            <motion.div
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={navItemVariants}
              transition={{ delay: 0.3 }}
            >
              <Link href="#about" className="text-gray-300 hover:text-agro-green transition-colors duration-300 relative group">
                About
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-agro-green transform scale-x-0 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
            
            <motion.div
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={navItemVariants}
              transition={{ delay: 0.4 }}
            >
              <Link href="#contact" className="text-gray-300 hover:text-agro-neon transition-colors duration-300 relative group">
                Contact
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-agro-neon transform scale-x-0 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
            
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="primary" 
                size="sm"
                className="bg-gradient-to-r from-agro-blue to-agro-purple hover:from-agro-purple hover:to-agro-blue relative group overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-agro-neon to-agro-green opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
              </Button>
            </motion.div>
          </nav>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-agro-blue hover:bg-agro-darker/80 border border-transparent hover:border-agro-blue/30 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={false}
              animate={isMenuOpen ? "open" : "closed"}
              variants={{
                open: { rotate: 180 },
                closed: { rotate: 0 }
              }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-agro-darker/90 backdrop-blur-md rounded-b-lg border-x border-b border-gray-800/50 relative overflow-hidden">
                {/* Corner accents */}
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-agro-blue/50"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-agro-blue/50"></div>
                
                <motion.div 
                  className="relative z-10"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                >
                  <motion.div variants={navItemVariants}>
                    <Link href="/" className="block px-3 py-2 text-gray-300 hover:text-agro-blue transition-colors duration-300 border-l-2 border-transparent hover:border-agro-blue/50 hover:bg-agro-blue/5 rounded-r-md">
                      Home
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <Link href="/dashboard" className="block px-3 py-2 text-gray-300 hover:text-agro-blue transition-colors duration-300 border-l-2 border-transparent hover:border-agro-blue/50 hover:bg-agro-blue/5 rounded-r-md">
                      Dashboard
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <Link href="/staking" className="block px-3 py-2 text-gray-300 hover:text-agro-purple transition-colors duration-300 border-l-2 border-transparent hover:border-agro-purple/50 hover:bg-agro-purple/5 rounded-r-md">
                      Staking
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <Link href="#about" className="block px-3 py-2 text-gray-300 hover:text-agro-green transition-colors duration-300 border-l-2 border-transparent hover:border-agro-green/50 hover:bg-agro-green/5 rounded-r-md">
                      About
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <Link href="#contact" className="block px-3 py-2 text-gray-300 hover:text-agro-neon transition-colors duration-300 border-l-2 border-transparent hover:border-agro-neon/50 hover:bg-agro-neon/5 rounded-r-md">
                      Contact
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants} className="mt-4">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-agro-blue to-agro-purple hover:from-agro-purple hover:to-agro-blue relative group overflow-hidden"
                    >
                      <span className="relative z-10">Get Started</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-agro-neon to-agro-green opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}