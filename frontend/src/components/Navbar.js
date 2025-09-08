import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../contexts/ThemeContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const location = useLocation()
  useTheme()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Contato', href: '/contato' },
    { name: 'Planos', href: '/planos' },
    {
      name: 'Serviços',
      href: '#',
      submenu: [
        { name: 'Loja Agroisync', href: '/loja' },
        { name: 'AgroConecta', href: '/agroconecta' },
        { name: 'Marketplace', href: '/marketplace' }
      ]
    }
  ]

  const isActive = href => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <nav className='bg-white border-b border-gray-200 sticky top-0 z-50'>
      <div className='container-futuristic'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link to='/' className='flex items-center gap-3'>
              <div className='bg-gray-900 flex h-10 w-10 items-center justify-center rounded-lg'>
                <span className='text-lg font-bold text-white'>A</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-gray-900 text-xl font-bold'>AgroSync</span>
                <span className='text-gray-500 text-xs'>Agronegócio</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className='hidden items-center gap-8 md:flex'>
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className='relative'
              >
                {item.submenu ? (
                  <div
                    className='relative'
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <button className='text-gray-700 hover:text-gray-900 flex items-center gap-1 font-medium transition-colors'>
                      {item.name}
                      <ChevronDown size={16} />
                    </button>

                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className='bg-white border border-gray-200 shadow-lg absolute left-0 top-full z-50 mt-2 w-48 p-2 rounded-lg'
                        >
                          {item.submenu.map(subItem => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className='text-gray-700 hover:bg-gray-50 block rounded-lg px-4 py-2 text-sm transition-colors hover:text-gray-900'
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`font-medium transition-colors ${
                      isActive(item.href) ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Side */}
          <div className='flex items-center gap-4'>
            <ThemeToggle />

            <div className='hidden items-center gap-3 md:flex'>
              <Link to='/login' className='text-gray-600 hover:text-gray-900 font-medium transition-colors'>
                Login
              </Link>
              <Link to='/cadastro' className='btn-primary'>
                Cadastrar
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className='text-gray-600 hover:text-gray-900 p-2 transition-colors md:hidden'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='bg-white border border-gray-200 shadow-lg mt-4 p-4 rounded-lg md:hidden'
            >
              <div className='flex flex-col gap-4'>
                {navigation.map(item => (
                  <div key={item.name}>
                    {item.submenu ? (
                      <div>
                        <div className='text-gray-900 mb-2 font-medium'>{item.name}</div>
                        <div className='ml-4 flex flex-col gap-2'>
                          {item.submenu.map(subItem => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className='text-gray-600 hover:text-gray-900 text-sm transition-colors'
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={`block font-medium transition-colors ${
                          isActive(item.href) ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                <div className='border-gray-200 flex flex-col gap-3 border-t pt-4'>
                  <Link
                    to='/login'
                    className='text-gray-600 hover:text-gray-900 font-medium transition-colors'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link to='/cadastro' className='btn-primary text-center' onClick={() => setIsMenuOpen(false)}>
                    Cadastrar
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
