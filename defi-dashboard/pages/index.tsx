import { NextPage } from 'next';
import DeFiDashboard from '../components/defi/DeFiDashboard';
import PriceWidget from '../components/widgets/PriceWidget';
import { DeFiProvider } from '../contexts/DeFiContext';

const Home: NextPage = () => {
  return (
    <DeFiProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">DeFi Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <DeFiDashboard />
          </div>
          <div>
            <PriceWidget />
          </div>
        </div>
      </div>
    </DeFiProvider>
  );
};

export default Home;
