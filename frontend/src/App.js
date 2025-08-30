import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import RouteGuard from './components/RouteGuard';

// Páginas principais
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
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

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <PaymentProvider>
            <ChatbotProvider>
              <div className="App">
                <Navbar />
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
                  <Route path="/agroconecta" element={<AgroConecta />} />
                  <Route path="/cripto" element={<Cripto />} />
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

                  {/* Rotas admin - requerem autenticação e permissão de admin */}
                  <Route 
                    path="/admin" 
                    element={
                      <RouteGuard requireAdmin={true}>
                        <Admin />
                      </RouteGuard>
                    } 
                  />
                  <Route 
                    path="/admin/login" 
                    element={<AdminLogin />} 
                  />
                  <Route 
                    path="/admin/secure-panel" 
                    element={
                      <RouteGuard requireAdmin={true}>
                        <AdminSecurePanel />
                      </RouteGuard>
                    } 
                  />

                  {/* Rotas de painel individual - requerem autenticação */}
                  <Route 
                    path="/painel" 
                    element={
                      <RouteGuard requireAuth={true}>
                        <PainelUsuario />
                      </RouteGuard>
                    } 
                  />
                  <Route 
                    path="/panel/loja" 
                    element={
                      <RouteGuard requireAuth={true}>
                        <Loja />
                      </RouteGuard>
                    } 
                  />
                  <Route 
                    path="/panel/agroconecta" 
                    element={
                      <RouteGuard requireAuth={true}>
                        <AgroConecta />
                      </RouteGuard>
                    } 
                  />

                  {/* Rotas protegidas - requerem autenticação */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <RouteGuard requireAuth={true}>
                        <Dashboard />
                      </RouteGuard>
                    } 
                  />
                  <Route 
                    path="/loja" 
                    element={<Loja />} 
                  />
                  <Route 
                    path="/mensageria" 
                    element={
                      <RouteGuard requireAuth={true}>
                        <Mensageria />
                      </RouteGuard>
                    } 
                  />
                </Routes>
                <Footer />
                
                {/* Chatbot Global */}
                <ChatbotWidget isOpen={true} />
              </div>
            </ChatbotProvider>
          </PaymentProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
