'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  User,
  FileText,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type ContactForm = 'general' | 'support' | 'partnership'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  company?: string
  phone?: string
  type: string
}

const contactInfo = [
  {
    title: 'E-mail',
    value: 'contato@agrosync.com.br',
    description: 'Resposta em até 24 horas',
    icon: Mail,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Telefone',
    value: '+55 (11) 99999-9999',
    description: 'Segunda a Sexta, 8h às 18h',
    icon: Phone,
    color: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Endereço',
    value: 'São Paulo, SP - Brasil',
    description: 'Escritório principal',
    icon: MapPin,
    color: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Horário',
    value: 'Segunda a Sexta',
    description: '8h às 18h (GMT-3)',
    icon: Clock,
    color: 'from-orange-500 to-red-600',
  },
]

const supportTopics = [
  'Problemas técnicos',
  'Dúvidas sobre produtos',
  'Suporte ao cliente',
  'Relatar bugs',
  'Sugestões de melhorias',
  'Outros',
]

const partnershipTypes = [
  'Fornecedor de produtos',
  'Transportadora',
  'Parceiro tecnológico',
  'Investidor',
  'Distribuidor',
  'Outros',
]

export function ContactPage() {
  const [activeForm, setActiveForm] = useState<ContactForm>('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: '',
    phone: '',
    type: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        company: '',
        phone: '',
        type: '',
      })
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getFormTitle = () => {
    switch (activeForm) {
      case 'general': return 'Entre em Contato'
      case 'support': return 'Suporte Técnico'
      case 'partnership': return 'Parcerias'
      default: return 'Entre em Contato'
    }
  }

  const getFormDescription = () => {
    switch (activeForm) {
      case 'general': return 'Envie sua mensagem e entraremos em contato em breve.'
      case 'support': return 'Precisa de ajuda? Nossa equipe está pronta para ajudar.'
      case 'partnership': return 'Interessado em uma parceria? Vamos conversar!'
      default: return 'Envie sua mensagem e entraremos em contato em breve.'
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center border border-border/50 max-w-2xl mx-auto"
          >
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Mensagem Enviada!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Obrigado pelo seu contato. Nossa equipe responderá em breve.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-neon-blue to-neon-cyan"
            >
              Enviar Nova Mensagem
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Entre em <span className="gradient-text">Contato</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Estamos aqui para ajudar. Entre em contato conosco através dos 
              canais abaixo ou preencha o formulário.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 text-center border border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{info.title}</h3>
                <p className="text-foreground font-medium mb-1">{info.value}</p>
                <p className="text-sm text-muted-foreground">{info.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-card p-6 border border-border/50">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Tipos de Contato
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveForm('general')}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                      activeForm === 'general'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Contato Geral</div>
                        <div className="text-sm opacity-80">Dúvidas e informações</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveForm('support')}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                      activeForm === 'support'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Suporte Técnico</div>
                        <div className="text-sm opacity-80">Ajuda e problemas</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveForm('partnership')}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                      activeForm === 'partnership'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Parcerias</div>
                        <div className="text-sm opacity-80">Oportunidades de negócio</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="glass-card p-8 border border-border/50">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {getFormTitle()}
                  </h2>
                  <p className="text-muted-foreground">
                    {getFormDescription()}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nome Completo *
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
                        E-mail *
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
                  </div>

                  {(activeForm === 'support' || activeForm === 'partnership') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeForm === 'partnership' && (
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Empresa
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Nome da empresa"
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Telefone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(11) 99999-9999"
                            className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {activeForm === 'support' ? 'Tipo de Suporte' : activeForm === 'partnership' ? 'Tipo de Parceria' : 'Assunto'} *
                    </label>
                    {activeForm === 'general' ? (
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Assunto da mensagem"
                        required
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    ) : (
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">Selecione uma opção</option>
                        {(activeForm === 'support' ? supportTopics : partnershipTypes).map((topic) => (
                          <option key={topic} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mensagem *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Descreva sua mensagem..."
                        required
                        rows={5}
                        className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-neon-blue to-neon-cyan py-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
