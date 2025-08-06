import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { appWithTranslation } from 'next-i18next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AGROTM - Agricultura Tokenizada do Futuro',
  description: 'Conectando agricultores e investidores através da tecnologia blockchain',
};

function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

export default appWithTranslation(RootLayout);