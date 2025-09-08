import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Clock, User, Building } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envio do formulário
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      })
    }, 2000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contato@agroisync.com',
      link: 'mailto:contato@agroisync.com',
      description: 'Envie-nos um email e responderemos em até 24 horas'
    },
    {
      icon: Phone,
      title: 'Telefone/WhatsApp',
      value: '(66) 99236-2830',
      link: 'https://wa.me/5566992362830',
      description: 'Ligue ou envie uma mensagem no WhatsApp'
    },
    {
      icon: MapPin,
      title: 'Localização',
      value: 'Sinop - MT, Brasil',
      link: '#',
      description: 'Nossa sede está localizada no coração do agronegócio brasileiro'
    }
  ]

  const subjects = [
    'Suporte Técnico',
    'Vendas e Comercial',
    'Parcerias',
    'Imprensa e Mídia',
    'Trabalhe Conosco',
    'Outros'
  ]

  return (
    <div className='bg-white min-h-screen'>
      {/* Hero Section */}
      <section className='bg-gray-50 py-24'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center text-gray-900'
          >
            <h1 className='heading-1 mb-8'>
              Entre em <span className='text-gray-700'>Contato</span>
            </h1>
            <p className='subtitle mx-auto mb-8 max-w-3xl text-gray-600'>
              Estamos aqui para ajudar! Entre em contato conosco através do formulário abaixo ou use nossos canais
              diretos de comunicação.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className='bg-white py-20'>
        <div className='container-futuristic'>
          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-3'>
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='glass-card p-8 text-center'
              >
                <div className='bg-primary-gradient mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl'>
                  <info.icon size={32} className='text-white' />
                </div>
                <h3 className='text-primary mb-4 text-xl font-bold'>{info.title}</h3>
                <a
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : '_self'}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  className='text-secondary hover:text-primary mb-3 block transition-colors'
                >
                  {info.value}
                </a>
                <p className='text-muted text-sm'>{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className='bg-gray-50 py-20'>
        <div className='container-futuristic'>
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className='glass-card p-8'>
                <h2 className='mb-6 text-3xl font-bold text-white'>
                  Envie sua <span className='text-yellow-300'>Mensagem</span>
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='py-12 text-center'
                  >
                    <div className='bg-success-gradient mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
                      <CheckCircle size={40} className='text-white' />
                    </div>
                    <h3 className='mb-4 text-2xl font-bold text-white'>Mensagem Enviada!</h3>
                    <p className='mb-6 text-white/80'>Obrigado pelo seu contato. Responderemos em breve!</p>
                    <button onClick={() => setIsSubmitted(false)} className='btn-futuristic'>
                      Enviar Nova Mensagem
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block font-medium text-white'>Nome Completo *</label>
                        <div className='relative'>
                          <User size={20} className='text-muted absolute left-3 top-1/2 -translate-y-1/2 transform' />
                          <input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className='input-futuristic pl-10'
                            placeholder='Seu nome completo'
                          />
                        </div>
                      </div>

                      <div>
                        <label className='mb-2 block font-medium text-white'>Email *</label>
                        <div className='relative'>
                          <Mail size={20} className='text-muted absolute left-3 top-1/2 -translate-y-1/2 transform' />
                          <input
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className='input-futuristic pl-10'
                            placeholder='seu@email.com'
                          />
                        </div>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div>
                        <label className='mb-2 block font-medium text-white'>Telefone</label>
                        <div className='relative'>
                          <Phone size={20} className='text-muted absolute left-3 top-1/2 -translate-y-1/2 transform' />
                          <input
                            type='tel'
                            name='phone'
                            value={formData.phone}
                            onChange={handleInputChange}
                            className='input-futuristic pl-10'
                            placeholder='(66) 99999-9999'
                          />
                        </div>
                      </div>

                      <div>
                        <label className='mb-2 block font-medium text-white'>Empresa</label>
                        <div className='relative'>
                          <Building
                            size={20}
                            className='text-muted absolute left-3 top-1/2 -translate-y-1/2 transform'
                          />
                          <input
                            type='text'
                            name='company'
                            value={formData.company}
                            onChange={handleInputChange}
                            className='input-futuristic pl-10'
                            placeholder='Nome da sua empresa'
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className='mb-2 block font-medium text-white'>Assunto *</label>
                      <select
                        name='subject'
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className='input-futuristic'
                      >
                        <option value=''>Selecione um assunto</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='mb-2 block font-medium text-white'>Mensagem *</label>
                      <div className='relative'>
                        <MessageSquare size={20} className='text-muted absolute left-3 top-3' />
                        <textarea
                          name='message'
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className='input-futuristic resize-none pl-10'
                          placeholder='Descreva sua mensagem aqui...'
                        />
                      </div>
                    </div>

                    <motion.button
                      type='submit'
                      disabled={isSubmitting}
                      className='btn-futuristic flex w-full items-center justify-center gap-2'
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className='h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Enviar Mensagem
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              {/* Business Hours */}
              <div className='glass-card p-8'>
                <div className='mb-6 flex items-center gap-3'>
                  <div className='bg-primary-gradient flex h-12 w-12 items-center justify-center rounded-lg'>
                    <Clock size={24} className='text-white' />
                  </div>
                  <h3 className='text-2xl font-bold text-white'>Horário de Funcionamento</h3>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-secondary'>Segunda - Sexta</span>
                    <span className='font-medium text-white'>08:00 - 18:00</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-secondary'>Sábado</span>
                    <span className='font-medium text-white'>09:00 - 14:00</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-secondary'>Domingo</span>
                    <span className='font-medium text-white'>Fechado</span>
                  </div>
                </div>

                <div className='bg-primary/10 mt-6 rounded-lg p-4'>
                  <p className='text-sm text-white/80'>
                    <strong>Suporte 24/7:</strong> Para emergências técnicas, nosso suporte está disponível 24 horas por
                    dia.
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className='glass-card p-8'>
                <h3 className='mb-6 text-2xl font-bold text-white'>Nossa Localização</h3>
                <div className='bg-secondary flex h-64 items-center justify-center rounded-lg'>
                  <div className='text-center'>
                    <MapPin size={48} className='text-primary mx-auto mb-4' />
                    <p className='text-secondary font-medium'>Sinop - MT, Brasil</p>
                    <p className='text-muted mt-2 text-sm'>Mapa interativo será implementado aqui</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className='glass-card p-8'>
                <h3 className='mb-6 text-2xl font-bold text-white'>Contato Rápido</h3>
                <div className='space-y-4'>
                  <a
                    href='https://wa.me/5566992362830'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='bg-success/10 hover:bg-success/20 flex items-center gap-3 rounded-lg p-4 transition-colors'
                  >
                    <Phone size={20} className='text-success' />
                    <span className='text-white'>WhatsApp: (66) 99236-2830</span>
                  </a>

                  <a
                    href='mailto:contato@agroisync.com'
                    className='bg-primary/10 hover:bg-primary/20 flex items-center gap-3 rounded-lg p-4 transition-colors'
                  >
                    <Mail size={20} className='text-primary' />
                    <span className='text-white'>contato@agroisync.com</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
