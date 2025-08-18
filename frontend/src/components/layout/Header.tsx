import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { clsx } from 'clsx';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  WalletIcon 
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Staking', href: '/staking' },
    { name: 'NFTs', href: '/nfts' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' }
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">AgroSync</span>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">AgroSync</span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'text-sm font-semibold leading-6 transition-colors',
                isActive(item.href)
                  ? 'text-green-600'
                  : 'text-gray-900 hover:text-green-600'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <button className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 hover:text-green-600 transition-colors">
            <WalletIcon className="h-5 w-5" />
            Connect Wallet
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 hover:text-green-600 transition-colors">
            <UserCircleIcon className="h-5 w-5" />
            Sign In
          </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">AgroSync</span>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🌱</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">AgroSync</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors',
                        isActive(item.href)
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-900 hover:bg-gray-50'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-2">
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    <WalletIcon className="h-5 w-5" />
                    Connect Wallet
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    <UserCircleIcon className="h-5 w-5" />
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
