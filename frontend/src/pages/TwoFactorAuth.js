import React from 'react';

const TwoFactorAuth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Autenticação de Dois Fatores</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Digite o código de verificação enviado para seu dispositivo.
        </p>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
