import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { PaymentProvider } from './contexts/PaymentContext'
import Layout from './components/Layout'
import ChatbotWidget from './components/ChatbotWidget'
import StockTicker from './components/StockTicker'
import GrainQuotes from './components/GrainQuotes'
import WeatherWidget from './components/WeatherWidget'

// Importar estilos futuristas
import './styles/futuristic-theme.css'

// Pages
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import AgroConecta from './pages/AgroConecta'
import IntermediationSystem from './components/IntermediationSystem'
import Crypto from './pages/Crypto'
import Messaging from './pages/Messaging'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import Plans from './pages/Plans'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import TwoFactorAuth from './pages/TwoFactorAuth'
import VerifyEmail from './pages/VerifyEmail'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import About from './pages/About'
import Contact from './pages/Contact'
import Store from './pages/Store'
import FAQ from './pages/FAQ'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Help from './pages/Help'
import LoginRedirect from './pages/LoginRedirect'
import Unauthorized from './pages/Unauthorized'
import NotFound from './pages/NotFound'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PaymentProvider>
            <LanguageProvider>
              <Router>
                <div className='App'>
                  {/* Ticker de Ações */}
                  <StockTicker />

                  {/* Barra de Informações */}
                  <div className='bg-gray-50 border-gray-200 border-b py-2'>
                    <div className='container-futuristic'>
                      <div className='flex flex-col items-center justify-between gap-4 text-sm md:flex-row'>
                        <GrainQuotes />
                        <WeatherWidget />
                      </div>
                    </div>
                  </div>

                  <Layout>
                    <Routes>
                      {/* Public Routes */}
                      <Route path='/' element={<Home />} />
                      <Route path='/marketplace' element={<Marketplace />} />
                      <Route path='/agroconecta' element={<AgroConecta />} />
                      <Route path='/loja' element={<Store />} />
                      <Route path='/intermediation' element={<IntermediationSystem />} />
                      <Route path='/crypto' element={<Crypto />} />
                      <Route path='/plans' element={<Plans />} />
                      <Route path='/about' element={<About />} />
                      <Route path='/contact' element={<Contact />} />
                      <Route path='/faq' element={<FAQ />} />
                      <Route path='/terms' element={<Terms />} />
                      <Route path='/privacy' element={<Privacy />} />
                      <Route path='/help' element={<Help />} />

                      {/* Auth Routes */}
                      <Route path='/login' element={<Login />} />
                      <Route path='/register' element={<Register />} />
                      <Route path='/forgot-password' element={<ForgotPassword />} />
                      <Route path='/reset-password' element={<ResetPassword />} />
                      <Route path='/two-factor-auth' element={<TwoFactorAuth />} />
                      <Route path='/verify-email' element={<VerifyEmail />} />
                      <Route path='/login-redirect' element={<LoginRedirect />} />

                      {/* Payment Routes */}
                      <Route path='/payment/success' element={<PaymentSuccess />} />
                      <Route path='/payment/cancel' element={<PaymentCancel />} />

                      {/* Protected Routes */}
                      <Route path='/dashboard' element={<Dashboard />} />
                      <Route path='/messaging' element={<Messaging />} />
                      <Route path='/admin' element={<AdminPanel />} />

                      {/* Error Routes */}
                      <Route path='/unauthorized' element={<Unauthorized />} />
                      <Route path='*' element={<NotFound />} />
                    </Routes>
                  </Layout>

                  {/* Global Chatbot Widget */}
                  <ChatbotWidget />

                  {/* Toast Notifications */}
                  <Toaster
                    position='top-right'
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'var(--bg-glass)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-light)',
                        backdropFilter: 'var(--blur-glass)',
                        borderRadius: 'var(--border-radius)'
                      },
                      success: {
                        iconTheme: {
                          primary: 'var(--success)',
                          secondary: 'var(--text-inverse)'
                        }
                      },
                      error: {
                        iconTheme: {
                          primary: 'var(--danger)',
                          secondary: 'var(--text-inverse)'
                        }
                      }
                    }}
                  />
                </div>
              </Router>
            </LanguageProvider>
          </PaymentProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
