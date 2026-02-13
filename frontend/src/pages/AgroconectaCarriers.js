import React, { useState, useEffect } from 'react';
import { Truck, Star, MapPin, Phone, Mail } from 'lucide-react';

const AgroconectaCarriers = () => {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCarriers = async () => {
      setLoading(true);
      try {
        console.log('🚛 Buscando transportadores do backend...');
        
        const response = await fetch('https://agroisync-backend.contato-00d.workers.dev/api/carriers')
          .then(async r => {
            if (!r.ok) {
              throw new Error(`HTTP error! status: ${r.status}`);
            }
            const data = await r.json();
            console.log('📦 Resposta completa do backend:', data);
            return data.data || data || [];
          })
          .catch(err => {
            console.error('❌ Erro carregando transportadores:', err);
            return [];
          });

        console.log('✅ Transportadores carregados:', Array.isArray(response) ? response.length : 0);
        setCarriers(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('❌ Erro geral:', error);
        setCarriers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCarriers();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-green-50'>
      {/* Header */}
      <div className='bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3'>
            <Truck className='h-8 w-8 text-blue-600' />
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Transportadores</h1>
              <p className='text-gray-600'>Encontre transportadores confiáveis para seus produtos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        {loading ? (
          <div className='rounded-2xl bg-white p-8 text-center shadow-sm'>
            <p className='text-gray-600'>⏳ Carregando transportadores...</p>
          </div>
        ) : carriers.length === 0 ? (
          <div className='rounded-2xl bg-white p-8 text-center shadow-sm'>
            <Truck className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <p className='text-gray-600'>Nenhum transportador disponível no momento.</p>
            <p className='text-sm text-gray-500 mt-2'>Volte mais tarde para ver opções de transportes.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {carriers.map(c => (
              <div 
                key={c.id} 
                className='flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='mb-4 flex items-start justify-between'>
                  <div className='flex-1'>
                    <h2 className='text-xl font-bold text-gray-900'>{c.name || 'Transportadora'}</h2>
                    {c.company && <p className='text-sm text-gray-500'>{c.company}</p>}
                  </div>
                  <div className='flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 whitespace-nowrap'>
                    <Star className='h-4 w-4 fill-yellow-500 text-yellow-500' />
                    <span className='text-sm font-semibold text-yellow-800'>
                      {(c.rating || 4.5).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className='flex-1 space-y-3'>
                  {c.routes && (
                    <div className='flex items-start gap-2'>
                      <MapPin className='h-4 w-4 mt-1 text-blue-600 flex-shrink-0' />
                      <div>
                        <p className='text-xs text-gray-500 font-semibold'>Rotas atendidas</p>
                        <p className='text-sm text-gray-700'>{c.routes}</p>
                      </div>
                    </div>
                  )}

                  {c.capacity && (
                    <div className='flex items-start gap-2'>
                      <Truck className='h-4 w-4 mt-1 text-green-600 flex-shrink-0' />
                      <div>
                        <p className='text-xs text-gray-500 font-semibold'>Capacidade</p>
                        <p className='text-sm text-gray-700'>{c.capacity}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className='mt-4 border-t pt-4 space-y-2'>
                  {c.phone && (
                    <div className='flex items-center gap-2'>
                      <Phone className='h-4 w-4 text-gray-500' />
                      <a href={`tel:${c.phone}`} className='text-sm text-blue-600 hover:underline'>
                        {c.phone}
                      </a>
                    </div>
                  )}
                  {c.email && (
                    <div className='flex items-center gap-2'>
                      <Mail className='h-4 w-4 text-gray-500' />
                      <a href={`mailto:${c.email}`} className='text-sm text-blue-600 hover:underline'>
                        {c.email}
                      </a>
                    </div>
                  )}
                </div>

                <button className='mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors'>
                  Solicitar Cotação
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgroconectaCarriers;
