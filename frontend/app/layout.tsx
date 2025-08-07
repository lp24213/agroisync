import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { Layout } from '@/components/layout/Layout';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Chatbot } from '@/components/ui/Chatbot';
import { Chatbot24h } from '@/components/ui/Chatbot24h';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AGROTM - Revolucionando o Agronegócio com Tecnologia',
  description: 'A maior revolução tecnológica no agronegócio mundial. Inovação, automação e sustentabilidade integradas em uma única plataforma.',
  keywords: 'agronegócio, tecnologia, agricultura, sustentabilidade, inovação, plataforma',
  authors: [{ name: 'AGROTM Team' }],
  creator: 'AGROTM',
  publisher: 'AGROTM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://agrotm.sol'),
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/pt',
      'en-US': '/en',
      'es-ES': '/es',
      'zh-CN': '/zh',
    },
  },
  openGraph: {
    title: 'AGROTM - Revolucionando o Agronegócio com Tecnologia',
    description: 'A maior revolução tecnológica no agronegócio mundial. Inovação, automação e sustentabilidade integradas em uma única plataforma.',
    url: 'https://agrotm.sol',
    siteName: 'AGROTM',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROTM - Plataforma de Tecnologia Agrícola',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AGROTM - Revolucionando o Agronegócio com Tecnologia',
    description: 'A maior revolução tecnológica no agronegócio mundial. Inovação, automação e sustentabilidade integradas em uma única plataforma.',
    images: ['/twitter-image.jpg'],
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Fontes premium */}
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AGROTM",
              "url": "https://agrotm.sol",
              "logo": "https://agrotm.sol/logo.png",
              "description": "A maior revolução tecnológica no agronegócio mundial. Inovação, automação e sustentabilidade integradas em uma única plataforma.",
              "foundingDate": "2024",
              "industry": "Agronegócio",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BR",
                "addressLocality": "São Paulo",
                "addressRegion": "SP"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "contato@agrotm.com",
                "availableLanguage": ["Portuguese", "English", "Spanish", "Chinese"]
              },
              "sameAs": [
                "https://twitter.com/agrotm",
                "https://linkedin.com/company/agrotm",
                "https://github.com/agrotm"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <I18nProvider>
          <CustomCursor />
          <LoadingScreen />
          <Layout>
            {children}
          </Layout>
          <Chatbot />
          <Chatbot24h />
        </I18nProvider>
      </body>
    </html>
  );
}