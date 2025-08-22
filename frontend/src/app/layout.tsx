import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Chatbot } from '@/components/chatbot/chatbot'
import { TickerBar } from '@/components/layout/ticker-bar'
import { StarfieldBackground } from '@/components/ui/starfield-background'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgroSync - Plataforma Agrícola Inteligente',
  description: 'Plataforma premium para gestão agrícola, criptomoedas, fretes e analytics em tempo real.',
  keywords: 'agricultura, tecnologia, criptomoedas, fretes, analytics, Web3',
  authors: [{ name: 'AgroSync Team' }],
  creator: 'AgroSync',
  publisher: 'AgroSync',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://agroisync.com'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://agroisync.com',
    title: 'AgroSync - Plataforma Agrícola Inteligente',
    description: 'Plataforma premium para gestão agrícola, criptomoedas, fretes e analytics em tempo real.',
    siteName: 'AgroSync',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AgroSync - Plataforma Agrícola Inteligente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgroSync - Plataforma Agrícola Inteligente',
    description: 'Plataforma premium para gestão agrícola, criptomoedas, fretes e analytics em tempo real.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background relative overflow-x-hidden">
            <StarfieldBackground />
            <div className="relative z-10">
              <TickerBar />
              <Navbar />
              <main className="pt-16">
                {children}
              </main>
              <Footer />
              <Chatbot />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
