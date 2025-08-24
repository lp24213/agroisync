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
import Planos from './pages/Planos';
import PaymentSuccess from './pages/PaymentSuccess';
import Contato from './pages/Contato';
import Ajuda from './pages/Ajuda';
import FAQ from './pages/FAQ';
import Status from './pages/Status';
import Cookies from './pages/Cookies';
import Termos from './pages/Termos';
import Privacidade from './pages/Privacidade';
import LGPD from './pages/LGPD';

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
              <Route path="/planos" element={<Planos />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/ajuda" element={<Ajuda />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/status" element={<Status />} />
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
