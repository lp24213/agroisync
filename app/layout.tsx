import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGROTM Solana",
  description: "Plataforma DeFi para Agricultura Sustentável",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
} 