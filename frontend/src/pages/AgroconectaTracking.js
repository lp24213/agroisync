import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Truck, MapPin, Clock, CheckCircle, Bot } from 'lucide-react';

const sampleTimeline = (code) => {
  const base = Date.now();
  return [
    { ts: new Date(base - 1000 * 60 * 60 * 24 * 2).toISOString(), status: 'Pedido recebido', location: 'Sinop, MT' },
    { ts: new Date(base - 1000 * 60 * 60 * 24).toISOString(), status: 'Coleta realizada', location: 'Sinop, MT' },
    { ts: new Date(base - 1000 * 60 * 60 * 12).toISOString(), status: 'Em trânsito', location: 'Lucas do Rio Verde, MT' },
    { ts: new Date(base - 1000 * 60 * 60 * 1).toISOString(), status: 'Chegando ao destino', location: 'Cuiabá, MT' }
  ].map((e, idx) => ({ ...e, id: `${code || 'AG'}-${idx + 1}` }));
};

const AgroconectaTracking = () => {
  const [params] = useSearchParams();
  const [input, setInput] = useState(params.get('code') || 'AG-2025-0001');
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
      // TODO: integrar backend quando disponível. Por ora, timeline simulada determinística.
      const data = sampleTimeline(input);
      setTracking(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (input) handleTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Truck className="w-5 h-5"/> Rastreamento de Frete</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Código de rastreamento</label>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="AG-2025-0001" />
          <button onClick={handleTrack} disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">{loading ? 'Buscando...' : 'Rastrear'}</button>
        </div>
      </div>

      {tracking.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Linha do tempo</h2>
          <ul className="space-y-3">
            {tracking.map((evt) => (
              <li key={evt.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600"/>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{evt.status}</div>
                  <div className="text-xs text-gray-600 flex items-center gap-2"><MapPin className="w-3 h-3"/> {evt.location}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2"><Clock className="w-3 h-3"/> {new Date(evt.ts).toLocaleString('pt-BR')}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm flex items-start gap-2">
            <Bot className="w-4 h-4 mt-0.5"/>
            <div>
              <div className="font-semibold">IA de Rastreamento</div>
              <div>{aiHint}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgroconectaTracking;


