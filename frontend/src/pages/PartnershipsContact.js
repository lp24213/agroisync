import React from 'react';

const PartnershipsContact = () => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Contato Comercial</h1>
      <p className="text-gray-600 mb-4">Envie uma mensagem para parcerias@agroisync.com</p>
      <form className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <input className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Empresa"/>
        <input className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="E-mail"/>
        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Mensagem" rows={5}/>
        <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Enviar</button>
      </form>
    </div>
  );
};

export default PartnershipsContact;


