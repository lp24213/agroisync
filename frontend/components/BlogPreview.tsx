import Link from 'next/link';
import { motion } from 'framer-motion';

const articles = [
  {
    title: 'Como o AGROTM está revolucionando o Agro com Web3',
    summary: 'Descubra como a blockchain Solana, NFTs e DeFi estão mudando o setor agroindustrial.',
    slug: '/blog/agro-web3',
  },
  {
    title: 'Staking seguro e rentável: Guia completo',
    summary: 'Aprenda a maximizar seus ganhos com staking seguro, transparente e auditável.',
    slug: '/blog/staking-seguro',
  },
];

export default function BlogPreview() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-10 mb-10 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-neon">Blog & Novidades</h2>
      <div className="grid gap-4">
        {articles.map((art, i) => (
          <motion.div
            key={art.slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-glass p-4 rounded-xl shadow-lg hover:scale-105 transition-transform border-l-4 border-neon"
          >
            <Link href={art.slug} className="text-xl font-semibold text-primary hover:text-neon">
              {art.title}
            </Link>
            <p className="text-gray-400 text-md mt-1">{art.summary}</p>
          </motion.div>
        ))}
      </div>
      <div className="text-right mt-3">
        <Link href="/blog" className="text-neon underline hover:text-primary">Ver todos os artigos →</Link>
      </div>
    </div>
  );
}
