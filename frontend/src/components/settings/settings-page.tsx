'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Palette, 
  Globe, 
  Bell,
  Shield,
  CreditCard,
  Key,
  Smartphone,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type Theme = 'dark' | 'light' | 'auto'
type Language = 'pt' | 'en' | 'es' | 'zh'

interface UserProfile {
  name: string
  email: string
  phone: string
  company: string
  role: string
  avatar: string
}

const mockProfile: UserProfile = {
  name: 'João Silva',
  email: 'joao.silva@agrosync.com.br',
  phone: '+55 (11) 99999-9999',
  company: 'AgroSync Ltda',
  role: 'Produtor',
  avatar: '/api/placeholder/100/100',
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<UserProfile>(mockProfile)
  const [theme, setTheme] = useState<Theme>('dark')
  const [language, setLanguage] = useState<Language>('pt')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'integrations', label: 'Integrações', icon: Smartphone },
  ]

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSaving(false)
  }

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{profile.name}</h3>
                <p className="text-muted-foreground">{profile.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Empresa
                </label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => handleProfileChange('company', e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Tema</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['dark', 'light', 'auto'] as Theme[]).map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => setTheme(themeOption)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      theme === themeOption
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2">
                        {themeOption === 'dark' && <span className="text-2xl">🌙</span>}
                        {themeOption === 'light' && <span className="text-2xl">☀️</span>}
                        {themeOption === 'auto' && <span className="text-2xl">🔄</span>}
                      </div>
                      <div className="font-medium text-foreground capitalize">
                        {themeOption === 'dark' ? 'Escuro' : themeOption === 'light' ? 'Claro' : 'Automático'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Idioma</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      language === lang.code
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="font-medium text-foreground">{lang.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Preferências de Notificação</h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground capitalize">
                        {key === 'email' ? 'E-mail' : key === 'push' ? 'Push' : key === 'sms' ? 'SMS' : 'Marketing'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {key === 'email' && 'Receber notificações por e-mail'}
                        {key === 'push' && 'Notificações push no navegador'}
                        {key === 'sms' && 'Notificações por SMS'}
                        {key === 'marketing' && 'Receber ofertas e novidades'}
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                      className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                        value ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Alterar Senha</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                      className="w-full bg-secondary border border-border rounded-lg pl-3 pr-10 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                    Nova Senha
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.new}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Autenticação de Dois Fatores</h3>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">2FA via Aplicativo</div>
                    <div className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta
                    </div>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Carteiras Web3</h3>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🦊</span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">MetaMask</div>
                        <div className="text-sm text-muted-foreground">Carteira Ethereum</div>
                      </div>
                    </div>
                    <Button variant="outline">Conectar</Button>
                  </div>
                </div>

                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">👻</span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Phantom</div>
                        <div className="text-sm text-muted-foreground">Carteira Solana</div>
                      </div>
                    </div>
                    <Button variant="outline">Conectar</Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">APIs Externas</h3>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Agrolink</div>
                      <div className="text-sm text-muted-foreground">Dados de preços de grãos</div>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              <span className="gradient-text">Configurações</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Gerencie seu perfil, preferências e configurações da conta
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-card p-6 border border-border/50">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="glass-card p-8 border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-foreground">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-neon-blue to-neon-cyan"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </>
                    )}
                  </Button>
                </div>

                {renderTabContent()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
