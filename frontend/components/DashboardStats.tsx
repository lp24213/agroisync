import GlassCard from './GlassCard';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Usuários', value: '12,340', change: '+4.2%' },
  { label: 'NFTs Mintados', value: '8,120', change: '+2.1%' },
  { label: 'Volume (ETH)', value: '1,024', change: '+8.7%' },
  { label: 'Staking (AGROTM)', value: '320,000', change: '+6.3%' },
];

export default function DashboardStats() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
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
            <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{stat.change}</span>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
} 