import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CryptoChart = ({ data, symbol, price, change24h, height = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configurar tamanho do canvas
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Configurar dimensões
    const width = canvas.offsetWidth;
    const chartHeight = height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartAreaHeight = chartHeight - padding * 2;

    // Limpar canvas
    ctx.clearRect(0, 0, width, chartHeight);

    if (data.length === 0) return;

    // Encontrar valores min e max
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const paddingPercent = 0.1;
    const adjustedMin = minPrice - priceRange * paddingPercent;
    const adjustedMax = maxPrice + priceRange * paddingPercent;
    const adjustedRange = adjustedMax - adjustedMin;

    // Função para converter preço para coordenada Y
    const priceToY = (price) => {
      return chartAreaHeight - ((price - adjustedMin) / adjustedRange) * chartAreaHeight;
    };

    // Função para converter tempo para coordenada X
    const timeToX = (time, index) => {
      return (index / (data.length - 1)) * chartWidth;
    };

    // Desenhar grade
    ctx.strokeStyle = 'rgba(42, 127, 79, 0.1)';
    ctx.lineWidth = 1;
    
    // Linhas horizontais
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartAreaHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Linhas verticais
    for (let i = 0; i <= 4; i++) {
      const x = padding + (chartWidth / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, chartHeight - padding);
      ctx.stroke();
    }

    // Desenhar linha do gráfico
    ctx.strokeStyle = change24h >= 0 ? '#22c55e' : '#ef4444';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    data.forEach((point, index) => {
      const x = padding + timeToX(point.time, index);
      const y = padding + priceToY(point.price);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Desenhar área sob a curva
    const gradient = ctx.createLinearGradient(0, padding, 0, chartHeight - padding);
    gradient.addColorStop(0, change24h >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)');
    gradient.addColorStop(1, change24h >= 0 ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding, chartHeight - padding);
    
    data.forEach((point, index) => {
      const x = padding + timeToX(point.time, index);
      const y = padding + priceToY(point.price);
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(width - padding, chartHeight - padding);
    ctx.closePath();
    ctx.fill();

    // Desenhar pontos nos dados
    ctx.fillStyle = change24h >= 0 ? '#22c55e' : '#ef4444';
    data.forEach((point, index) => {
      if (index % 5 === 0 || index === data.length - 1) { // Mostrar alguns pontos
        const x = padding + timeToX(point.time, index);
        const y = padding + priceToY(point.price);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Desenhar círculo branco interno
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = change24h >= 0 ? '#22c55e' : '#ef4444';
      }
    });

    // Desenhar labels do eixo Y
    ctx.fillStyle = 'rgba(42, 127, 79, 0.6)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i <= 4; i++) {
      const price = adjustedMax - (adjustedRange / 4) * i;
      const y = padding + (chartAreaHeight / 4) * i;
      
      let priceText;
      if (price >= 1) {
        priceText = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        priceText = `$${price.toFixed(4)}`;
      }
      
      ctx.fillText(priceText, padding - 10, y);
    }

    // Desenhar label do eixo X
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const lastDate = new Date(data[data.length - 1].time);
    const firstDate = new Date(data[0].time);
    
    ctx.fillText('30 dias', width / 2, chartHeight - padding + 10);

  }, [data, height, change24h]);
                
                return (
    <div className="crypto-chart-container" style={{ position: 'relative', width: '100%', height: height }}>
      <canvas
        ref={canvasRef}
                      style={{ 
          width: '100%',
          height: '100%',
          borderRadius: '8px'
        }}
      />
      
      {/* Overlay com informações */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {symbol} • {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
          </div>
    </div>
  );
};

export default CryptoChart;