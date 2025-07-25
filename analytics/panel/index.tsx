import { useEffect, useState } from 'react';

interface AnalyticsRow {
  date: string;
  users: number;
  transactions: number;
}

export default function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsRow[]>([]);

  useEffect(() => {
    setData([
      { date: '2025-07-01', users: 1340, transactions: 785 },
      { date: '2025-07-02', users: 1480, transactions: 920 },
      { date: '2025-07-03', users: 1622, transactions: 1043 },
    ]);
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">📊 Painel de Analytics</h1>
      <table className="w-full text-left border border-blue-900">
        <thead>
          <tr className="bg-blue-900 text-sky-100">
            <th className="p-3">📅 Data</th>
            <th className="p-3">👥 Usuários</th>
            <th className="p-3">🔁 Transações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: AnalyticsRow, i: number) => (
            <tr key={i} className="border-b border-blue-800">
              <td className="p-3">{row.date}</td>
              <td className="p-3">{row.users}</td>
              <td className="p-3">{row.transactions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
