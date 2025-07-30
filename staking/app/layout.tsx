import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staking Platform - AGROTM',
  description: 'Staking Platform for AGROTM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 