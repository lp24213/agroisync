import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "../components/layout/Layout";
import "../lib/i18n"; // Initialize i18n

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AGROTM Solana - Revolucione a Agricultura com DeFi",
  description: "A maior plataforma Web3 para o agronegócio mundial. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade na Solana.",
  keywords: [
    "AGROTM",
    "Solana",
    "DeFi",
    "Agricultura",
    "Blockchain",
    "NFTs",
    "Staking",
    "Governança",
    "Sustentabilidade"
  ],
  authors: [{ name: "AGROTM Team" }],
  creator: "AGROTM",
  publisher: "AGROTM",
  openGraph: {
    title: "AGROTM Solana - Revolucione a Agricultura com DeFi",
    description: "A maior plataforma Web3 para o agronegócio mundial. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade na Solana.",
    type: "website",
    locale: "pt_BR",
    siteName: "AGROTM Solana"
  },
  twitter: {
    card: "summary_large_image",
    title: "AGROTM Solana - Revolucione a Agricultura com DeFi",
    description: "A maior plataforma Web3 para o agronegócio mundial. Staking, NFTs agrícolas, governança descentralizada e sustentabilidade na Solana."
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}