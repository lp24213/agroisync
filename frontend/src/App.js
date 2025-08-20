import React from 'react';

function App() {
  return (
    <div style={{padding: '50px', textAlign: 'center', fontFamily: 'Arial'}}>
      <h1>🚀 AgroSync Funcionando!</h1>
      <p>Deploy realizado com sucesso usando React puro</p>
      <p>Data: {new Date().toLocaleString()}</p>
      <button onClick={() => alert('Backend integrado!')}>
        Testar Funcionalidade
      </button>
    </div>
  );
}

export default App;
