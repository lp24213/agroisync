import dynamic from 'next/dynamic'

const FuturisticHero = dynamic(() => import('@/components/home/futuristic-hero').then(mod => ({ default: mod.FuturisticHero })), { ssr: false })

export default function Home() {
  return (
    <div className="min-h-screen">
      <FuturisticHero />
    </div>
  )
}
