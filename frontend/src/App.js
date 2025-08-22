import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Páginas
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Cotacao from './pages/Cotacao';
import Loja from './pages/Loja';
import AgroConecta from './pages/AgroConecta';
import Cripto from './pages/Cripto';
import Cadastro from './pages/Cadastro';
import Admin from './pages/Admin';

// Serviço de Segurança
import securityService from './services/securityService';

// Inicializar serviço de segurança
securityService.initSecurity();

function App() {
  // Verificar ambiente de segurança
  React.useEffect(() => {
    // Log de inicialização segura
    console.log('🔒 AGROSYNC - Sistema de Segurança Ativado');
    
    // Verificar integridade do ambiente
    try {
      securityService.validateEnvironment();
      console.log('✅ Ambiente validado com sucesso');
    } catch (error) {
      console.error('❌ Erro de validação de ambiente:', error);
      // Em produção, redirecionar para página de erro
      if (process.env.NODE_ENV === 'production') {
        window.location.href = '/security-error';
      }
    }
    
    // Monitor de segurança contínuo
    const securityInterval = setInterval(() => {
      const report = securityService.getSecurityReport();
      if (report.metrics.emergencyMode) {
        console.warn('🚨 MODO DE EMERGÊNCIA ATIVADO');
        // Implementar ações de emergência
      }
    }, 30000); // A cada 30 segundos
    
    return () => clearInterval(securityInterval);
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/cotacao" element={<Cotacao />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/agroconecta" element={<AgroConecta />} />
          <Route path="/cripto" element={<Cripto />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
