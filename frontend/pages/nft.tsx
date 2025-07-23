import Header from '../components/Header';
import Footer from '../components/Footer';
import MintNFT from '../components/MintNFT';
import { useTranslation } from 'react-i18next';

export default function NFT() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-futuristic text-primary mb-4">{t('mint_nft')}</h2>
        <MintNFT />
      </main>
      <Footer />
    </div>
  );
}
