import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Layout } from "../components/layout/Layout";
import { Web3Provider } from "../contexts/Web3Context";
import { AuthProvider } from "../contexts/AuthContext";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ]
};

export const metadata: Metadata = {
  title: {
    default: "AGROTM Solana - Plataforma DeFi para Agricultura Sustentável",
    template: "%s | AGROTM Solana"
  },
  description: "Revolucione a agricultura com DeFi na Solana. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade em uma única plataforma.",
  keywords: [
    "DeFi",
    "Solana",
    "Agricultura",
    "Sustentabilidade",
    "Staking",
    "NFT",
    "Blockchain",
    "Criptomoedas",
    "Governança",
    "Farming"
  ],
  authors: [{ name: "AGROTM Team" }],
  creator: "AGROTM",
  publisher: "AGROTM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://agrotm.com"),
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/pt",
      "en-US": "/en",
      "es-ES": "/es"
    }
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "AGROTM Solana",
    title: "AGROTM Solana - Plataforma DeFi para Agricultura Sustentável",
    description: "Revolucione a agricultura com DeFi na Solana. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade em uma única plataforma.",
    images: [
      {
        url: "/assets/img/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AGROTM Solana - Plataforma DeFi Agrícola",
        type: "image/jpeg"
      },
      {
        url: "/assets/img/og-image-square.jpg",
        width: 1200,
        height: 1200,
        alt: "AGROTM Solana Logo",
        type: "image/jpeg"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@agrotm_official",
    creator: "@agrotm_official",
    title: "AGROTM Solana - Plataforma DeFi para Agricultura Sustentável",
    description: "Revolucione a agricultura com DeFi na Solana. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade.",
    images: ["/assets/img/twitter-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/assets/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "mask-icon", url: "/assets/icons/safari-pinned-tab.svg", color: "#10b981" }
    ]
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    other: {
      "msvalidate.01": process.env.BING_SITE_VERIFICATION || ""
    }
  },
  category: "technology",
  classification: "DeFi Platform",
  referrer: "origin-when-cross-origin"
};

// Loading component for Suspense fallbacks
function GlobalLoading() {
  return (
    <div className="min-h-screen bg-agro-dark flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//api.solana.com" />
        <link rel="dns-prefetch" href="//mainnet-beta.solana.com" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* PWA meta tags */}
        <meta name="application-name" content="AGROTM Solana" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AGROTM" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AGROTM Solana",
              "description": "Plataforma DeFi para Agricultura Sustentável na Solana",
              "url": process.env.NEXT_PUBLIC_APP_URL || "https://agrotm.com",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "AGROTM"
              }
            })
          }}
        />
      </head>
      <body 
        className={`
          ${inter.className} 
          min-h-screen 
          bg-agro-dark 
          text-agro-light 
          antialiased 
          selection:bg-agro-primary/20 
          selection:text-agro-light
          overflow-x-hidden
        `}
        suppressHydrationWarning
      >
        <Suspense fallback={<GlobalLoading />}>
          <AuthProvider>
            <Web3Provider>
              <Layout>
                <main className="flex-1 w-full">
                  <Suspense fallback={<GlobalLoading />}>
                    {children}
                  </Suspense>
                </main>
              </Layout>
            </Web3Provider>
          </AuthProvider>
        </Suspense>
        
        {/* Analytics and tracking scripts */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                        page_title: document.title,
                        page_location: window.location.href,
                      });
                    `
                  }}
                />
              </>
            )}
            
            {/* Hotjar */}
            {process.env.NEXT_PUBLIC_HOTJAR_ID && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(h,o,t,j,a,r){
                      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                      h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                      a=o.getElementsByTagName('head')[0];
                      r=o.createElement('script');r.async=1;
                      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                      a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                  `
                }}
              />
            )}
          </>
        )}
      </body>
    </html>
  );
}