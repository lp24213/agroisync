import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Package,
  Award,
  Shield,
  CheckCircle,
  Search,
  Filter,
  TrendingUp,
  Users,
  Building2,
  Store
} from 'lucide-react';

const MarketplaceSellers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('todos');

  const sellers = [
    {
      id: 1,
      name: 'AgroFert Distribuidora',
      rating: 4.8,
      reviewCount: 247,
      state: 'MT',
      city: 'Cuiabá',
      products: 128,
      category: 'Insumos',
      verified: true,
      premium: true,
      since: '2019',
      specialties: ['Fertilizantes', 'Defensivos', 'Sementes'],
      description: 'Distribuidora líder em insumos agrícolas na região Centro-Oeste. Atendemos produtores rurais com produtos de alta qualidade e consultoria técnica especializada.',
      avatar: '🏪'
    },
    {
      id: 2,
      name: 'Máquinas do Campo',
      rating: 4.6,
      reviewCount: 189,
      state: 'PR',
      city: 'Curitiba',
      products: 54,
      category: 'Máquinas',
      verified: true,
      premium: false,
      since: '2020',
      specialties: ['Tratores', 'Colheitadeiras', 'Implementos'],
      description: 'Especialistas em máquinas agrícolas. Venda, manutenção e locação de equipamentos para o agronegócio brasileiro.',
      avatar: '🚜'
    },
    {
      id: 3,
      name: 'Pecuária Forte',
      rating: 4.7,
      reviewCount: 156,
      state: 'GO',
      city: 'Goiânia',
      products: 72,
      category: 'Pecuária',
      verified: true,
      premium: true,
      since: '2018',
      specialties: ['Rações', 'Genética', 'Medicamentos'],
      description: 'Referência em pecuária no Brasil Central. Oferecemos soluções completas para criação de bovinos, suínos e aves.',
      avatar: '🐄'
    },
    {
      id: 4,
      name: 'AgroTech Solutions',
      rating: 4.9,
      reviewCount: 98,
      state: 'SP',
      city: 'São Paulo',
      products: 34,
      category: 'Tecnologia',
      verified: true,
      premium: true,
      since: '2021',
      specialties: ['IoT', 'Automação', 'Sensores'],
      description: 'Tecnologia de ponta para agricultura moderna. Soluções em IoT, automação e agricultura de precisão.',
      avatar: '🤖'
    },
    {
      id: 5,
      name: 'Sementes Premium',
      rating: 4.5,
      reviewCount: 203,
      state: 'RS',
      city: 'Passo Fundo',
      products: 89,
      category: 'Insumos',
      verified: true,
      premium: false,
      since: '2017',
      specialties: ['Sementes', 'Milho', 'Soja', 'Trigo'],
      description: 'Especialistas em sementes certificadas. Trabalhamos com as melhores variedades para máxima produtividade.',
      avatar: '🌱'
    },
    {
      id: 6,
      name: 'AgroConsult Pro',
      rating: 4.8,
      reviewCount: 67,
      state: 'MG',
      city: 'Uberlândia',
      products: 12,
      category: 'Serviços',
      verified: true,
      premium: true,
      since: '2020',
      specialties: ['Consultoria', 'Análises', 'Planejamento'],
      description: 'Consultoria especializada em agronegócio. Ajudamos produtores a otimizar seus negócios e aumentar a rentabilidade.',
      avatar: '📊'
    }
  ];

  const states = ['todos', ...new Set(sellers.map(s => s.state))].sort();

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesState = selectedState === 'todos' || seller.state === selectedState;
    return matchesSearch && matchesState;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-green-50'>
      {/* Header */}
      <div className='bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl'>
              Vendedores Verificados
            </h1>
            <p className='mt-4 text-xl text-gray-600 max-w-3xl mx-auto'>
              Conecte-se com vendedores certificados e confiáveis do agronegócio brasileiro.
              Todas as empresas passam por rigorosos processos de verificação.
            </p>
          </div>

          {/* Stats */}
          <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>{sellers.length}</div>
              <div className='text-sm text-gray-600'>Vendedores Ativos</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {sellers.filter(s => s.verified).length}
              </div>
              <div className='text-sm text-gray-600'>Verificados</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-600'>
                {sellers.filter(s => s.premium).length}
              </div>
              <div className='text-sm text-gray-600'>Premium</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {sellers.reduce((sum, s) => sum + s.products, 0).toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>Produtos Totais</div>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Filters */}
        <div className='mb-8 rounded-2xl bg-white p-6 shadow-lg'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Buscar vendedores, produtos ou especialidades...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                />
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <Filter className='h-5 w-5 text-gray-400' />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className='rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
              >
                <option value='todos'>Todos os Estados</option>
                {states.filter(state => state !== 'todos').map(state => (
                  <option key={state} value={state}>Estado: {state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sellers Grid */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
          {filteredSellers.map(seller => (
            <Link
              key={seller.id}
              to={`/vendedor/${seller.id}`}
              className='group block'
            >
              <div className='relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
                {/* Premium Badge */}
                {seller.premium && (
                  <div className='absolute top-4 right-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg'>
                    <Award className='inline h-3 w-3 mr-1' />
                    PREMIUM
                  </div>
                )}

                {/* Header */}
                <div className='mb-4 flex items-start justify-between'>
                  <div className='flex items-center'>
                    <div className='mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-green-100 text-2xl'>
                      {seller.avatar}
                    </div>
                    <div>
                      <h3 className='text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>
                        {seller.name}
                      </h3>
                      <div className='flex items-center text-sm text-gray-500'>
                        <MapPin className='mr-1 h-4 w-4' />
                        {seller.city}, {seller.state}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className='mb-4 flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='flex items-center mr-2'>
                      {renderStars(seller.rating)}
                    </div>
                    <span className='text-sm font-semibold text-gray-900'>
                      {seller.rating.toFixed(1)}
                    </span>
                    <span className='ml-1 text-sm text-gray-500'>
                      ({seller.reviewCount})
                    </span>
                  </div>
                  {seller.verified && (
                    <div className='flex items-center text-sm font-medium text-green-600'>
                      <CheckCircle className='mr-1 h-4 w-4' />
                      Verificado
                    </div>
                  )}
                </div>

                {/* Category & Products */}
                <div className='mb-4 flex items-center justify-between text-sm'>
                  <div className='flex items-center text-gray-600'>
                    <Store className='mr-1 h-4 w-4' />
                    {seller.category}
                  </div>
                  <div className='flex items-center font-medium text-gray-900'>
                    <Package className='mr-1 h-4 w-4' />
                    {seller.products} produtos
                  </div>
                </div>

                {/* Specialties */}
                <div className='mb-4'>
                  <div className='flex flex-wrap gap-1'>
                    {seller.specialties.map(specialty => (
                      <span
                        key={specialty}
                        className='inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700'
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className='mb-4 text-sm text-gray-600 line-clamp-2'>
                  {seller.description}
                </p>

                {/* Footer */}
                <div className='flex items-center justify-between text-xs text-gray-500'>
                  <span>No Agroisync desde {seller.since}</span>
                  <span className='font-medium text-blue-600 group-hover:underline'>
                    Ver perfil →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredSellers.length === 0 && (
          <div className='text-center py-12'>
            <Users className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-4 text-lg font-medium text-gray-900'>Nenhum vendedor encontrado</h3>
            <p className='mt-2 text-gray-500'>
              Tente ajustar os filtros de busca ou explore outras categorias.
            </p>
          </div>
        )}

        {/* Become a Seller CTA */}
        <div className='mt-12 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Quer vender seus produtos?</h2>
          <p className='mb-6 text-lg opacity-90 max-w-2xl mx-auto'>
            Junte-se a milhares de vendedores verificados. Alcance milhões de compradores
            no maior marketplace do agronegócio brasileiro.
          </p>
          <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <Link
              to='/produtos/sell'
              className='inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-green-600 shadow-sm hover:bg-gray-50'
            >
              <TrendingUp className='mr-2 h-5 w-5' />
              Começar a Vender
            </Link>
            <Link
              to='/contato'
              className='inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20'
            >
              Falar com Especialista
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceSellers;
