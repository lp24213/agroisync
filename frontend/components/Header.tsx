import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { i18n } = useTranslation();
  return (
    <header className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-background via-gray-900 to-background shadow-lg">
      <Link href="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <Image src="/assets/img/logo.png" alt="AGROTM Logo" width={40} height={40} className="h-10 w-10 rounded-xl shadow-lg" priority />
          <span className="font-futuristic text-xl text-primary">AGROTM</span>
        </div>
      </Link>
      <nav className="flex gap-8 font-futuristic text-md items-center">
        <Link href="/nft" className="hover:text-accent">NFT</Link>
        <Link href="/stake" className="hover:text-accent">Staking</Link>
        <select
          className="ml-4 px-2 py-1 bg-background text-primary border border-primary rounded-xl font-futuristic focus:outline-none"
          value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value)}
        >
          <option value="pt">PT</option>
          <option value="en">EN</option>
          <option value="zh">中文</option>
        </select>
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}