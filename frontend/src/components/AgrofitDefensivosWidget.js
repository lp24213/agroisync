import React, { useEffect, useState } from 'react';
import agrofitService from '../services/agrofitService';

const AgrofitDefensivosWidget = () => {
  const [categorias, setCategorias] = useState([]);
  const [defensivos, setDefensivos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedDefensivo, setSelectedDefensivo] = useState(null);
  const [defensivoDetalhes, setDefensivoDetalhes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await agrofitService.getClassesCategorias();
        setCategorias(data);
      } catch (err) {
        setError('Erro ao buscar categorias.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  const handleCategoriaChange = async (e) => {
    const categoriaId = e.target.value;
    setSelectedCategoria(categoriaId);
    setSelectedDefensivo(null);
    setDefensivoDetalhes(null);
    setLoading(true);
    setError(null);
    try {
      const defensivosData = await agrofitService.getDefensivosPorCategoria(categoriaId);
      setDefensivos(defensivosData);
    } catch (err) {
      setError('Erro ao buscar defensivos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDefensivoClick = async (defensivo) => {
    setSelectedDefensivo(defensivo);
    setDefensivoDetalhes(null);
    setLoading(true);
    setError(null);
    try {
      const detalhes = await agrofitService.getDefensivoDetalhes(defensivo.id);
      setDefensivoDetalhes(detalhes);
    } catch (err) {
      setError('Erro ao buscar detalhes do defensivo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', margin: '2rem 0', padding: 24 }}>
      <h3 style={{ marginBottom: 16 }}>Defensivos Agrícolas (Agrofit)</h3>
      {loading && <div>Carregando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="categoria">Categoria:</label>
        <select id="categoria" value={selectedCategoria} onChange={handleCategoriaChange} style={{ marginLeft: 8 }}>
          <option value="">Selecione</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
      </div>
      {defensivos.length > 0 && (
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #eee', background: '#f8f9fa', padding: 4 }}>Nome</th>
                <th style={{ border: '1px solid #eee', background: '#f8f9fa', padding: 4 }}>Registro MAPA</th>
                <th style={{ border: '1px solid #eee', background: '#f8f9fa', padding: 4 }}>Titular</th>
              </tr>
            </thead>
            <tbody>
              {defensivos.slice(0, 100).map((def, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} onClick={() => handleDefensivoClick(def)}>
                  <td style={{ border: '1px solid #eee', padding: 4, fontSize: 12 }}>{def.nome}</td>
                  <td style={{ border: '1px solid #eee', padding: 4, fontSize: 12 }}>{def.registro_mapa}</td>
                  <td style={{ border: '1px solid #eee', padding: 4, fontSize: 12 }}>{def.titular}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {defensivos.length > 100 && <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>(Exibindo apenas os 100 primeiros)</div>}
        </div>
      )}

      {defensivoDetalhes && (
        <div style={{ marginTop: 24, background: '#f8f8f8', borderRadius: 8, padding: 16 }}>
          <h4 style={{ marginBottom: 8 }}>Detalhes do Defensivo</h4>
          <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>{JSON.stringify(defensivoDetalhes, null, 2)}</pre>
        </div>
      )}
    </section>
  );
};

export default AgrofitDefensivosWidget;
