import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Cotacao from './pages/Cotacao';
import Loja from './pages/Loja';
import AgroConecta from './pages/AgroConecta';
import Cripto from './pages/Cripto';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Admin from './pages/Admin';
import PaymentSuccess from './pages/PaymentSuccess';
import Contato from './pages/Contato';
import Mensageria from './pages/Mensageria';
import MessagesProducts from './pages/MessagesProducts';
import MessagesFreights from './pages/MessagesFreights';
import ProtectedRoute from './components/ProtectedRoute';
import Ajuda from './pages/Ajuda';
import FAQ from './pages/FAQ';
import Status from './pages/Status';
import Cookies from './pages/Cookies';
import Termos from './pages/Termos';
import Privacidade from './pages/Privacidade';
import LGPD from './pages/LGPD';
import Parcerias from './pages/Parcerias';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/cotacao" element={<Cotacao />} />
              <Route path="/loja" element={<Loja />} />
              <Route path="/agroconecta" element={<AgroConecta />} />
              <Route path="/cripto" element={<Cripto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/mensageria" element={<ProtectedRoute requirePlan={true}><Mensageria /></ProtectedRoute>} />
              <Route path="/messages/products" element={<ProtectedRoute requirePlan={true}><MessagesProducts /></ProtectedRoute>} />
              <Route path="/messages/freights" element={<ProtectedRoute requirePlan={true}><MessagesFreights /></ProtectedRoute>} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/ajuda" element={<Ajuda />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/status" element={<Status />} />
              <Route path="/parcerias" element={<Parcerias />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/termos" element={<Termos />} />
              <Route path="/privacidade" element={<Privacidade />} />
              <Route path="/lgpd" element={<LGPD />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
