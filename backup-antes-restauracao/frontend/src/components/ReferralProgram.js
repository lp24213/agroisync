import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Mail } from 'lucide-react';

const ReferralProgram = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'AGROISYNC2025'; // Código de exemplo

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-center mb-8">Programa de Indicação Agroisync</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Convide Amigos e Ganhe Benefícios</h2>
          <p className="text-gray-600 mb-6">
            Indique a Agroisync para produtores, compradores e transportadores e receba recompensas por cada indicação válida.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Recompensas</h3>
              <ul className="text-green-700 space-y-1">
                <li>• 5% de desconto em fretes</li>
                <li>• OU R$5 de cashback por indicação</li>
                <li>• Válido para os primeiros 10 indicados</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Como Funciona</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Compartilhe seu código único</li>
                <li>• Amigo se cadastra usando o código</li>
                <li>• Confirma e-mail para validação</li>
                <li>• Receba sua recompensa automaticamente</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Seu Código de Indicação</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Regras do Programa</h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800">1. Elegibilidade</h3>
              <p>Qualquer usuário ativo da Agroisync pode participar do programa de indicação.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">2. Validação</h3>
              <p>O indicado deve confirmar seu e-mail e completar o cadastro para que a indicação seja válida.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">3. Recompensas</h3>
              <p>As recompensas são creditadas automaticamente após a validação do indicado.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">4. Limite</h3>
              <p>Máximo de 10 indicações válidas por usuário por mês.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">5. Prazo</h3>
              <p>As indicações devem ser utilizadas dentro de 30 dias após o compartilhamento do código.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralProgram;