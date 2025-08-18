import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const Contact: NextPage = () => {
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
      icon: <EnvelopeIcon className="h-6 w-6 text-green-600" />,
      title: 'Email',
      content: 'contato@agroisync.com',
      link: 'mailto:contato@agroisync.com'
    },
    {
      icon: <PhoneIcon className="h-6 w-6 text-blue-600" />,
      title: 'Telefone',
      content: '+55 (11) 99999-9999',
      link: 'tel:+5511999999999'
    },
    {
      icon: <MapPinIcon className="h-6 w-6 text-purple-600" />,
      title: 'Endereço',
      content: 'São Paulo, SP - Brasil',
      link: '#'
    },
    {
      icon: <ClockIcon className="h-6 w-6 text-orange-600" />,
      title: 'Horário de Atendimento',
      content: 'Seg-Sex: 9h às 18h',
      link: '#'
    }
  ]

  return (
    <>
      <Head>
        <title>Contato - AgroSync</title>
        <meta name="description" content="Entre em contato com a equipe AgroSync" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white shadow-sm border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Entre em Contato
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tem alguma dúvida ou sugestão? Nossa equipe está pronta para ajudar você
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card>
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie sua Mensagem</h2>
                    
                    {success ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mensagem Enviada!</h3>
                        <p className="text-gray-600 mb-4">
                          Obrigado por entrar em contato. Retornaremos em breve.
                        </p>
                        <Button onClick={() => setSuccess(false)}>
                          Enviar Nova Mensagem
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                              Nome Completo *
                            </label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Seu nome completo"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                              Email *
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="seu@email.com"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                            Assunto *
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Assunto da mensagem"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Mensagem *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={6}
                            required
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Descreva sua dúvida ou sugestão..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                          />
                        </div>
                        
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={loading}
                        >
                          {loading ? 'Enviando...' : 'Enviar Mensagem'}
                        </Button>
                      </form>
                    )}
                  </div>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações de Contato</h2>
                  <p className="text-gray-600 mb-8">
                    Nossa equipe está sempre disponível para ajudar. Entre em contato conosco através dos canais abaixo ou preencha o formulário ao lado.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {info.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {info.title}
                            </h3>
                            {info.link !== '#' ? (
                              <a
                                href={info.link}
                                className="text-green-600 hover:text-green-700 transition-colors"
                              >
                                {info.content}
                              </a>
                            ) : (
                              <p className="text-gray-600">{info.content}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* FAQ Section */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Perguntas Frequentes</h3>
                    <div className="space-y-3">
                      <div className="border-b border-gray-200 pb-3">
                        <h4 className="font-medium text-gray-900 mb-1">
                          Como funciona o sistema de staking?
                        </h4>
                        <p className="text-sm text-gray-600">
                          O sistema de gestão permite que você controle suas operações agrícolas e acompanhe o desempenho da sua propriedade.
                        </p>
                      </div>
                      
                      <div className="border-b border-gray-200 pb-3">
                        <h4 className="font-medium text-gray-900 mb-1">
                          Posso cadastrar qualquer propriedade rural?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Sim, desde que você seja o proprietário legítimo e tenha a documentação necessária para comprovar a propriedade.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          A plataforma é segura?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Sim, utilizamos as mais avançadas tecnologias de segurança e criptografia para proteger seus dados.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nossa Localização</h2>
              <p className="text-gray-600">
                Visite nossa sede em São Paulo ou entre em contato remotamente
              </p>
            </div>
            
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Mapa será implementado</p>
                <p className="text-gray-400 text-sm">Integração com Google Maps</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Junte-se à revolução agrícola digital e transforme seus ativos rurais em oportunidades de investimento
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="bg-white text-green-600 hover:bg-gray-50">
                Criar Conta
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                Saiba Mais
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Contact
