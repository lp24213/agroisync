import React, { useState, useEffect, useRef } from 'react';
import cryptoService from '../../services/cryptoService';

const CryptoChart = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await cryptoService.getTopCryptos(8);
        setCryptoData(data);
        if (data.length > 0 && !selectedCrypto) {
          setSelectedCrypto(data[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar dados de criptomoedas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [selectedCrypto]);

  useEffect(() => {
    if (cryptoData.length > 0 && canvasRef.current) {
      const animate = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        let time = 0;
        const animateFrame = () => {
          time += 0.02;

          // Limpar canvas
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, width, height);

          // Desenhar fundo gradiente
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);

          // Desenhar grid
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1;

          // Linhas verticais
          for (let i = 0; i < width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
          }

          // Linhas horizontais
          for (let i = 0; i < height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
          }

          // Desenhar dados da criptomoeda selecionada
          if (selectedCrypto && selectedCrypto.priceHistory) {
            const priceData = selectedCrypto.priceHistory;
            const maxPrice = Math.max(...priceData);
            const minPrice = Math.min(...priceData);
            const priceRange = maxPrice - minPrice;

            if (priceRange > 0) {
              ctx.strokeStyle = '#8b5cf6';
              ctx.lineWidth = 2;
              ctx.beginPath();

              priceData.forEach((price, index) => {
                const x = (index / (priceData.length - 1)) * width;
                const y = height - ((price - minPrice) / priceRange) * height;

                if (index === 0) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              });

              ctx.stroke();

              // Adicionar pontos nos dados
              ctx.fillStyle = '#8b5cf6';
              priceData.forEach((price, index) => {
                const x = (index / (priceData.length - 1)) * width;
                const y = height - ((price - minPrice) / priceRange) * height;

                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
              });
            }
          }

          // Adicionar efeito de partículas
          ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
          for (let i = 0; i < 20; i++) {
            const x = (Math.sin(time + i) * 0.5 + 0.5) * width;
            const y = (Math.cos(time * 0.5 + i) * 0.5 + 0.5) * height;

            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fill();
          }

          animationRef.current = requestAnimationFrame(animateFrame);
        };

        animateFrame();
      };

      animate();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cryptoData, selectedCrypto]);

  const formatPrice = price => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatChange = change => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-gray-600'}`} style={{ backgroundColor: 'transparent', border: 'none', padding: '0', margin: '0' }}>
        {isPositive ? '↗' : '↘'}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-700'></div>
      </div>
    );
  }

  return (
    <div className='rounded-2xl bg-white p-6 shadow-lg'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>Gráfico de Criptomoedas</h2>
        <div className='flex gap-2'>
          {cryptoData.map(crypto => (
            <button
              key={crypto.id}
              onClick={() => setSelectedCrypto(crypto)}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                selectedCrypto?.id === crypto.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {crypto.symbol}
            </button>
          ))}
        </div>
      </div>

      {selectedCrypto && (
        <div className='mb-6'>
          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100'>
              <span className='text-2xl'>{selectedCrypto.icon}</span>
            </div>
            <div>
              <h3 className='text-xl font-semibold text-gray-900'>{selectedCrypto.name}</h3>
              <p className='text-gray-600'>{selectedCrypto.symbol}</p>
            </div>
            <div className='ml-auto text-right'>
              <p className='text-2xl font-bold text-gray-900'>{formatPrice(selectedCrypto.price)}</p>
              {formatChange(selectedCrypto.change24h)}
            </div>
          </div>
        </div>
      )}

      <div className='relative'>
        <canvas ref={canvasRef} width={800} height={400} className='h-64 w-full rounded-lg bg-gray-50' />

        <div className='absolute left-4 top-4 rounded-lg bg-white bg-opacity-90 p-3'>
          <div className='text-sm text-gray-600'>
            <p>Preço: {selectedCrypto && formatPrice(selectedCrypto.price)}</p>
            <p>Volume: {selectedCrypto && formatPrice(selectedCrypto.volume24h)}</p>
            <p>Market Cap: {selectedCrypto && formatPrice(selectedCrypto.marketCap)}</p>
          </div>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {cryptoData.slice(0, 4).map(crypto => (
          <div
            key={crypto.id}
            className='cursor-pointer rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100'
            onClick={() => setSelectedCrypto(crypto)}
          >
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200'>
                <span className='text-lg'>{crypto.icon}</span>
              </div>
              <div className='flex-1'>
                <p className='font-medium text-gray-900'>{crypto.symbol}</p>
                <p className='text-sm text-gray-600'>{crypto.name}</p>
              </div>
              <div className='text-right'>
                <p className='font-semibold text-gray-900'>{formatPrice(crypto.price)}</p>
                {formatChange(crypto.change24h)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoChart;
