import React from 'react';

const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Redefinir Senha</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Digite sua nova senha para redefinir o acesso à sua conta.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
