'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { I18nProvider } from '../providers/I18nProvider';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-black text-white relative">
        <Header />
        <main className="pt-16 relative z-10">
          {children}
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
} 