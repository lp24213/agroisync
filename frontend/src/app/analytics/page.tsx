import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'

export const metadata = {
  title: 'Analytics - AgroSync',
  description: 'Dashboards interativos, gráficos e KPIs em tempo real na plataforma AgroSync.',
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <AnalyticsDashboard />
    </div>
  )
}
