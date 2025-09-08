import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { usePayment } from '../contexts/PaymentContext'
import { useAuth } from '../contexts/AuthContext'
import {
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Package,
  User,
  ArrowRight,
  Search,
  Plus,
  Lock,
  CreditCard,
  Shield,
  CheckCircle,
  X
} from 'lucide-react'

const AgroConecta = () => {
  const [activeTab, setActiveTab] = useState('freights'); // 'freights' ou 'carriers'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFreight, setSelectedFreight] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showProposalModal, setShowProposalModal] = useState(false)
  const [proposalData, setProposalData] = useState({
    price: '',
    message: '',
    contactPhone: '',
    contactEmail: ''
  })

  const { hasAccessToPrivilegedInfo, processPaymentAndUnlock } = usePayment()
  const { user } = useAuth()

  // Dados mockados de fretes (em produção, viria da API)
  const freights = [
    {
      id: 1,
      title: 'Transporte de Soja - Sinop/MT para Santos/SP',
      origin: 'Sinop - MT',
      destination: 'Santos - SP',
      weight: 30000,
      weightUnit: 'kg',
      freightValue: 45000,
      currency: 'BRL',
      freightType: 'carga_completa',
      pickupDate: '2024-01-20',
      deliveryDate: '2024-01-25',
      description: 'Transporte de soja em grão, carga completa, caminhão graneleiro.',
      cargoType: 'Soja em grão',
      specialRequirements: ['Caminhão graneleiro', 'Seguro obrigatório'],
      status: 'active',
      views: 45,
      publishedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Fertilizantes - Cuiabá/MT para Rondonópolis/MT',
      origin: 'Cuiabá - MT',
      destination: 'Rondonópolis - MT',
      weight: 15000,
      weightUnit: 'kg',
      freightValue: 8500,
      currency: 'BRL',
      freightType: 'carga_fracionada',
      pickupDate: '2024-01-18',
      deliveryDate: '2024-01-19',
      description: 'Transporte de fertilizantes, carga fracionada, urgente.',
      cargoType: 'Fertilizantes',
      specialRequirements: ['Caminhão baú', 'Entrega urgente'],
      status: 'active',
      views: 23,
      publishedAt: '2024-01-16T14:30:00Z'
    },
    {
      id: 3,
      title: 'Milho - Sorriso/MT para Paranaguá/PR',
      origin: 'Sorriso - MT',
      destination: 'Paranaguá - PR',
      weight: 25000,
      weightUnit: 'kg',
      freightValue: 32000,
      currency: 'BRL',
      freightType: 'carga_completa',
      pickupDate: '2024-01-22',
      deliveryDate: '2024-01-28',
      description: 'Transporte de milho em grão para exportação.',
      cargoType: 'Milho em grão',
      specialRequirements: ['Caminhão graneleiro', 'Documentação de exportação'],
      status: 'active',
      views: 67,
      publishedAt: '2024-01-14T09:15:00Z'
    }
  ]

  const formatPrice = price => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(price)
  }

  const handleProposal = freight => {
    if (!user) {
      alert('Você precisa fazer login para enviar propostas.')
      return
    }

    // Verificar se tem acesso às informações privilegiadas
    if (!hasAccessToPrivilegedInfo('freight')) {
      setSelectedFreight(freight)
      setShowPaymentModal(true)
      return
    }

    setSelectedFreight(freight)
    setShowProposalModal(true)
  }

  const handleProposalSubmit = async () => {
    try {
      // Simular envio da proposta
      alert('Proposta enviada com sucesso! O anunciante será notificado.')
      setShowProposalModal(false)
      setProposalData({
        price: '',
        message: '',
        contactPhone: '',
        contactEmail: ''
      })
    } catch (error) {
      console.error('Erro ao enviar proposta:', error)
      alert('Erro ao enviar proposta. Tente novamente.')
    }
  }

  const handlePaymentSuccess = async () => {
    try {
      // Após pagamento bem-sucedido, liberar acesso
      await processPaymentAndUnlock({}, 'freight')
      setShowPaymentModal(false)

      // Agora permitir proposta
      if (selectedFreight) {
        setShowProposalModal(true)
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    }
  }

  return (
    <div className='bg-primary min-h-screen'>
      {/* Hero Section */}
      <section className='hero-section'>
        <div className='container-futuristic relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center text-white'
          >
            <h1 className='mb-6 text-5xl font-bold md:text-6xl'>
              <span className='text-yellow-300'>AgroConecta</span> Fretes
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-white/90'>
              Plataforma de intermediação de fretes agrícolas. Conectamos anunciantes de cargas com transportadores
              qualificados. <strong>Mais acessível que o Fretebrás!</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs de Navegação */}
      <section className='bg-secondary py-8'>
        <div className='container-futuristic'>
          <div className='mb-8 flex justify-center'>
            <div className='glass-card flex gap-2 p-2'>
              <button
                onClick={() => setActiveTab('freights')}
                className={`rounded-lg px-6 py-3 font-medium transition-all ${
                  activeTab === 'freights' ? 'bg-primary text-white' : 'text-muted hover:text-primary'
                }`}
              >
                <Truck size={20} className='mr-2 inline' />
                Fretes Disponíveis
              </button>
              <button
                onClick={() => setActiveTab('carriers')}
                className={`rounded-lg px-6 py-3 font-medium transition-all ${
                  activeTab === 'carriers' ? 'bg-primary text-white' : 'text-muted hover:text-primary'
                }`}
              >
                <User size={20} className='mr-2 inline' />
                Anunciar Frete
              </button>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <div className='mx-auto max-w-2xl'>
            <div className='relative'>
              <Search size={20} className='text-muted absolute left-4 top-1/2 -translate-y-1/2 transform' />
              <input
                type='text'
                placeholder='Buscar fretes por origem, destino ou tipo de carga...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='input-futuristic w-full pl-12 pr-4'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Fretes */}
      {activeTab === 'freights' && (
        <section className='bg-primary py-16'>
          <div className='container-futuristic'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-12 text-center'>
              <h2 className='text-primary mb-4 text-4xl font-bold'>
                Fretes <span className='text-gradient'>Disponíveis</span>
              </h2>
              <p className='text-secondary text-xl'>Encontre cargas para transportar e envie suas propostas</p>
            </motion.div>

            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3'>
              {freights.map(freight => (
                <motion.div
                  key={freight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className='glass-card p-6 transition-all duration-300 hover:shadow-2xl'
                >
                  <div className='mb-4 flex items-start justify-between'>
                    <div className='flex items-center gap-2'>
                      <Package size={20} className='text-primary' />
                      <span className='text-muted text-sm'>{freight.cargoType}</span>
                    </div>
                    <span className='text-muted text-xs'>{freight.views} visualizações</span>
                  </div>

                  <h3 className='text-primary mb-3 line-clamp-2 text-lg font-semibold'>{freight.title}</h3>

                  <div className='mb-4 space-y-3'>
                    <div className='flex items-center gap-2'>
                      <MapPin size={16} className='text-muted' />
                      <span className='text-secondary text-sm'>
                        {freight.origin} → {freight.destination}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Package size={16} className='text-muted' />
                      <span className='text-secondary text-sm'>
                        {freight.weight.toLocaleString()} {freight.weightUnit}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Clock size={16} className='text-muted' />
                      <span className='text-secondary text-sm'>
                        Coleta: {new Date(freight.pickupDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <DollarSign size={16} className='text-muted' />
                      <span className='text-primary text-lg font-bold'>{formatPrice(freight.freightValue)}</span>
                    </div>
                  </div>

                  <p className='text-muted mb-4 line-clamp-2 text-sm'>{freight.description}</p>

                  {freight.specialRequirements && (
                    <div className='mb-4'>
                      <div className='flex flex-wrap gap-1'>
                        {freight.specialRequirements.map((req, index) => (
                          <span key={index} className='bg-secondary/20 text-secondary rounded px-2 py-1 text-xs'>
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className='flex gap-3'>
                    <button
                      onClick={() => handleProposal(freight)}
                      className='btn-futuristic flex flex-1 items-center justify-center gap-2'
                    >
                      <ArrowRight size={16} />
                      Enviar Proposta
                    </button>
                    <button className='btn-secondary'>
                      <Plus size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seção para Anunciar Frete */}
      {activeTab === 'carriers' && (
        <section className='bg-primary py-16'>
          <div className='container-futuristic'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-12 text-center'>
              <h2 className='text-primary mb-4 text-4xl font-bold'>
                Anunciar <span className='text-gradient'>Frete</span>
              </h2>
              <p className='text-secondary text-xl'>
                Publique sua carga e receba propostas de transportadores qualificados
              </p>
            </motion.div>

            <div className='mx-auto max-w-4xl'>
              <div className='glass-card p-8'>
                <div className='text-center'>
                  <Truck size={64} className='text-primary mx-auto mb-4' />
                  <h3 className='text-primary mb-4 text-2xl font-bold'>Publique seu Frete</h3>
                  <p className='text-secondary mb-6'>
                    Preencha os dados da sua carga e receba propostas de transportadores
                  </p>
                  <button className='btn-futuristic mx-auto flex items-center gap-2'>
                    <Plus size={20} />
                    Criar Anúncio de Frete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modal de Pagamento */}
      {showPaymentModal && selectedFreight && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='glass-card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8'
          >
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-primary text-2xl font-bold'>Acesso às Informações Privilegiadas</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className='text-muted hover:text-primary transition-colors'
              >
                <X size={24} />
              </button>
            </div>

            <div className='bg-secondary/20 mb-6 rounded-lg p-4'>
              <h4 className='text-primary mb-2 font-semibold'>{selectedFreight.title}</h4>
              <div className='flex items-center justify-between'>
                <span className='text-primary text-2xl font-bold'>{formatPrice(selectedFreight.freightValue)}</span>
                <span className='text-secondary'>{selectedFreight.cargoType}</span>
              </div>
              <p className='text-muted mt-2 text-sm'>{selectedFreight.description}</p>
            </div>

            <div className='space-y-6'>
              <div className='bg-warning/10 border-warning/20 rounded-lg border p-4'>
                <div className='mb-2 flex items-center gap-3'>
                  <Lock size={20} className='text-warning' />
                  <span className='text-primary font-semibold'>Informações Restritas</span>
                </div>
                <p className='text-muted text-sm'>
                  Para acessar informações de contato do anunciante e enviar propostas, você precisa de um plano ativo.
                  Escolha um dos planos abaixo:
                </p>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='glass-card border-primary/20 border p-4'>
                  <h5 className='text-primary mb-2 font-semibold'>Plano Básico</h5>
                  <div className='text-primary mb-2 text-2xl font-bold'>R$ 39,90</div>
                  <ul className='text-muted mb-4 space-y-1 text-sm'>
                    <li>• Acesso a contatos de anunciantes</li>
                    <li>• Envio de propostas</li>
                    <li>• Suporte por email</li>
                    <li>• 10 propostas/mês</li>
                  </ul>
                  <button
                    onClick={handlePaymentSuccess}
                    className='btn-futuristic flex w-full items-center justify-center gap-2'
                  >
                    <CreditCard size={16} />
                    Assinar Plano Básico
                  </button>
                </div>

                <div className='glass-card border-success/20 border p-4'>
                  <h5 className='text-primary mb-2 font-semibold'>Plano Pro</h5>
                  <div className='text-primary mb-2 text-2xl font-bold'>R$ 79,90</div>
                  <ul className='text-muted mb-4 space-y-1 text-sm'>
                    <li>• Tudo do Plano Básico</li>
                    <li>• Propostas ilimitadas</li>
                    <li>• Suporte prioritário</li>
                    <li>• Relatórios avançados</li>
                    <li>• API de integração</li>
                  </ul>
                  <button
                    onClick={handlePaymentSuccess}
                    className='btn-futuristic flex w-full items-center justify-center gap-2'
                  >
                    <CreditCard size={16} />
                    Assinar Plano Pro
                  </button>
                </div>
              </div>

              <div className='bg-primary/10 rounded-lg p-4'>
                <div className='mb-2 flex items-center gap-3'>
                  <Shield size={20} className='text-success' />
                  <span className='text-primary font-semibold'>Garantia de Segurança</span>
                </div>
                <p className='text-muted text-sm'>
                  Pagamento 100% seguro via Stripe. Após o pagamento, você terá acesso imediato às informações
                  privilegiadas e poderá enviar propostas.
                </p>
              </div>

              <div className='flex gap-4'>
                <button type='button' onClick={() => setShowPaymentModal(false)} className='btn-secondary flex-1'>
                  Cancelar
                </button>
                <button
                  type='button'
                  onClick={() => window.open('/plans', '_blank')}
                  className='btn-futuristic flex flex-1 items-center justify-center gap-2'
                >
                  <ArrowRight size={16} />
                  Ver Todos os Planos
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Proposta */}
      {showProposalModal && selectedFreight && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='glass-card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8'
          >
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-primary text-2xl font-bold'>Enviar Proposta</h3>
              <button
                onClick={() => setShowProposalModal(false)}
                className='text-muted hover:text-primary transition-colors'
              >
                <X size={24} />
              </button>
            </div>

            <div className='bg-secondary/20 mb-6 rounded-lg p-4'>
              <h4 className='text-primary mb-2 font-semibold'>{selectedFreight.title}</h4>
              <div className='flex items-center justify-between'>
                <span className='text-primary text-2xl font-bold'>{formatPrice(selectedFreight.freightValue)}</span>
                <span className='text-secondary'>{selectedFreight.cargoType}</span>
              </div>
              <p className='text-muted mt-2 text-sm'>{selectedFreight.description}</p>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault()
                handleProposalSubmit()
              }}
              className='space-y-6'
            >
              <div>
                <label className='text-primary mb-2 block font-medium'>Sua Proposta de Preço *</label>
                <input
                  type='number'
                  value={proposalData.price}
                  onChange={e => setProposalData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  className='input-futuristic w-full'
                  placeholder='Digite sua proposta em reais'
                />
                <p className='text-muted mt-1 text-sm'>Valor do frete: {formatPrice(selectedFreight.freightValue)}</p>
              </div>

              <div>
                <label className='text-primary mb-2 block font-medium'>Telefone para Contato *</label>
                <input
                  type='tel'
                  value={proposalData.contactPhone}
                  onChange={e => setProposalData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  required
                  className='input-futuristic w-full'
                  placeholder='(66) 99999-9999'
                />
              </div>

              <div>
                <label className='text-primary mb-2 block font-medium'>Email para Contato</label>
                <input
                  type='email'
                  value={proposalData.contactEmail}
                  onChange={e => setProposalData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className='input-futuristic w-full'
                  placeholder='seu@email.com'
                />
              </div>

              <div>
                <label className='text-primary mb-2 block font-medium'>Mensagem Adicional</label>
                <textarea
                  value={proposalData.message}
                  onChange={e => setProposalData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className='input-futuristic w-full resize-none'
                  placeholder='Informações sobre sua proposta, experiência, veículo disponível...'
                />
              </div>

              <div className='bg-primary/10 rounded-lg p-4'>
                <div className='mb-2 flex items-center gap-3'>
                  <Shield size={20} className='text-success' />
                  <span className='text-primary font-semibold'>Proposta Segura</span>
                </div>
                <p className='text-muted text-sm'>
                  Sua proposta será enviada diretamente ao anunciante. Nossa equipe facilitará a negociação e garantirá
                  transparência total.
                </p>
              </div>

              <div className='flex gap-4'>
                <button type='button' onClick={() => setShowProposalModal(false)} className='btn-secondary flex-1'>
                  Cancelar
                </button>
                <button type='submit' className='btn-futuristic flex flex-1 items-center justify-center gap-2'>
                  <CheckCircle size={20} />
                  Enviar Proposta
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AgroConecta
