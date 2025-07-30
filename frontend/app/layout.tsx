import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agrotm Solana - DeFi Platform for Sustainable Agriculture',
  description: 'The most advanced DeFi platform on Solana blockchain, focused on sustainable agriculture and yield farming.',
  keywords: 'DeFi, Solana, Agriculture, Staking, Yield Farming, Blockchain',
  authors: [{ name: 'Agrotm Team' }],
  openGraph: {
    title: 'Agrotm Solana - DeFi Platform',
    description: 'Sustainable agriculture meets DeFi on Solana',
    url: 'https://agrotm.com',
    siteName: 'Agrotm Solana',
    images: [
      {
        url: '/assets/img/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agrotm Solana - DeFi Platform',
    description: 'Sustainable agriculture meets DeFi on Solana',
    images: ['/assets/img/og-image.png'],
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
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
} 