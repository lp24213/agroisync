import React from 'react';

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Pagamento Realizado</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Seu pagamento foi processado com sucesso!
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
