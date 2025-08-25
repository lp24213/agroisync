import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

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
import MessagesProducts from './pages/MessagesProducts';
import MessagesFreights from './pages/MessagesFreights';

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

// Componentes
import Layout from './components/layout/Layout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
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

              {/* Rotas admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/secure-panel" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminSecurePanel />
                  </ProtectedRoute>
                } 
              />

              {/* Rotas protegidas que requerem plano ativo */}
              <Route 
                path="/messages/products" 
                element={
                  <ProtectedRoute requirePlan={true}>
                    <MessagesProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages/freights" 
                element={
                  <ProtectedRoute requirePlan={true}>
                    <MessagesFreights />
                  </ProtectedRoute>
                } 
              />

              {/* Rotas protegidas por autenticação */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/loja" 
                element={
                  <ProtectedRoute>
                    <Loja />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
