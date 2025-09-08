import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  FileText,
  Star,
  Clock,
  Shield
} from 'lucide-react'

const ContactForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general',
    priority: 'normal'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const contactTypes = [
    { id: 'general', name: 'Geral', icon: MessageSquare },
    { id: 'support', name: 'Suporte', icon: AlertCircle },
    { id: 'business', name: 'Negócios', icon: FileText },
    { id: 'partnership', name: 'Parceria', icon: Star }
  ]

  const priorities = [
    { id: 'low', name: 'Baixa', color: 'green' },
    { id: 'normal', name: 'Normal', color: 'blue' },
    { id: 'high', name: 'Alta', color: 'yellow' },
    { id: 'urgent', name: 'Urgente', color: 'red' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          type: 'general',
          priority: 'normal'
        })
        onFormSubmit?.(data.contact)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erro ao enviar mensagem')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      case 'normal':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
      case 'high':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
      case 'urgent':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Mensagem Enviada!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-3 bg-agro-emerald text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
        >
          Enviar Nova Mensagem
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Entre em Contato
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Envie sua mensagem e entraremos em contato o mais rápido possível.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações pessoais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome *
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
                placeholder="Seu nome completo"
              />
              <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
                placeholder="seu@email.com"
              />
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telefone
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
              placeholder="(11) 99999-9999"
            />
            <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Tipo de contato */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Contato
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {contactTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                className={`p-3 border-2 rounded-lg transition-colors ${
                  formData.type === type.id
                    ? 'border-agro-emerald bg-agro-emerald/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-center">
                  <type.icon className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {type.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Prioridade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prioridade
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {priorities.map((priority) => (
              <button
                key={priority.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priority: priority.id }))}
                className={`p-3 border-2 rounded-lg transition-colors ${
                  formData.priority === priority.id
                    ? 'border-agro-emerald bg-agro-emerald/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    priority.color === 'green' ? 'bg-green-500' :
                    priority.color === 'blue' ? 'bg-blue-500' :
                    priority.color === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {priority.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assunto *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent"
            placeholder="Resumo da sua mensagem"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mensagem *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agro-emerald focus:border-transparent resize-none"
            placeholder="Descreva sua mensagem em detalhes..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-agro-emerald text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Enviar Mensagem</span>
            </>
          )}
        </button>
      </form>

      {/* Informações de segurança */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
              Privacidade e Segurança
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Suas informações são protegidas e não serão compartilhadas com terceiros.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactForm