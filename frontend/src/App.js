import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importando todas as páginas
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Cotacao from './pages/Cotacao';
import Loja from './pages/Loja';
import AgroConecta from './pages/AgroConecta';
import Cripto from './pages/Cripto';
import Cadastro from './pages/Cadastro';
import Admin from './pages/Admin';

// Importando componentes de grãos
import GrainsDashboard from './components/grains/GrainsDashboard';
import GrainsPriceCard from './components/grains/GrainsPriceCard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rotas principais */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/cotacao" element={<Cotacao />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/agroconecta" element={<AgroConecta />} />
          <Route path="/cripto" element={<Cripto />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* Rotas de componentes de grãos (para desenvolvimento/teste) */}
          <Route path="/grains-dashboard" element={<GrainsDashboard />} />
          <Route path="/grains-price-card" element={<GrainsPriceCard />} />
          
          {/* Rota 404 */}
          <Route path="*" element={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
                <p className="text-xl text-gray-400 mb-8">Página não encontrada</p>
                <a 
                  href="/" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Voltar ao Início
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
