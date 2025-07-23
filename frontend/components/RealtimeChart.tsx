import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from './GlassCard';

function generateData() {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(now - (19 - i) * 1000).toLocaleTimeString(),
    value: 1000 + Math.round(Math.sin(i / 2) * 50 + Math.random() * 30),
  }));
}

export default function RealtimeChart() {
  const [data, setData] = useState(generateData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData((old) => [...old.slice(1), {
        time: new Date().toLocaleTimeString(),
        value: 1000 + Math.round(Math.sin(Date.now() / 10000) * 50 + Math.random() * 30),
      }]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-primary text-xl font-futuristic mb-4">Volume AGROTM (simulado)</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={[900, 1100]} hide />
          <Tooltip contentStyle={{ background: '#0a0a0a', border: 'none', color: '#00f0ff' }} />
          <Line type="monotone" dataKey="value" stroke="#00f0ff" strokeWidth={3} dot={false} isAnimationActive />
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  );
} 