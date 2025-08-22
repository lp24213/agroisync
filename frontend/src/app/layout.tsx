import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientLayout } from '@/components/layout/client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgroSync - O Futuro da Agricultura Digital',
  description: 'Plataforma revolucionária que combina blockchain, IA e conectividade global para transformar o agronegócio. Criptomoedas, grãos, marketplace e muito mais.',
  keywords: 'agroisync, agricultura, blockchain, criptomoedas, grãos, marketplace, IA, agronegócio',
  authors: [{ name: 'AgroSync Team' }],
  creator: 'AgroSync',
  publisher: 'AgroSync',
  robots: 'index, follow',
  openGraph: {
    title: 'AgroSync - O Futuro da Agricultura Digital',
    description: 'Plataforma revolucionária que combina blockchain, IA e conectividade global para transformar o agronegócio.',
    url: 'https://agroisync.com',
    siteName: 'AgroSync',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AgroSync - Agricultura Digital',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgroSync - O Futuro da Agricultura Digital',
    description: 'Plataforma revolucionária que combina blockchain, IA e conectividade global para transformar o agronegócio.',
    images: ['/og-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
