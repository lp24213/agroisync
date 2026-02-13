import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, TrendingUp, TrendingDown, Star, 
  Truck, Package, Shield, AlertCircle,
  Heart, Share2, Calendar, Award, Phone,
  Mail, ArrowLeft, Eye, MessageCircle,
  ThumbsUp, Clock, CheckCircle, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import cotacoesService from '../services/cotacoesService';
import productService from '../services/productService';
import freightService from '../services/freightService';
import { getCategoriaById } from '../data/agroCategorias';

const ProductDetailNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [cotacao, setCotacao] = useState(null);
  const [freight, setFreight] = useState(null);
  const [seller, setSeller] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProductData();
  }, [id]);

  async function loadProductData() {
    try {
      // 1. Carregar produto
      const productData = await productService.getById(id);
      setProduct(productData);

      // 2. Buscar cotação de mercado (se for grão ou gado)
      const categoria = getCategoriaById(productData.category);
      if (categoria?.temCotacao) {
        const cotacaoData = await cotacoesService.getCotacao(productData.subcategory || productData.name.toLowerCase());
        setCotacao(cotacaoData);
      }

      // 3. Calcular frete estimado
      const userLocation = getUserLocation();
      if (userLocation && productData.origin_city) {
        try {
          const freightEstimate = await freightService.calculateEstimate({
            origin: `${productData.origin_city}, ${productData.origin_state}`,
            destination: `${userLocation.city}, ${userLocation.state}`,
            weight: productData.quantity || 1000,
            productType: productData.category
          });
          setFreight(freightEstimate);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') console.error('Erro ao calcular frete:', error);
        }
      }

      // 4. Dados do vendedor
      try {
        const sellerData = await productService.getSellerInfo(productData.user_id);
        setSeller(sellerData);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Erro ao buscar vendedor:', error);
      }

      // 5. Produtos similares
      try {
        const similarData = await productService.getSimilar(id, 4);
        setSimilar(similarData);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Erro ao buscar similares:', error);
      }

      // 6. Avaliações
      try {
        const reviewsData = await productService.getReviews(id);
        setReviews(reviewsData);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Erro ao buscar avaliações:', error);
      }

      // 7. Verificar se está nos favoritos
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favs.includes(parseInt(id)));

      setLoading(false);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Erro ao carregar produto:', error);
      setLoading(false);
    }
  }

  function getUserLocation() {
    return JSON.parse(localStorage.getItem('userLocation') || 'null');
  }

  async function toggleFavorite() {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const productId = parseInt(id);
    
    if (isFavorite) {
      const index = favs.indexOf(productId);
      if (index > -1) favs.splice(index, 1);
    } else {
      favs.push(productId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favs));
    setIsFavorite(!isFavorite);

    // Salvar no backend também
    try {
      await productService.toggleFavorite(id);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Erro ao salvar favorito:', error);
    }
  }

  async function handleBuy() {
    // Verificar se usuário está logado
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // Redirecionar para checkout
    const checkoutData = {
      product: id,
      quantity,
      freight: freight?.id || 'calculate',
      total: calculateTotal()
    };
    
    navigate('/checkout', { state: checkoutData });
  }

  function calculateTotal() {
    const productTotal = product.price * quantity;
    const freightTotal = freight?.price || 0;
    return productTotal + freightTotal;
  }

  async function handleContact() {
    navigate(`/messages?seller=${product.user_id}&product=${id}`);
  }

  function shareProduct() {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Confira: ${product.name} por R$ ${product.price.toFixed(2)}`,
        url: window.location.href
      });
    } else {
      // Fallback: copiar link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para área de transferência!');
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="loading-spinner">Carregando produto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '20px'
      }}>
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2>Produto não encontrado</h2>
        <button 
          onClick={() => navigate('/marketplace')}
          style={{
            padding: '12px 24px',
            background: '#2F5233',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Voltar ao Marketplace
        </button>
      </div>
    );
  }

  const oportunidade = cotacao ? 
    cotacoesService.isOportunidade(product.price, cotacao.preco) : 
    null;

  const categoria = getCategoriaById(product.category);

  return (
    <div className="product-detail-page" style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      
      {/* BOTÃO VOLTAR */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: '#f3f4f6',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontWeight: '500'
        }}
        aria-label="Voltar"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      {/* BREADCRUMB */}
      <nav 
        className="breadcrumb" 
        style={{ marginBottom: '30px', fontSize: '14px', color: '#6b7280' }}
        aria-label="Navegação estrutural"
      >
        <a href="/marketplace" style={{ color: '#2F5233' }}>Marketplace</a>
        {' > '}
        <a href={`/marketplace?categoria=${product.category}`} style={{ color: '#2F5233' }}>
          {categoria?.nome || product.category}
        </a>
        {' > '}
        <span>{product.name}</span>
      </nav>

      {/* LAYOUT PRINCIPAL */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* COLUNA 1: GALERIA (40%) */}
        <div className="md:col-span-1">
          
          {/* IMAGEM PRINCIPAL */}
          <motion.div
            className="product-gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: '#f9fafb',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
              border: '1px solid #e5e7eb'
            }}
          >
            {product.images && product.images.length > 0 ? (
              <img 
                src={JSON.parse(product.images)[selectedImage]} 
                alt={`${product.name} - Imagem ${selectedImage + 1}`}
                style={{ 
                  width: '100%', 
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '400px',
                fontSize: '80px',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                borderRadius: '12px'
              }}>
                {categoria?.icone || '📦'}
              </div>
            )}
          </motion.div>

          {/* MINIATURAS */}
          {product.images && JSON.parse(product.images).length > 1 && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '8px' 
            }}>
              {JSON.parse(product.images).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    padding: 0,
                    background: 'transparent',
                    border: selectedImage === idx ? '2px solid #2F5233' : '2px solid transparent',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  aria-label={`Ver imagem ${idx + 1}`}
                >
                  <img 
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* VENDEDOR CARD */}
          <motion.div
            className="seller-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: '24px',
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <h3 style={{ 
              marginBottom: '16px', 
              fontSize: '18px', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <User className="w-5 h-5 text-gray-600" />
              Vendedor
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ 
                width: '70px', 
                height: '70px', 
                background: 'linear-gradient(135deg, #2F5233 0%, #4a7c59 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(47, 82, 51, 0.2)'
              }}>
                {seller?.name?.charAt(0) || product.user_id?.toString().charAt(0) || 'V'}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '700', 
                  fontSize: '16px',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {seller?.name || 'Vendedor Verificado'}
                  {seller?.verified && (
                    <CheckCircle 
                      className="w-5 h-5 text-green-500" 
                      fill="currentColor"
                      aria-label="Vendedor verificado"
                    />
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  <span style={{ fontSize: '15px', fontWeight: '600' }}>
                    {seller?.rating || '4.8'}
                  </span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    ({seller?.reviewCount || '156'} avaliações)
                  </span>
                </div>
                
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  <Clock className="w-3 h-3 inline mr-1" />
                  Membro desde {seller?.memberSince || '2023'}
                </div>
              </div>
            </div>

            {/* CONTATO */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '8px',
              marginBottom: '12px'
            }}>
              <button 
                onClick={handleContact}
                style={{
                  padding: '10px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                aria-label="Enviar mensagem para vendedor"
              >
                <MessageCircle className="w-4 h-4" />
                Mensagem
              </button>
              
              <button
                onClick={() => window.open(`tel:${seller?.phone || ''}`)}
                style={{
                  padding: '10px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                aria-label="Ligar para vendedor"
              >
                <Phone className="w-4 h-4" />
                Ligar
              </button>
            </div>

            <button 
              onClick={() => navigate(`/seller/${product.user_id}`)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
              aria-label="Ver loja do vendedor"
            >
              Ver Loja do Vendedor
            </button>
          </motion.div>
        </div>

        {/* COLUNA 2: INFORMAÇÕES PRINCIPAIS (60%) */}
        <div className="md:col-span-2">
          
          {/* TÍTULO E CATEGORIA */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{
                padding: '6px 16px',
                background: '#ecfdf5',
                color: '#065f46',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {categoria?.icone} {categoria?.nome || product.category}
              </span>
              
              {product.quality_grade && (
                <span style={{
                  padding: '6px 16px',
                  background: '#fef3c7',
                  color: '#92400e',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  <Award className="w-3 h-3 inline mr-1" />
                  {product.quality_grade}
                </span>
              )}
            </div>

            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              marginBottom: '12px',
              color: '#111827'
            }}>
              {product.name}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin className="w-4 h-4 text-gray-500" />
                <span style={{ fontSize: '15px', color: '#6b7280' }}>
                  {product.origin_city}/{product.origin_state}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye className="w-4 h-4 text-gray-500" />
                <span style={{ fontSize: '15px', color: '#6b7280' }}>
                  {product.views || 0} visualizações
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock className="w-4 h-4 text-gray-500" />
                <span style={{ fontSize: '15px', color: '#6b7280' }}>
                  Publicado {new Date(product.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* PREÇO VS MERCADO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: oportunidade?.isOportunidade 
                ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
              border: `3px solid ${oportunidade?.isOportunidade ? '#10b981' : '#e5e7eb'}`,
              borderRadius: '16px',
              padding: '28px',
              marginBottom: '24px',
              boxShadow: oportunidade?.isOportunidade 
                ? '0 10px 25px rgba(16, 185, 129, 0.15)'
                : '0 4px 6px rgba(0,0,0,0.05)'
            }}
          >
            {oportunidade?.isOportunidade && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '16px'
              }}>
                🔥 OPORTUNIDADE DE COMPRA!
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                Preço do Vendedor
              </div>
              
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 'bold',
                color: oportunidade?.isOportunidade ? '#10b981' : '#111827',
                lineHeight: '1.2'
              }}>
                R$ {product.price.toFixed(2)}
                <span style={{ fontSize: '20px', fontWeight: 'normal', color: '#6b7280' }}>
                  {' '}/ {product.unit || 'unidade'}
                </span>
              </div>
            </div>

            {cotacao && (
              <div style={{ 
                paddingTop: '20px', 
                borderTop: '2px solid rgba(0,0,0,0.06)'
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                      Preço de Mercado
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#374151' }}>
                      R$ {cotacao.preco.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                      Fonte: {cotacao.fonte?.toUpperCase() || 'CEPEA'}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                      Diferença
                    </div>
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: 'bold',
                      color: oportunidade?.isOportunidade ? '#10b981' : '#ef4444'
                    }}>
                      {oportunidade?.percentual}%
                    </div>
                    {oportunidade?.isOportunidade && (
                      <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', marginTop: '4px' }}>
                        Abaixo do mercado
                      </div>
                    )}
                  </div>
                </div>

                {oportunidade?.isOportunidade && oportunidade.economiaTotal > 0 && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #10b981'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#065f46', marginBottom: '6px' }}>
                      💰 Você economiza:
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                      R$ {oportunidade.economia}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      por {product.unit || 'unidade'} • R$ {(oportunidade.economiaTotal * quantity).toFixed(2)} no total
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* ESTOQUE E QUANTIDADE */}
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                <Package className="w-4 h-4 inline mr-1" />
                Estoque Disponível
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {product.quantity} {product.unit}
              </div>
              
              {product.min_order && (
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                  <Info className="w-3 h-3 inline mr-1" />
                  Pedido mínimo: {product.min_order} {product.unit}
                </div>
              )}
            </div>

            {/* SELETOR DE QUANTIDADE */}
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Quantidade:
              </label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setQuantity(Math.max(product.min_order || 1, quantity - 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>
                
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    const min = product.min_order || 1;
                    const max = product.max_order || product.quantity;
                    setQuantity(Math.max(min, Math.min(max, val)));
                  }}
                  min={product.min_order || 1}
                  max={product.max_order || product.quantity}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}
                  aria-label="Quantidade desejada"
                />
                
                <button
                  onClick={() => setQuantity(Math.min(product.max_order || product.quantity, quantity + 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* FRETE ESTIMADO */}
          {freight && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                border: '2px solid #f59e0b',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                marginBottom: '16px' 
              }}>
                <Truck className="w-6 h-6 text-orange-600" />
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#92400e' }}>
                  Frete Disponível
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div style={{ fontSize: '12px', color: '#78350f', marginBottom: '4px' }}>
                    Distância
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#92400e' }}>
                    {freight.distance} km
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#78350f', marginBottom: '4px' }}>
                    Valor do Frete
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#92400e' }}>
                    R$ {freight.price.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div style={{ fontSize: '13px', color: '#92400e', marginBottom: '12px' }}>
                <Clock className="w-4 h-4 inline mr-1" />
                Prazo estimado: {freight.estimatedDays || 5} dias úteis
              </div>
              
              <button 
                onClick={() => navigate(`/freight?product=${id}`)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'white',
                  border: '2px solid #f59e0b',
                  borderRadius: '10px',
                  color: '#92400e',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                aria-label="Ver outras opções de frete"
              >
                Ver Mais Opções de Frete
              </button>
            </motion.div>
          )}

          {/* RESUMO DO PEDIDO */}
          <div style={{
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
              📝 Resumo do Pedido
            </h3>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#6b7280' }}>
                  Produto ({quantity} {product.unit})
                </span>
                <span style={{ fontWeight: '600' }}>
                  R$ {(product.price * quantity).toFixed(2)}
                </span>
              </div>
              
              {freight && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#6b7280' }}>Frete</span>
                  <span style={{ fontWeight: '600' }}>
                    R$ {freight.price.toFixed(2)}
                  </span>
                </div>
              )}
              
              <div style={{ 
                paddingTop: '12px', 
                marginTop: '12px',
                borderTop: '2px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '18px', fontWeight: '700' }}>Total</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#2F5233' }}>
                  R$ {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* AÇÕES PRINCIPAIS */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuy}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '18px 24px',
                background: 'linear-gradient(135deg, #2F5233 0%, #4a7c59 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(47, 82, 51, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              aria-label="Comprar produto agora"
            >
              <Package className="w-5 h-5" />
              Comprar Agora
            </motion.button>
            
            <button
              onClick={toggleFavorite}
              style={{
                padding: '18px 20px',
                background: isFavorite ? '#fee2e2' : 'white',
                border: `2px solid ${isFavorite ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart 
                className={`w-6 h-6`}
                style={{ color: isFavorite ? '#ef4444' : '#6b7280' }}
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </button>
            
            <button
              onClick={shareProduct}
              style={{
                padding: '18px 20px',
                background: 'white',
                border: '2px solid #d1d5db',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
              aria-label="Compartilhar produto"
              title="Compartilhar produto"
            >
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* GARANTIAS E SEGURANÇA */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '10px'
            }}>
              <Shield className="w-5 h-5 text-green-600" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                Pagamento Seguro
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '10px'
            }}>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                Vendedor Verificado
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '10px'
            }}>
              <Truck className="w-5 h-5 text-green-600" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                Rastreamento GPS
              </span>
            </div>
          </div>

          {/* DESCRIÇÃO */}
          {product.description && (
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
                📝 Descrição do Produto
              </h3>
              <p style={{ 
                color: '#4b5563', 
                lineHeight: '1.8',
                fontSize: '15px',
                whiteSpace: 'pre-wrap'
              }}>
                {product.description}
              </p>
            </div>
          )}

          {/* ESPECIFICAÇÕES TÉCNICAS */}
          <div style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
              📋 Especificações Técnicas
            </h3>
            
            <div className="specs-grid" style={{ display: 'grid', gap: '14px' }}>
              {renderSpecField('Categoria', categoria?.nome || product.category)}
              {renderSpecField('Unidade', product.unit)}
              {product.quality_grade && renderSpecField('Qualidade', product.quality_grade)}
              {product.harvest_season && renderSpecField('Safra', product.harvest_season, Calendar)}
              {product.humidity && renderSpecField('Umidade', `${product.humidity}%`)}
              {product.impurities && renderSpecField('Impurezas', `${product.impurities}%`)}
              {product.origin && renderSpecField('Origem', product.origin)}
              
              {product.certifications && JSON.parse(product.certifications).length > 0 && (
                <div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#6b7280', 
                    marginBottom: '10px',
                    fontWeight: '600'
                  }}>
                    <Award className="w-4 h-4 inline mr-2" />
                    Certificações:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {JSON.parse(product.certifications).map(cert => (
                      <span key={cert} style={{
                        padding: '6px 14px',
                        background: '#ecfdf5',
                        color: '#065f46',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: '1px solid #10b981'
                      }}>
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AVALIAÇÕES */}
          {reviews && reviews.length > 0 && (
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
                ⭐ Avaliações ({reviews.length})
              </h3>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                {reviews.slice(0, 3).map((review, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>
                        {review.userName}
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className="w-4 h-4"
                            fill={i < review.rating ? '#f59e0b' : 'none'}
                            color="#f59e0b"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                      {review.comment}
                    </p>
                    
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
              
              {reviews.length > 3 && (
                <button
                  onClick={() => navigate(`/product/${id}/reviews`)}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                  aria-label="Ver todas as avaliações"
                >
                  Ver todas as {reviews.length} avaliações
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PRODUTOS SIMILARES */}
      {similar && similar.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: '60px' }}
        >
          <h3 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            🤝 Produtos Similares
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
                onClick={() => navigate(`/product/${item.id}`)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                role="article"
                aria-label={`Produto similar: ${item.name}`}
              >
                {item.images && JSON.parse(item.images)[0] ? (
                  <img 
                    src={JSON.parse(item.images)[0]}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '12px'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '150px',
                    background: '#f3f4f6',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px'
                  }}>
                    {categoria?.icone || '📦'}
                  </div>
                )}
                
                <div style={{ 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  color: '#111827',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.name}
                </div>
                
                <div style={{ 
                  fontSize: '22px', 
                  fontWeight: 'bold', 
                  color: '#2F5233',
                  marginBottom: '6px'
                }}>
                  R$ {item.price.toFixed(2)}
                </div>
                
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <MapPin className="w-3 h-3" />
                  {item.origin_city}/{item.origin_state}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  function renderSpecField(label, value, Icon = null) {
    if (!value) return null;
    
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6'
      }}>
        <span style={{ color: '#6b7280', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {Icon && <Icon className="w-4 h-4" />}
          {label}:
        </span>
        <span style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>
          {value}
        </span>
      </div>
    );
  }
};

export default ProductDetailNew;

