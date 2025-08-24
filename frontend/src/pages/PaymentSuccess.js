import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
// Componente removido - já renderizado pelo Layout global
// Componente removido - já renderizado pelo Layout global

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [planName, setPlanName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan) {
      setPlanName(plan);
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">

      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Ícone de Sucesso */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Pagamento Confirmado!
          </h1>

          {/* Mensagem */}
          <div className="bg-neutral-800 rounded-2xl p-8 border border-green-500/20 mb-8">
            <p className="text-xl text-neutral-300 mb-4">
              Parabéns! Seu pagamento foi processado com sucesso.
            </p>
            
            {planName && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-green-400 mb-2">
                  Plano: {planName}
                </h2>
                <p className="text-green-300">
                  Seu acesso foi ativado imediatamente!
                </p>
              </div>
            )}

            <p className="text-lg text-neutral-400">
              Você receberá um email de confirmação com todos os detalhes da sua assinatura 
              e instruções de acesso à plataforma.
            </p>
          </div>

          {/* Próximos Passos */}
          <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Próximos Passos
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Email de Confirmação</h3>
                <p className="text-neutral-400 text-sm">
                  Verifique sua caixa de entrada para o email de confirmação
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Acesso Imediato</h3>
                <p className="text-neutral-400 text-sm">
                  Sua conta já está ativa com todas as funcionalidades
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Suporte Disponível</h3>
                <p className="text-neutral-400 text-sm">
                  Nossa equipe está pronta para ajudar você
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cotacao"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Acessar Cotações
            </Link>
            
            <Link
              to="/loja"
              className="bg-neutral-700 hover:bg-neutral-600 text-white px-8 py-4 rounded-xl font-semibold border border-neutral-600 hover:border-blue-400 transition-all duration-300 hover:scale-105"
            >
              Ir para Marketplace
            </Link>
            
            <Link
              to="/admin"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Painel de Controle
            </Link>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-12 bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Precisa de Ajuda?
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Suporte Técnico</h4>
                <p className="text-neutral-400 text-sm mb-2">
                  Email: suporte@agroisync.com
                </p>
                <p className="text-neutral-400 text-sm">
                  WhatsApp: (66) 99236-2830
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-400 mb-2">Faturamento</h4>
                <p className="text-neutral-400 text-sm mb-2">
                  Email: financeiro@agroisync.com
                </p>
                <p className="text-neutral-400 text-sm">
                  Horário: Seg-Sex, 8h às 18h
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      
    </div>
  );
};

export default PaymentSuccess;
