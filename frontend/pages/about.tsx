import { ThemeProvider } from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const team = [
  { name: 'Luis P.', role: 'Founder & CEO', img: '/assets/img/logo.png' },
  { name: 'Maria S.', role: 'CTO', img: '/assets/img/logo.png' },
  { name: 'João A.', role: 'Lead Blockchain', img: '/assets/img/logo.png' },
];

export default function AboutPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl font-futuristic text-primary mt-12 mb-4 drop-shadow-neon">
            Sobre o AGROTM
          </h1>
          <GlassCard className="mb-8 w-full max-w-3xl text-center">
            <h2 className="text-2xl text-primary font-futuristic mb-2">Missão</h2>
            <p className="text-white/80 mb-4">
              Revolucionar o agronegócio global com tecnologia blockchain, NFTs e DeFi, promovendo
              transparência, inclusão e inovação.
            </p>
            <h2 className="text-2xl text-primary font-futuristic mb-2">Valores</h2>
            <p className="text-white/80">
              Inovação, sustentabilidade, inclusão, transparência e excelência.
            </p>
          </GlassCard>
          <h2 className="text-2xl text-primary font-futuristic mb-6">Equipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-12">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
              >
                <GlassCard className="flex flex-col items-center">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-28 h-28 rounded-full mb-4 shadow-neon"
                  />
                  <span className="text-primary text-xl font-futuristic mb-1">{member.name}</span>
                  <span className="text-white/80 text-lg mb-1">{member.role}</span>
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
