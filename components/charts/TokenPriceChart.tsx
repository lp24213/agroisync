import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const TokenPriceChart = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Simular dados de API Web3 real
    const fetchPrices = async () => {
      const now = Date.now();
      const prices = Array.from({ length: 20 }, (_, i) => ({
        x: now - (19 - i) * 3600 * 1000,
        y: (Math.random() * 0.15 + 0.85).toFixed(2),
      }));

      setChartData({
        labels: prices.map((p) => new Date(p.x)),
        datasets: [
          {
            label: 'AGRTM Token',
            data: prices.map((p) => p.y),
            borderColor: '#00ffff',
            backgroundColor: 'rgba(0, 255, 255, 0.1)',
            tension: 0.4,
            pointRadius: 2,
          },
        ],
      });
    };

    fetchPrices();
  }, []);

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div className="bg-black rounded-xl p-4">
      <h2 className="text-white text-lg mb-2">Token Price (AGRTM)</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            x: {
              type: 'time',
              time: { unit: 'hour' },
              ticks: { color: '#00ffff' },
              grid: { color: '#333' },
            },
            y: {
              ticks: { color: '#00ffff' },
              grid: { color: '#333' },
            },
          },
        }}
      />
    </div>
  );
};

export default TokenPriceChart;
