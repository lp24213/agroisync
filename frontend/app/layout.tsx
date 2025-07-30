import type { Metadata } from 'next';
import { Inter, Orbitron, Space_Grotesk } from 'next/font/google';
import { Providers } from './providers';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@/components/Analytics';
import { Toaster } from '@/components/ui/Toaster';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AGROTM - Next-Generation DeFi Platform',
    template: '%s | AGROTM',
  },
  description: 'Experience the future of decentralized finance with AGROTM. High-performance staking, yield farming, and portfolio management powered by cutting-edge blockchain technology.',
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'AGROTM - Next-Generation DeFi Platform',
    description: 'Experience the future of decentralized finance with AGROTM. High-performance staking, yield farming, and portfolio management.',
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
    title: 'AGROTM - Next-Generation DeFi Platform',
    description: 'Experience the future of decentralized finance with AGROTM.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.mainnet-beta.solana.com" />
        <link rel="preconnect" href="https://api.coingecko.com" />
        
        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.mainnet-beta.solana.com" />
        <link rel="dns-prefetch" href="//api.coingecko.com" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white antialiased">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <I18nProvider>
            <Providers>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <Toaster />
              <Analytics />
            </Providers>
          </I18nProvider>
        </div>

        {/* Loading Indicator */}
        <div id="loading-indicator" className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300 opacity-0 pointer-events-none">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
        </div>

        {/* Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Loading indicator
              window.addEventListener('load', () => {
                const loader = document.getElementById('loading-indicator');
                if (loader) {
                  loader.style.opacity = '0';
                  setTimeout(() => {
                    loader.style.display = 'none';
                  }, 300);
                }
              });

              // Service Worker registration
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }

              // Performance monitoring
              if ('performance' in window) {
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart);
                    }
                  }, 0);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}