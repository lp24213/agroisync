import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import AgroisyncHeader from './components/AgroisyncHeader';
import AgroisyncFooter from './components/AgroisyncFooter';
import AIChatbot from './components/ai/AIChatbot';
import LGPDCompliance from './components/LGPDCompliance';
import GlobalWeatherWidget from './components/GlobalWeatherWidget';
import AccessibilityPanel from './components/AccessibilityPanel';
import DynamicCryptoURL from './components/DynamicCryptoURL';
import { Accessibility } from 'lucide-react';

// CSS unificado (5 arquivos)
import './styles/base.css';
import './styles/layout.css';
import './styles/menu.css';
import './styles/components.css';
import './styles/mobile.css';

// Pages - APENAS AS QUE EXISTEM
import AgroisyncHome from './pages/AgroisyncHome';
import AgroisyncHomePrompt from './pages/AgroisyncHomePrompt';
import AgroisyncMarketplace from './pages/AgroisyncMarketplace';
import AgroisyncLoja from './pages/AgroisyncLoja';
import AgroisyncAgroConecta from './pages/AgroisyncAgroConecta';
import UsuarioGeral from './pages/UsuarioGeral';
import AgroisyncCrypto from './pages/AgroisyncCrypto';
import AgroisyncDashboard from './pages/AgroisyncDashboard';
import AgroisyncPlans from './pages/AgroisyncPlans';
import AgroisyncAbout from './pages/AgroisyncAbout';
import AgroisyncContact from './pages/AgroisyncContact';
import Partnerships from './pages/Partnerships';
import AgroisyncLogin from './pages/AgroisyncLogin';
import AgroisyncRegister from './pages/AgroisyncRegister';
import AgroisyncForgotPassword from './pages/AgroisyncForgotPassword';
import SignupType from './pages/SignupType';
import SignupFreight from './pages/SignupFreight';
import SignupStore from './pages/SignupStore';
import SignupProduct from './pages/SignupProduct';
import SignupGeneral from './pages/SignupGeneral';
import ResetPassword from './pages/ResetPassword';
import Payment from './pages/Payment';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetail from './pages/ProductDetail';
import CryptoDetail from './pages/CryptoDetail';
import AdminPanel from './pages/AdminPanel';
import UserAdmin from './pages/UserAdmin';
import CryptoRoutesStatus from './components/CryptoRoutesStatus';
import UserDashboard from './pages/UserDashboard';
import Messaging from './pages/Messaging';
import TwoFactorAuth from './pages/TwoFactorAuth';
import VerifyEmail from './pages/VerifyEmail';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Help from './pages/Help';
import LoginRedirect from './pages/LoginRedirect';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Insumos from './pages/Insumos';
import Store from './pages/Store';
import StorePlans from './pages/StorePlans';
import AgroconectaTracking from './pages/AgroconectaTracking';
import MarketplaceCategories from './pages/MarketplaceCategories';
import MarketplaceSellers from './pages/MarketplaceSellers';
import MarketplaceSell from './pages/MarketplaceSell';
import AgroconectaOffer from './pages/AgroconectaOffer';
import AgroconectaCarriers from './pages/AgroconectaCarriers';
import PartnershipsCurrent from './pages/PartnershipsCurrent';
import PartnershipsBenefits from './pages/PartnershipsBenefits';
import PartnershipsContact from './pages/PartnershipsContact';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = React.useState(false);
  const [showLGPD, setShowLGPD] = React.useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = React.useState(false);

  React.useEffect(() => {
    // Verificar se já aceitou LGPD
    const lgpdConsent = localStorage.getItem('agroisync-lgpd-consent');
    if (!lgpdConsent) {
      setShowLGPD(true);
    }
  }, []);

  const handleLGPDAccept = () => {
    setShowLGPD(false);
  };

  const handleLGPDDecline = () => {
    setShowLGPD(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="App">
                {/* Skip Links para Acessibilidade */}
                <a href="#main-content" className="skip-link">
                  Pular para o conteúdo principal
                </a>
                <a href="#navigation" className="skip-link">
                  Pular para a navegação
                </a>
                <a href="#footer" className="skip-link">
                  Pular para o rodapé
                </a>

                {/* AGROISYNC Header */}
                <AgroisyncHeader />
                
                <Layout>
                  <main id="main-content" role="main">
                    <DynamicCryptoURL>
                      <Routes>
                    {/* Public Routes - TODAS CRIPTOGRAFADAS */}
                    <Route path="/" element={<AgroisyncHome />} />
                    <Route path="/:cryptoHash" element={<AgroisyncHome />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/home/:cryptoHash" element={<Home />} />
                    <Route path="/home-prompt" element={<AgroisyncHomePrompt />} />
                    <Route path="/home-prompt/:cryptoHash" element={<AgroisyncHomePrompt />} />
                    <Route path="/marketplace" element={<AgroisyncMarketplace />} />
                    <Route path="/marketplace/:cryptoHash" element={<AgroisyncMarketplace />} />
                    <Route path="/marketplace/categories" element={<MarketplaceCategories />} />
                    <Route path="/marketplace/categories/:cryptoHash" element={<MarketplaceCategories />} />
                    <Route path="/marketplace/sellers" element={<MarketplaceSellers />} />
                    <Route path="/marketplace/sellers/:cryptoHash" element={<MarketplaceSellers />} />
                    <Route path="/marketplace/sell" element={<MarketplaceSell />} />
                    <Route path="/marketplace/sell/:cryptoHash" element={<MarketplaceSell />} />
                    <Route path="/loja" element={<AgroisyncLoja />} />
                    <Route path="/loja/:cryptoHash" element={<AgroisyncLoja />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/store/:cryptoHash" element={<Store />} />
                    <Route path="/agroconecta" element={<AgroisyncAgroConecta />} />
                    <Route path="/agroconecta/:cryptoHash" element={<AgroisyncAgroConecta />} />
                    <Route path="/agroconecta/offer" element={<AgroconectaOffer />} />
                    <Route path="/agroconecta/offer/:cryptoHash" element={<AgroconectaOffer />} />
                    <Route path="/agroconecta/carriers" element={<AgroconectaCarriers />} />
                    <Route path="/agroconecta/carriers/:cryptoHash" element={<AgroconectaCarriers />} />
                    <Route path="/agroconecta/tracking" element={<AgroconectaTracking />} />
                    <Route path="/agroconecta/tracking/:cryptoHash" element={<AgroconectaTracking />} />
                    <Route path="/usuario-geral" element={<UsuarioGeral />} />
                    <Route path="/usuario-geral/:cryptoHash" element={<UsuarioGeral />} />
                    <Route path="/tecnologia" element={<AgroisyncCrypto />} />
                    <Route path="/tecnologia/:cryptoHash" element={<AgroisyncCrypto />} />
                    <Route path="/insumos" element={<Insumos />} />
                    <Route path="/insumos/:cryptoHash" element={<Insumos />} />
                    <Route path="/plans" element={<AgroisyncPlans />} />
                    <Route path="/plans/:cryptoHash" element={<AgroisyncPlans />} />
                    <Route path="/planos" element={<AgroisyncPlans />} />
                    <Route path="/planos/:cryptoHash" element={<AgroisyncPlans />} />
                    <Route path="/about" element={<AgroisyncAbout />} />
                    <Route path="/about/:cryptoHash" element={<AgroisyncAbout />} />
                    <Route path="/sobre" element={<AgroisyncAbout />} />
                    <Route path="/sobre/:cryptoHash" element={<AgroisyncAbout />} />
                    <Route path="/contact" element={<AgroisyncContact />} />
                    <Route path="/contact/:cryptoHash" element={<AgroisyncContact />} />
                    <Route path="/partnerships" element={<Partnerships />} />
                    <Route path="/partnerships/:cryptoHash" element={<Partnerships />} />
                    <Route path="/partnerships/current" element={<PartnershipsCurrent />} />
                    <Route path="/partnerships/current/:cryptoHash" element={<PartnershipsCurrent />} />
                    <Route path="/partnerships/benefits" element={<PartnershipsBenefits />} />
                    <Route path="/partnerships/benefits/:cryptoHash" element={<PartnershipsBenefits />} />
                    <Route path="/partnerships/contact" element={<PartnershipsContact />} />
                    <Route path="/partnerships/contact/:cryptoHash" element={<PartnershipsContact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/faq/:cryptoHash" element={<FAQ />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/terms/:cryptoHash" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/privacy/:cryptoHash" element={<Privacy />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/help/:cryptoHash" element={<Help />} />
                    
                    {/* Detail Pages - TODAS CRIPTOGRAFADAS */}
                    <Route path="/produto/:id" element={<ProductDetail />} />
                    <Route path="/produto/:id/:cryptoHash" element={<ProductDetail />} />
                    <Route path="/crypto/:id" element={<CryptoDetail />} />
                    <Route path="/crypto/:id/:cryptoHash" element={<CryptoDetail />} />
                    
                    {/* Auth Routes - TODAS CRIPTOGRAFADAS */}
                    <Route path="/register" element={<AgroisyncRegister />} />
                    <Route path="/register/:cryptoHash" element={<AgroisyncRegister />} />
                    <Route path="/login" element={<AgroisyncLogin />} />
                    <Route path="/login/:cryptoHash" element={<AgroisyncLogin />} />
                    <Route path="/signup" element={<SignupType />} />
                    <Route path="/signup/:cryptoHash" element={<SignupType />} />
                    <Route path="/signup/general" element={<SignupGeneral />} />
                    <Route path="/signup/general/:cryptoHash" element={<SignupGeneral />} />
                    <Route path="/signup/freight" element={<SignupFreight />} />
                    <Route path="/signup/freight/:cryptoHash" element={<SignupFreight />} />
                    <Route path="/frete" element={<SignupFreight />} />
                    <Route path="/frete/:cryptoHash" element={<SignupFreight />} />
                    <Route path="/signup/store" element={<SignupStore />} />
                    <Route path="/signup/store/:cryptoHash" element={<SignupStore />} />
                    <Route path="/signup/product" element={<SignupProduct />} />
                    <Route path="/signup/product/:cryptoHash" element={<SignupProduct />} />
                    <Route path="/store-plans" element={<StorePlans />} />
                    <Route path="/store-plans/:cryptoHash" element={<StorePlans />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/payment/:cryptoHash" element={<Payment />} />
                    <Route path="/forgot-password" element={<AgroisyncForgotPassword />} />
                    <Route path="/forgot-password/:cryptoHash" element={<AgroisyncForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/reset-password/:cryptoHash" element={<ResetPassword />} />
                    <Route path="/two-factor-auth" element={<TwoFactorAuth />} />
                    <Route path="/two-factor-auth/:cryptoHash" element={<TwoFactorAuth />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/verify-email/:cryptoHash" element={<VerifyEmail />} />
                    <Route path="/login-redirect" element={<LoginRedirect />} />
                    <Route path="/login-redirect/:cryptoHash" element={<LoginRedirect />} />
                    
                    {/* Payment Routes */}
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/cancel" element={<PaymentCancel />} />
                    
            {/* Protected Routes - TODAS CRIPTOGRAFADAS */}
            <Route path="/dashboard" element={<ProtectedRoute><AgroisyncDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/:cryptoHash" element={<ProtectedRoute><AgroisyncDashboard /></ProtectedRoute>} />
            <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/user-dashboard/:cryptoHash" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/messaging" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
            <Route path="/messaging/:cryptoHash" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/admin/:cryptoHash" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/useradmin" element={<ProtectedRoute><UserAdmin /></ProtectedRoute>} />
            <Route path="/useradmin/:cryptoHash" element={<ProtectedRoute><UserAdmin /></ProtectedRoute>} />
            <Route path="/crypto-routes" element={<ProtectedRoute><CryptoRoutesStatus /></ProtectedRoute>} />
            <Route path="/crypto-routes/:cryptoHash" element={<ProtectedRoute><CryptoRoutesStatus /></ProtectedRoute>} />
                    
                    {/* Error Routes - TODAS CRIPTOGRAFADAS */}
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/unauthorized/:cryptoHash" element={<Unauthorized />} />
                    <Route path="*" element={<NotFound />} />
                      </Routes>
                    </DynamicCryptoURL>
                  </main>
                </Layout>
                
                       {/* Widget de Clima Futurista */}
                       <div className="bg-gray-50 py-8">
                         <div className="container mx-auto px-4">
                           <div className="text-center mb-8">
                             <h2 className="text-2xl font-bold mb-2 text-gray-900" style={{ textAlign: 'center' }}>
                               Informações Climáticas
                             </h2>
                             <p className="text-sm text-gray-600" style={{ textAlign: 'center' }}>Dados meteorológicos em tempo real para otimizar suas decisões agrícolas</p>
                           </div>
                           <div className="flex justify-center">
                             <GlobalWeatherWidget />
                           </div>
                         </div>
                       </div>

                {/* AGROISYNC Footer */}
                <footer id="footer" role="contentinfo">
                  <AgroisyncFooter />
                </footer>
                
                {/* AI Chatbot Futurista */}
                <AIChatbot 
                  isOpen={isChatbotOpen} 
                  onClose={() => setIsChatbotOpen(false)} 
                />
                
                       {/* Botão do Chatbot Preto */}
                       <button
                         onClick={() => setIsChatbotOpen(true)}
                         className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 border border-black"
                         aria-label="Abrir chatbot AI"
                         style={{
                           background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
                           padding: '14px',
                         }}
                       >
                         <div className="relative flex items-center justify-center">
                           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c3.866 0 7-2.015 7-4.5S15.866 5 12 5 5 7.015 5 9.5c0 1.264.79 2.402 2.084 3.213-.031 1.02-.337 1.982-.938 2.787 1.31-.172 2.52-.557 3.449-1.078.761.108 1.558.178 2.405.178z" />
                           </svg>
                           <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                         </div>
                       </button>
                
                {/* LGPD Compliance Futurista */}
                {showLGPD && (
                  <LGPDCompliance 
                    onAccept={handleLGPDAccept}
                    onDecline={handleLGPDDecline}
                    isVisible={showLGPD}
                  />
                )}

                {/* Painel de Acessibilidade Futurista */}
                <AccessibilityPanel 
                  isOpen={isAccessibilityOpen} 
                  onClose={() => setIsAccessibilityOpen(false)} 
                />
                
                       {/* Botão de Acessibilidade Azul */}
                       <button
                         onClick={() => setIsAccessibilityOpen(true)}
                         className="fixed bottom-6 left-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
                         aria-label="Abrir painel de acessibilidade"
                       >
                         <Accessibility className="w-6 h-6 text-white" />
                       </button>
                
                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--bg-glass)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-light)',
                      backdropFilter: 'var(--blur-glass)',
                      borderRadius: 'var(--border-radius)',
                    },
                    success: {
                      iconTheme: {
                        primary: 'var(--success)',
                        secondary: 'var(--text-inverse)',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: 'var(--danger)',
                        secondary: 'var(--text-inverse)',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;