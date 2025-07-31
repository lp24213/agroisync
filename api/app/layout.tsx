import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Gateway - AGROTM',
  description: 'API Gateway for AGROTM platform',
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
