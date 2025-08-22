'use client';

import dynamic from 'next/dynamic'

const FuturisticNavbar = dynamic(() => import('@/components/layout/futuristic-navbar').then(mod => ({ default: mod.FuturisticNavbar })), { ssr: false })
const CosmicBackground = dynamic(() => import('@/components/ui/cosmic-background').then(mod => ({ default: mod.CosmicBackground })), { ssr: false })
const AIChatbot = dynamic(() => import('@/components/chatbot/ai-chatbot').then(mod => ({ default: mod.AIChatbot })), { ssr: false })
const FloatingLights = dynamic(() => import('@/components/ui/cosmic-background').then(mod => ({ default: mod.FloatingLights })), { ssr: false })

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <CosmicBackground>
      <FloatingLights />
      <FuturisticNavbar />
      <main className="pt-20">
        {children}
      </main>
      <AIChatbot />
    </CosmicBackground>
  )
}
