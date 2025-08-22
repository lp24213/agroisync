'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  Wallet,
  Shield,
  ArrowRight,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type AuthMode = 'login' | 'register' | 'forgot'

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const connectWallet = () => {
    console.log('Connecting wallet...')
  }

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-secondary border border-border rounded-lg pl-10 pr-10 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-sm text-primary hover:text-primary/80"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-neon-blue to-neon-cyan py-3"
            >
              Entrar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.form>
        )

      case 'register':
        return (
          <motion.form
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                  className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-secondary border border-border rounded-lg pl-10 pr-10 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-neon-blue to-neon-cyan py-3"
            >
              Criar Conta
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.form>
        )

      case 'forgot':
        return (
          <motion.form
            key="forgot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Recuperar Senha
              </h3>
              <p className="text-muted-foreground">
                Digite seu e-mail para receber um link de recuperação
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-neon-blue to-neon-cyan py-3"
            >
              Enviar Link
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.form>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 border border-border/50"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {mode === 'login' && 'Entrar na Conta'}
                {mode === 'register' && 'Criar Conta'}
                {mode === 'forgot' && 'Recuperar Senha'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'login' && 'Acesse sua conta AgroSync'}
                {mode === 'register' && 'Comece sua jornada na AgroSync'}
                {mode === 'forgot' && 'Recupere o acesso à sua conta'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {renderForm()}
            </AnimatePresence>

            {mode !== 'forgot' && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/30" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">ou</span>
                  </div>
                </div>

                <Button
                  onClick={connectWallet}
                  variant="outline"
                  className="w-full mt-4 py-3 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Conectar Carteira Web3
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              {mode === 'login' && (
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{' '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Criar conta
                  </button>
                </p>
              )}
              {mode === 'register' && (
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Entrar
                  </button>
                </p>
              )}
              {mode === 'forgot' && (
                <p className="text-sm text-muted-foreground">
                  Lembrou a senha?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Voltar ao login
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
