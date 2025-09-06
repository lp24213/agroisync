import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Unauthorized = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-400 mb-8">
            Você não tem permissão para acessar esta página. Verifique suas credenciais ou entre em contato com o administrador.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Voltar ao Início
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Página Anterior
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
