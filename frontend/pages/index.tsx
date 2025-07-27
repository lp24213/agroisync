import Header from '../components/Header';
import Footer from '../components/Footer';
import MintNFT from '../components/MintNFT';
import Onboarding from '../components/Onboarding';
import BlogPreview from '../components/BlogPreview';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const ExampleExperimentalChart = dynamic(
  () => import('../components/ui/experimental/ExampleExperimentalChart'),
  { ssr: false },
);

import { useState, useEffect } from 'react';
import Skeleton from '../components/Skeleton';

export default function Home() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {loading ? (
          <>
            <Skeleton width="w-full max-w-4xl" height="h-64" className="mb-8" />
            <Skeleton width="w-72" height="h-12" className="mb-6" />
            <Skeleton width="w-96" height="h-8" className="mb-8" />
            <Skeleton width="w-full max-w-lg" height="h-24" className="mb-6" />
            <Skeleton width="w-full max-w-3xl" height="h-32" className="mb-6" />
            <Skeleton width="w-full max-w-2xl" height="h-24" className="mb-6" />
            <Skeleton width="w-full max-w-xl" height="h-32" className="mb-6" />
          </>
        ) : (
          <>
            {/* Hero Banner Neon Premium */}
            <picture>
              <source srcSet="/assets/img/hero-banner-agro-neon.png" type="image/png" />
              <img
                src="/assets/img/hero-banner-agro-neon.png"
                alt="AGROTM Hero Banner - Agricultura Digital Neon"
                title="AGROTM - Agricultura Digital Futurista"
                className="w-full max-w-4xl rounded-3xl mb-8 shadow-2xl object-cover animate-fade-in"
                loading="eager"
              />
            </picture>
            {/* Showcase animado */}
            <motion.h1
              className="text-5xl font-futuristic mb-6 text-primary neon-glow animate-gradient"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {t('welcome', 'Bem-vindo ao AGROTM')}
            </motion.h1>
            <p className="text-lg mb-8 text-center max-w-xl animate-fade-in">
              {t(
                'landing_subtitle',
                'A revolução Web3 no agronegócio, com NFTs, staking e integração blockchain.',
              )}
            </p>
            {/* MintNFT Widget */}
            <MintNFT />
            {/* Onboarding gamificado */}
            <Onboarding />
            {/* BlogPreview dinâmico */}
            <BlogPreview />
            {/* Componente experimental animado */}
            <ExampleExperimentalChart />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
