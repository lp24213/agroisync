import { ThemeProvider } from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const tokenomics = [
  { label: 'Staking', value: 40, color: '#00f0ff' },
  { label: 'Equipe', value: 20, color: '#0ff1ce' },
  { label: 'Tesouraria', value: 15, color: '#1e90ff' },
  { label: 'Marketing', value: 10, color: '#00bfff' },
  { label: 'Comunidade', value: 15, color: '#007fff' },
];

export default function TokenomicsPage() {
  const total = tokenomics.reduce((acc, t) => acc + t.value, 0);
  let offset = 0;
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl font-futuristic text-primary mt-12 mb-4 drop-shadow-neon">Tokenomics</h1>
          <GlassCard className="flex flex-col items-center w-full max-w-2xl">
            <svg width="220" height="220" viewBox="0 0 220 220" className="mb-6">
              {tokenomics.map((t, i) => {
                const r = 100;
                const circ = 2 * Math.PI * r;
                const dash = (t.value / total) * circ;
                const dashArray = `${dash} ${circ - dash}`;
                const circle = (
                  <motion.circle
                    key={t.label}
                    cx="110"
                    cy="110"
                    r={r}
                    fill="none"
                    stroke={t.color}
                    strokeWidth="24"
                    strokeDasharray={dashArray}
                    strokeDashoffset={-offset}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 + i * 0.2 }}
                  />
                );
                offset += dash;
                return circle;
              })}
            </svg>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {tokenomics.map((t) => (
                <div key={t.label} className="flex items-center gap-4">
                  <span className="inline-block w-6 h-6 rounded-full" style={{ background: t.color }} />
                  <span className="text-white/80 text-lg">{t.label}</span>
                  <span className="text-primary font-futuristic ml-auto">{t.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
} 