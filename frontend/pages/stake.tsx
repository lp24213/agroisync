import Header from '../components/Header';
import Footer from '../components/Footer';
import StakingCard from '../components/StakingCard';
import { useTranslation } from 'react-i18next';

import { useState, useEffect } from 'react';
import Skeleton from '../components/Skeleton';

export default function Stake() {
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
            <Skeleton width="w-64" height="h-10" className="mb-4" />
            <Skeleton width="w-full max-w-xl" height="h-56" />
          </>
        ) : (
          <>
            <h2 className="text-3xl font-futuristic text-primary mb-4">{t('staking')}</h2>
            <StakingCard />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
