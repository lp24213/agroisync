/**
 * AGROISYNC - Lazy Loading Configuration
 *
 * Este arquivo centraliza todas as importações lazy para otimização do bundle
 */

import { lazy } from 'react';

// ===== PÁGINAS PRINCIPAIS =====
export const Home = lazy(() => import('./pages/Home'));
export const About = lazy(() => import('./pages/About'));
export const Contact = lazy(() => import('./pages/Contact'));
export const Plans = lazy(() => import('./pages/Plans'));

// ===== AUTENTICAÇÃO =====
export const AgroisyncLogin = lazy(() => import('./pages/AgroisyncLogin'));
export const AgroisyncRegister = lazy(() => import('./pages/AgroisyncRegister'));
export const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
export const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// ===== DASHBOARDS =====
export const UserDashboard = lazy(() => import('./pages/UserDashboard'));
export const AgroisyncDashboard = lazy(() => import('./pages/AgroisyncDashboard'));

// ===== FUNCIONALIDADES PRINCIPAIS =====
export const AgroisyncAgroConecta = lazy(() => import('./pages/AgroisyncAgroConecta'));
export const AgroisyncCrypto = lazy(() => import('./pages/AgroisyncCrypto'));
export const AgroisyncStore = lazy(() => import('./pages/AgroisyncStore'));
export const Partnerships = lazy(() => import('./pages/Partnerships'));

// ===== CADASTROS =====
export const SignupGeneral = lazy(() => import('./pages/SignupGeneral'));
export const SignupProduct = lazy(() => import('./pages/SignupProduct'));
export const SignupFreight = lazy(() => import('./pages/SignupFreight'));
export const SignupStore = lazy(() => import('./pages/SignupStore'));
export const Onboarding = lazy(() => import('./pages/Onboarding'));

// ===== ADMIN =====
export const AdminAnonymousPanel = lazy(() => import('./pages/admin/AdminAnonymousPanel'));

// ===== TRANSAÇÕES & PAGAMENTOS =====
export const TransactionDetails = lazy(() => import('./pages/TransactionDetails'));
export const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
export const PaymentCancel = lazy(() => import('./pages/PaymentCancel'));

// ===== OUTRAS PÁGINAS =====
export const NotFound = lazy(() => import('./pages/NotFound'));
export const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
export const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// ===== COMPONENTES PESADOS =====
export const ChatbotWidget = lazy(() => import('./components/ChatbotWidget'));
export const CryptoWallet = lazy(() => import('./components/blockchain/CryptoWallet'));
export const NFTManager = lazy(() => import('./components/blockchain/NFTManager'));
export const PricePrediction = lazy(() => import('./components/ai/PricePrediction'));
export const SmartRecommendations = lazy(() => import('./components/ai/SmartRecommendations'));

// Configuração de prefetch para páginas importantes
export const prefetchCriticalPages = () => {
  // Prefetch de páginas que usuários provavelmente visitarão
  const criticalPages = [
    () => import('./pages/AgroisyncLogin'),
    () => import('./pages/AgroisyncRegister'),
    () => import('./pages/UserDashboard')
  ];

  // Executar prefetch após o carregamento inicial
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      criticalPages.forEach(page => {
        try {
          page();
        } catch (e) {
          // Ignorar erros de prefetch
        }
      });
    }, 3000); // 3 segundos após o load
  }
};

export default {
  // Páginas
  Home,
  About,
  Contact,
  Plans,

  // Auth
  AgroisyncLogin,
  AgroisyncRegister,
  ForgotPassword,
  ResetPassword,

  // Dashboards
  UserDashboard,
  AgroisyncDashboard,

  // Features
  AgroisyncAgroConecta,
  AgroisyncCrypto,
  AgroisyncStore,
  Partnerships,

  // Signup
  SignupGeneral,
  SignupProduct,
  SignupFreight,
  SignupStore,
  Onboarding,

  // Admin
  AdminAnonymousPanel,

  // Transactions
  TransactionDetails,
  PaymentSuccess,
  PaymentCancel,

  // Other
  NotFound,
  PrivacyPolicy,
  TermsOfService,

  // Components
  ChatbotWidget,
  CryptoWallet,
  NFTManager,
  PricePrediction,
  SmartRecommendations,

  // Utils
  prefetchCriticalPages
};
