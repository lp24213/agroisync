import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [planName, setPlanName] = useState('');
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan) {
      setPlanName(plan);
    }
    setLoading(false);
    
    // Iniciar redirecionamento automático após 3 segundos
    const redirectTimer = setTimeout(() => {
      handleAutoRedirect();
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [searchParams]);

  const handleAutoRedirect = () => {
    setRedirecting(true);
    
    // Se for admin, redirecionar para /admin
    if (isAdmin) {
      navigate('/admin');
      return;
    }

    // Se for usuário comum, verificar o plano e redirecionar para painel secreto
    if (planName) {
      if (planName.toLowerCase().includes('produto') || planName.toLowerCase().includes('store') || planName.toLowerCase().includes('anunciante')) {
        // Usuário que vai anunciar produtos - redirecionar para painel secreto da Loja
        navigate('/loja');
      } else if (planName.toLowerCase().includes('frete') || planName.toLowerCase().includes('freight') || planName.toLowerCase().includes('transportador')) {
        // Usuário que vai oferecer fretes - redirecionar para painel secreto do AgroConecta
        navigate('/agroconecta');
      } else if (planName.toLowerCase().includes('comprador') || planName.toLowerCase().includes('cliente')) {
        // Usuário que vai comprar produtos - redirecionar para painel secreto da Loja
        navigate('/loja');
      } else {
        // Plano geral - redirecionar para dashboard
        navigate('/dashboard');
      }
    } else {
      // Sem plano específico - redirecionar para dashboard
      navigate('/dashboard');
    }
  };

  const handleManualRedirect = (path) => {
    setRedirecting(true);
    navigate(path);
  };

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

  if (redirecting) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl">Redirecionando...</p>
          <p className="text-neutral-400 mt-2">Aguarde um momento</p>
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

            {/* Contador de redirecionamento */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-blue-300 text-sm">
                ⏰ Redirecionamento automático em 3 segundos...
              </p>
            </div>
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
                <h3 className="font-semibold text-white mb-2">Painel de Mensagens</h3>
                <p className="text-neutral-400 text-sm">
                  Acesse suas conversas e mensagens privadas
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => handleManualRedirect('/messages')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              💬 Acessar Mensagens
            </button>
            
            <button
              onClick={() => handleManualRedirect('/loja')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              🛒 Painel Secreto da Loja
            </button>
            
            <button
              onClick={() => handleManualRedirect('/agroconecta')}
              className="bg-neutral-700 hover:bg-neutral-600 text-white px-8 py-4 rounded-xl font-semibold border border-neutral-600 hover:border-blue-400 transition-all duration-300 hover:scale-105"
            >
              🚛 Painel Secreto do AgroConecta
            </button>
          </div>

          {/* Redirecionamento Automático */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">
              🔄 Redirecionamento Automático
            </h3>
            <p className="text-blue-300 mb-4">
              Você será redirecionado automaticamente para o seu painel secreto em alguns segundos.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">🛒 Loja (Marketplace)</h4>
                <p className="text-sm text-blue-200">
                  • Controle de anúncios e produtos<br/>
                  • Caixa de mensagens pessoal<br/>
                  • Histórico de vendas
                </p>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-300 mb-2">🚛 AgroConecta (Fretes)</h4>
                <p className="text-sm text-green-200">
                  • Controle de fretes<br/>
                  • Caixa de mensagens pessoal<br/>
                  • Histórico de transportes
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => handleManualRedirect('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleManualRedirect('/loja')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Painel da Loja
              </button>
              <button
                onClick={() => handleManualRedirect('/agroconecta')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Painel do AgroConecta
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleManualRedirect('/admin')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Painel Admin
                </button>
              )}
            </div>
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

