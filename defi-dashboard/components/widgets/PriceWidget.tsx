import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PriceResponse {
  [key: string]: {
    usd: number;
  };
}

const PriceWidget: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axios.get('/api/prices?ids=bitcoin,ethereum&vs_currencies=usd');
        setPriceData(response.data);
      } catch (err) {
        console.error('Error fetching price data:', err);
        setError('Failed to fetch price data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
    
    // Refresh price data every 60 seconds
    const interval = setInterval(fetchPriceData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-4 bg-gray-100 rounded-lg shadow">Loading price data...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow">{error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Crypto Prices</h3>
      {priceData && (
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="font-medium">Bitcoin</span>
            <span className="text-green-600">${priceData.bitcoin?.usd.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="font-medium">Ethereum</span>
            <span className="text-green-600">${priceData.ethereum?.usd.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceWidget;