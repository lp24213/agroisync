import { AgroConectaDashboard } from '@/components/agroconecta/agroconecta-dashboard'

export const metadata = {
  title: 'AgroConecta - Marketplace de Fretes - AgroSync',
  description: 'Marketplace de fretes agrícolas, conectando transportadores e produtores na plataforma AgroSync.',
}

export default function AgroConectaPage() {
  return (
    <div className="min-h-screen">
      <AgroConectaDashboard />
    </div>
  )
}
