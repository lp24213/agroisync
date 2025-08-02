import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "../components/sections/Hero";
import { Features } from "../components/sections/Features";
import { Stats } from "../components/sections/Stats";
import { CTA } from "../components/sections/CTA";
import { About } from "../components/sections/About";
import { Contact } from "../components/sections/Contact";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export const metadata: Metadata = {
  title: "AGROTM Solana - Revolucione a Agricultura com DeFi",
  description: "A maior plataforma Web3 para o agronegócio mundial. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade na Solana.",
  keywords: [
    "DeFi agricultura",
    "Solana farming",
    "NFT agrícola",
    "Blockchain agronegócio",
    "Staking sustentável",
    "Web3 agricultura",
    "Tokenização rural",
    "Governança descentralizada"
  ],
  openGraph: {
    title: "AGROTM Solana - Revolucione a Agricultura com DeFi",
    description: "A maior plataforma Web3 para o agronegócio mundial. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade na Solana.",
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "AGROTM Solana",
    images: [
      {
        url: "/assets/img/home-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AGROTM Solana - Plataforma DeFi Agrícola"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AGROTM Solana - Revolucione a Agricultura com DeFi",
    description: "A maior plataforma Web3 para o agronegócio mundial. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade.",
    images: ["/assets/img/home-twitter-image.jpg"]
  },
  alternates: {
    canonical: "/"
  }
};

/**
 * Componente de loading para seções da página inicial
 */
function SectionLoading() {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <LoadingSpinner size="md" />
    </div>
  );
}

/**
 * Página inicial da plataforma AGROTM Solana
 * 
 * Apresenta a proposta de valor da plataforma através de seções otimizadas:
 * - Hero: Apresentação principal com call-to-action
 * - Features: Principais funcionalidades da plataforma
 * - Stats: Estatísticas e métricas importantes
 * - Testimonials: Depoimentos de usuários
 * - Partners: Parceiros e integrações
 * - CTA: Chamada final para ação
 * 
 * @returns JSX.Element - Página inicial responsiva e otimizada
 */
export default function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "AGROTM Solana - Página Inicial",
            "description": "A maior plataforma Web3 para o agronegócio mundial. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade na Solana.",
            "url": process.env.NEXT_PUBLIC_APP_URL || "https://agrotm.com",
            "mainEntity": {
              "@type": "Organization",
              "name": "AGROTM",
              "description": "Plataforma DeFi para Agricultura Sustentável",
              "url": process.env.NEXT_PUBLIC_APP_URL || "https://agrotm.com",
              "logo": {
                "@type": "ImageObject",
                "url": "/assets/img/logo.svg"
              },
              "sameAs": [
                "https://twitter.com/agrotm_official",
                "https://github.com/agrotm",
                "https://discord.gg/agrotm",
                "https://t.me/agrotm_official"
              ]
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Início",
                  "item": process.env.NEXT_PUBLIC_APP_URL || "https://agrotm.com"
                }
              ]
            }
          })
        }}
      />

      {/* Main Content */}
      <div className="min-h-screen w-full">
        {/* Hero Section */}
        <section className="relative w-full">
          <Suspense fallback={<SectionLoading />}>
            <Hero />
          </Suspense>
        </section>

        {/* Features Section */}
        <section className="relative w-full py-20 bg-agro-dark/50">
          <Suspense fallback={<SectionLoading />}>
            <Features />
          </Suspense>
        </section>

        {/* Stats Section */}
        <section className="relative w-full py-16 bg-gradient-to-r from-agro-primary/10 to-agro-secondary/10">
          <Suspense fallback={<SectionLoading />}>
            <Stats />
          </Suspense>
        </section>

        {/* About Section */}
        <section className="relative w-full py-20 bg-agro-dark/30">
          <Suspense fallback={<SectionLoading />}>
            <About />
          </Suspense>
        </section>

        {/* Contact Section */}
        <section className="relative w-full py-16 bg-agro-dark/50">
          <Suspense fallback={<SectionLoading />}>
            <Contact />
          </Suspense>
        </section>

        {/* Call to Action Section */}
        <section className="relative w-full py-20 bg-gradient-to-br from-agro-primary/20 via-agro-secondary/20 to-agro-accent/20">
          <Suspense fallback={<SectionLoading />}>
            <CTA />
          </Suspense>
        </section>
      </div>
    </>
  );
}
