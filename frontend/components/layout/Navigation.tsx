'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/staking', label: 'Staking' },
  { href: '/pools', label: 'Pools' },
  { href: '/analytics', label: 'Analytics' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-gray-300 hover:text-white transition-colors',
            pathname === item.href && 'text-white font-medium'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
} 