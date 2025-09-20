import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  User,
  Phone,
  Mail,
  Shield,
  CheckCircle
} from 'lucide-react';
import AgroisyncHeader from '../components/AgroisyncHeader';
import AgroisyncFooter from '../components/AgroisyncFooter';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Simular carregamento de produto
    const mockProduct = {
      id: id,
      name: 'Produto Agrícola Premium',
      price: 'R$ 1.250,00',
      originalPrice: 'R$ 1.500,00',
      images: [
        'https://images.unsplash.com/photo-1600747476236-76579658b1b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q0FNUE8lMjBERSUyMFNPSkF8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=60'
      ],
      description: 'Produto agrícola de alta qualidade, ideal para maximizar sua produção. Desenvolvido com tecnologia de ponta e materiais premium.',
      category: 'Insumos Agrícolas',
      rating: 4.8,
      reviews: 127,
      location: 'Mato Grosso, MT',
      seller: {
        name: 'Fazenda Santa Maria',
        verified: true,
        rating: 4.9,
        phone: '(66) 99999-9999',
        email: 'contato@fazendasantamaria.com'
      },
      features: [
        'Alta qualidade certificada',
        'Garantia de 30 dias',
        'Entrega rápida',
        'Suporte técnico especializado'
      ],
      specifications: {
        'Peso': '50kg',
        'Dimensões': '100x50x30cm',
        'Material': 'Aço inoxidável',
        'Garantia': '12 meses'
      },
      inStock: true,
      discount: '17% OFF'
    };

    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleContact = () => {
    // Implementar contato com vendedor
    alert('Funcionalidade de contato será implementada em breve!');
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h1>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AgroisyncHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-green-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <span>/</span>
          <span>Produtos</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagens do Produto */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  {product.category}
                </span>
                {product.discount && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                    {product.discount}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating} ({product.reviews} avaliações)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-green-600">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Características */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Especificações */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Especificações</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Localização */}
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span>{product.location}</span>
            </div>

            {/* Vendedor */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Vendedor</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{product.seller.name}</span>
                    {product.seller.verified && (
                      <Shield size={16} className="text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.seller.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 btn btn-secondary text-sm">
                  <Phone size={16} />
                  Ligar
                </button>
                <button className="flex-1 btn btn-secondary text-sm">
                  <Mail size={16} />
                  Email
                </button>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <button 
                className="w-full btn btn-primary text-lg py-3"
                onClick={handleContact}
                disabled={!product.inStock}
              >
                <ShoppingCart size={20} />
                {product.inStock ? 'Entrar em Contato' : 'Indisponível'}
              </button>
              
              <div className="flex gap-2">
                <button 
                  className="flex-1 btn btn-secondary"
                  onClick={handleFavorite}
                >
                  <Heart size={16} className={isFavorite ? 'text-red-500 fill-current' : ''} />
                  {isFavorite ? 'Favoritado' : 'Favoritar'}
                </button>
                <button 
                  className="flex-1 btn btn-secondary"
                  onClick={handleShare}
                >
                  <Share2 size={16} />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AgroisyncFooter />
    </div>
  );
};

export default ProductDetail;
