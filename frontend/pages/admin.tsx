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

export default function AdminPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl font-futuristic text-primary mt-12 mb-4 drop-shadow-neon">Admin Dashboard</h1>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
              >
                <GlassCard className="flex flex-col items-center text-center">
                  <span className="text-primary text-2xl font-futuristic mb-2 drop-shadow-neon">{stat.value}</span>
                  <span className="text-white/80 text-lg mb-1">{stat.label}</span>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          <h2 className="text-2xl text-primary font-futuristic mb-6">NFTs Mintados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
            {nfts.map((nft, i) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
              >
                <GlassCard className="flex flex-col items-start">
                  <span className="text-primary text-xl font-futuristic mb-1">{nft.name}</span>
                  <span className="text-white/60 text-sm mb-2">Owner: {nft.owner}</span>
                  <span className="text-white/80 mb-2">Preço: {nft.price}</span>
                  <button className="mt-2 px-6 py-2 bg-primary text-black rounded-xl font-futuristic shadow-neon hover:bg-accent transition-all">Ver NFT</button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
