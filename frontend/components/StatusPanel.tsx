import React, { useEffect, useState } from 'react';

export default function StatusPanel() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(setStatus);
  }, []);

  if (!status) return <div className="text-blue-400">Carregando status...</div>;

  return (
    <div className="bg-black/70 rounded-2xl p-8 shadow-xl flex flex-col items-center">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Status do Sistema</h2>
      <div className="flex gap-8">
        <div>
          <span className="font-bold text-white">API:</span>
          <span className={status.api ? 'text-green-400' : 'text-red-400'}>
            {status.api ? ' Online' : ' Offline'}
          </span>
        </div>
        <div>
          <span className="font-bold text-white">MongoDB:</span>
          <span className={status.db ? 'text-green-400' : 'text-red-400'}>
            {status.db ? ' Online' : ' Offline'}
          </span>
        </div>
      </div>
      <div className="mt-4 text-gray-400 text-xs">
        Uptime: {Math.round(status.uptime)}s<br />
        Atualizado: {new Date(status.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
