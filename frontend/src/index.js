import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/mobile-fixes.css'; // Importar correções para mobile
import './styles/header-fixes.css'; // Importar correções para header
import './styles/debug-fix.css'; // FORÇA REMOÇÃO DE BORDAS VERMELHAS
import './i18n/index'; // Importar configuração do i18n
import './utils/disableConsoleInProd'; // Silencia console em produção
import App from './App';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Removido: Service Worker desativado
// import reportWebVitals from './reportWebVitals'; // Removido: Service Worker desativado

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// serviceWorkerRegistration.unregister(); // Desativado permanentemente para evitar conflitos de navegação
