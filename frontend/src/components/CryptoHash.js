import React, { useEffect, useState } from 'react';
import cryptoService from '../services/cryptoService';

// Por padrão não exibe visualmente o hash para não poluir a UI
// Pode ser exibido passando visible={true}
const CryptoHash = ({ pageName = 'default', visible = false, style = {}, className = '' }) => {
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatePageHash = async () => {
      try {
        setLoading(true);

        // Gerar hash único para a página
        const pageData = {
          page: pageName,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        };

        const result = await cryptoService.generateHash(pageData, 'sha256');

        if (result.success) {
          // Pegar apenas os primeiros 16 caracteres do hash
          const shortHash = result.data.hash.substring(0, 16).toUpperCase();
          setHash(shortHash);
        } else {
          // Fallback: gerar hash local
          const fallbackHash = btoa(JSON.stringify(pageData))
            .replace(/[^A-Z0-9]/g, '')
            .substring(0, 16);
          setHash(fallbackHash);
        }
      } catch (error) {
        // Fallback em caso de erro
        const fallbackHash = Math.random().toString(36).substring(2, 18).toUpperCase();
        setHash(fallbackHash);
      } finally {
        setLoading(false);
      }
    };

    generatePageHash();
  }, [pageName]);

  if (loading || !visible) {
    // Não renderiza nada visual enquanto carrega ou quando não for para exibir
    return null;
  }

  return (
    <div className={`crypto-hash-display ${className}`} style={style} aria-hidden={!visible}>
      <span className='font-mono text-xs text-gray-500'>{hash}</span>
    </div>
  );
};

export default CryptoHash;
