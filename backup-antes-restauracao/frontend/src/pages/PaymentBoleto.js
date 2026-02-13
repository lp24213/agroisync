import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FileText, Copy, CheckCircle, Download, Calendar } from 'lucide-react';

const PaymentBoleto = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { barcode, barcodeNumber, pdfUrl, amount, dueDate, plan } = location.state || {};

  const [copied, setCopied] = useState(false);

  if (!barcode || !barcodeNumber) {
    setTimeout(() => {
      toast.error('Dados de pagamento não encontrados');
      navigate('/plans');
    }, 1000);
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(barcodeNumber);
    setCopied(true);
    toast.success('Código de barras copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      toast.error('PDF não disponível');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Boleto Bancário
          </h1>
          <p className="text-gray-600">
            Pague até o vencimento em qualquer banco
          </p>
        </div>

        {/* Informações do pagamento */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Plano:</span>
            <span className="text-gray-900 font-bold">{plan}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Valor:</span>
            <span className="text-2xl font-bold text-orange-600">
              R$ {amount?.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Vencimento:
            </span>
            <span className="text-gray-900 font-bold">
              {new Date(dueDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Linha digitável */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Linha Digitável (Código de Barras)
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={barcode}
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

        {/* Código de barras numérico */}
        {barcodeNumber && barcodeNumber !== barcode && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Barras (Numérico)
            </label>
            <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono">
              {barcodeNumber}
            </div>
          </div>
        )}

        {/* Botão de download */}
        {pdfUrl && (
          <button
            onClick={handleDownloadPDF}
            className="w-full mb-6 px-6 py-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="h-5 w-5" />
            Baixar Boleto (PDF)
          </button>
        )}

        {/* Instruções */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">🏦 Como pagar:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>Copie a linha digitável acima</li>
            <li>Acesse o app ou site do seu banco</li>
            <li>Escolha "Pagar Boleto"</li>
            <li>Cole o código ou escaneie o código de barras</li>
            <li>Confirme o pagamento até a data de vencimento</li>
            <li>Seu plano será ativado em até 2 dias úteis após a confirmação</li>
          </ol>
        </div>

        {/* Aviso importante */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-sm text-yellow-700">
            ⚠️ <strong>Importante:</strong> Após o vencimento, será cobrada multa de 2% e juros de 1% ao mês. 
            Pagamentos via boleto podem levar até 2 dias úteis para serem confirmados.
          </p>
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

        {/* Aviso final */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Guarde este boleto até a confirmação do pagamento. Você também pode baixar o PDF acima.
        </p>
      </div>
    </div>
  );
};

export default PaymentBoleto;

