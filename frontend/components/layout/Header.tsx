import React from 'react';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSelector } from '../ui/LanguageSelector';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = React.useState<'en' | 'pt' | 'es' | 'zh'>('pt');
  
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
      color: "#00ff88",
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

  const languageMenuVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  const handleLanguageChange = (lang: 'en' | 'pt' | 'es' | 'zh') => {
    setCurrentLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  const getLanguageFlag = (lang: 'en' | 'pt' | 'es' | 'zh') => {
    switch (lang) {
      case 'en': return '🇬🇧';
      case 'pt': return '🇧🇷';
      case 'es': return '🇪🇸';
      case 'zh': return '🇨🇳';
      default: return '🇧🇷';
    }
  };

  const getLanguageName = (lang: 'en' | 'pt' | 'es' | 'zh') => {
    switch (lang) {
      case 'en': return 'EN';
      case 'pt': return 'PT';
      case 'es': return 'ES';
      case 'zh': return 'ZH';
      default: return 'PT';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-blue-500/30 overflow-hidden">
      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-0 scanlines opacity-10"></div>
      
      {/* Glowing border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="w-8 h-8 relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="text-white font-bold text-sm">A</span>
            </motion.div>
            <motion.span 
              className="text-xl font-bold text-white relative"
              whileHover={{ scale: 1.05 }}
            >
              AGROTM
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 transform scale-x-0 origin-left"
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
              <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 relative group">
                Home
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 origin-left"
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
              <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 relative group">
                Dashboard
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 origin-left"
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
              <Link href="/staking" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 relative group">
                Staking
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 origin-left"
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
              <Link href="#about" className="text-gray-300 hover:text-blue-500 transition-colors duration-300 relative group">
                About
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 origin-left"
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
              <Link href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 relative group">
                Contact
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>

            {/* Language Selector Desktop */}
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <motion.button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 border border-transparent hover:border-blue-500/30 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">
                  {getLanguageFlag(currentLanguage)}
                </span>
                <span className="text-sm font-medium">
                  {getLanguageName(currentLanguage)}
                </span>
                <motion.svg
                  className="w-4 h-4 transition-transform"
                  animate={{ rotate: isLanguageMenuOpen ? 180 : 0 }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-blue-500/30 rounded-lg shadow-xl z-50"
                    variants={languageMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="p-2 space-y-1">
                      {[
                        { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
                        { code: 'pt', name: 'Português', flag: '🇧🇷', nativeName: 'Português Brasil' },
                        { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
                        { code: 'zh', name: '中文', flag: '🇨🇳', nativeName: '中文' }
                      ].map((lang) => (
                        <motion.button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code as 'en' | 'pt' | 'es' | 'zh')}
                          className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors duration-200 ${
                            currentLanguage === lang.code
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'text-gray-300 hover:bg-blue-500/10 hover:text-blue-400'
                          }`}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm font-medium">{lang.nativeName}</span>
                          {currentLanguage === lang.code && (
                            <motion.svg
                              className="w-4 h-4 ml-auto text-blue-400"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </motion.svg>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="primary" 
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 relative group overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
              </Button>
            </motion.div>
          </nav>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-blue-400 hover:bg-black/50 border border-transparent hover:border-blue-500/30 transition-colors duration-300"
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
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-md rounded-b-lg border-x border-b border-blue-500/30 relative overflow-hidden">
                {/* Corner accents */}
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500/50"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500/50"></div>
                
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
                    <Link href="/" className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 border-l-2 border-transparent hover:border-blue-500/50 hover:bg-blue-500/5 rounded-r-md">
                      Home
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <Link href="/dashboard" className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 border-l-2 border-transparent hover:border-blue-500/50 hover:bg-blue-500/5 rounded-r-md">
                      Dashboard
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <Link href="/staking" className="block px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300 border-l-2 border-transparent hover:border-cyan-400/50 hover:bg-cyan-400/5 rounded-r-md">
                      Staking
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <Link href="#about" className="block px-3 py-2 text-gray-300 hover:text-blue-500 transition-colors duration-300 border-l-2 border-transparent hover:border-blue-500/50 hover:bg-blue-500/5 rounded-r-md">
                      About
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants}>
                    <Link href="#contact" className="block px-3 py-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300 border-l-2 border-transparent hover:border-cyan-400/50 hover:bg-cyan-400/5 rounded-r-md">
                      Contact
                    </Link>
                  </motion.div>

                  {/* Language Selector Mobile */}
                  <motion.div variants={navItemVariants} className="mt-4">
                    <div className="px-3 py-2">
                      <p className="text-sm text-gray-400 mb-2">Idioma / Language</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { code: 'en', name: 'EN', flag: '🇬🇧', nativeName: 'English' },
                          { code: 'pt', name: 'PT', flag: '🇧🇷', nativeName: 'Português' },
                          { code: 'es', name: 'ES', flag: '🇪🇸', nativeName: 'Español' },
                          { code: 'zh', name: 'ZH', flag: '🇨🇳', nativeName: '中文' }
                        ].map((lang) => (
                          <motion.button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code as 'en' | 'pt' | 'es' | 'zh')}
                            className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                              currentLanguage === lang.code
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 border border-transparent'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="text-sm font-medium">{lang.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Technologies Section Mobile */}
                  <motion.div variants={navItemVariants} className="mt-4">
                    <div className="px-3 py-2">
                      <p className="text-sm text-gray-400 mb-2">🛠️ Tecnologias / Tech Stack</p>
                      <div className="space-y-2">
                        {/* Frontend */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3">
                          <p className="text-xs text-blue-400 font-semibold mb-1">🎨 Frontend</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Next.js</span>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">React</span>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">TypeScript</span>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Tailwind</span>
                          </div>
                        </div>
                        
                        {/* Backend */}
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-md p-3">
                          <p className="text-xs text-cyan-400 font-semibold mb-1">⚙️ Backend</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">Node.js</span>
                            <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">Express</span>
                            <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">MongoDB</span>
                            <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">Redis</span>
                          </div>
                        </div>
                        
                        {/* Blockchain */}
                        <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3">
                          <p className="text-xs text-green-400 font-semibold mb-1">⛓️ Blockchain</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Solana</span>
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Rust</span>
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Anchor</span>
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Web3.js</span>
                          </div>
                        </div>
                        
                        {/* DevOps */}
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-md p-3">
                          <p className="text-xs text-purple-400 font-semibold mb-1">🚀 DevOps</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Docker</span>
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Vercel</span>
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Railway</span>
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">GitHub</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={navItemVariants} className="mt-4">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 relative group overflow-hidden"
                    >
                      <span className="relative z-10">Get Started</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
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