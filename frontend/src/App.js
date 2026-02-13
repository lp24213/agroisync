import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
// import { Helmet } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import AgroisyncHeader from './components/AgroisyncHeader';
import AgroisyncFooter from './components/AgroisyncFooter';
const AIChatbot = React.lazy(() => import('./components/ai/AIChatbot'));
const StockTicker = React.lazy(() => import('./components/StockTicker'));
import LGPDCompliance from './components/LGPDCompliance';
const GlobalWeatherWidget = React.lazy(() => import('./components/GlobalWeatherWidget'));
const AccessibilityPanel = React.lazy(() => import('./components/AccessibilityPanel'));
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
const AdminEmailPanel = React.lazy(() => import('./pages/AdminEmailPanel'));
const UserEmailDashboard = React.lazy(() => import('./pages/UserEmailDashboard'));
const EmailManager = React.lazy(() => import('./pages/EmailManager'));
const MediaKit = React.lazy(() => import('./pages/MediaKit'));

// Login de email inline para evitar problemas de lazy loading - V2024
const SimpleEmailLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // VERIFICAÇÃO: Se acidentalmente carregar Admin Panel, redirecionar
  React.useEffect(() => {
    console.log('[EMAIL LOGIN] Component mounted - Route: /email');
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Preencha email e senha');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://agroisync.com/api'}/email/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data?.error || 'Erro ao autenticar');
        return;
      }
      localStorage.setItem('agroisyncEmailSession', JSON.stringify(data.account));
      navigate('/email/inbox');
    } catch (error) {
      alert('Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '6rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Login do Email</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Acesse sua caixa corporativa @agroisync.com</p>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seuemail@agroisync.com"
              style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Sua senha"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', background: '#2563eb', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
};
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
import AgroconectaCarriers from './pages/AgroconectaCarriers';
import AgroconectaOffer from './pages/AgroconectaOffer';
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
  const [showWeatherWidget, setShowWeatherWidget] = React.useState(true);

  React.useEffect(() => {
    // Adicionar classe "loaded" ao body para animações
    document.body.classList.add('loaded');
    
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
                      <Suspense fallback={null}>
                        <StockTicker />
                      </Suspense>
                    </div>
                    <div style={{ paddingTop: 32 }} />
                    <AgroisyncHeader />
                    {isAccessibilityOpen && (
                      <Suspense fallback={null}>
                        <AccessibilityPanel isOpen={isAccessibilityOpen} setIsOpen={setIsAccessibilityOpen} />
                      </Suspense>
                    )}
                    
                    {/* Botão de Acessibilidade - Assistente para Cegos e outras funcionalidades */}
                    <button
                      className='fixed z-[9998] bottom-28 left-6 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-xl p-3 flex items-center justify-center transition-all duration-300 hover:scale-110'
                      style={{ 
                        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)',
                        width: 56,
                        height: 56
                      }}
                      onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                      aria-label='Abrir Painel de Acessibilidade'
                      title='Acessibilidade: Leitor de tela, alto contraste, navegação por teclado e mais'
                    >
                      <Accessibility className='h-6 w-6' />
                    </button>
                    
                    {/* Botão flutuante do Chatbot com Logo Agroisync */}
                    <button
                      className='fixed z-[9999] bottom-6 right-6 bg-transparent hover:bg-white/10 rounded-full shadow-xl p-2 flex items-center justify-center chatbot-trigger transition-all duration-300 hover:scale-110'
                      style={{ 
                        boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3), 0 4px 16px rgba(0, 0, 0, 0.15)',
                        width: 64,
                        height: 64,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                      }}
                      onClick={() => setIsChatbotOpen(true)}
                      aria-label='Abrir Chatbot Agroisync'
                      title='Chatbot IA - Tire suas dúvidas sobre produtos, fretes e mais'
                    >
                      <img 
                        src='/LOGO_AGROISYNC_TRANSPARENTE.png' 
                        alt='Agroisync Chatbot' 
                        className='h-12 w-12 object-contain drop-shadow-lg'
                        onError={(e) => {
                          e.target.src = '/agroisync-logo.svg';
                        }}
                      />
                    </button>
                    {isChatbotOpen && (
                      <Suspense fallback={null}>
                        <AIChatbot isOpen={isChatbotOpen} setIsOpen={open => setIsChatbotOpen(open)} onClose={() => setIsChatbotOpen(false)} />
                      </Suspense>
                    )}
                    <LGPDCompliance isOpen={showLGPD} onAccept={handleLGPDAccept} onDecline={handleLGPDDecline} />
                    {showWeatherWidget && (
                      <Suspense fallback={null}>
                        <div style={{ position: 'fixed', top: '80px', left: '10px', zIndex: 40, width: '280px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                          <div style={{ position: 'relative' }}>
                            <button
                              onClick={() => setShowWeatherWidget(false)}
                              style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                zIndex: 50,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}
                              title="Fechar widget de clima"
                            >
                              ×
                            </button>
                            <GlobalWeatherWidget />
                          </div>
                        </div>
                      </Suspense>
                    )}
                    <DynamicCryptoURL />
                    <Toaster position='top-right' />
                    <Layout>
                      <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                          <Route path='/' element={<AgroisyncHome />} />
                          <Route path='/email' element={<SimpleEmailLogin />} />
                          <Route path='/email/inbox' element={<EmailManager />} />
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
                          <Route path='/sobre' element={<AgroisyncAbout />} />
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
                          <Route path='/produtos' element={<AgroisyncMarketplace />} />
                          <Route path='/produtos/categories' element={<MarketplaceCategories />} />
                          <Route path='/produtos/sellers' element={<MarketplaceSellers />} />
                          <Route path='/produtos/sell' element={<MarketplaceSell />} />
                          <Route path='/produtos/:id' element={<ProductDetail />} />
                          <Route path='/produtos/:id/new' element={<ProductDetailNew />} />
                          <Route path='/frete' element={<AgroisyncAgroConecta />} />
                          <Route path='/frete/carriers' element={<AgroconectaCarriers />} />
                          <Route path='/frete/tracking' element={<AgroconectaTracking />} />
                          <Route path='/frete/offer' element={<AgroconectaOffer />} />
                          <Route path='/alerts' element={<PriceAlerts />} />
                          <Route path='/favorites' element={<Favorites />} />
                          <Route path='/termos' element={<TermosResponsabilidade />} />
                          <Route path='/crypto-detail/:id' element={<CryptoDetail />} />
                          <Route path='/admin' element={<AdminPanel />} />
                          <Route path='/admin/email' element={<AdminEmailPanel />} />
                          <Route path='/user-admin' element={<UserAdmin />} />
                          <Route path='/dashboard/email' element={<UserEmailDashboard />} />
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
                          <Route path='/clima' element={<ClimaInsumos />} />
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
