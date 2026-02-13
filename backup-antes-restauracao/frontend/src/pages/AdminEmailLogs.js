import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw } from 'lucide-react';

const AdminEmailLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const apiBase = useMemo(() => process.env.REACT_APP_API_URL || '/api', []);

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (status) params.set('status', status);
      if (to) params.set('to', to);
      params.set('page', String(page));
      params.set('limit', String(limit));

      const res = await fetch(`${apiBase}/admin/email-logs?${params.toString()}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken') || ''}` }
      });
      if (!res.ok) throw new Error('Falha ao carregar logs');
      const data = await res.json();
      setLogs(data?.data || []);
      setTotal(data?.pagination?.total || 0);
    } catch (e) {
      setError(e?.message || 'Erro ao carregar logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-xl font-semibold text-gray-900'>Logs de E-mail</h1>
          <button
            onClick={fetchLogs}
            className='inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
          >
            <RefreshCw className='h-4 w-4' /> Atualizar
          </button>
        </div>

        <div className='mb-4 grid grid-cols-1 gap-3 md:grid-cols-4'>
          <div className='flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2'>
            <Search className='h-4 w-4 text-gray-500' />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='Buscar por assunto'
              className='w-full outline-none'
            />
          </div>
          <input
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder='Destinatário (to)'
            className='rounded-md border border-gray-200 bg-white px-3 py-2'
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className='rounded-md border border-gray-200 bg-white px-3 py-2'
          >
            <option value=''>Status (todos)</option>
            <option value='sent'>Enviado</option>
            <option value='error'>Erro</option>
          </select>
          <button
            onClick={() => { setPage(1); fetchLogs(); }}
            className='rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700'
          >
            Filtrar
          </button>
        </div>

        {error && (
          <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700'>{error}</div>
        )}

        <div className='overflow-hidden rounded-md border border-gray-200 bg-white'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Data</th>
                <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Destinatário</th>
                <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Assunto</th>
                <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Status</th>
                <th className='px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Message ID</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td className='px-4 py-6 text-center text-gray-500' colSpan={5}>Carregando…</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td className='px-4 py-6 text-center text-gray-500' colSpan={5}>Sem registros</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td className='px-4 py-2 text-sm text-gray-700'>{new Date(log.createdAt).toLocaleString()}</td>
                    <td className='px-4 py-2 text-sm text-gray-700'>{log.to}</td>
                    <td className='px-4 py-2 text-sm text-gray-700'>{log.subject}</td>
                    <td className='px-4 py-2 text-sm'>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${log.status === 'sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {log.status === 'sent' ? 'Enviado' : 'Erro'}
                      </span>
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-700'>{log.messageId || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='mt-4 flex items-center justify-between'>
          <div className='text-sm text-gray-600'>
            Total: {total} • Página {page} de {totalPages}
          </div>
          <div className='flex items-center gap-2'>
            <select value={limit} onChange={e => { setLimit(parseInt(e.target.value, 10)); setPage(1); }} className='rounded-md border border-gray-200 bg-white px-2 py-1 text-sm'>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className='rounded-md border border-gray-200 bg-white px-3 py-1 text-sm disabled:opacity-50'>Anterior</button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className='rounded-md border border-gray-200 bg-white px-3 py-1 text-sm disabled:opacity-50'>Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmailLogs;
