'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieBanner } from '../ui/CookieBanner';
import { I18nProvider } from '../providers/I18nProvider';
import '../../lib/i18n'; // Initialize i18n

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </I18nProvider>
  );
} 