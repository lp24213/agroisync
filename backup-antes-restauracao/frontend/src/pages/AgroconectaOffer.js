import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AgroconectaOffer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ transportador: '', origem: '', destino: '', volume: '', data: '' });
  const [submitted, setSubmitted] = useState(false);

  const submit = e => {
    e.preventDefault();
    if (!user) {
      const redirectTo = `${location.pathname}${location.search || ''}`;
      navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className='mx-auto max-w-2xl p-4'>
      <h1 className='mb-4 text-3xl font-bold text-gray-900'>Oferecer Frete</h1>
      <div className='mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-800'>
        <p className='font-semibold'>Como funciona</p>
        <ul className='mt-2 list-disc space-y-1 pl-5 text-sm'>
          <li>Preencha a proposta com origem, destino, volume e data.</li>
          <li>Se não estiver logado, você será direcionado para login/cadastro no envio.</li>
          <li>Após publicar, transportadores cadastrados poderão visualizar e entrar em contato.</li>
          <li>Sem dados falsos: ofertas só ficam visíveis com cadastro válido.</li>
        </ul>
      </div>
      {!submitted ? (
        <form onSubmit={submit} className='space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Transportador</label>
            <input className='w-full rounded-lg border border-gray-300 p-2' required value={form.transportador} onChange={e => setForm({ ...form, transportador: e.target.value })} />
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Origem</label>
              <input className='w-full rounded-lg border border-gray-300 p-2' required value={form.origem} onChange={e => setForm({ ...form, origem: e.target.value })} />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Destino</label>
              <input className='w-full rounded-lg border border-gray-300 p-2' required value={form.destino} onChange={e => setForm({ ...form, destino: e.target.value })} />
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Volume (t)</label>
              <input className='w-full rounded-lg border border-gray-300 p-2' required value={form.volume} onChange={e => setForm({ ...form, volume: e.target.value })} />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Data</label>
              <input type='date' className='w-full rounded-lg border border-gray-300 p-2' required value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
            </div>
          </div>
          <div className='pt-2'>
            <button className='rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700'>Publicar Oferta</button>
          </div>
        </form>
      ) : (
        <div className='rounded-2xl border border-green-200 bg-green-50 p-6 text-green-800'>Oferta publicada! Transportadores verão sua proposta.</div>
      )}
    </div>
  );
};

export default AgroconectaOffer;
