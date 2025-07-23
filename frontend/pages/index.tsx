import Header from '../components/Header';
import Footer from '../components/Footer';
import MintNFT from '../components/MintNFT';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.h1
          className="text-5xl font-futuristic mb-6 text-primary"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('welcome')}
        </motion.h1>
        <p className="text-lg mb-8 text-center max-w-xl">
          {t('landing_subtitle', 'A revolução Web3 no agronegócio, com NFTs, staking e integração blockchain.')}
        </p>
        <MintNFT />
      </main>
      <Footer />
    </div>
  );
}

