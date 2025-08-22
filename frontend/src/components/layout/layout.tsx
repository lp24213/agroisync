import React, { useState } from 'react'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { GlobalTicker } from './global-ticker'
import { ChatbotWidget } from '../chatbot/chatbot-widget'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <GlobalTicker />
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <ChatbotWidget 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />
    </div>
  )
}
