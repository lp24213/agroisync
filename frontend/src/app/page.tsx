import { Hero } from '@/components/home/hero'
import { QuickAccessCards } from '@/components/home/quick-access-cards'
import { FeaturesSection } from '@/components/home/features-section'
import { StatsSection } from '@/components/home/stats-section'
import { CTASection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
      <QuickAccessCards />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  )
}
