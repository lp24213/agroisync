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
import ErrorBoundary from './components/ErrorBoundary';
import { Accessibility } from 'lucide-react';

// CSS unificado (5 arquivos)
import './styles/base.css';
import './styles/layout.css';
import './styles/menu.css';
import './styles/components.css';
import './styles/mobile.css';

// Components que precisam carregar imediatamente
import ProtectedRoute from './components/ProtectedRoute';
import LoadingFallback from './components/LoadingFallback';

// Pages - LAZY LOADING para melhor performance
// Páginas principais (carregar logo)
const AgroisyncHome = React.lazy(() => import('./pages/AgroisyncHome'));
const AgroisyncLogin = React.lazy(() => import('./pages/AgroisyncLogin'));
const AgroisyncRegister = React.lazy(() => import('./pages/AgroisyncRegister'));

// Páginas secundárias (carregar sob demanda)
const AgroisyncHomePrompt = React.lazy(() => import('./pages/AgroisyncHomePrompt'));
const AgroisyncMarketplace = React.lazy(() => import('./pages/AgroisyncMarketplace'));
const AgroisyncLoja = React.lazy(() => import('./pages/AgroisyncLoja'));
const AgroisyncAgroConecta = React.lazy(() => import('./pages/AgroisyncAgroConecta'));
const UsuarioGeral = React.lazy(() => import('./pages/UsuarioGeral'));
const AgroisyncCrypto = React.lazy(() => import('./pages/AgroisyncCrypto'));
const AgroisyncDashboard = React.lazy(() => import('./pages/AgroisyncDashboard'));
const AgroisyncPlans = React.lazy(() => import('./pages/AgroisyncPlans'));
const AgroisyncAbout = React.lazy(() => import('./pages/AgroisyncAbout'));
const AgroisyncContact = React.lazy(() => import('./pages/AgroisyncContact'));
const Partnerships = React.lazy(() => import('./pages/Partnerships'));
const AgroisyncForgotPassword = React.lazy(() => import('./pages/AgroisyncForgotPassword'));
const SignupType = React.lazy(() => import('./pages/SignupType'));
const SignupFreight = React.lazy(() => import('./pages/SignupFreight'));
const SignupStore = React.lazy(() => import('./pages/SignupStore'));
const SignupProduct = React.lazy(() => import('./pages/SignupProduct'));
const SignupGeneral = React.lazy(() => import('./pages/SignupGeneral'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Payment = React.lazy(() => import('./pages/Payment'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const CryptoDetail = React.lazy(() => import('./pages/CryptoDetail'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const UserAdmin = React.lazy(() => import('./pages/UserAdmin'));
const CryptoRoutesStatus = React.lazy(() => import('./components/CryptoRoutesStatus'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));
const Messaging = React.lazy(() => import('./pages/Messaging'));
const TwoFactorAuth = React.lazy(() => import('./pages/TwoFactorAuth'));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail'));
const PaymentSuccess = React.lazy(() => import('./pages/PaymentSuccess'));
const PaymentCancel = React.lazy(() => import('./pages/PaymentCancel'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Help = React.lazy(() => import('./pages/Help'));
const LoginRedirect = React.lazy(() => import('./pages/LoginRedirect'));
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Home = React.lazy(() => import('./pages/Home'));
const Insumos = React.lazy(() => import('./pages/Insumos'));
const Store = React.lazy(() => import('./pages/Store'));
const StorePlans = React.lazy(() => import('./pages/StorePlans'));
const AgroconectaTracking = React.lazy(() => import('./pages/AgroconectaTracking'));
const MarketplaceCategories = React.lazy(() => import('./pages/MarketplaceCategories'));
const MarketplaceSellers = React.lazy(() => import('./pages/MarketplaceSellers'));
const MarketplaceSell = React.lazy(() => import('./pages/MarketplaceSell'));
const AgroconectaOffer = React.lazy(() => import('./pages/AgroconectaOffer'));
const AgroconectaCarriers = React.lazy(() => import('./pages/AgroconectaCarriers'));
const PartnershipsCurrent = React.lazy(() => import('./pages/PartnershipsCurrent'));
const PartnershipsBenefits = React.lazy(() => import('./pages/PartnershipsBenefits'));
const PartnershipsContact = React.lazy(() => import('./pages/PartnershipsContact'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  }
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className='App'>
                {/* Skip Links para Acessibilidade */}
                <a href='#main-content' className='skip-link'>
                  Pular para o conteúdo principal
                </a>
                <a href='#navigation' className='skip-link'>
                  Pular para a navegação
                </a>
                <a href='#footer' className='skip-link'>
                  Pular para o rodapé
                </a>

                {/* AGROISYNC Header */}
                <AgroisyncHeader />

                <Layout>
                  <main id='main-content' role='main'>
                    <DynamicCryptoURL>
                      <React.Suspense fallback={<LoadingFallback message="Carregando página..." />}>
                        <Routes>
                        {/* Public Routes - TODAS CRIPTOGRAFADAS */}
                        <Route path='/' element={<AgroisyncHome />} />
                        <Route path='/:cryptoHash' element={<AgroisyncHome />} />
                        <Route path='/home' element={<Home />} />
                        <Route path='/home/:cryptoHash' element={<Home />} />
                        <Route path='/home-prompt' element={<AgroisyncHomePrompt />} />
                        <Route path='/home-prompt/:cryptoHash' element={<AgroisyncHomePrompt />} />
                        <Route path='/marketplace' element={<AgroisyncMarketplace />} />
                        <Route path='/marketplace/:cryptoHash' element={<AgroisyncMarketplace />} />
                        <Route path='/marketplace/categories' element={<MarketplaceCategories />} />
                        <Route path='/marketplace/categories/:cryptoHash' element={<MarketplaceCategories />} />
                        <Route path='/marketplace/sellers' element={<MarketplaceSellers />} />
                        <Route path='/marketplace/sellers/:cryptoHash' element={<MarketplaceSellers />} />
                        <Route path='/marketplace/sell' element={<MarketplaceSell />} />
                        <Route path='/marketplace/sell/:cryptoHash' element={<MarketplaceSell />} />
                        <Route path='/loja' element={<AgroisyncLoja />} />
                        <Route path='/loja/:cryptoHash' element={<AgroisyncLoja />} />
                        <Route path='/store' element={<Store />} />
                        <Route path='/store/:cryptoHash' element={<Store />} />
                        <Route path='/agroconecta' element={<AgroisyncAgroConecta />} />
                        <Route path='/agroconecta/:cryptoHash' element={<AgroisyncAgroConecta />} />
                        <Route path='/agroconecta/offer' element={<AgroconectaOffer />} />
                        <Route path='/agroconecta/offer/:cryptoHash' element={<AgroconectaOffer />} />
                        <Route path='/agroconecta/carriers' element={<AgroconectaCarriers />} />
                        <Route path='/agroconecta/carriers/:cryptoHash' element={<AgroconectaCarriers />} />
                        <Route path='/agroconecta/tracking' element={<AgroconectaTracking />} />
                        <Route path='/agroconecta/tracking/:cryptoHash' element={<AgroconectaTracking />} />
                        <Route path='/usuario-geral' element={<UsuarioGeral />} />
                        <Route path='/usuario-geral/:cryptoHash' element={<UsuarioGeral />} />
                        <Route path='/tecnologia' element={<AgroisyncCrypto />} />
                        <Route path='/tecnologia/:cryptoHash' element={<AgroisyncCrypto />} />
                        <Route path='/insumos' element={<Insumos />} />
                        <Route path='/insumos/:cryptoHash' element={<Insumos />} />
                        <Route path='/plans' element={<AgroisyncPlans />} />
                        <Route path='/plans/:cryptoHash' element={<AgroisyncPlans />} />
                        <Route path='/planos' element={<AgroisyncPlans />} />
                        <Route path='/planos/:cryptoHash' element={<AgroisyncPlans />} />
                        <Route path='/about' element={<AgroisyncAbout />} />
                        <Route path='/about/:cryptoHash' element={<AgroisyncAbout />} />
                        <Route path='/sobre' element={<AgroisyncAbout />} />
                        <Route path='/sobre/:cryptoHash' element={<AgroisyncAbout />} />
                        <Route path='/contact' element={<AgroisyncContact />} />
                        <Route path='/contact/:cryptoHash' element={<AgroisyncContact />} />
                        <Route path='/partnerships' element={<Partnerships />} />
                        <Route path='/partnerships/:cryptoHash' element={<Partnerships />} />
                        <Route path='/partnerships/current' element={<PartnershipsCurrent />} />
                        <Route path='/partnerships/current/:cryptoHash' element={<PartnershipsCurrent />} />
                        <Route path='/partnerships/benefits' element={<PartnershipsBenefits />} />
                        <Route path='/partnerships/benefits/:cryptoHash' element={<PartnershipsBenefits />} />
                        <Route path='/partnerships/contact' element={<PartnershipsContact />} />
                        <Route path='/partnerships/contact/:cryptoHash' element={<PartnershipsContact />} />
                        <Route path='/faq' element={<FAQ />} />
                        <Route path='/faq/:cryptoHash' element={<FAQ />} />
                        <Route path='/terms' element={<Terms />} />
                        <Route path='/terms/:cryptoHash' element={<Terms />} />
                        <Route path='/privacy' element={<Privacy />} />
                        <Route path='/privacy/:cryptoHash' element={<Privacy />} />
                        <Route path='/help' element={<Help />} />
                        <Route path='/help/:cryptoHash' element={<Help />} />

                        {/* Detail Pages - TODAS CRIPTOGRAFADAS */}
                        <Route path='/produto/:id' element={<ProductDetail />} />
                        <Route path='/produto/:id/:cryptoHash' element={<ProductDetail />} />
                        <Route path='/crypto/:id' element={<CryptoDetail />} />
                        <Route path='/crypto/:id/:cryptoHash' element={<CryptoDetail />} />

                        {/* Auth Routes - TODAS CRIPTOGRAFADAS */}
                        <Route path='/register' element={<AgroisyncRegister />} />
                        <Route path='/register/:cryptoHash' element={<AgroisyncRegister />} />
                        <Route path='/login' element={<AgroisyncLogin />} />
                        <Route path='/login/:cryptoHash' element={<AgroisyncLogin />} />
                        <Route path='/signup' element={<SignupType />} />
                        <Route path='/signup/:cryptoHash' element={<SignupType />} />
                        <Route path='/signup/general' element={<SignupGeneral />} />
                        <Route path='/signup/general/:cryptoHash' element={<SignupGeneral />} />
                        <Route path='/signup/freight' element={<SignupFreight />} />
                        <Route path='/signup/freight/:cryptoHash' element={<SignupFreight />} />
                        <Route path='/frete' element={<SignupFreight />} />
                        <Route path='/frete/:cryptoHash' element={<SignupFreight />} />
                        <Route path='/signup/store' element={<SignupStore />} />
                        <Route path='/signup/store/:cryptoHash' element={<SignupStore />} />
                        <Route path='/signup/product' element={<SignupProduct />} />
                        <Route path='/signup/product/:cryptoHash' element={<SignupProduct />} />
                        <Route path='/store-plans' element={<StorePlans />} />
                        <Route path='/store-plans/:cryptoHash' element={<StorePlans />} />
                        <Route path='/payment' element={<Payment />} />
                        <Route path='/payment/:cryptoHash' element={<Payment />} />
                        <Route path='/forgot-password' element={<AgroisyncForgotPassword />} />
                        <Route path='/forgot-password/:cryptoHash' element={<AgroisyncForgotPassword />} />
                        <Route path='/reset-password' element={<ResetPassword />} />
                        <Route path='/reset-password/:cryptoHash' element={<ResetPassword />} />
                        <Route path='/two-factor-auth' element={<TwoFactorAuth />} />
                        <Route path='/two-factor-auth/:cryptoHash' element={<TwoFactorAuth />} />
                        <Route path='/verify-email' element={<VerifyEmail />} />
                        <Route path='/verify-email/:cryptoHash' element={<VerifyEmail />} />
                        <Route path='/login-redirect' element={<LoginRedirect />} />
                        <Route path='/login-redirect/:cryptoHash' element={<LoginRedirect />} />

                        {/* Payment Routes */}
                        <Route path='/payment/success' element={<PaymentSuccess />} />
                        <Route path='/payment/cancel' element={<PaymentCancel />} />

                        {/* Protected Routes - TODAS CRIPTOGRAFADAS */}
                        <Route
                          path='/dashboard'
                          element={
                            <ProtectedRoute>
                              <AgroisyncDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/dashboard/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <AgroisyncDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/user-dashboard'
                          element={
                            <ProtectedRoute>
                              <UserDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/user-dashboard/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <UserDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/messaging'
                          element={
                            <ProtectedRoute>
                              <Messaging />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/messaging/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <Messaging />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/admin'
                          element={
                            <ProtectedRoute>
                              <AdminPanel />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/admin/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <AdminPanel />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/useradmin'
                          element={
                            <ProtectedRoute>
                              <UserAdmin />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/useradmin/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <UserAdmin />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/crypto-routes'
                          element={
                            <ProtectedRoute>
                              <CryptoRoutesStatus />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/crypto-routes/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <CryptoRoutesStatus />
                            </ProtectedRoute>
                          }
                        />

                        {/* Error Routes - TODAS CRIPTOGRAFADAS */}
                        <Route path='/unauthorized' element={<Unauthorized />} />
                        <Route path='/unauthorized/:cryptoHash' element={<Unauthorized />} />
                        <Route path='*' element={<NotFound />} />
                        </Routes>
                      </React.Suspense>
                    </DynamicCryptoURL>
                  </main>
                </Layout>

                {/* Widget de Clima Futurista */}
                <div className='bg-gray-50 py-8'>
                  <div className='container mx-auto px-4'>
                    <div className='mb-8 text-center'>
                      <h2 className='mb-2 text-2xl font-bold text-gray-900' style={{ textAlign: 'center' }}>
                        Informações Climáticas
                      </h2>
                      <p className='text-sm text-gray-600' style={{ textAlign: 'center' }}>
                        Dados meteorológicos em tempo real para otimizar suas decisões agrícolas
                      </p>
                    </div>
                    <div className='flex justify-center'>
                      <GlobalWeatherWidget />
                    </div>
                  </div>
                </div>

                {/* AGROISYNC Footer */}
                <footer id='footer' role='contentinfo'>
                  <AgroisyncFooter />
                </footer>

                {/* AI Chatbot Futurista */}
                <AIChatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

                {/* Botão do Chatbot Preto */}
                <button
                  onClick={() => setIsChatbotOpen(true)}
                  className='fixed bottom-6 right-6 z-50 transform rounded-full border border-black shadow-2xl transition-all duration-300 hover:scale-110'
                  aria-label='Abrir chatbot AI'
                  style={{
                    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
                    padding: '14px'
                  }}
                >
                  <div className='relative flex items-center justify-center'>
                    <svg className='h-6 w-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 14c3.866 0 7-2.015 7-4.5S15.866 5 12 5 5 7.015 5 9.5c0 1.264.79 2.402 2.084 3.213-.031 1.02-.337 1.982-.938 2.787 1.31-.172 2.52-.557 3.449-1.078.761.108 1.558.178 2.405.178z'
                      />
                    </svg>
                    <div className='absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-white'></div>
                  </div>
                </button>

                {/* LGPD Compliance Futurista */}
                {showLGPD && (
                  <LGPDCompliance onAccept={handleLGPDAccept} onDecline={handleLGPDDecline} isVisible={showLGPD} />
                )}

                {/* Painel de Acessibilidade Futurista */}
                <AccessibilityPanel isOpen={isAccessibilityOpen} onClose={() => setIsAccessibilityOpen(false)} />

                {/* Botão de Acessibilidade Azul */}
                <button
                  onClick={() => setIsAccessibilityOpen(true)}
                  className='fixed bottom-6 left-6 z-50 transform rounded-full bg-blue-600 p-4 text-white shadow-2xl transition-all duration-300 hover:scale-110'
                  aria-label='Abrir painel de acessibilidade'
                >
                  <Accessibility className='h-6 w-6 text-white' />
                </button>

                {/* Toast Notifications */}
                <Toaster
                  position='top-right'
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--bg-glass)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-light)',
                      backdropFilter: 'var(--blur-glass)',
                      borderRadius: 'var(--border-radius)'
                    },
                    success: {
                      iconTheme: {
                        primary: 'var(--success)',
                        secondary: 'var(--text-inverse)'
                      }
                    },
                    error: {
                      iconTheme: {
                        primary: 'var(--danger)',
                        secondary: 'var(--text-inverse)'
                      }
                    }
                  }}
                />
                </div>
              </Router>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
