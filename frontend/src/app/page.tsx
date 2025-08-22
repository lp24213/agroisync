import { FuturisticHero } from '@/components/home/futuristic-hero'
import { QuickLogin } from '@/components/auth/quick-login'
import { FeaturesShowcase } from '@/components/home/features-showcase'
import { StatsSection } from '@/components/home/stats-section'

export default function Home() {
  return (
    <div className="min-h-screen">
      <FuturisticHero />
      <QuickLogin />
      <FeaturesShowcase />
      <StatsSection />
    </div>
  )
}
