import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  X
} from 'lucide-react';

const Store = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showIntermediation, setShowIntermediation] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [intermediationData, setIntermediationData] = useState({
    quantity: '',
    message: '',
    contactPhone: '',
    contactEmail: ''
  });

  const categories = [
    { id: 'all', name: 'Todos os Produtos', icon: Package },
    { id: 'grains', name: 'Grãos', icon: Package },
    { id: 'machinery', name: 'Maquinário', icon: Truck },
    { id: 'inputs', name: 'Insumos', icon: Package },
    { id: 'services', name: 'Serviços', icon: TrendingUp }
  ];

  const products = [
    {
      id: 1,
      name: 'Soja Premium - Safra 2024',
      category: 'grains',
      price: 185.50,
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
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(price);
  };

  const handleIntermediation = (product) => {
    setSelectedProduct(product);
    setShowIntermediation(true);
  };

  const handleIntermediationSubmit = () => {
    // Simular envio da solicitação de intermediação
    alert('Solicitação de intermediação enviada! O vendedor será notificado e entrará em contato em breve.');
    setShowIntermediation(false);
    setIntermediationData({
      quantity: '',
      message: '',
      contactPhone: '',
      contactEmail: ''
    });
  };

  const handleContactSeller = (product) => {
    // Abrir WhatsApp ou email direto com o vendedor
    const message = `Olá! Tenho interesse no produto: ${product.name}`;
    const whatsappUrl = `https://wa.me/5566992362830?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Intermediação <span className="text-yellow-300">AgroSync</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Plataforma de intermediação inteligente. Conectamos produtores, 
              compradores e fornecedores do agronegócio com segurança total e transparência.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-secondary">
        <div className="container-futuristic">
          <div className="glass-card p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Buscar produtos, serviços ou fornecedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-futuristic pl-10 w-full"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-secondary hover:bg-primary hover:text-white'
                    }`}
                  >
                    <category.icon size={16} />
                    {category.name}
                  </button>
                ))}
              </div>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'bg-secondary text-secondary hover:bg-primary hover:text-white'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'bg-secondary text-secondary hover:bg-primary hover:text-white'
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
      <section className="py-20 bg-primary">
        <div className="container-futuristic">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              Produtos Disponíveis ({filteredProducts.length})
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-white/80">Ordenar por:</span>
              <select className="input-futuristic">
                <option>Relevância</option>
                <option>Preço: Menor para Maior</option>
                <option>Preço: Maior para Menor</option>
                <option>Avaliação</option>
                <option>Mais Recentes</option>
              </select>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="product-card group relative"
                >
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-success text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Destaque
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl">{product.image}</div>
                    <button className="p-2 text-muted hover:text-danger transition-colors">
                      <Heart size={20} />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-primary-dark transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-secondary mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-warning fill-current" />
                      <span className="text-sm font-medium text-primary">{product.rating}</span>
                    </div>
                    <span className="text-muted text-sm">({product.reviews} avaliações)</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-sm text-muted">
                    <MapPin size={16} />
                    <span>{product.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-sm text-muted">
                    <User size={16} />
                    <span>{product.seller}</span>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </div>
                      <div className="text-sm text-muted">{product.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted">Disponível:</div>
                      <div className="font-medium text-primary">{product.quantity.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleContactSeller(product)}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                      <User size={16} />
                      Contatar Vendedor
                    </button>
                    <button 
                      onClick={() => handleIntermediation(product)}
                      className="btn-futuristic flex items-center justify-center gap-2"
                    >
                      Solicitar Intermediação
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6"
                >
                  <div className="flex gap-6">
                    <div className="text-6xl">{product.image}</div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-primary mb-2">
                            {product.name}
                          </h3>
                          <p className="text-secondary mb-4">
                            {product.description}
                          </p>
                        </div>
                        {product.featured && (
                          <div className="bg-success text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Destaque
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-muted">
                          <MapPin size={16} />
                          <span>{product.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted">
                          <User size={16} />
                          <span>{product.seller}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted">
                          <Star size={16} className="text-warning fill-current" />
                          <span>{product.rating} ({product.reviews} avaliações)</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted">
                          <Package size={16} />
                          <span>{product.quantity.toLocaleString()} disponíveis</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-3xl font-bold text-primary">
                            {formatPrice(product.price)}
                          </div>
                          <div className="text-sm text-muted">{product.unit}</div>
                        </div>
                        
                        <div className="flex gap-3">
                          <button className="btn-secondary flex items-center gap-2">
                            <Heart size={16} />
                            Favoritar
                          </button>
                          <button 
                            onClick={() => handleContactSeller(product)}
                            className="btn-secondary flex items-center gap-2"
                          >
                            <User size={16} />
                            Contatar Vendedor
                          </button>
                          <button 
                            onClick={() => handleIntermediation(product)}
                            className="btn-futuristic flex items-center gap-2"
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
      <section className="py-20 bg-secondary">
        <div className="container-futuristic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Por que escolher nossa <span className="text-gradient">Intermediação</span>?
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Conectamos compradores e vendedores com segurança total e transparência
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary-gradient rounded-xl mx-auto mb-6 flex items-center justify-center">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Intermediação Segura
              </h3>
              <p className="text-secondary">
                Garantimos a segurança de todas as transações com proteção 
                completa para compradores e vendedores.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary-gradient rounded-xl mx-auto mb-6 flex items-center justify-center">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Preços Competitivos
              </h3>
              <p className="text-secondary">
                Conectamos você aos melhores preços do mercado com 
                transparência total e sem taxas ocultas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary-gradient rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Truck size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Logística Integrada
              </h3>
              <p className="text-secondary">
                Soluções completas de transporte e logística para 
                garantir a entrega segura dos seus produtos.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-gradient">
        <div className="container-futuristic text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para <span className="text-yellow-300">Comercializar</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Cadastre-se gratuitamente e comece a vender ou comprar 
              produtos do agronegócio com segurança total
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/cadastro"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cadastrar-se Gratuitamente
                <ArrowRight size={20} />
              </motion.a>
              <motion.a
                href="/contato"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Falar com Especialista
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal de Intermediação */}
      {showIntermediation && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-primary">
                Solicitar Intermediação
              </h3>
              <button
                onClick={() => setShowIntermediation(false)}
                className="text-muted hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 p-4 bg-secondary/20 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">{selectedProduct.name}</h4>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(selectedProduct.price)}
                </span>
                <span className="text-secondary">{selectedProduct.unit}</span>
              </div>
              <p className="text-muted text-sm mt-2">{selectedProduct.description}</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleIntermediationSubmit(); }} className="space-y-6">
              <div>
                <label className="block text-primary font-medium mb-2">
                  Quantidade Desejada *
                </label>
                <input
                  type="number"
                  value={intermediationData.quantity}
                  onChange={(e) => setIntermediationData(prev => ({ ...prev, quantity: e.target.value }))}
                  required
                  className="input-futuristic w-full"
                  placeholder="Digite a quantidade desejada"
                />
                <p className="text-muted text-sm mt-1">
                  Disponível: {selectedProduct.quantity.toLocaleString()} {selectedProduct.unit}
                </p>
              </div>

              <div>
                <label className="block text-primary font-medium mb-2">
                  Telefone para Contato *
                </label>
                <input
                  type="tel"
                  value={intermediationData.contactPhone}
                  onChange={(e) => setIntermediationData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  required
                  className="input-futuristic w-full"
                  placeholder="(66) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-primary font-medium mb-2">
                  Email para Contato
                </label>
                <input
                  type="email"
                  value={intermediationData.contactEmail}
                  onChange={(e) => setIntermediationData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="input-futuristic w-full"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-primary font-medium mb-2">
                  Mensagem Adicional
                </label>
                <textarea
                  value={intermediationData.message}
                  onChange={(e) => setIntermediationData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="input-futuristic w-full resize-none"
                  placeholder="Informações adicionais sobre sua solicitação..."
                />
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={20} className="text-success" />
                  <span className="font-semibold text-primary">Intermediação Segura</span>
                </div>
                <p className="text-muted text-sm">
                  Nossa equipe entrará em contato com o vendedor e facilitará a negociação. 
                  Garantimos transparência total e segurança na transação.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowIntermediation(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-futuristic flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Solicitar Intermediação
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Store;
