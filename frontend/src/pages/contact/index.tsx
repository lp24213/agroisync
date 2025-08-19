import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { useI18n } from '@/i18n/I18nProvider'
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  SparklesIcon,
  RocketLaunchIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const Contact: NextPage = () => {
  const { t } = useI18n();
  
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <EnvelopeIcon className="h-6 w-6 text-cyan-400" />,
      title: t('contact_info_email'),
      content: 'contato@agroisync.com',
      link: 'mailto:contato@agroisync.com',
      bgColor: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30'
    },
    {
      icon: <PhoneIcon className="h-6 w-6 text-blue-400" />,
      title: t('contact_info_phone'),
      content: '+55 (66) 99236-2830',
      link: 'tel:+5566992362830',
      bgColor: 'from-blue-500/20 to-purple-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      icon: <MapPinIcon className="h-6 w-6 text-purple-400" />,
      title: t('contact_info_address'),
      content: 'Mato Grosso, Brasil',
      link: '#',
      bgColor: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      icon: <ClockIcon className="h-6 w-6 text-pink-400" />,
      title: t('contact_info_hours'),
      content: 'Seg-Sex: 9h às 18h',
      link: '#',
      bgColor: 'from-pink-500/20 to-cyan-500/20',
      borderColor: 'border-pink-500/30'
    }
  ]

  return (
    <>
      <Head>
        <title>{t('contact_title')} - {t('app_name')}</title>
        <meta name="description" content={t('contact_subtitle')} />
      </Head>

      <div className="min-h-screen cosmic-background text-white relative overflow-hidden">
        {/* Efeitos cósmicos de fundo */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Nebulosas flutuantes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-full blur-3xl animate-nebula-drift"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-full blur-3xl animate-nebula-drift animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-full blur-3xl animate-nebula-drift animation-delay-4000"></div>
          
          {/* Portais quânticos */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full animate-quantum-orbital"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full animate-quantum-orbital animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-full animate-quantum-orbital animation-delay-4000"></div>
          
          {/* Ondas de energia cósmica */}
          <div className="absolute top-1/2 left-0 w-64 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-cosmic-wave"></div>
          <div className="absolute bottom-1/3 right-0 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-cosmic-wave animation-delay-2000"></div>
          
          {/* Estrelas cintilantes */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-sparkle animation-delay-100"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-cyan-400 rounded-full animate-sparkle animation-delay-2000"></div>
          <div className="absolute bottom-40 left-40 w-1.5 h-1.5 bg-blue-400 rounded-full animate-sparkle animation-delay-3000"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-sparkle animation-delay-4000"></div>
          
          {/* Partículas flutuantes */}
          <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-cyan-400/60 rounded-full animate-cosmic-float"></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-400/60 rounded-full animate-cosmic-float animation-delay-1500"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-purple-400/60 rounded-full animate-cosmic-float animation-delay-3000"></div>
        </div>

        {/* Header Section */}
        <section className="relative py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full px-6 py-3 mb-8 animate-fade-in">
                <SparklesIcon className="h-5 w-5 text-cyan-400 animate-sparkle" />
                <span className="text-cyan-400 font-semibold text-sm">🌟 {t('contact_title')}</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-cosmic-glow mb-6 animate-fade-in animation-delay-300">
                {t('contact_title')}
              </h1>
              <p className="text-2xl text-purple-silver max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-600">
                {t('contact_subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-16 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <div className="cosmic-card p-8">
                  <h2 className="text-3xl font-bold text-cosmic-glow mb-8 flex items-center">
                    <RocketLaunchIcon className="h-8 w-8 mr-3 text-cyan-400 animate-pulse" />
                    {t('contact_form_title')}
                  </h2>
                  
                  {success ? (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-cosmic-glow mb-4">{t('contact_form_success')}</h3>
                      <p className="text-purple-silver mb-6 text-lg">
                        {t('contact_form_success_message')}
                      </p>
                      <button 
                        onClick={() => setSuccess(false)}
                        className="cosmic-button px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-300"
                      >
                        {t('contact_form_send')}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-bold text-cyan-400 mb-3">
                            {t('contact_form_name')} *
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={t('contact_form_name')}
                            className="cosmic-input w-full"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-bold text-cyan-400 mb-3">
                            {t('contact_form_email')} *
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={t('contact_form_email')}
                            className="cosmic-input w-full"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-bold text-cyan-400 mb-3">
                          {t('contact_form_subject')} *
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder={t('contact_form_subject')}
                          className="cosmic-input w-full"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-bold text-cyan-400 mb-3">
                          {t('contact_form_message')} *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder={t('contact_form_message')}
                          className="cosmic-input w-full resize-none"
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="cosmic-button w-full py-4 text-lg font-bold hover:scale-105 transition-transform duration-300"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>{t('contact_form_sending')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <RocketLaunchIcon className="h-5 w-5" />
                            <span>{t('contact_form_send')}</span>
                          </div>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-cosmic-glow mb-6 flex items-center">
                    <GlobeAltIcon className="h-8 w-8 mr-3 text-blue-400 animate-pulse" />
                    {t('contact_info_title')}
                  </h2>
                  <p className="text-purple-silver text-lg mb-8 leading-relaxed">
                    {t('contact_subtitle')}
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className={`cosmic-card p-6 group hover:scale-105 transition-all duration-500 hover-cosmic-pulse`}>
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${info.bgColor} border ${info.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                          {info.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-cosmic-glow mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                            {info.title}
                          </h3>
                          {info.link !== '#' ? (
                            <a
                              href={info.link}
                              className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-medium"
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-purple-silver text-lg">{info.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ Section */}
                <div className="cosmic-card p-6">
                  <h3 className="text-xl font-bold text-cosmic-glow mb-6 flex items-center">
                    <StarIcon className="h-6 w-6 mr-3 text-yellow-400 animate-pulse" />
                    {t('contact_faq_title')}
                  </h3>
                  <div className="space-y-4">
                    <div className="border-b border-cyan-500/20 pb-4">
                      <h4 className="font-bold text-cyan-400 mb-2">
                        {t('contact_faq_q1')}
                      </h4>
                      <p className="text-purple-silver text-sm leading-relaxed">
                        {t('contact_faq_a1')}
                      </p>
                    </div>
                    
                    <div className="border-b border-cyan-500/20 pb-4">
                      <h4 className="font-bold text-cyan-400 mb-2">
                        {t('contact_faq_q2')}
                      </h4>
                      <p className="text-purple-silver text-sm leading-relaxed">
                        {t('contact_faq_a2')}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-cyan-400 mb-2">
                        {t('contact_faq_q3')}
                      </h4>
                      <p className="text-purple-silver text-sm leading-relaxed">
                        {t('contact_faq_a3')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cosmic-glow mb-4 flex items-center justify-center">
                <MapPinIcon className="h-8 w-8 mr-3 text-purple-400 animate-pulse" />
                {t('contact_location_title')}
              </h2>
              <p className="text-purple-silver text-lg">
                {t('contact_location_subtitle')}
              </p>
            </div>
            
            <div className="cosmic-card p-8">
              <div className="bg-gradient-to-br from-cyan-950 via-blue-950 to-purple-950 rounded-2xl h-96 flex items-center justify-center border border-cyan-500/20 relative overflow-hidden">
                {/* Efeitos de fundo cósmicos */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-cosmic-pulse"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl animate-float"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-float animation-delay-2000"></div>
                
                <div className="text-center relative z-10">
                  <MapPinIcon className="h-20 w-20 text-cyan-400 mx-auto mb-6 animate-pulse" />
                  <p className="text-cyan-400 text-2xl font-bold mb-2">{t('contact_map_title')}</p>
                  <p className="text-purple-silver text-lg mb-4">{t('contact_map_status')}</p>
                  <p className="text-purple-silver/70 text-sm">{t('contact_map_integration')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-cosmic-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-cosmic-pulse animation-delay-2000"></div>
          </div>
          
          {/* Portais quânticos flutuantes */}
          <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full animate-quantum-orbital"></div>
          <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full animate-quantum-orbital animation-delay-3000"></div>
          
          <div className="relative z-10 mx-auto max-w-5xl text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-black text-white mb-6 text-glow">
              {t('contact_cta_title')}
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('contact_cta_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="cosmic-button px-10 py-4 text-xl font-bold hover:scale-105 transition-transform duration-300">
                <span className="flex items-center space-x-3">
                  <RocketLaunchIcon className="h-6 w-6" />
                  <span>{t('contact_cta_create_account')}</span>
                </span>
              </button>
              <button className="border-2 border-white text-white px-10 py-4 text-xl font-bold hover:bg-white hover:text-black transition-all duration-500 hover:scale-105 transform relative overflow-hidden hover-float">
                <span className="relative z-10">{t('contact_cta_learn_more')}</span>
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Contact
