'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieBanner } from '../ui/CookieBanner';
import { LanguageProvider } from '../../contexts/LanguageContext';
import '../../lib/i18n'; // Initialize i18n

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </LanguageProvider>
  );
} 