import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGROISYNC - Plataforma Agro",
  description: "Plataforma completa para gestão agropecuária",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{
        fontFamily: `var(--font-inter), Arial, Helvetica, sans-serif`,
        margin: 0,
        padding: 0,
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}>
        {children}
      </body>
    </html>
  );
}
