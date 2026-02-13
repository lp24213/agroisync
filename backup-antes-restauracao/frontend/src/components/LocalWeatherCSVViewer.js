import React, { useState } from 'react';

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i] ? values[i].trim() : '';
    });
    return obj;
  });
}

const LocalWeatherCSVViewer = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filename, setFilename] = useState('');

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.trim().split('\n');
      setHeaders(lines[0].split(','));
      setData(parseCSV(text));
    };
    reader.readAsText(file);
  };

  return (
    <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', margin: '2rem 0', padding: 24 }}>
      <h3 style={{ marginBottom: 16 }}>Importar CSV Local da Open-Meteo</h3>
      <input type="file" accept=".csv" onChange={handleFile} />
      {filename && <div style={{ margin: '12px 0', color: '#2a7f4f' }}>Arquivo: {filename}</div>}
      {data.length > 0 && (
        <div style={{ overflowX: 'auto', maxHeight: 400 }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} style={{ border: '1px solid #eee', background: '#f8f9fa', padding: 4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 100).map((row, i) => (
                <tr key={i}>
                  {headers.map((h, j) => (
                    <td key={j} style={{ border: '1px solid #eee', padding: 4, fontSize: 12 }}>{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 100 && <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>(Exibindo apenas as 100 primeiras linhas)</div>}
        </div>
      )}
    </section>
  );
};

export default LocalWeatherCSVViewer;
