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
import ChatbotWidget from './components/ChatbotWidget';
import Ticker from './components/Ticker';
import GrainQuotes from './components/GrainQuotes';
import WeatherWidget from './components/WeatherWidget';
import NewsFeed from './components/NewsFeed';

// Importar tema AGROISYNC Premium
import './styles/agro-premium-theme.css';

// Pages
import AgroisyncHome from './pages/AgroisyncHome';
import AgroisyncMarketplace from './pages/AgroisyncMarketplace';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TwoFactorAuth from './pages/TwoFactorAuth';
import VerifyEmail from './pages/VerifyEmail';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Store from './pages/Store';
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
                
                {/* Barra de Informações - Cotações, clima e notícias */}
                <div className="info-bar">
                  <div className="premium-container">
                    <div className="info-content">
                      <GrainQuotes />
                      <WeatherWidget />
                      <NewsFeed />
                    </div>
                  </div>
                </div>
                
                <Layout>
                <Routes>
                         {/* Public Routes */}
                         <Route path="/" element={<AgroisyncHome />} />
                  <Route path="/marketplace" element={<AgroisyncMarketplace />} />
                  <Route path="/agroconecta" element={<AgroisyncAgroConecta />} />
                  <Route path="/loja" element={<Store />} />
                  <Route path="/tecnologia" element={<AgroisyncCrypto />} />
                  <Route path="/intermediation" element={<IntermediationSystem />} />
                  <Route path="/crypto" element={<AgroisyncCrypto />} />
                  <Route path="/plans" element={<AgroisyncPlans />} />
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
                  
                  {/* Error Routes */}
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </Layout>
                
                {/* AGROISYNC Footer */}
                <AgroisyncFooter />
                
                {/* Global Chatbot Widget */}
                <ChatbotWidget />
                
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
