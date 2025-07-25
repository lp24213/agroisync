import GlassCard from './GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

const wallets = [
  { name: 'Metamask', icon: '/assets/icons/metamask.svg' },
  { name: 'WalletConnect', icon: '/assets/icons/walletconnect.svg' },
  { name: 'Phantom', icon: '/assets/icons/phantom.svg' },
];

export default function WalletModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard className="w-80 flex flex-col items-center">
              <h2 className="text-primary text-2xl font-futuristic mb-4">Conectar Carteira</h2>
              <div className="flex flex-col gap-4 w-full">
                {wallets.map((w) => (
                  <button
                    key={w.name}
                    className="flex items-center gap-3 px-4 py-3 bg-background rounded-xl shadow-neon hover:bg-primary/20 transition-all text-white font-futuristic text-lg"
                  >
                    <img src={w.icon} alt={w.name} className="w-7 h-7" />
                    {w.name}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="mt-6 text-primary hover:underline">
                Fechar
              </button>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
