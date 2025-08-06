import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AGROTM - Agricultura Tokenizada do Futuro',
  description: 'Conectando agricultores e investidores através da tecnologia blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </body>
    </html>
  );
}