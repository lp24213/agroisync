import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { i18n } = useTranslation();
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-glass backdrop-blur-lg shadow-glass border-b border-glassLight z-50">
      <Link href="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/assets/img/logo.png"
            alt="AGROTM Logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl shadow-neon"
            priority
          />
          <span className="font-futuristic text-2xl text-primary drop-shadow-neon">AGROTM</span>
        </div>
      </Link>
      <div className="flex gap-8 items-center font-futuristic text-md">
        <Link href="/dashboard" className="hover:text-accent transition-colors">
          Dashboard
        </Link>
        <Link href="/nft" className="hover:text-accent transition-colors">
          NFTs
        </Link>
        <Link href="/stake" className="hover:text-accent transition-colors">
          Staking
        </Link>
        <Link href="/tokenomics" className="hover:text-accent transition-colors">
          Tokenomics
        </Link>
        <Link href="/about" className="hover:text-accent transition-colors">
          Sobre
        </Link>
        <ThemeToggle />
        <select
          className="ml-4 px-2 py-1 bg-background text-primary border border-primary rounded-xl font-futuristic focus:outline-none"
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          <option value="pt">PT</option>
          <option value="en">EN</option>
          <option value="zh">中文</option>
        </select>
        <button className="ml-4 px-4 py-2 bg-primary text-black rounded-xl font-futuristic shadow-neon hover:bg-accent transition-all">
          Conectar Carteira
        </button>
      </div>
    </nav>
  );
}
