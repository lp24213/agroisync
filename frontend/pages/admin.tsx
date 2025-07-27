import { ThemeProvider } from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Usuários', value: '12,340' },
  { label: 'NFTs Mintados', value: '8,120' },
  { label: 'Volume (ETH)', value: '1,024' },
];

const nfts = [
  { id: 1, name: 'AGRO NFT #1', owner: '0x123...', price: '0.5 ETH' },
  { id: 2, name: 'AGRO NFT #2', owner: '0x456...', price: '0.7 ETH' },
];

import { useState, useEffect } from 'react';
import Skeleton from '../components/Skeleton';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    // Proteção de rota admin
    const token = Cookies.get('admin_token');
    if (token !== 'valid') {
      router.replace('/login');
      return;
    }
    const timeout = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, [router]);
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl font-futuristic text-primary mt-12 mb-4 drop-shadow-neon">
            Admin Dashboard
          </h1>
          {loading ? (
            <>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} width="w-full" height="h-32" className="mb-4" />
                ))}
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} width="w-full" height="h-28" />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.7 }}
                  >
                    <GlassCard className="flex flex-col items-center text-center">
                      <span className="text-primary text-2xl font-futuristic mb-2 drop-shadow-neon">
                        {stat.value}
                      </span>
                      <span className="text-white/80 text-lg mb-1">{stat.label}</span>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                {nfts.map((nft, i) => (
                  <GlassCard key={nft.id} className="flex flex-col items-start text-left">
                    <span className="text-primary text-lg font-futuristic mb-1">{nft.name}</span>
                    <span className="text-white/80 text-sm mb-1">Owner: {nft.owner}</span>
                    <span className="text-white/70 text-base mb-2">Preço: {nft.price}</span>
                  </GlassCard>
                ))}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
