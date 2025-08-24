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

// Serviços de Segurança
import securityService from './services/securityService';
import advancedSecurityService from './services/advancedSecurityService';

// Inicializar serviços de segurança
securityService.initSecurity();
advancedSecurityService.initAdvancedSecurity();

function App() {
  // Verificar ambiente de segurança
  React.useEffect(() => {
    // Log de inicialização segura
    console.log('🔒 AGROSYNC - Sistema de Segurança Ativado');
    console.log('🛡️ AGROSYNC - Segurança Avançada Ativada');

    // Verificar integridade do ambiente
    try {
      securityService.validateEnvironment();
      advancedSecurityService.validateSecurityEnvironment();
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
      const advancedReport = advancedSecurityService.getSecurityReport();
      
      if (report.metrics.emergencyMode) {
        console.warn('🚨 MODO DE EMERGÊNCIA ATIVADO');
        // Implementar ações de emergência
      }
      
      if (advancedReport.threatLevel === 'HIGH' || advancedReport.threatLevel === 'CRITICAL') {
        console.warn('🚨 NÍVEL DE AMEAÇA ALTO:', advancedReport.threatLevel);
        // Ativar proteções adicionais
      }
    }, 30000); // A cada 30 segundos

    return () => clearInterval(securityInterval);
  }, []);

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
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
