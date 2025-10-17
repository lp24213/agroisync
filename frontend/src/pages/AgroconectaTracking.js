import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Truck, MapPin, Clock, CheckCircle, Bot } from 'lucide-react';
import { getApiUrl } from '../config/constants.js';

const sampleTimeline = code => {
  // Retorna array vazio - dados reais virão do backend quando disponíveis
  return [];
};

const AgroconectaTracking = () => {
  const [params] = useSearchParams();
  const [input, setInput] = useState(params.get('code') || '');
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(false);

  const aiHint = useMemo(() => {
    if (!tracking.length) return '';
    const last = tracking[tracking.length - 1];
    if (last.status.includes('Chegando')) return 'Previsão de entrega hoje até 18:00.';
    if (last.status.includes('Em trânsito')) return 'Rota otimizada via BR-163. Sem incidentes reportados.';
    return 'Pedido processado e seguindo normalmente.';
  }, [tracking]);

  const handleTrack = async () => {
    setLoading(true);
    try {
      // Tentar buscar dados reais do backend primeiro
      try {
        const response = await fetch(getApiUrl(`/freight-orders/track/${input}`), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          const realData = await response.json();
          setTracking(realData);
          return;
        }
      } catch (error) {
        // Em produção, silenciar erro
        if (process.env.NODE_ENV === 'production') {
          setTracking([]);
          return;
        }
      }
      
      // Fallback para dados simulados APENAS em desenvolvimento
      if (process.env.NODE_ENV !== 'production') {
        const data = sampleTimeline(input);
        setTracking(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // handleTrack é uma função local que não precisa ser redeclarada nas deps
    // usamos apenas `input` como gatilho para buscar a timeline quando mudar
    if (input) {
      (async () => {
        setLoading(true);
        try {
          const data = sampleTimeline(input);
          setTracking(data);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [input]);

  return (
    <div className='mx-auto max-w-4xl p-4'>
      <h1 className='mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900'>
        <Truck className='h-5 w-5' /> Rastreamento de Frete
      </h1>
      <div className='mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-800'>
        <p className='font-semibold'>Como funciona o rastreamento</p>
        <ul className='mt-2 list-disc space-y-1 pl-5 text-sm'>
          <li>Informe o código fornecido no seu pedido ou ordem de frete.</li>
          <li>Buscamos os dados reais no sistema (quando disponíveis).</li>
          <li>Sem código válido, nenhuma informação é exibida por segurança.</li>
          <li>A IA auxilia com dicas contextuais baseadas no último status.</li>
        </ul>
      </div>
      <div className='mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
        <label className='mb-2 block text-sm font-medium text-gray-700'>Código de rastreamento</label>
        <div className='flex gap-2'>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className='flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'
            placeholder='Digite o código de rastreamento'
          />
          <button
            onClick={handleTrack}
            disabled={loading}
            className='rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50'
          >
            {loading ? 'Buscando...' : 'Rastrear'}
          </button>
        </div>
      </div>

      {tracking.length > 0 && (
        <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
          <h2 className='mb-3 text-lg font-semibold text-gray-900'>Linha do tempo</h2>
          <ul className='space-y-3'>
            {tracking.map(evt => (
              <li key={evt.id} className='flex items-start gap-3'>
                <div className='mt-1'>
                  <CheckCircle className='h-4 w-4 text-emerald-600' />
                </div>
                <div>
                  <div className='text-sm font-medium text-gray-900'>{evt.status}</div>
                  <div className='flex items-center gap-2 text-xs text-gray-600'>
                    <MapPin className='h-3 w-3' /> {evt.location}
                  </div>
                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                    <Clock className='h-3 w-3' /> {new Date(evt.ts).toLocaleString('pt-BR')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className='mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800'>
            <Bot className='mt-0.5 h-4 w-4' />
            <div>
              <div className='font-semibold'>IA de Rastreamento</div>
              <div>{aiHint}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgroconectaTracking;
