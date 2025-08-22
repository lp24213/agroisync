'use client';

import { FuturisticNavbar } from '@/components/layout/futuristic-navbar'
import { AIChatbot } from '@/components/chatbot/ai-chatbot'

interface SimpleLayoutProps {
  children: React.ReactNode
}

export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <FuturisticNavbar />
      <main className="pt-20">
        {children}
      </main>
      <AIChatbot />
    </div>
  )
}
