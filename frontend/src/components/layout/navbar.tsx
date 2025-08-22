'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  ChevronDown, 
  Globe, 
  User, 
  Wallet,
  ShoppingCart,
  BarChart3,
  Truck,
  Wheat,
  Coins,
  Bot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { WalletButton } from '@/components/ui/wallet-button'

const navigation = [
  {
    name: 'Loja',
    href: '/store',
    icon: ShoppingCart,
    description: 'Catálogo de produtos agrícolas',
  },
  {
    name: 'Criptomoedas',
    href: '/crypto',
    icon: Coins,
    description: 'Cotações e trading em tempo real',
  },
  {
    name: 'Grãos',
    href: '/grains',
    icon: Wheat,
    description: 'Preços e geolocalização de grãos',
  },
  {
    name: 'AgroConecta',
    href: '/agroconecta',
    icon: Truck,
    description: 'Marketplace de fretes agrícolas',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Dashboards e KPIs em tempo real',
  },
  {
    name: 'Chatbot',
    href: '/chatbot',
    icon: Bot,
    description: 'Assistente IA para agricultura',
  },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-lg flex items-center justify-center">
                <Wheat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AgroSync</span>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Link>

                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-lg p-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <WalletButton />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth">
                <User className="w-4 h-4 mr-2" />
                Entrar
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border/50"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-colors rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
