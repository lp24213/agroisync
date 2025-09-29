import React from 'react';

const PartnershipsContact = () => {
  return (
    <div className='mx-auto max-w-5xl p-4'>
      <h1 className='mb-4 text-2xl font-bold text-gray-900'>Contato Comercial</h1>
      <p className='mb-4 text-gray-600'>Envie uma mensagem para parcerias@agroisync.com</p>
      <form className='space-y-3 rounded-xl border border-gray-200 bg-white p-4'>
        <input className='w-full rounded-lg border border-gray-300 px-3 py-2' placeholder='Empresa' />
        <input className='w-full rounded-lg border border-gray-300 px-3 py-2' placeholder='E-mail' />
        <textarea className='w-full rounded-lg border border-gray-300 px-3 py-2' placeholder='Mensagem' rows={5} />
        <button className='rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700'>Enviar</button>
      </form>
    </div>
  );
};

export default PartnershipsContact;
