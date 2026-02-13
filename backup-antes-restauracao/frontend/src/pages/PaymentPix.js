import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { QrCode, Copy, CheckCircle, Clock } from 'lucide-react';

const PaymentPix = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { qrCode, qrCodeText, amount, txid, expiresAt, plan } = location.state || {};

  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (!qrCode || !qrCodeText) {
      toast.error('Dados de pagamento não encontrados');
      navigate('/plans');
      return;
    }

    // Calcular tempo restante
    const interval = setInterval(() => {
      if (expiresAt) {
        const now = new Date();
        const expires = new Date(expiresAt);
        const diff = expires - now;

        if (diff <= 0) {
          setTimeRemaining('Expirado');
          clearInterval(interval);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, qrCode, qrCodeText, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCodeText);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <QrCode className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento via PIX
          </h1>
          <p className="text-gray-600">
            Escaneie o QR Code ou copie o código abaixo
          </p>
        </div>

        {/* Informações do pagamento */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Plano:</span>
            <span className="text-gray-900 font-bold">{plan}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Valor:</span>
            <span className="text-2xl font-bold text-green-600">
              R$ {amount?.toFixed(2)}
            </span>
          </div>
          {timeRemaining && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Expira em:
              </span>
              <span className="text-orange-600 font-bold">{timeRemaining}</span>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="bg-white border-4 border-gray-200 rounded-lg p-6 mb-6 flex justify-center">
          <img
            src={qrCode}
            alt="QR Code PIX"
            className="w-64 h-64"
          />
        </div>

        {/* Código PIX */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código PIX (Copiar e Colar)
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={qrCodeText}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
            />
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {copied ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">📱 Como pagar:</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Abra o app do seu banco</li>
            <li>Escolha "Pagar com PIX"</li>
            <li>Escaneie o QR Code ou cole o código acima</li>
            <li>Confirme o pagamento</li>
            <li>Seu plano será ativado automaticamente!</li>
          </ol>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/plans')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={() => navigate('/user-dashboard')}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Ver meu painel
          </button>
        </div>

        {/* Aviso */}
        <p className="text-xs text-gray-500 text-center mt-4">
          O pagamento será confirmado automaticamente. Não feche esta página até concluir o pagamento.
        </p>
      </div>
    </div>
  );
};

export default PaymentPix;

