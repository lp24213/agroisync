import { AuthPage } from '@/components/auth/auth-page'

export const metadata = {
  title: 'Autenticação - AgroSync',
  description: 'Login, registro e conexão de carteiras Web3 na plataforma AgroSync.',
}

export default function AuthPageRoute() {
  return <AuthPage />
}
