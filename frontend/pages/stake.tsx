import Header from '../components/Header';
import Footer from '../components/Footer';
import StakingCard from '../components/StakingCard';
import { useTranslation } from 'react-i18next';

export default function Stake() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-futuristic text-primary mb-4">{t('staking')}</h2>
        <StakingCard />
      </main>
      <Footer />
    </div>
  );
}
