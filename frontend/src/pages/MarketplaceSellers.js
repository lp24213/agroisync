import React from 'react';

const sellers = [
  { id: 1, name: 'AgroFert Distribuidora', rating: 4.8, state: 'MT', products: 128 },
  { id: 2, name: 'Máquinas do Campo', rating: 4.6, state: 'PR', products: 54 },
  { id: 3, name: 'Pecuária Forte', rating: 4.7, state: 'GO', products: 72 }
];

const MarketplaceSellers = () => {
  return (
    <div className='mx-auto max-w-6xl p-4'>
      <h1 className='mb-2 text-3xl font-bold text-gray-900'>Vendedores</h1>
      <p className='mb-8 text-gray-600'>Vendedores verificados com avaliação e portfólio</p>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {sellers.map(seller => (
          <div key={seller.id} className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-2 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900'>{seller.name}</h2>
              <span className='rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800'>
                {seller.rating.toFixed(1)} ★
              </span>
            </div>
            <div className='text-sm text-gray-600'>Estado: {seller.state}</div>
            <div className='text-sm text-gray-600'>Produtos: {seller.products}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceSellers;
