import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment deve ser usado dentro de um PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState({
    hasActivePayment: false,
    planType: null,
    planDetails: null,
    expiresAt: null,
    freeProductLimit: null,
    freeProductsConsumed: 0,
    canSendMessages: true
  });
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      checkPaymentStatus();
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      
      // Simular verificação de pagamento
      // Em produção, isso seria uma chamada para a API
      if (isAdmin) {
        // Admin sempre tem acesso
        setPaymentStatus({
          hasActivePayment: true,
          planType: 'admin',
          planDetails: 'Acesso Administrativo Completo',
          expiresAt: null,
          freeProductLimit: null,
          freeProductsConsumed: 0,
          canSendMessages: true
        });
      } else if (user) {
        // Verificar se o usuário tem pagamento ativo
        // Por enquanto, simulando que todos os usuários logados têm acesso
        // Em produção, isso seria verificado no backend
        
        // Determinar tipo de plano baseado no perfil do usuário
        let planType = 'basic';
        let freeProductLimit = null;
        
        if (user.userType === 'loja' && user.userCategory === 'comprador') {
          planType = 'comprador';
          freeProductLimit = 3;
        } else if (user.userType === 'loja' && user.userCategory === 'anunciante') {
          planType = 'anunciante';
        } else if (user.userType === 'agroconecta' && user.userCategory === 'freteiro') {
          planType = 'freteiro';
        } else if (user.userType === 'agroconecta' && user.userCategory === 'anunciante') {
          planType = 'anunciante_agro';
        }

        setPaymentStatus({
          hasActivePayment: true,
          planType: planType,
          planDetails: `Plano ${planType.charAt(0).toUpperCase() + planType.slice(1)} Ativo`,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          freeProductLimit: freeProductLimit,
          freeProductsConsumed: user.freeProductsConsumed || 0,
          canSendMessages: planType === 'comprador' ? (freeProductLimit - (user.freeProductsConsumed || 0)) > 0 : true
        });
      }
    } catch (error) {
      console.error('Erro ao verificar status de pagamento:', error);
      setPaymentStatus({
        hasActivePayment: false,
        planType: null,
        planDetails: null,
        expiresAt: null,
        freeProductLimit: null,
        freeProductsConsumed: 0,
        canSendMessages: false
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      // Simular carregamento do perfil do usuário
      // Em produção, isso seria uma chamada para a API
      if (user && !isAdmin) {
        setUserProfile({
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType || 'loja',
          userCategory: user.userCategory || 'comprador',
          registrationDate: user.registrationDate || new Date().toISOString(),
          status: user.status || 'pending',
          freeProductLimit: user.userCategory === 'comprador' ? 3 : null,
          freeProductsConsumed: user.freeProductsConsumed || 0,
          // Dados específicos por tipo
          companyName: user.companyName,
          businessType: user.businessType,
          vehiclePlate: user.vehiclePlate,
          vehicleType: user.vehicleType,
          vehicleAxles: user.vehicleAxles,
          businessDescription: user.businessDescription
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
    }
  };

  const hasAccessToSecretPanel = (area) => {
    if (isAdmin) return true;
    
    if (!paymentStatus.hasActivePayment) return false;
    
    // Verificar acesso baseado no tipo de plano e área
    switch (area) {
      case 'loja':
        return ['premium', 'anunciante', 'comprador', 'store', 'loja'].includes(paymentStatus.planType);
      case 'agroconecta':
        return ['premium', 'frete', 'transportador', 'freight', 'agroconecta', 'anunciante_agro'].includes(paymentStatus.planType);
      case 'messages':
        return paymentStatus.hasActivePayment;
      case 'products':
        return ['anunciante', 'anunciante_agro', 'premium'].includes(paymentStatus.planType);
      case 'freights':
        return ['freteiro', 'premium'].includes(paymentStatus.planType);
      default:
        return paymentStatus.hasActivePayment;
    }
  };

  const canSendMessage = () => {
    if (isAdmin) return true;
    
    if (!paymentStatus.hasActivePayment) return false;
    
    // Compradores têm limite de produtos gratuitos
    if (paymentStatus.planType === 'comprador') {
      return paymentStatus.canSendMessages;
    }
    
    return true;
  };

  const getFreeProductInfo = () => {
    if (paymentStatus.planType === 'comprador') {
      return {
        limit: paymentStatus.freeProductLimit,
        consumed: paymentStatus.freeProductsConsumed,
        remaining: paymentStatus.freeProductLimit - paymentStatus.freeProductsConsumed,
        canSend: paymentStatus.canSendMessages
      };
    }
    return null;
  };

  const consumeFreeProduct = async () => {
    try {
      // Simular consumo de produto gratuito
      // Em produção, isso seria uma chamada para a API
      if (paymentStatus.planType === 'comprador' && paymentStatus.freeProductsConsumed < paymentStatus.freeProductLimit) {
        const newConsumed = paymentStatus.freeProductsConsumed + 1;
        const canSend = newConsumed < paymentStatus.freeProductLimit;
        
        setPaymentStatus(prev => ({
          ...prev,
          freeProductsConsumed: newConsumed,
          canSendMessages: canSend
        }));

        // Atualizar perfil local
        if (userProfile) {
          setUserProfile(prev => ({
            ...prev,
            freeProductsConsumed: newConsumed
          }));
        }

        return { success: true, remaining: paymentStatus.freeProductLimit - newConsumed };
      }
      
      return { success: false, message: 'Limite de produtos gratuitos atingido' };
    } catch (error) {
      console.error('Erro ao consumir produto gratuito:', error);
      return { success: false, message: error.message };
    }
  };

  const getPlanInfo = () => {
    if (isAdmin) {
      return {
        name: 'Admin',
        description: 'Acesso administrativo completo',
        features: ['Todos os painéis', 'Controle total', 'Relatórios', 'Usuários'],
        restrictions: []
      };
    }

    if (paymentStatus.planType === 'comprador') {
      const freeInfo = getFreeProductInfo();
      return {
        name: 'Comprador',
        description: 'Acesso para comprar produtos com limite gratuito',
        features: [
          'Visualização de produtos',
          'Sistema de mensagens',
          `${freeInfo.remaining}/3 produtos gratuitos restantes`,
          'Acesso a painel secreto após pagamento'
        ],
        restrictions: [
          'Limite de 3 produtos gratuitos',
          'Dados pessoais limitados até pagamento',
          'Painel secreto bloqueado até pagamento'
        ]
      };
    }

    if (paymentStatus.planType === 'anunciante') {
      return {
        name: 'Anunciante',
        description: 'Acesso para anunciar produtos',
        features: [
          'Cadastro completo de produtos',
          'Sistema de mensagens',
          'Painel secreto com controle total',
          'Relatórios de vendas'
        ],
        restrictions: [
          'Dados pessoais privados até pagamento',
          'Painel secreto bloqueado até pagamento'
        ]
      };
    }

    if (paymentStatus.planType === 'freteiro') {
      return {
        name: 'Freteiro',
        description: 'Acesso para oferecer fretes',
        features: [
          'Cadastro de veículos',
          'Sistema de mensagens',
          'Painel secreto com controle de fretes',
          'Histórico de transportes'
        ],
        restrictions: [
          'Apenas cidade e valor ficam públicos',
          'Dados privados liberados após pagamento'
        ]
      };
    }

    return {
      name: 'Básico',
      description: 'Acesso limitado',
      features: ['Mensagens básicas'],
      restrictions: ['Funcionalidades limitadas']
    };
  };

  const requirePayment = (area) => {
    if (isAdmin) return false;
    
    if (!paymentStatus.hasActivePayment) {
      // Redirecionar para página de pagamento
      window.location.href = '/planos';
      return true;
    }
    
    if (!hasAccessToSecretPanel(area)) {
      // Usuário não tem acesso a esta área específica
      // Pode redirecionar para upgrade de plano
      return true;
    }
    
    return false;
  };

  const getPublicData = (userType, userCategory) => {
    // Retornar apenas dados públicos baseado no tipo de usuário
    if (userType === 'loja' && userCategory === 'anunciante') {
      return {
        companyName: userProfile?.companyName,
        businessType: userProfile?.businessType,
        // Produtos ficam públicos
        products: true
      };
    }
    
    if (userType === 'loja' && userCategory === 'comprador') {
      return {
        name: userProfile?.name,
        city: userProfile?.city,
        state: userProfile?.state,
        // Limite de produtos gratuitos
        freeProductsRemaining: getFreeProductInfo()?.remaining || 0
      };
    }
    
    if (userType === 'agroconecta' && userCategory === 'freteiro') {
      return {
        city: userProfile?.city,
        state: userProfile?.state,
        // Apenas cidade de destino e valor do frete ficam públicos
        freightPublic: true
      };
    }
    
    if (userType === 'agroconecta' && userCategory === 'anunciante') {
      return {
        companyName: userProfile?.companyName,
        businessDescription: userProfile?.businessDescription,
        // Produtos ficam públicos
        products: true
      };
    }
    
    return {};
  };

  const value = {
    paymentStatus,
    userProfile,
    hasAccessToSecretPanel,
    canSendMessage,
    getFreeProductInfo,
    consumeFreeProduct,
    getPlanInfo,
    requirePayment,
    checkPaymentStatus,
    getPublicData,
    loading
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
