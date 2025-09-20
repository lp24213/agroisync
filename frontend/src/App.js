import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import AgroisyncHeader from './components/AgroisyncHeader';
import AgroisyncFooter from './components/AgroisyncFooter';
import PremiumCursor from './components/PremiumCursor';
import AgroSyncGPT from './components/AgroSyncGPT';
import LGPDCompliance from './components/LGPDCompliance';
import Ticker from './components/Ticker';
import WeatherWidget from './components/WeatherWidget';

// Importar tema TXC + Grao Direto unificado
import './styles/agro-txc-grao-theme.css';
// Importar override CSS para correcoes especificas
import './styles/ui-txc-final-override.css';
// Importar correção do menu mobile
import './styles/mobile-menu-fix.css';
// Importar nova estetica visual
import './styles/agroisync-new-theme.css';
// Importar layout clean conforme design
import './styles/agroisync-layout-clean.css';
// Importar design tokens atualizados
import './styles/agroisync-design-tokens.css';
// Importar animações suaves e estilo moderno
import './styles/agroisync-animations.css';
// Importar visual futurista e profissional
import './styles/agroisync-futuristic.css';

// Pages
import AgroisyncHome from './pages/AgroisyncHome';
import AgroisyncHomePrompt from './pages/AgroisyncHomePrompt';
import AgroisyncMarketplace from './pages/AgroisyncMarketplace';
import AgroisyncLoja from './pages/AgroisyncLoja';
import AgroisyncAgroConecta from './pages/AgroisyncAgroConecta';
import AgroisyncCrypto from './pages/AgroisyncCrypto';
import AgroisyncPlans from './pages/AgroisyncPlans';
import AgroisyncAbout from './pages/AgroisyncAbout';
import AgroisyncContact from './pages/AgroisyncContact';
import Partnerships from './pages/Partnerships';
import AgroisyncLogin from './pages/AgroisyncLogin';
import AgroisyncRegister from './pages/AgroisyncRegister';
import AgroisyncDashboard from './pages/AgroisyncDashboard';
import IntermediationSystem from './components/IntermediationSystem';
import Messaging from './pages/Messaging';
import AdminPanel from './pages/AdminPanel';
import UserAdmin from './pages/UserAdmin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
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
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <Router>
              <div className="App">
                {/* Premium Cursor */}
                <PremiumCursor />
                
                {/* AGROISYNC Header */}
                <AgroisyncHeader />
                
                {/* Ticker fixo no topo */}
                <Ticker />
                
                <Layout>
                <Routes>
                         {/* Public Routes */}
                         <Route path="/" element={<AgroisyncHome />} />
                         {/* PROMPT CERTEIRO - Pagina com header padrao */}
                         <Route path="/home-prompt" element={<AgroisyncHomePrompt />} />
                  <Route path="/marketplace" element={<AgroisyncMarketplace />} />
                  <Route path="/loja" element={<AgroisyncLoja />} />
                  <Route path="/agroconecta" element={<AgroisyncAgroConecta />} />
                  <Route path="/tecnologia" element={<AgroisyncCrypto />} />
                  <Route path="/intermediation" element={<IntermediationSystem />} />
                  <Route path="/plans" element={<AgroisyncPlans />} />
                  <Route path="/planos" element={<AgroisyncPlans />} />
                  <Route path="/about" element={<AgroisyncAbout />} />
                  <Route path="/contact" element={<AgroisyncContact />} />
                  <Route path="/partnerships" element={<Partnerships />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/help" element={<Help />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<AgroisyncLogin />} />
                  <Route path="/register" element={<AgroisyncRegister />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/two-factor-auth" element={<TwoFactorAuth />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/login-redirect" element={<LoginRedirect />} />
                  
                  {/* Payment Routes */}
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/cancel" element={<PaymentCancel />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<AgroisyncDashboard />} />
                  <Route path="/messaging" element={<Messaging />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/useradmin" element={<UserAdmin />} />
                  
                  {/* Error Routes */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </Layout>
                
                {/* Widget de Clima - Final da pagina */}
                <div className="weather-section">
                  <div className="container">
                    <div className="text-center">
                      <h2>Informacoes Climaticas</h2>
                      <p>Dados meteorologicos atualizados para auxiliar suas decisoes agricolas</p>
                    </div>
                    <div className="flex-center">
                      <WeatherWidget />
                    </div>
                  </div>
                </div>

                {/* AGROISYNC Footer */}
                <AgroisyncFooter />
                
                {/* Global Chatbot Widget */}
                <AgroSyncGPT />
                
                {/* LGPD Compliance Modal */}
                <LGPDCompliance />
                
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
