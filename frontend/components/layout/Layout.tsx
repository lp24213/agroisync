'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieBanner } from '../ui/CookieBanner';
import '../lib/i18n'; // Initialize i18n

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
} 