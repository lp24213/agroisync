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
// import AgroisyncHeader from '../components/AgroisyncHeader'; // Já incluído no App.js
// import AgroisyncFooter from '../components/AgroisyncFooter'; // Já incluído no App.js

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
      description:
        'Produto agrícola de alta qualidade, ideal para maximizar sua produção. Desenvolvido com tecnologia de ponta e materiais premium.',
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
        Peso: '50kg',
        Dimensões: '100x50x30cm',
        Material: 'Aço inoxidável',
        Garantia: '12 meses'
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
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-green-500'></div>
          <p className='mt-4 text-gray-600'>Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-800'>Produto não encontrado</h1>
          <button onClick={() => navigate('/')} className='btn btn-primary'>
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header já incluído no App.js */}

      <div className='container mx-auto px-4 py-8'>
        {/* Breadcrumb */}
        <div className='mb-6 flex items-center gap-2 text-sm text-gray-600'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center gap-1 transition-colors hover:text-green-600'
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
          <span>/</span>
          <span>Produtos</span>
          <span>/</span>
          <span className='font-medium text-gray-800'>{product.name}</span>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Imagens do Produto */}
          <div className='space-y-4'>
            <div className='aspect-square overflow-hidden rounded-lg bg-white shadow-lg'>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className='h-full w-full object-cover'
                loading='lazy'
                onError={e => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1600747476236-76579658b1b1?w=500&auto=format&fit=crop&q=60';
                }}
              />
            </div>

            <div className='grid grid-cols-3 gap-2'>
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg ${
                    selectedImage === index ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className='h-full w-full object-cover'
                    loading='lazy'
                    onError={e => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1600747476236-76579658b1b1?w=200&auto=format&fit=crop&q=60';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className='space-y-6'>
            <div>
              <div className='mb-2 flex items-center gap-2'>
                <span className='rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                  {product.category}
                </span>
                {product.discount && (
                  <span className='rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800'>
                    {product.discount}
                  </span>
                )}
              </div>

              <h1 className='mb-4 text-3xl font-bold text-gray-900'>{product.name}</h1>

              <div className='mb-4 flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? 'fill-current text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className='ml-1 text-sm text-gray-600'>
                    {product.rating} ({product.reviews} avaliações)
                  </span>
                </div>
              </div>

              <div className='mb-6 flex items-center gap-4'>
                <span className='text-3xl font-bold text-green-600'>{product.price}</span>
                {product.originalPrice && (
                  <span className='text-lg text-gray-500 line-through'>{product.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>Descrição</h3>
              <p className='leading-relaxed text-gray-700'>{product.description}</p>
            </div>

            {/* Características */}
            <div>
              <h3 className='mb-3 text-lg font-semibold text-gray-900'>Características</h3>
              <ul className='space-y-2'>
                {product.features.map((feature, index) => (
                  <li key={index} className='flex items-center gap-2'>
                    <CheckCircle size={16} className='text-green-500' />
                    <span className='text-gray-700'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Especificações */}
            <div>
              <h3 className='mb-3 text-lg font-semibold text-gray-900'>Especificações</h3>
              <div className='grid grid-cols-2 gap-3'>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className='flex justify-between border-b border-gray-200 py-2'>
                    <span className='text-gray-600'>{key}:</span>
                    <span className='font-medium text-gray-900'>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Localização */}
            <div className='flex items-center gap-2 text-gray-600'>
              <MapPin size={16} />
              <span>{product.location}</span>
            </div>

            {/* Vendedor */}
            <div className='rounded-lg bg-gray-50 p-4'>
              <h3 className='mb-3 text-lg font-semibold text-gray-900'>Vendedor</h3>
              <div className='mb-3 flex items-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                  <User size={24} className='text-green-600' />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium text-gray-900'>{product.seller.name}</span>
                    {product.seller.verified && <Shield size={16} className='text-green-500' />}
                  </div>
                  <div className='flex items-center gap-1'>
                    <Star size={14} className='fill-current text-yellow-400' />
                    <span className='text-sm text-gray-600'>{product.seller.rating}</span>
                  </div>
                </div>
              </div>

              <div className='flex gap-2'>
                <button className='btn btn-secondary flex-1 text-sm'>
                  <Phone size={16} />
                  Ligar
                </button>
                <button className='btn btn-secondary flex-1 text-sm'>
                  <Mail size={16} />
                  Email
                </button>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className='space-y-3'>
              <button
                className='btn btn-primary w-full py-3 text-lg'
                onClick={handleContact}
                disabled={!product.inStock}
              >
                <ShoppingCart size={20} />
                {product.inStock ? 'Entrar em Contato' : 'Indisponível'}
              </button>

              <div className='flex gap-2'>
                <button className='btn btn-secondary flex-1' onClick={handleFavorite}>
                  <Heart size={16} className={isFavorite ? 'fill-current text-red-500' : ''} />
                  {isFavorite ? 'Favoritado' : 'Favoritar'}
                </button>
                <button className='btn btn-secondary flex-1' onClick={handleShare}>
                  <Share2 size={16} />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer já incluído no App.js */}
    </div>
  );
};

export default ProductDetail;
