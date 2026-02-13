import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, X, Check } from 'lucide-react';

const EmailMarketingConsent = ({ isOpen, onClose, onAccept }) => {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && accepted) {
      // Aqui seria enviado para o backend
      console.log('Email marketing consent:', { email, accepted });
      onAccept(email);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail className="text-blue-600" size={24} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Fique por Dentro</h2>
          <p className="text-gray-600 text-center mb-6">
            Receba novidades do agronegócio, dicas de mercado e ofertas exclusivas da Agroisync.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 text-green-600 focus:ring-green-500"
                  required
                />
                <span className="text-sm text-gray-600">
                  Concordo em receber comunicações de marketing da Agroisync sobre produtos, serviços e novidades do agronegócio.
                  Posso cancelar a qualquer momento.
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Agora não
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Aceitar
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Seus dados estão seguros e serão utilizados apenas para comunicações de marketing.
            Consulte nossa <a href="/privacy" className="text-blue-600 hover:underline">Política de Privacidade</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailMarketingConsent;