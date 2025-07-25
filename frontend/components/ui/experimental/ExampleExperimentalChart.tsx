import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const data = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'TVL (R$ Milhões)',
      data: [12, 19, 7, 23, 17, 28],
      borderColor: '#00f0ff',
      backgroundColor: 'rgba(0,240,255,0.2)',
      tension: 0.4,
    },
  ],
};

const options = {
  plugins: { legend: { labels: { color: '#00f0ff' } } },
  scales: {
    x: { ticks: { color: '#fff' }, grid: { color: '#222' } },
    y: { ticks: { color: '#fff' }, grid: { color: '#222' } },
  },
};

export default function ExampleExperimentalChart() {
  return (
    <motion.div
      className="bg-glass rounded-2xl p-6 shadow-xl mt-10"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-neon">TVL DeFi (Experimental)</h2>
      <Line data={data} options={options} />
    </motion.div>
  );
}
