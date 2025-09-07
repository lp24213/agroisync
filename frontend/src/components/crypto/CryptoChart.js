import React, { useState, // useEffect, useRef } from 'react';
import cryptoService from '../../services/cryptoService';

const CryptoChart = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [// loading, // setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // useEffect(() => {
    // loadCryptoData();
    const interval = setInterval(// loadCryptoData, 30000); // Atualizar a cada 30 segundos
    return () => clearInterval(interval);
  }, [// loadCryptoData]);

  // useEffect(() => {
    if (cryptoData.length > 0 && canvasRef.current) {
      // startAnimation();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cryptoData, // startAnimation]);

  const // loadCryptoData = async () => {
    try {
      // setLoading(true);
      const data = await cryptoService.getTopCryptos(8);
      setCryptoData(data);
      if (data.length > 0 && !selectedCrypto) {
        setSelectedCrypto(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de criptomoedas:', error);
    } finally {
      // setLoading(false);
    }
  };

  const // startAnimation = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let time = 0;
    const animate = () => {
      time += 0.02;
      
      // Limpar canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Desenhar fundo gradiente
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
      gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.1)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Desenhar linhas de preço animadas
      cryptoData.forEach((crypto, index) => {
        const x = (index / (cryptoData.length - 1)) * width;
        const baseY = height * 0.5;
        const amplitude = height * 0.3;
        const frequency = 2 + index * 0.5;
        
        // Linha de preço
        ctx.strokeStyle = `hsl(${200 + index * 30}, 70%, 60%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < width; i += 2) {
          const progress = i / width;
          const y = baseY + Math.sin(progress * frequency * Math.PI + time + index) * amplitude * 0.5;
          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        ctx.stroke();

        // Pontos de dados
        ctx.fillStyle = `hsl(${200 + index * 30}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, baseY + Math.sin((x / width) * frequency * Math.PI + time + index) * amplitude * 0.5, 4, 0, Math.PI * 2);
        ctx.fill();

        // Efeito de brilho
        ctx.shadowColor = `hsl(${200 + index * 30}, 70%, 60%)`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, baseY + Math.sin((x / width) * frequency * Math.PI + time + index) * amplitude * 0.5, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Desenhar grade de fundo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      // Linhas horizontais
      for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Linhas verticais
      for (let i = 0; i <= 4; i++) {
        const x = (width / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatPercentage = (percentage) => {
    const isPositive = percentage >= 0;
    return (
      <span className={`font-mono ${isPositive ? 'text-blue-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{percentage.toFixed(2)}%
      </span>
    );
  };

  if (// loading) {
    return (
      <div className="w-full h-96 bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-// t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dados de criptomoedas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Gráfico Principal */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Gráfico de Criptomoedas</h3>
          <div className="flex space-x-2">
            {cryptoData.slice(0, 4).map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => setSelectedCrypto(crypto)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  selectedCrypto?.id === crypto.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {crypto.symbol}
              </button>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-96 rounded-lg"
          />
          
          {/* Overlay de informações */}
          {selectedCrypto && (
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-600">
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src={selectedCrypto.image}
                  alt={selectedCrypto.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h4 className="text-white font-semibold">{selectedCrypto.name}</h4>
                  <p className="text-gray-400 text-sm">{selectedCrypto.symbol}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-white text-lg font-bold">
                  {formatPrice(selectedCrypto.price)}
                </p>
                <p className="text-sm">
                  {formatPercentage(selectedCrypto.priceChangePercentage24h)}
                </p>
                <p className="text-gray-400 text-xs">
                  Cap: ${(selectedCrypto.marketCap / 1e9).toFixed(2)}B
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Criptomoedas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cryptoData.map((crypto) => (
          <div
            key={crypto.id}
            className={`bg-gray-800 rounded-lg p-4 border transition-all duration-300 cursor-pointer hover:scale-105 ${
              selectedCrypto?.id === crypto.id
                ? 'border-purple-500 bg-gray-700'
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => setSelectedCrypto(crypto)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h4 className="text-white font-semibold text-sm">{crypto.symbol}</h4>
                  <p className="text-gray-400 text-xs">{crypto.name}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-white font-bold text-lg">
                {formatPrice(crypto.price)}
              </p>
              <p className="text-sm">
                {formatPercentage(crypto.priceChangePercentage24h)}
              </p>
              <div className="text-xs text-gray-400">
                <p>Cap: ${(crypto.marketCap / 1e9).toFixed(2)}B</p>
                <p>Vol: ${(crypto.volume24h / 1e6).toFixed(1)}M</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoChart;
