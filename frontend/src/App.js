import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { FeatureFlagsProvider } from './contexts/FeatureFlagsContext';
// import RouteGuard from './components/RouteGuard'; // Removido temporariamente - será usado em futuras implementações
import ProtectedRoute from './components/ProtectedRoute';
import LoginRedirect from './components/LoginRedirect';
import Unauthorized from './pages/Unauthorized';

// Páginas principais
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/dashboard';
import Loja from './pages/Loja';
import Parcerias from './pages/Parcerias';
import Contato from './pages/Contato';
import Sobre from './pages/Sobre';
import FAQ from './pages/FAQ';
import Termos from './pages/Termos';
import Privacidade from './pages/Privacidade';
import LGPD from './pages/LGPD';
import Cookies from './pages/Cookies';
import Ajuda from './pages/Ajuda';
import Planos from './pages/Planos';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

// Páginas de mensageria
import Messages from './pages/Messages';
import MessagesProducts from './pages/MessagesProducts';
import MessagesFreights from './pages/MessagesFreights';
import Mensageria from './pages/Mensageria';

// Páginas admin
import AdminLogin from './pages/AdminLogin';
import AdminSecurePanel from './pages/AdminSecurePanel';

// Páginas especiais
import Admin from './pages/Admin';
import AgroConecta from './pages/AgroConecta';
import Cripto from './pages/Cripto';
import Crypto from './pages/Crypto';
import NotFound from './pages/NotFound';

import Cotacao from './pages/Cotacao';
import Status from './pages/Status';
import Commodities from './pages/commodities';
import GrainsDashboard from './pages/grains-dashboard';
import IBGEData from './pages/ibge-data';
import Receita from './pages/receita';
import Global from './pages/global';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OtpVerification from './pages/OtpVerification';
import VerifyEmail from './pages/VerifyEmail';
import CadastroProduto from './pages/CadastroProduto';
import PainelUsuario from './pages/PainelUsuario';
import NotFound from './pages/NotFound';

// Painéis individuais
import BuyerPanel from './pages/panels/BuyerPanel';
import SellerPanel from './pages/panels/SellerPanel';
import DriverPanel from './pages/panels/DriverPanel';

// Componentes de mensageria
import MessagingCenter from './components/messaging/MessagingCenter';

// Componentes
import ChatbotWidget from './components/ChatbotWidget';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <FeatureFlagsProvider>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <PaymentProvider>
                <ChatbotProvider>
                  <div className="App">
                    <Layout>
                      <Routes>
                    {/* Rotas públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/sobre" element={<Sobre />} />
                    <Route path="/parcerias" element={<Parcerias />} />
                    <Route path="/contato" element={<Contato />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/termos" element={<Termos />} />
                    <Route path="/privacidade" element={<Privacidade />} />
                    <Route path="/lgpd" element={<LGPD />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/ajuda" element={<Ajuda />} />
                    <Route path="/planos" element={<Planos />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-cancel" element={<PaymentCancel />} />
                    <Route path="/order/:id/success" element={<PaymentSuccess />} />
                    <Route path="/order/:id/cancel" element={<PaymentCancel />} />
                    <Route path="/agroconecta" element={<AgroConecta />} />
                    <Route path="/cripto" element={<Cripto />} />
                    <Route path="/crypto" element={<Crypto />} />
                    <Route path="/cotacao" element={<Cotacao />} />
                    <Route path="/status" element={<Status />} />
                    <Route path="/commodities" element={<Commodities />} />
                    <Route path="/grains-dashboard" element={<GrainsDashboard />} />
                    <Route path="/ibge-data" element={<IBGEData />} />
                    <Route path="/receita" element={<Receita />} />
                    <Route path="/global" element={<Global />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/otp-verification" element={<OtpVerification />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/cadastro-produto" element={<CadastroProduto />} />

                    {/* Rotas protegidas */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/dashboard/buyer" element={<ProtectedRoute requiredRole="buyer"><Dashboard /></ProtectedRoute>} />
                    <Route path="/dashboard/seller" element={<ProtectedRoute requiredRole="seller"><Dashboard /></ProtectedRoute>} />
                    <Route path="/dashboard/driver" element={<ProtectedRoute requiredRole="driver"><Dashboard /></ProtectedRoute>} />
                    <Route path="/dashboard/transport" element={<ProtectedRoute requiredRole="transport"><Dashboard /></ProtectedRoute>} />
                    
                    {/* Painéis individuais específicos */}
                    <Route path="/dashboard/store" element={<ProtectedRoute requiredRole={["seller", "buyer"]}><Dashboard /></ProtectedRoute>} />
                    <Route path="/dashboard/freight" element={<ProtectedRoute requiredRole={["driver", "transport"]}><Dashboard /></ProtectedRoute>} />
                    
                    {/* Painéis individuais ocultos */}
                    <Route path="/dashboard/buyer-panel" element={<ProtectedRoute requiredRole="buyer"><BuyerPanel /></ProtectedRoute>} />
                    <Route path="/dashboard/seller-panel" element={<ProtectedRoute requiredRole="seller"><SellerPanel /></ProtectedRoute>} />
                    <Route path="/dashboard/driver-panel" element={<ProtectedRoute requiredRole="driver"><DriverPanel /></ProtectedRoute>} />
                    
                    {/* Rotas da loja */}
                    <Route path="/loja" element={<Loja />} />
                    <Route path="/store" element={<Loja />} />
                    <Route path="/store/:id" element={<Loja />} />
                    
                    {/* Rotas de fretes */}
                    <Route path="/freight" element={<AgroConecta />} />
                    <Route path="/freight/:id" element={<AgroConecta />} />
                    <Route path="/mensageria" element={<ProtectedRoute requiredPlan={true}><Mensageria /></ProtectedRoute>} />
                    <Route path="/messages" element={<ProtectedRoute requiredPlan={true}><Messages /></ProtectedRoute>} />
                    <Route path="/messages-products" element={<ProtectedRoute requiredPlan={true}><MessagesProducts /></ProtectedRoute>} />
                    <Route path="/messages-freights" element={<ProtectedRoute requiredPlan={true}><MessagesFreights /></ProtectedRoute>} />
                    
                    {/* Centro de Mensagens */}
                    <Route path="/messaging" element={<ProtectedRoute requiredPlan={true}><MessagingCenter /></ProtectedRoute>} />
                    <Route path="/chat" element={<ProtectedRoute requiredPlan={true}><MessagingCenter /></ProtectedRoute>} />
                    <Route path="/painel-usuario" element={<ProtectedRoute><PainelUsuario /></ProtectedRoute>} />

                    {/* Rotas admin */}
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
                    <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
                    <Route path="/admin-panel" element={<ProtectedRoute requiredRole="admin"><AdminSecurePanel /></ProtectedRoute>} />
                    <Route path="/admin/anon" element={<AdminSecurePanel />} />
                    
                    {/* Rotas especiais */}
                    <Route path="/login-redirect" element={<LoginRedirect />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    
                    {/* Rota 404 - Página não encontrada */}
                    <Route path="*" element={<NotFound />} />
                                        </Routes>
                      
                      {/* Chatbot Global */}
                      <ChatbotWidget />
                    </Layout>
                  </div>
              </ChatbotProvider>
            </PaymentProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </FeatureFlagsProvider>
    </Router>
  );
}

export default App;
