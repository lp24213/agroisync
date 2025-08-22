'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ChevronDown, User, LogOut } from 'lucide-react'
import { Button } from './button'

export function WalletButton() {
  const [isConnected, setIsConnected] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleConnect = () => {
    setIsConnected(true)
    setIsOpen(false)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setIsOpen(false)
  }

  if (!isConnected) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleConnect}
        className="flex items-center space-x-2 border-primary/30 text-primary hover:bg-primary/10"
      >
        <Wallet className="w-4 h-4" />
        <span>Conectar Carteira</span>
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
          <User className="w-3 h-3 text-primary" />
        </div>
        <span className="hidden sm:inline">0x1234...5678</span>
        <ChevronDown className="w-3 h-3" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg p-2 z-50"
          >
            <div className="p-3 border-b border-border/50">
              <p className="text-sm font-medium text-foreground">Carteira Conectada</p>
              <p className="text-xs text-muted-foreground">0x1234567890abcdef...</p>
            </div>
            
            <div className="p-2">
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-red-400 hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Desconectar</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
