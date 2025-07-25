import { ThemeProvider } from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const posts = [
  {
    title: 'Lançamento do AGROTM',
    date: '2024-06-01',
    excerpt: 'O maior DApp Web3 Agro do planeta está no ar!',
    image: '/assets/img/logo.png',
  },
  {
    title: 'Como funciona o staking?',
    date: '2024-06-02',
    excerpt: 'Entenda como ganhar rendimentos com AGROTM.',
    image: '/assets/img/logo.png',
  },
  {
    title: 'NFTs no agronegócio',
    date: '2024-06-03',
    excerpt: 'Descubra o impacto dos NFTs no setor agro.',
    image: '/assets/img/logo.png',
  },
];

export default function BlogPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl font-futuristic text-primary mt-12 mb-4 drop-shadow-neon">
            Blog & Notícias
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            {posts.map((post, i) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
              >
                <GlassCard className="flex flex-col items-start">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-xl mb-4 shadow-neon"
                  />
                  <span className="text-primary text-xl font-futuristic mb-1">{post.title}</span>
                  <span className="text-white/60 text-sm mb-2">{post.date}</span>
                  <p className="text-white/80 mb-2">{post.excerpt}</p>
                  <button className="mt-2 px-6 py-2 bg-primary text-black rounded-xl font-futuristic shadow-neon hover:bg-accent transition-all">
                    Ler mais
                  </button>
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
