import React from 'react';

const carriers = [];

const AgroconectaCarriers = () => {
  return (
    <div className='mx-auto max-w-6xl p-4'>
      <h1 className='mb-2 text-3xl font-bold text-gray-900'>Transportadores</h1>
      <p className='mb-8 text-gray-600'>Rotas, capacidade e avaliação</p>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {carriers.length === 0 ? (
          <div className='col-span-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm'>
            <p className='text-gray-600'>Ainda não há transportadores cadastrados.</p>
            <p className='text-sm text-gray-500 mt-2'>Os transportadores aparecerão aqui conforme forem se cadastrando na plataforma.</p>
          </div>
        ) : (
          carriers.map(c => (
            <div key={c.id} className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='mb-2 flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-gray-900'>{c.name}</h2>
                <span className='rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800'>
                  {c.rating.toFixed(1)} ★
                </span>
              </div>
              <div className='text-sm text-gray-600'>Rotas: {c.routes}</div>
              <div className='text-sm text-gray-600'>Capacidade: {c.capacity}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgroconectaCarriers;
