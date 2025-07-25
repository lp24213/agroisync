import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

export default function AnimatedHero() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center min-h-[60vh] py-16 bg-gradient-glass overflow-hidden">
      <motion.h1
        className="text-6xl md:text-7xl font-futuristic text-primary drop-shadow-lg mb-6 animate-pulse-neon"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        AGROTM
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl text-white/80 max-w-2xl text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        A revolução Web3 no agronegócio. NFTs, staking, DeFi e integração blockchain com design de
        outro mundo.
      </motion.p>
      <GlassCard className="mt-4 animate-pulse-neon">
        <span className="text-primary text-lg font-futuristic">
          Conecte sua carteira e comece agora!
        </span>
      </GlassCard>
      <div className="absolute -z-10 top-0 left-0 w-full h-full pointer-events-none">
        <motion.div
          className="w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-neon"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        />
      </div>
    </section>
  );
}
