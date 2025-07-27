import { ThemeProvider } from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import DashboardStats from '../components/DashboardStats';
import RealtimeChart from '../components/RealtimeChart';
import Footer from '../components/Footer';

export default function Dashboard() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Dashboard Neon Premium */}
          <picture>
            <source srcSet="/assets/img/dashboard-interactive-neon.png" type="image/png" />
            <img
              src="/assets/img/dashboard-interactive-neon.png"
              alt="AGROTM Dashboard Interativo Neon"
              title="Dashboard Interativo AGROTM"
              className="w-full max-w-3xl rounded-2xl mb-8 shadow-xl object-cover animate-fade-in"
              loading="eager"
            />
          </picture>
          <h1 className="text-4xl font-futuristic text-primary mt-12 mb-4 drop-shadow-neon">
            Dashboard
          </h1>
          <DashboardStats />
          <RealtimeChart />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
