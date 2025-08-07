import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AGROTM - Plataforma de Agronegócio com Blockchain',
  description: 'AGROTM é uma plataforma inovadora que combina agronegócio com tecnologia blockchain, oferecendo tokenização de ativos agrícolas, DeFi e soluções sustentáveis.',
  keywords: 'agronegócio, blockchain, tokenização, DeFi, agricultura, sustentabilidade',
  authors: [{ name: 'AGROTM Team' }],
  creator: 'AGROTM',
  publisher: 'AGROTM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://agrotmsol.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AGROTM - Plataforma de Agronegócio com Blockchain',
    description: 'AGROTM é uma plataforma inovadora que combina agronegócio com tecnologia blockchain, oferecendo tokenização de ativos agrícolas, DeFi e soluções sustentáveis.',
    url: 'https://agrotmsol.com.br',
    siteName: 'AGROTM',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROTM - Plataforma de Agronegócio com Blockchain',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AGROTM - Plataforma de Agronegócio com Blockchain',
    description: 'AGROTM é uma plataforma inovadora que combina agronegócio com tecnologia blockchain, oferecendo tokenização de ativos agrícolas, DeFi e soluções sustentáveis.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#ffffff',
                  border: '1px solid #374151',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}