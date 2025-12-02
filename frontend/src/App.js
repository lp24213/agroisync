import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
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
import ErrorBoundary from './components/ErrorBoundary';
import LoadingFallback from './components/LoadingFallback';
import DynamicCryptoURL from './components/DynamicCryptoURL';
import { Accessibility } from 'lucide-react';

// CSS unificado (5 arquivos)
import './styles/base.css';
import './styles/layout.css';
import './styles/menu.css';
import './styles/components.css';
import './styles/mobile.css';

// Components que precisam carregar imediatamente
import ProtectedRoute from './components/ProtectedRoute';
import CryptoRouteHandler from './components/CryptoRouteHandler';

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
const PaymentPix = React.lazy(() => import('./pages/PaymentPix'));
const PaymentBoleto = React.lazy(() => import('./pages/PaymentBoleto'));
const PaymentCreditCard = React.lazy(() => import('./pages/PaymentCreditCard'));
const AgroisyncAbout = React.lazy(() => import('./pages/AgroisyncAbout'));
const AgroisyncContact = React.lazy(() => import('./pages/AgroisyncContact'));
const AgroisyncForgotPassword = React.lazy(() => import('./pages/AgroisyncForgotPassword'));
const SignupType = React.lazy(() => import('./pages/SignupType'));
const SignupFreight = React.lazy(() => import('./pages/SignupFreight'));
const SignupStore = React.lazy(() => import('./pages/SignupStore'));
const SignupProduct = React.lazy(() => import('./pages/SignupProduct'));
const SignupGeneral = React.lazy(() => import('./pages/SignupGeneral'));
const SignupUnified = React.lazy(() => import('./pages/SignupUnified'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Payment = React.lazy(() => import('./pages/Payment'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const ProductDetailNew = React.lazy(() => import('./pages/ProductDetailNew'));
const PriceAlerts = React.lazy(() => import('./pages/PriceAlerts'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const TermosResponsabilidade = React.lazy(() => import('./pages/TermosResponsabilidade'));
const CryptoDetail = React.lazy(() => import('./pages/CryptoDetail'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const UserAdmin = React.lazy(() => import('./pages/UserAdmin'));
const MediaKit = React.lazy(() => import('./pages/MediaKit'));
const CryptoRoutesStatus = React.lazy(() => import('./components/CryptoRoutesStatus'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));
const CryptoDashboard = React.lazy(() => import('./pages/CryptoDashboard'));
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
const ClimaInsumos = React.lazy(() => import('./pages/ClimaInsumos'));
const APIPage = React.lazy(() => import('./pages/APIPage'));
const Store = React.lazy(() => import('./pages/Store'));
const StorePlans = React.lazy(() => import('./pages/StorePlans'));
// Importações diretas para evitar problemas de lazy loading
import MarketplaceCategories from './pages/MarketplaceCategories';
import MarketplaceSellers from './pages/MarketplaceSellers';
import MarketplaceSell from './pages/MarketplaceSell';
import AgroconectaOffer from './pages/AgroconectaOffer';
import AgroconectaCarriers from './pages/AgroconectaCarriers';
import AgroconectaTracking from './pages/AgroconectaTracking';
// Importações diretas para parcerias também
import Partnerships from './pages/Partnerships';
import PartnershipsCurrent from './pages/PartnershipsCurrent';
import PartnershipsBenefits from './pages/PartnershipsBenefits';
import PartnershipsContact from './pages/PartnershipsContact';

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
                    <React.Suspense fallback={<LoadingFallback message="Carregando página..." />}>
                      <DynamicCryptoURL>
                      <Routes>
                        {/* Public Routes - OTIMIZADAS */}
                        <Route path='/' element={<AgroisyncHome />} />
                        <Route path='/home' element={<Home />} />
                        <Route path='/home-prompt' element={<AgroisyncHomePrompt />} />
                        
                        {/* Produtos Routes (novo nome) */}
                        <Route path='/produtos' element={<AgroisyncMarketplace />} />
                        <Route path='/produtos/:cryptoHash' element={<AgroisyncMarketplace />} />
                        <Route path='/produtos/categories' element={<MarketplaceCategories />} />
                        <Route path='/produtos/categories/:cryptoHash' element={<MarketplaceCategories />} />
                        <Route path='/produtos/sellers' element={<MarketplaceSellers />} />
                        <Route path='/produtos/sellers/:cryptoHash' element={<MarketplaceSellers />} />
                        <Route path='/produtos/sell' element={<MarketplaceSell />} />
                        <Route path='/produtos/sell/:cryptoHash' element={<MarketplaceSell />} />
                        
                        {/* Marketplace Routes (compatibilidade - redireciona) */}
                        <Route path='/marketplace' element={<Navigate to="/produtos" replace />} />
                        <Route path='/marketplace/categories' element={<Navigate to="/produtos/categories" replace />} />
                        <Route path='/marketplace/sellers' element={<Navigate to="/produtos/sellers" replace />} />
                        <Route path='/marketplace/sell' element={<Navigate to="/produtos/sell" replace />} />
                        
                        {/* Store Routes */}
                        <Route path='/loja' element={<AgroisyncLoja />} />
                        <Route path='/store' element={<Store />} />
                        
                        {/* Frete Routes (novo nome) */}
                        <Route path='/frete' element={<AgroisyncAgroConecta />} />
                        <Route path='/frete/:cryptoHash' element={<AgroisyncAgroConecta />} />
                        <Route path='/frete/offer' element={<AgroconectaOffer />} />
                        <Route path='/frete/offer/:cryptoHash' element={<AgroconectaOffer />} />
                        <Route path='/frete/carriers' element={<AgroconectaCarriers />} />
                        <Route path='/frete/carriers/:cryptoHash' element={<AgroconectaCarriers />} />
                        <Route path='/frete/tracking' element={<AgroconectaTracking />} />
                        <Route path='/frete/tracking/:cryptoHash' element={<AgroconectaTracking />} />
                        
                        {/* AgroConecta Routes (compatibilidade - redireciona) */}
                        <Route path='/agroconecta' element={<Navigate to="/frete" replace />} />
                        <Route path='/agroconecta/offer' element={<Navigate to="/frete/offer" replace />} />
                        <Route path='/agroconecta/carriers' element={<Navigate to="/frete/carriers" replace />} />
                        <Route path='/agroconecta/tracking' element={<Navigate to="/frete/tracking" replace />} />
                        
                        {/* Partnerships Routes */}
                        <Route path='/partnerships' element={<Partnerships />} />
                        <Route path='/partnerships/:cryptoHash' element={<Partnerships />} />
                        <Route path='/partnerships/current' element={<PartnershipsCurrent />} />
                        <Route path='/partnerships/current/:cryptoHash' element={<PartnershipsCurrent />} />
                        <Route path='/partnerships/benefits' element={<PartnershipsBenefits />} />
                        <Route path='/partnerships/benefits/:cryptoHash' element={<PartnershipsBenefits />} />
                        <Route path='/partnerships/contact' element={<PartnershipsContact />} />
                        <Route path='/partnerships/contact/:cryptoHash' element={<PartnershipsContact />} />
                        
                        {/* Main Pages Routes */}
                        <Route path='/sobre' element={<AgroisyncAbout />} />
                        <Route path='/about' element={<AgroisyncAbout />} />
                        <Route path='/planos' element={<AgroisyncPlans />} />
                        <Route path='/plans' element={<AgroisyncPlans />} />
                        <Route path='/clima' element={<ClimaInsumos />} />
                        <Route path='/weather' element={<ClimaInsumos />} />
                        <Route path='/insumos' element={<ClimaInsumos />} />
                        <Route path='/supplies' element={<ClimaInsumos />} />
                        <Route path='/clima-insumos' element={<ClimaInsumos />} />
                        <Route path='/api' element={<APIPage />} />
                        <Route path='/api-key' element={<APIPage />} />
                        <Route path='/payment/pix' element={<PaymentPix />} />
                        <Route path='/payment/boleto' element={<PaymentBoleto />} />
                        <Route path='/payment/credit-card' element={<PaymentCreditCard />} />
                        <Route path='/contato' element={<AgroisyncContact />} />
                        <Route path='/contact' element={<AgroisyncContact />} />
                        
                        {/* User Routes */}
                        <Route path='/usuario-geral' element={<UsuarioGeral />} />
                        <Route path='/tecnologia' element={<AgroisyncCrypto />} />
                        <Route path='/crypto' element={<AgroisyncCrypto />} />
                        
                        {/* Legal Routes */}
                        <Route path='/faq' element={<FAQ />} />
                        <Route path='/terms' element={<Terms />} />
                        <Route path='/privacy' element={<Privacy />} />
                        <Route path='/help' element={<Help />} />

                        {/* Detail Pages */}
                        <Route path='/produto/:id' element={<ProductDetail />} />
                        <Route path='/product/:id' element={<ProductDetailNew />} />
                        <Route path='/produto/:id/:cryptoHash' element={<CryptoRouteHandler><ProductDetail /></CryptoRouteHandler>} />
                        <Route path='/price-alerts' element={<PriceAlerts />} />
                        <Route path='/favorites' element={<Favorites />} />
                        <Route path='/termos-responsabilidade' element={<TermosResponsabilidade />} />
                        <Route path='/crypto/:id' element={<CryptoDetail />} />
                        <Route path='/crypto/:id/:cryptoHash' element={<CryptoRouteHandler><CryptoDetail /></CryptoRouteHandler>} />

                        {/* Auth Routes */}
                        <Route path='/register' element={<SignupUnified />} />
                        <Route path='/login' element={<AgroisyncLogin />} />
                        <Route path='/signup' element={<SignupUnified />} />
                        <Route path='/signup/type' element={<SignupType />} />
                        <Route path='/signup/general' element={<SignupUnified />} />
                        <Route path='/signup/unified' element={<SignupUnified />} />
                        <Route path='/signup/old' element={<AgroisyncRegister />} />
                        <Route path='/signup/freight' element={<SignupFreight />} />
                        <Route path='/signup/store' element={<SignupStore />} />
                        <Route path='/signup/product' element={<SignupProduct />} />
                        <Route path='/store-plans' element={<StorePlans />} />
                        <Route path='/forgot-password' element={<AgroisyncForgotPassword />} />
                        <Route path='/reset-password' element={<ResetPassword />} />
                        <Route path='/two-factor-auth' element={<TwoFactorAuth />} />
                        <Route path='/verify-email' element={<VerifyEmail />} />
                        <Route path='/login-redirect' element={<LoginRedirect />} />

                        {/* Payment Routes */}
                        <Route path='/payment' element={<Payment />} />
                        <Route path='/payment/:cryptoHash' element={<CryptoRouteHandler><Payment /></CryptoRouteHandler>} />
                        <Route path='/payment/success' element={<PaymentSuccess />} />
                        <Route path='/payment/success/:cryptoHash' element={<CryptoRouteHandler><PaymentSuccess /></CryptoRouteHandler>} />
                        <Route path='/payment/cancel' element={<PaymentCancel />} />
                        <Route path='/payment/cancel/:cryptoHash' element={<CryptoRouteHandler><PaymentCancel /></CryptoRouteHandler>} />

                        {/* Protected Routes - Otimizadas */}
                        <Route
                          path='/dashboard'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <AgroisyncDashboard />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/dashboard/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <AgroisyncDashboard />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/crypto-dashboard'
                          element={
                            <ProtectedRoute>
                              <CryptoDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/user-dashboard'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <UserDashboard />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/user-dashboard/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <UserDashboard />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/messaging'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <Messaging />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/messaging/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <Messaging />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/admin'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <AdminPanel />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/admin/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <AdminPanel />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/useradmin'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <UserAdmin />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/media-kit'
                          element={
                            <ProtectedRoute>
                              <MediaKit />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/admin/media-kit'
                          element={
                            <ProtectedRoute>
                              <MediaKit />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/useradmin/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <UserAdmin />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/crypto-routes'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <CryptoRoutesStatus />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/crypto-routes/:cryptoHash'
                          element={
                            <ProtectedRoute>
                              <CryptoRouteHandler>
                                <CryptoRoutesStatus />
                              </CryptoRouteHandler>
                            </ProtectedRoute>
                          }
                        />

                        {/* Error Routes */}
                        <Route path='/unauthorized' element={<Unauthorized />} />

                        {/* Rotas Criptografadas - Catch All para evitar 404 */}
                        <Route path='/:cryptoHash' element={<AgroisyncHome />} />
                        <Route path='/:path/:cryptoHash' element={<AgroisyncHome />} />
                        <Route path='/:path1/:path2/:cryptoHash' element={<AgroisyncHome />} />
                        <Route path='/:path1/:path2/:path3/:cryptoHash' element={<AgroisyncHome />} />
                        <Route path='/:path1/:path2/:path3/:path4/:cryptoHash' element={<AgroisyncHome />} />


                        {/* Catch all para 404 */}
                        <Route path='*' element={<NotFound />} />
                        </Routes>
                      </DynamicCryptoURL>
                      </React.Suspense>
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
                <footer id='footer' role='contentinfo' className="mt-0">
                  <AgroisyncFooter />
                </footer>

                {/* AI Chatbot Futurista */}
                <AIChatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

                {/* Botão do Chatbot VERDE Futurista */}
                <button
                  onClick={() => setIsChatbotOpen(true)}
                  className='fixed bottom-6 right-6 z-50 transform rounded-full border-2 border-green-300 shadow-2xl transition-all duration-300 hover:scale-115 hover:rotate-6'
                  aria-label='Abrir chatbot IA Agroisync'
                  style={{
                    background: 'linear-gradient(140deg, rgba(34, 197, 94, 0.92) 0%, rgba(21, 128, 61, 0.9) 100%)',
                    padding: '14px',
                    boxShadow: '0 0 32px rgba(34, 197, 94, 0.65), 0 8px 24px rgba(0, 0, 0, 0.35)'
                  }}
                >
                  <div className='relative flex items-center justify-center'>
                    <img
                      src='/logo-agroconecta-folhas.svg'
                      alt='Abrir IA Agroisync'
                      className='h-7 w-7 object-contain drop-shadow-md'
                    />
                    <div className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-green-600 shadow-sm'>
                      IA
                    </div>
                  </div>
                </button>

                {/* LGPD Compliance Futurista */}
                {showLGPD && (
                  <LGPDCompliance onAccept={handleLGPDAccept} onDecline={handleLGPDDecline} isVisible={showLGPD} />
                )}

                {/* Painel de Acessibilidade Futurista */}
                <AccessibilityPanel isOpen={isAccessibilityOpen} onClose={() => setIsAccessibilityOpen(false)} />

                {/* Botão de Acessibilidade ROXO Futurista */}
                <button
                  onClick={() => setIsAccessibilityOpen(true)}
                  className='fixed bottom-4 left-4 z-30 transform rounded-full bg-gradient-to-br from-blue-600 to-sky-500 p-3 text-white shadow-xl transition-all duration-300 hover:scale-120 hover:rotate-6 md:bottom-6 md:left-6 md:p-4 md:shadow-2xl border-2 border-blue-300'
                  aria-label='Abrir painel de acessibilidade'
                  style={{
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.55), 0 8px 28px rgba(0, 0, 0, 0.35)'
                  }}
                >
                  <Accessibility className='h-6 w-6 text-white md:h-7 md:w-7' />
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
