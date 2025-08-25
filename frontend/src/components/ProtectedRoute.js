import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

const ProtectedRoute = ({ children, requirePlan = false }) => {
  const { user, isAdmin, loading } = useAuth();

  // Se ainda está carregando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redirecionar para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se requer plano específico (como mensageria)
  if (requirePlan) {
    // Admin tem acesso total
    if (isAdmin) {
      return children;
    }

    // Verificar se tem plano ativo
    const hasActivePlan = () => {
      if (!user.subscriptions) return false;
      
      const storeSubscription = user.subscriptions.store;
      const agroconectaSubscription = user.subscriptions.agroconecta;
      
      return (storeSubscription && storeSubscription.status === 'active') ||
             (agroconectaSubscription && agroconectaSubscription.status === 'active');
    };

    if (!hasActivePlan()) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Acesso Restrito
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Esta funcionalidade requer um plano ativo.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="font-semibold text-red-800 mb-2">
                      ⚠️ AVISO DE SEGURANÇA
                    </h3>
                    <p className="text-red-700 text-sm">
                      Nunca faça pagamentos sem confirmar a veracidade do produto. 
                      A Agroisync não se responsabiliza por pagamentos entre usuários.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  📋 Planos Disponíveis:
                </h3>
                <ul className="text-yellow-700 text-left space-y-2">
                  <li>• <strong>Loja:</strong> R$25/mês (até 3 anúncios) + Mensageria</li>
                  <li>• <strong>AgroConecta Básico:</strong> R$50/mês + Mensageria</li>
                  <li>• <strong>AgroConecta Pro:</strong> R$149/mês (até 30 fretes) + Mensageria</li>
                </ul>
              </div>

              <div className="space-x-4">
                <a 
                  href="/planos" 
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ver Planos
                </a>
                <a 
                  href="/loja" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ir para Loja
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Se passou por todas as verificações, renderizar o conteúdo
  return children;
};

export default ProtectedRoute;
