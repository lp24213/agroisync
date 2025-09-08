import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { usePayment } from '../contexts/PaymentContext'
import { useAuth } from '../contexts/AuthContext'
import {
  Search,
  Grid,
  List,
  Star,
  Heart,
  Truck,
  Package,
  TrendingUp,
  MapPin,
  User,
  ArrowRight,
  CheckCircle,
  Shield,
  X,
  Lock,
  CreditCard
} from 'lucide-react'

const Store = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showIntermediation, setShowIntermediation] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [intermediationData, setIntermediationData] = useState({
    quantity: '',
    message: '',
    contactPhone: '',
    contactEmail: ''
  })
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const { hasAccessToPrivilegedInfo, processPaymentAndUnlock } = usePayment()
  const { user } = useAuth()

  const categories = [
    { id: 'all', name: 'Todos os Produtos', icon: Package },
    { id: 'grains', name: 'Grãos', icon: Package },
    { id: 'machinery', name: 'Maquinário', icon: Truck },
    { id: 'inputs', name: 'Insumos', icon: Package },
    { id: 'services', name: 'Serviços', icon: TrendingUp }
  ]

  const products = [
    {
      id: 1,
      name: 'Soja Premium - Safra 2024',
      category: 'grains',
      price: 185.5,
      unit: 'R$/sc',
      location: 'Sorriso - MT',
      seller: 'Fazenda São José',
      rating: 4.8,
      reviews: 124,
      image: '🌾',
      description: 'Soja de alta qualidade, certificada e pronta para exportação',
      quantity: 5000,
      available: true,
      featured: true
    },
    {
      id: 2,
      name: 'Trator John Deere 6110J',
      category: 'machinery',
      price: 285000,
      unit: 'R$',
      location: 'Campo Grande - MS',
      seller: 'Agro Máquinas',
      rating: 4.9,
      reviews: 89,
      image: '🚜',
      description: 'Trator 0km com garantia de 2 anos e assistência técnica',
      quantity: 1,
      available: true,
      featured: true
    },
    {
      id: 3,
      name: 'Milho Híbrido Pioneer',
      category: 'grains',
      price: 89.75,
      unit: 'R$/sc',
      location: 'Lucas do Rio Verde - MT',
      seller: 'Cooperativa Agro Norte',
      rating: 4.7,
      reviews: 203,
      image: '🌽',
      description: 'Sementes de milho híbrido de alta produtividade',
      quantity: 2000,
      available: true,
      featured: false
    },
    {
      id: 4,
      name: 'Fertilizante NPK 20-10-10',
      category: 'inputs',
      price: 1250,
      unit: 'R$/ton',
      location: 'Rondonópolis - MT',
      seller: 'Agro Fertilizantes',
      rating: 4.6,
      reviews: 156,
      image: '🌱',
      description: 'Fertilizante balanceado para diversas culturas',
      quantity: 100,
      available: true,
      featured: false
    },
    {
      id: 5,
      name: 'Serviço de Colheita Mecanizada',
      category: 'services',
      price: 45,
      unit: 'R$/ha',
      location: 'Sinop - MT',
      seller: 'Agro Serviços Premium',
      rating: 4.9,
      reviews: 67,
      image: '⚙️',
      description: 'Colheita mecanizada com equipamentos modernos',
      quantity: 1000,
      available: true,
      featured: true
    },
    {
      id: 6,
      name: 'Algodão Premium',
      category: 'grains',
      price: 4.25,
      unit: 'R$/kg',
      location: 'Chapadão do Sul - MS',
      seller: 'Fazenda Algodão Dourado',
      rating: 4.5,
      reviews: 98,
      image: '☁️',
      description: 'Algodão de fibra longa, ideal para exportação',
      quantity: 15000,
      available: true,
      featured: false
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatPrice = price => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(price)
  }

  const handleIntermediation = product => {
    if (!user) {
      alert('Você precisa fazer login para solicitar intermediação.')
      return
    }

    // Verificar se tem acesso às informações privilegiadas
    if (!hasAccessToPrivilegedInfo('product')) {
      setSelectedProduct(product)
      setShowPaymentModal(true)
      return
    }

    setSelectedProduct(product)
    setShowIntermediation(true)
  }

  const handleIntermediationSubmit = async () => {
    try {
      // Simular envio da solicitação de intermediação
      alert('Solicitação de intermediação enviada! O vendedor será notificado e entrará em contato em breve.')
      setShowIntermediation(false)
      setIntermediationData({
        quantity: '',
        message: '',
        contactPhone: '',
        contactEmail: ''
      })
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error)
      alert('Erro ao enviar solicitação. Tente novamente.')
    }
  }

  const handleContactSeller = product => {
    if (!user) {
      alert('Você precisa fazer login para contatar o vendedor.')
      return
    }

    // Verificar se tem acesso às informações privilegiadas
    if (!hasAccessToPrivilegedInfo('product')) {
      setSelectedProduct(product)
      setShowPaymentModal(true)
      return
    }

    // Abrir WhatsApp ou email direto com o vendedor
    const message = `Olá! Tenho interesse no produto: ${product.name}`
    const whatsappUrl = `https://wa.me/5566992362830?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handlePaymentSuccess = async () => {
    try {
      // Após pagamento bem-sucedido, liberar acesso
      await processPaymentAndUnlock({}, 'product')
      setShowPaymentModal(false)

      // Agora permitir intermediação
      if (selectedProduct) {
        setShowIntermediation(true)
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    }
  }

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
              Loja <span className='text-gray-700'>Agroisync</span>
            </h1>
            <p className='subtitle mx-auto mb-8 max-w-3xl text-gray-600'>
              Plataforma de intermediação inteligente. Conectamos produtores, compradores e fornecedores do agronegócio
              com segurança total e transparência.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className='bg-white py-12'>
        <div className='container-futuristic'>
          <div className='card-futuristic p-6'>
            <div className='flex flex-col items-center gap-6 lg:flex-row'>
              {/* Search */}
              <div className='relative flex-1'>
                <Search size={20} className='text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 transform' />
                <input
                  type='text'
                  placeholder='Buscar produtos, serviços ou fornecedores...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='input-futuristic w-full pl-10'
                />
              </div>

              {/* Category Filter */}
              <div className='flex flex-wrap gap-2'>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    <category.icon size={16} />
                    {category.name}
                  </button>
                ))}
              </div>

              {/* View Mode */}
              <div className='flex gap-2'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className='bg-gray-50 py-20'>
        <div className='container-futuristic'>
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='heading-3 text-gray-900'>Produtos Disponíveis ({filteredProducts.length})</h2>
            <div className='flex items-center gap-4'>
              <span className='text-gray-600'>Ordenar por:</span>
              <select className='input-futuristic'>
                <option>Relevância</option>
                <option>Preço: Menor para Maior</option>
                <option>Preço: Maior para Menor</option>
                <option>Avaliação</option>
                <option>Mais Recentes</option>
              </select>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='card-futuristic group relative p-6 transition-all duration-300 hover:shadow-medium'
                >
                  {product.featured && (
                    <div className='bg-gray-900 absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-semibold text-white'>
                      Destaque
                    </div>
                  )}

                  <div className='mb-4 flex items-start justify-between'>
                    <div className='text-4xl'>{product.image}</div>
                    <button className='text-gray-400 hover:text-gray-600 p-2 transition-colors'>
                      <Heart size={20} />
                    </button>
                  </div>

                  <h3 className='heading-4 mb-2 text-gray-900 group-hover:text-gray-700 transition-colors'>
                    {product.name}
                  </h3>

                  <p className='body-text mb-4 text-gray-600 line-clamp-2'>{product.description}</p>

                  <div className='mb-4 flex items-center gap-2'>
                    <div className='flex items-center gap-1'>
                      <Star size={16} className='text-yellow-500 fill-current' />
                      <span className='text-gray-900 text-sm font-medium'>{product.rating}</span>
                    </div>
                    <span className='text-gray-500 text-sm'>({product.reviews} avaliações)</span>
                  </div>

                  <div className='text-gray-500 mb-4 flex items-center gap-2 text-sm'>
                    <MapPin size={16} />
                    <span>{product.location}</span>
                  </div>

                  <div className='text-gray-500 mb-4 flex items-center gap-2 text-sm'>
                    <User size={16} />
                    <span>{product.seller}</span>
                  </div>

                  <div className='mb-6 flex items-center justify-between'>
                    <div>
                      <div className='text-gray-900 text-2xl font-bold'>{formatPrice(product.price)}</div>
                      <div className='text-gray-500 text-sm'>{product.unit}</div>
                    </div>
                    <div className='text-right'>
                      <div className='text-gray-500 text-sm'>Disponível:</div>
                      <div className='text-gray-900 font-medium'>{product.quantity.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <button
                      onClick={() => handleContactSeller(product)}
                      className='btn-secondary flex flex-1 items-center justify-center gap-2'
                    >
                      <User size={16} />
                      Contatar Vendedor
                    </button>
                    <button
                      onClick={() => handleIntermediation(product)}
                      className='btn-primary flex items-center justify-center gap-2'
                    >
                      Solicitar Intermediação
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='space-y-6'>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='card-futuristic p-6'
                >
                  <div className='flex gap-6'>
                    <div className='text-6xl'>{product.image}</div>

                    <div className='flex-1'>
                      <div className='mb-4 flex items-start justify-between'>
                        <div>
                          <h3 className='heading-4 mb-2 text-gray-900'>{product.name}</h3>
                          <p className='body-text mb-4 text-gray-600'>{product.description}</p>
                        </div>
                        {product.featured && (
                          <div className='bg-gray-900 rounded-full px-3 py-1 text-sm font-semibold text-white'>
                            Destaque
                          </div>
                        )}
                      </div>

                      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
                        <div className='text-gray-500 flex items-center gap-2'>
                          <MapPin size={16} />
                          <span>{product.location}</span>
                        </div>
                        <div className='text-gray-500 flex items-center gap-2'>
                          <User size={16} />
                          <span>{product.seller}</span>
                        </div>
                        <div className='text-gray-500 flex items-center gap-2'>
                          <Star size={16} className='text-yellow-500 fill-current' />
                          <span>
                            {product.rating} ({product.reviews} avaliações)
                          </span>
                        </div>
                        <div className='text-gray-500 flex items-center gap-2'>
                          <Package size={16} />
                          <span>{product.quantity.toLocaleString()} disponíveis</span>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <div className='text-gray-900 text-3xl font-bold'>{formatPrice(product.price)}</div>
                          <div className='text-gray-500 text-sm'>{product.unit}</div>
                        </div>

                        <div className='flex gap-3'>
                          <button className='btn-secondary flex items-center gap-2'>
                            <Heart size={16} />
                            Favoritar
                          </button>
                          <button
                            onClick={() => handleContactSeller(product)}
                            className='btn-secondary flex items-center gap-2'
                          >
                            <User size={16} />
                            Contatar Vendedor
                          </button>
                          <button
                            onClick={() => handleIntermediation(product)}
                            className='btn-primary flex items-center gap-2'
                          >
                            Solicitar Intermediação
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-white py-20'>
        <div className='container-futuristic'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='heading-2 mb-6 text-gray-900'>
              Por que escolher nossa <span className='text-gray-700'>Intermediação</span>?
            </h2>
            <p className='subtitle mx-auto max-w-3xl text-gray-600'>
              Conectamos compradores e vendedores com segurança total e transparência
            </p>
          </motion.div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className='card-futuristic p-8 text-center transition-all duration-300 hover:shadow-medium'
            >
              <div className='bg-gray-100 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl'>
                <CheckCircle size={32} className='text-gray-700' />
              </div>
              <h3 className='heading-4 mb-4 text-gray-900'>Intermediação Segura</h3>
              <p className='body-text text-gray-600'>
                Garantimos a segurança de todas as transações com proteção completa para compradores e vendedores.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className='card-futuristic p-8 text-center transition-all duration-300 hover:shadow-medium'
            >
              <div className='bg-gray-100 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl'>
                <TrendingUp size={32} className='text-gray-700' />
              </div>
              <h3 className='heading-4 mb-4 text-gray-900'>Preços Competitivos</h3>
              <p className='body-text text-gray-600'>
                Conectamos você aos melhores preços do mercado com transparência total e sem taxas ocultas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className='card-futuristic p-8 text-center transition-all duration-300 hover:shadow-medium'
            >
              <div className='bg-gray-100 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl'>
                <Truck size={32} className='text-gray-700' />
              </div>
              <h3 className='heading-4 mb-4 text-gray-900'>Logística Integrada</h3>
              <p className='body-text text-gray-600'>
                Soluções completas de transporte e logística para garantir a entrega segura dos seus produtos.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-gray-900 py-20'>
        <div className='container-futuristic text-center'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='heading-2 mb-6 text-white'>
              Pronto para <span className='text-gray-300'>Comercializar</span>?
            </h2>
            <p className='subtitle mx-auto mb-8 max-w-2xl text-gray-300'>
              Cadastre-se gratuitamente e comece a vender ou comprar produtos do agronegócio com segurança total
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <motion.a
                href='/cadastro'
                className='btn-primary flex items-center justify-center gap-2 px-8 py-4 text-lg'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cadastrar-se Gratuitamente
                <ArrowRight size={20} />
              </motion.a>
              <motion.a
                href='/contato'
                className='btn-secondary px-8 py-4 text-lg'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Falar com Especialista
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal de Pagamento */}
      {showPaymentModal && selectedProduct && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='card-futuristic max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8'
          >
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='heading-3 text-gray-900'>Acesso às Informações Privilegiadas</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <X size={24} />
              </button>
            </div>

            <div className='bg-secondary/20 mb-6 rounded-lg p-4'>
              <h4 className='text-primary mb-2 font-semibold'>{selectedProduct.name}</h4>
              <div className='flex items-center justify-between'>
                <span className='text-primary text-2xl font-bold'>{formatPrice(selectedProduct.price)}</span>
                <span className='text-secondary'>{selectedProduct.unit}</span>
              </div>
              <p className='text-muted mt-2 text-sm'>{selectedProduct.description}</p>
            </div>

            <div className='space-y-6'>
              <div className='bg-warning/10 border-warning/20 rounded-lg border p-4'>
                <div className='mb-2 flex items-center gap-3'>
                  <Lock size={20} className='text-warning' />
                  <span className='text-primary font-semibold'>Informações Restritas</span>
                </div>
                <p className='text-muted text-sm'>
                  Para acessar informações de contato do vendedor e solicitar intermediação, você precisa de um plano
                  ativo. Escolha um dos planos abaixo:
                </p>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='glass-card border-primary/20 border p-4'>
                  <h5 className='text-primary mb-2 font-semibold'>Plano Básico</h5>
                  <div className='text-primary mb-2 text-2xl font-bold'>R$ 49,90</div>
                  <ul className='text-muted mb-4 space-y-1 text-sm'>
                    <li>• Acesso a contatos de vendedores</li>
                    <li>• Solicitações de intermediação</li>
                    <li>• Suporte por email</li>
                    <li>• 5 intermediações/mês</li>
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
                  <div className='text-primary mb-2 text-2xl font-bold'>R$ 99,90</div>
                  <ul className='text-muted mb-4 space-y-1 text-sm'>
                    <li>• Tudo do Plano Básico</li>
                    <li>• Intermediações ilimitadas</li>
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
                  privilegiadas e poderá solicitar intermediações.
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

      {/* Modal de Intermediação */}
      {showIntermediation && selectedProduct && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='glass-card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8'
          >
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-primary text-2xl font-bold'>Solicitar Intermediação</h3>
              <button
                onClick={() => setShowIntermediation(false)}
                className='text-muted hover:text-primary transition-colors'
              >
                <X size={24} />
              </button>
            </div>

            <div className='bg-secondary/20 mb-6 rounded-lg p-4'>
              <h4 className='text-primary mb-2 font-semibold'>{selectedProduct.name}</h4>
              <div className='flex items-center justify-between'>
                <span className='text-primary text-2xl font-bold'>{formatPrice(selectedProduct.price)}</span>
                <span className='text-secondary'>{selectedProduct.unit}</span>
              </div>
              <p className='text-muted mt-2 text-sm'>{selectedProduct.description}</p>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault()
                handleIntermediationSubmit()
              }}
              className='space-y-6'
            >
              <div>
                <label className='text-primary mb-2 block font-medium'>Quantidade Desejada *</label>
                <input
                  type='number'
                  value={intermediationData.quantity}
                  onChange={e => setIntermediationData(prev => ({ ...prev, quantity: e.target.value }))}
                  required
                  className='input-futuristic w-full'
                  placeholder='Digite a quantidade desejada'
                />
                <p className='text-muted mt-1 text-sm'>
                  Disponível: {selectedProduct.quantity.toLocaleString()} {selectedProduct.unit}
                </p>
              </div>

              <div>
                <label className='text-primary mb-2 block font-medium'>Telefone para Contato *</label>
                <input
                  type='tel'
                  value={intermediationData.contactPhone}
                  onChange={e => setIntermediationData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  required
                  className='input-futuristic w-full'
                  placeholder='(66) 99999-9999'
                />
              </div>

              <div>
                <label className='text-primary mb-2 block font-medium'>Email para Contato</label>
                <input
                  type='email'
                  value={intermediationData.contactEmail}
                  onChange={e => setIntermediationData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className='input-futuristic w-full'
                  placeholder='seu@email.com'
                />
              </div>

              <div>
                <label className='text-primary mb-2 block font-medium'>Mensagem Adicional</label>
                <textarea
                  value={intermediationData.message}
                  onChange={e => setIntermediationData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className='input-futuristic w-full resize-none'
                  placeholder='Informações adicionais sobre sua solicitação...'
                />
              </div>

              <div className='bg-primary/10 rounded-lg p-4'>
                <div className='mb-2 flex items-center gap-3'>
                  <Shield size={20} className='text-success' />
                  <span className='text-primary font-semibold'>Intermediação Segura</span>
                </div>
                <p className='text-muted text-sm'>
                  Nossa equipe entrará em contato com o vendedor e facilitará a negociação. Garantimos transparência
                  total e segurança na transação.
                </p>
              </div>

              <div className='flex gap-4'>
                <button type='button' onClick={() => setShowIntermediation(false)} className='btn-secondary flex-1'>
                  Cancelar
                </button>
                <button type='submit' className='btn-futuristic flex flex-1 items-center justify-center gap-2'>
                  <CheckCircle size={20} />
                  Solicitar Intermediação
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Store
