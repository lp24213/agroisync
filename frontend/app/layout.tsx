import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'AGROTM - Next-Generation DeFi Platform',
    template: '%s | AGROTM',
  },
  description:
    'Experience the future of decentralized finance with AGROTM. High-performance staking, yield farming, and portfolio management powered by cutting-edge blockchain technology.',
  keywords: [
    'DeFi',
    'blockchain',
    'staking',
    'yield farming',
    'portfolio',
    'cryptocurrency',
    'Solana',
    'Ethereum',
    'Web3',
    'NFT',
    'trading',
    'analytics',
  ],
  authors: [{ name: 'AGROTM Team' }],
  creator: 'AGROTM',
  publisher: 'AGROTM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://agrotmsol.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://agrotmsol.com.br',
    title: 'AGROTM.SOL - Next-Generation DeFi Platform',
    description:
      'Experience the future of decentralized finance with AGROTM. High-performance staking, yield farming, and portfolio management.',
    siteName: 'AGROTM',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROTM DeFi Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AGROTM.SOL - Next-Generation DeFi Platform',
    description: 'Experience the future of decentralized finance with AGROTM.SOL.',
    images: ['/og-image.jpg'],
    creator: '@agrotm',
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
