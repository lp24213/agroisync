import React from 'react';

const MarketplaceCategories = () => {
  const categories = [
    { key: 'insumos', name: 'Insumos', description: 'Fertilizantes, defensivos e sementes', count: 124 },
    { key: 'maquinas', name: 'Máquinas', description: 'Tratores, colheitadeiras e implementos', count: 86 },
    { key: 'pecuaria', name: 'Pecuária', description: 'Rações, equipamentos e genética', count: 57 },
    { key: 'servicos', name: 'Serviços', description: 'Consultoria, manutenção e assistência', count: 42 }
  ];

  return (
    <div className='mx-auto max-w-6xl p-4'>
      <h1 className='mb-2 text-3xl font-bold text-gray-900'>Categorias do Marketplace</h1>
      <p className='mb-8 text-gray-600'>Explore os principais segmentos do agronegócio</p>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {categories.map(cat => (
          <div key={cat.key} className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h2 className='mb-1 text-xl font-semibold text-gray-900'>{cat.name}</h2>
            <p className='mb-4 text-gray-600'>{cat.description}</p>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-500'>Itens disponíveis</span>
              <span className='rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800'>{cat.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceCategories;
