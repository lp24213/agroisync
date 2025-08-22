import { Marketplace } from '@/components/store/marketplace'

export default function StorePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Marketplace />
      </div>
    </div>
  )
}
