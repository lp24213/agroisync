import { AdminPage } from '@/components/admin/admin-page'

export const metadata = {
  title: 'Administração - AgroSync',
  description: 'Painel administrativo para gestão de usuários, produtos e sistema.',
}

export default function AdminPageRoute() {
  return <AdminPage />
}
