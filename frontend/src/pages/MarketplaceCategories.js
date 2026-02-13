import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Tractor,
  Beef,
  Wrench,
  ShoppingCart,
  TrendingUp,
  Users,
  Award,
  Shield,
  Zap
} from 'lucide-react';

const MarketplaceCategories = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSellers: 0,
    totalStates: 0
  });
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Buscar produtos do backend
      const productsRes = await fetch('https://agroisync-backend.contato-00d.workers.dev/api/products?limit=1000')
        .then(r => r.json())
        .then(d => d.data?.products || [])
        .catch(err => {
          console.error('❌ Erro carregando produtos:', err);
          return [];
        });

      // Contar produtos por categoria
      const counts = {
        insumos: 0,
        maquinas: 0,
        pecuaria: 0,
        servicos: 0
      };

      productsRes.forEach(product => {
        const cat = product.category?.toLowerCase() || '';
        if (cat.includes('insumo') || cat.includes('fertilizante') || cat.includes('defensivo') || cat.includes('semente')) {
          counts.insumos++;
        } else if (cat.includes('maquina') || cat.includes('trator') || cat.includes('equipamento') || cat.includes('implemento')) {
          counts.maquinas++;
        } else if (cat.includes('pecuaria') || cat.includes('racao') || cat.includes('veterinario') || cat.includes('genetica')) {
          counts.pecuaria++;
        } else if (cat.includes('servico') || cat.includes('consultoria') || cat.includes('manutencao')) {
          counts.servicos++;
        }
      });

      // Contar vendedores únicos
      const uniqueSellers = new Set(productsRes.map(p => p.seller_id || p.user_id).filter(Boolean));
      
      // Contar estados únicos
      const uniqueStates = new Set(productsRes.map(p => p.origin || p.state).filter(Boolean));

      setCategoryCounts(counts);
      setStats({
        totalProducts: productsRes.length,
        totalSellers: uniqueSellers.size,
        totalStates: uniqueStates.size
      });
    } catch (error) {
      console.error('❌ Erro geral loadData:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      key: 'insumos',
      name: 'Insumos Agrícolas',
      description: 'Fertilizantes, defensivos agrícolas, sementes, substratos e insumos para cultivo',
      icon: Sprout,
      count: categoryCounts.insumos || 0,
      subcategories: ['Fertilizantes', 'Defensivos', 'Sementes', 'Substratos', 'Nutrientes'],
      featured: true,
      color: 'green'
    },
    {
      key: 'maquinas',
      name: 'Máquinas e Equipamentos',
      description: 'Tratores, colheitadeiras, implementos agrícolas, irrigação e automação',
      icon: Tractor,
      count: categoryCounts.maquinas || 0,
      subcategories: ['Tratores', 'Colheitadeiras', 'Implementos', 'Irrigação', 'Peças'],
      featured: true,
      color: 'blue'
    },
    {
      key: 'pecuaria',
      name: 'Pecuária e Genética',
      description: 'Rações, medicamentos veterinários, genética animal e equipamentos pecuários',
      icon: Beef,
      count: categoryCounts.pecuaria || 0,
      subcategories: ['Rações', 'Medicamentos', 'Genética', 'Equipamentos', 'Suplementos'],
      featured: true,
      color: 'orange'
    },
    {
      key: 'servicos',
      name: 'Serviços Agrícolas',
      description: 'Consultoria, manutenção, assistência técnica e serviços especializados',
      icon: Wrench,
      count: categoryCounts.servicos || 0,
      subcategories: ['Consultoria', 'Manutenção', 'Análises', 'Capacitação', 'Assessoria'],
      featured: false,
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
    };
    return colors[color] || colors.blue;
  };

  const featuredCategories = categories.filter(cat => cat.featured);
  const otherCategories = categories.filter(cat => !cat.featured);

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50'>
      {/* Header */}
      <div className='bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl'>
              Categorias do Marketplace
            </h1>
            <p className='mt-4 text-xl text-gray-600 max-w-3xl mx-auto'>
              Explore milhares de produtos e serviços do agronegócio.
              Tudo que você precisa para o sucesso da sua propriedade.
            </p>
          </div>

          {/* Stats - Dados reais do backend */}
          <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {loading ? '...' : stats.totalProducts.toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>Produtos Ativos</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {loading ? '...' : stats.totalSellers.toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>Vendedores</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-600'>
                {loading ? '...' : stats.totalStates.toLocaleString()}
              </div>
              <div className='text-sm text-gray-600'>Estados</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-600'>24/7</div>
              <div className='text-sm text-gray-600'>Suporte</div>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Featured Categories */}
        <section className='mb-12'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 flex items-center'>
            <TrendingUp className='mr-2 h-6 w-6 text-green-600' />
            Categorias em Destaque
          </h2>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {featuredCategories.map(category => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.key}
                  to={`/produtos?categoria=${category.key}`}
                  className='group block'
                >
                  <div className={`relative overflow-hidden rounded-2xl border-2 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${getColorClasses(category.color)}`}>
                    <div className='flex items-center justify-between mb-4'>
                      <IconComponent className='h-12 w-12' />
                      <span className='text-2xl font-bold'>{category.count.toLocaleString()}</span>
                    </div>

                    <h3 className='mb-3 text-2xl font-bold text-gray-900 group-hover:text-current transition-colors'>
                      {category.name}
                    </h3>

                    <p className='mb-4 text-gray-700 leading-relaxed'>
                      {category.description}
                    </p>

                    <div className='mb-4'>
                      <div className='flex flex-wrap gap-1'>
                        {category.subcategories.slice(0, 3).map(sub => (
                          <span key={sub} className='inline-block rounded-full bg-white/50 px-2 py-1 text-xs font-medium'>
                            {sub}
                          </span>
                        ))}
                        {category.subcategories.length > 3 && (
                          <span className='inline-block rounded-full bg-white/50 px-2 py-1 text-xs font-medium'>
                            +{category.subcategories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-gray-600'>Ver produtos →</span>
                      <div className='flex items-center text-sm font-medium'>
                        <Shield className='mr-1 h-4 w-4' />
                        Verificado
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Other Categories */}
        {otherCategories.length > 0 && (
          <section className='mb-12'>
            <h2 className='mb-6 text-2xl font-bold text-gray-900 flex items-center'>
              <Wrench className='mr-2 h-6 w-6 text-purple-600' />
              Outros Serviços
            </h2>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {otherCategories.map(category => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.key}
                    to={`/produtos?categoria=${category.key}`}
                    className='group block'
                  >
                    <div className={`rounded-xl border bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${getColorClasses(category.color)}`}>
                      <div className='flex items-start justify-between mb-4'>
                        <IconComponent className='h-8 w-8' />
                        <span className='text-lg font-bold'>{category.count.toLocaleString()}</span>
                      </div>

                      <h3 className='mb-2 text-xl font-semibold text-gray-900 group-hover:text-current transition-colors'>
                        {category.name}
                      </h3>

                      <p className='mb-4 text-gray-700 text-sm leading-relaxed'>
                        {category.description}
                      </p>

                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium text-gray-600'>Explorar serviços →</span>
                        <Award className='h-4 w-4 text-yellow-500' />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Why Choose Our Marketplace */}
        <section className='mb-12 rounded-2xl bg-white p-8 shadow-lg'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900 text-center'>
            Por que escolher nosso Marketplace?
          </h2>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                <Shield className='h-6 w-6 text-green-600' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>Compra Segura</h3>
              <p className='text-gray-600 text-sm'>
                Todas as transações são protegidas e os vendedores são verificados.
              </p>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                <Zap className='h-6 w-6 text-blue-600' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>Tecnologia IA</h3>
              <p className='text-gray-600 text-sm'>
                Inteligência artificial para recomendações personalizadas e preços justos.
              </p>
            </div>

            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100'>
                <Users className='h-6 w-6 text-orange-600' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900'>Comunidade</h3>
              <p className='text-gray-600 text-sm'>
                Conecte-se com produtores, fornecedores e especialistas do agronegócio.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className='text-center'>
          <div className='mb-6'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>Pronto para começar?</h2>
            <p className='text-gray-600'>
              Explore produtos, conecte-se com vendedores ou comece a vender hoje mesmo.
            </p>
          </div>

          <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <Link
              to='/produtos'
              className='inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            >
              <ShoppingCart className='mr-2 h-5 w-5' />
              Explorar Produtos
            </Link>

            <Link
              to='/produtos/sellers'
              className='inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            >
              <Users className='mr-2 h-5 w-5' />
              Ver Vendedores
            </Link>

            <Link
              to='/produtos/sell'
              className='inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            >
              <TrendingUp className='mr-2 h-5 w-5' />
              Começar a Vender
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MarketplaceCategories;
