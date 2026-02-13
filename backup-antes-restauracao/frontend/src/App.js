import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
// import { Helmet } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import AgroisyncHeader from './components/AgroisyncHeader';
import AgroisyncFooter from './components/AgroisyncFooter';
import AIChatbot from './components/ai/AIChatbot';
import StockTicker from './components/StockTicker';
import LGPDCompliance from './components/LGPDCompliance';
import GlobalWeatherWidget from './components/GlobalWeatherWidget';
import AccessibilityPanel from './components/AccessibilityPanel';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingFallback from './components/LoadingFallback';
import DynamicCryptoURL from './components/DynamicCryptoURL';
import { AnalyticsProvider } from './components/analytics/AnalyticsProvider';
// import ChristmasAnimations from './components/ChristmasAnimations'; // Removido - animações pesadas
import { Accessibility } from 'lucide-react';

// CSS unificado (5 arquivos)
import './styles/base.css';
import './styles/layout.css';
import './styles/menu.css';
import './styles/components.css';
import './styles/mobile.css';
// Removido: animações de natal
import './styles/bloomfi-theme.css';

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

    // Proteção global contra erro de classList.add/remover/toggle
    const safeClassListMethod = (method) => {
      return function(...args) {
        if (this && this.classList && typeof this.classList[method] === 'function') {
          try {
            this.classList[method](...args);
          } catch (e) {
            // Ignorar erro
          }
        }
      };
    };
    // Patch document.body/classList
    if (typeof document !== 'undefined' && document.body && document.body.classList) {
      ['add', 'remove', 'toggle'].forEach((m) => {
        document.body[m + 'Safe'] = safeClassListMethod(m).bind(document.body);
      });
    }
    // Patch global para elementos principais
    window.safeClassListAdd = safeClassListMethod('add');
    window.safeClassListRemove = safeClassListMethod('remove');
    window.safeClassListToggle = safeClassListMethod('toggle');
  }, []);

  const handleLGPDAccept = () => {
    setShowLGPD(false);
  };

  const handleLGPDDecline = () => {
    setShowLGPD(false);
  };

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <LanguageProvider>
                <AnalyticsProvider>
                  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <div className='App'>
                    {/* Ticker fixo no topo */}
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 2000 }}>
                      <StockTicker />
                    </div>
                    <div style={{ paddingTop: 32 }} />
                    <AgroisyncHeader />
                    <AccessibilityPanel isOpen={isAccessibilityOpen} setIsOpen={setIsAccessibilityOpen} />
                    {/* Botão flutuante do Chatbot sempre visível */}
                    <button
                      className='fixed z-[9999] bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg p-3 flex items-center justify-center chatbot-trigger'
                      style={{ boxShadow: '0 4px 24px rgba(34,197,94,0.25)', width: 48, height: 48 }}
                      onClick={() => setIsChatbotOpen(true)}
                      aria-label='Abrir Chatbot'
                    >
                      <svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <circle cx='14' cy='14' r='14' fill='#fff'/>
                        <path d='M9.5 14C9.5 11.5147 11.5147 9.5 14 9.5C16.4853 9.5 18.5 11.5147 18.5 14C18.5 16.4853 16.4853 18.5 14 18.5C11.5147 18.5 9.5 16.4853 9.5 14Z' fill='#00A859'/>
                        <rect x='12' y='12' width='4' height='4' rx='2' fill='#fff'/>
                      </svg>
                    </button>
                    <AIChatbot isOpen={isChatbotOpen} setIsOpen={open => setIsChatbotOpen(open)} onClose={() => setIsChatbotOpen(false)} />
                    <LGPDCompliance isOpen={showLGPD} onAccept={handleLGPDAccept} onDecline={handleLGPDDecline} />
                    <GlobalWeatherWidget />
                    <DynamicCryptoURL />
                    <Toaster position='top-right' />
                    <Layout>
                      <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                          <Route path='/' element={<AgroisyncHome />} />
                          <Route path='/login' element={<AgroisyncLogin />} />
                          <Route path='/register' element={<AgroisyncRegister />} />
                          <Route path='/marketplace' element={<AgroisyncMarketplace />} />
                          <Route path='/loja' element={<AgroisyncLoja />} />
                          <Route path='/agroconecta' element={<AgroisyncAgroConecta />} />
                          <Route path='/usuario' element={<UsuarioGeral />} />
                          <Route path='/crypto' element={<AgroisyncCrypto />} />
                          <Route path='/dashboard' element={<AgroisyncDashboard />} />
                          <Route path='/planos' element={<AgroisyncPlans />} />
                          <Route path='/payment/pix' element={<PaymentPix />} />
                          <Route path='/payment/boleto' element={<PaymentBoleto />} />
                          <Route path='/payment/credit-card' element={<PaymentCreditCard />} />
                          <Route path='/about' element={<AgroisyncAbout />} />
                          <Route path='/contact' element={<AgroisyncContact />} />
                          <Route path='/forgot-password' element={<AgroisyncForgotPassword />} />
                          <Route path='/signup/type' element={<SignupType />} />
                          <Route path='/signup/freight' element={<SignupFreight />} />
                          <Route path='/signup/store' element={<SignupStore />} />
                          <Route path='/signup/product' element={<SignupProduct />} />
                          <Route path='/signup/general' element={<SignupGeneral />} />
                          <Route path='/signup/unified' element={<SignupUnified />} />
                          <Route path='/reset-password' element={<ResetPassword />} />
                          <Route path='/payment' element={<Payment />} />
                          <Route path='/produtos/:id' element={<ProductDetail />} />
                          <Route path='/produtos/:id/new' element={<ProductDetailNew />} />
                          <Route path='/alerts' element={<PriceAlerts />} />
                          <Route path='/favorites' element={<Favorites />} />
                          <Route path='/termos' element={<TermosResponsabilidade />} />
                          <Route path='/crypto-detail/:id' element={<CryptoDetail />} />
                          <Route path='/admin' element={<AdminPanel />} />
                          <Route path='/user-admin' element={<UserAdmin />} />
                          <Route path='/media-kit' element={<MediaKit />} />
                          <Route path='/crypto-routes-status' element={<CryptoRoutesStatus />} />
                          <Route path='/user-dashboard' element={<UserDashboard />} />
                          <Route path='/crypto-dashboard' element={<CryptoDashboard />} />
                          <Route path='/messaging' element={<Messaging />} />
                          <Route path='/2fa' element={<TwoFactorAuth />} />
                          <Route path='/verify-email' element={<VerifyEmail />} />
                          <Route path='/payment-success' element={<PaymentSuccess />} />
                          <Route path='/payment-cancel' element={<PaymentCancel />} />
                          <Route path='/faq' element={<FAQ />} />
                          <Route path='/terms' element={<Terms />} />
                          <Route path='/privacy' element={<Privacy />} />
                          <Route path='/help' element={<Help />} />
                          <Route path='/login-redirect' element={<LoginRedirect />} />
                          <Route path='/unauthorized' element={<Unauthorized />} />
                          <Route path='/clima-insumos' element={<ClimaInsumos />} />
                          <Route path='/api' element={<APIPage />} />
                          <Route path='/store' element={<Store />} />
                          <Route path='/store-plans' element={<StorePlans />} />
                          <Route path='/marketplace/categories' element={<MarketplaceCategories />} />
                          <Route path='/marketplace/sellers' element={<MarketplaceSellers />} />
                          <Route path='/marketplace/sell' element={<MarketplaceSell />} />
                          <Route path='/agroconecta/offer' element={<AgroconectaOffer />} />
                          <Route path='/agroconecta/carriers' element={<AgroconectaCarriers />} />
                          <Route path='/agroconecta/tracking' element={<AgroconectaTracking />} />
                          <Route path='/partnerships' element={<Partnerships />} />
                          <Route path='/partnerships/current' element={<PartnershipsCurrent />} />
                          <Route path='/partnerships/benefits' element={<PartnershipsBenefits />} />
                          <Route path='/partnerships/contact' element={<PartnershipsContact />} />
                          <Route path='*' element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </Layout>
                    <AgroisyncFooter />
                  </div>
                </Router>
              </AnalyticsProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
