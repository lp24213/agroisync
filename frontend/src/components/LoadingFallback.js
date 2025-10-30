import React from 'react';
import { Loader } from 'lucide-react';

const LoadingFallback = ({ message = 'Carregando...' }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        {/* Logo Spinner - SEM ANIMAÇÃO BUGADA */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gradient-to-tr from-green-400 to-green-600 p-4 shadow-lg">
            <Loader className="h-12 w-12 text-white animate-spin" />
          </div>
        </div>

        {/* Texto */}
        <h2 className="mb-2 text-2xl font-bold text-gray-800">{message}</h2>
        
        {/* Barra de Progresso SIMPLES */}
        <div className="mx-auto w-64 overflow-hidden rounded-full bg-gray-200">
          <div className="h-2 bg-gradient-to-r from-green-400 to-green-600 w-1/2 animate-pulse" />
        </div>

        {/* Texto Secundário */}
        <p className="mt-4 text-sm text-gray-600">
          Aguarde um momento...
        </p>
      </div>
    </div>
  );
};

export default LoadingFallback;
