import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DeFi Dashboard - AGROTM',
  description: 'DeFi Dashboard for AGROTM platform',
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
