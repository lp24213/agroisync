import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MapPin } from 'lucide-react';

const GrainsChart = () => {
  const [grainsData, setGrainsData] = useState([]);
  const [userLocation, setUserLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrainsData = async () => {
      try {
        // Detectar localização real via nosso proxy
        const response = await fetch('/api/geolocation');
        const locationData = await response.json();
        
        let userRegion = 'São Paulo';
        let userCity = 'São Paulo';
        
        if (locationData.region) {
          // Mapear regiões para estados brasileiros
          const regionMap = {
            'Mato Grosso': 'Mato Grosso',
            'Paraná': 'Paraná', 
            'Rio Grande do Sul': 'Rio Grande do Sul',
            'São Paulo': 'São Paulo',
            'Minas Gerais': 'Minas Gerais',
            'Goiás': 'Goiás',
            'Bahia': 'Bahia',
            'Maranhão': 'Maranhão'
          };
          
          userRegion = regionMap[locationData.region] || 'São Paulo';
          userCity = locationData.city || 'São Paulo';
        }
        
        // Simulando dados da Agrolink por região REAL (baseado em IP)
        const mockGrainsData = [
          { 
            grain: 'Soja', 
            price: userRegion === 'Mato Grosso' ? 148.50 : 145.50, // Preço maior no MT
            change: userRegion === 'Mato Grosso' ? 3.20 : 2.30,
            changePercent: userRegion === 'Mato Grosso' ? 2.20 : 1.60,
            region: userRegion,
            unit: 'R$/saca'
          },
          { 
            grain: 'Milho', 
            price: userRegion === 'Mato Grosso' ? 82.20 : 78.20, // Preço maior no MT
            change: userRegion === 'Mato Grosso' ? -0.80 : -1.20,
            changePercent: userRegion === 'Mato Grosso' ? -0.96 : -1.51,
            region: userRegion,
            unit: 'R$/saca'
          },
          { 
            grain: 'Algodão', 
            price: userRegion === 'Mato Grosso' ? 285.40 : 275.20, // MT é grande produtor
            change: userRegion === 'Mato Grosso' ? 4.60 : 2.80,
            changePercent: userRegion === 'Mato Grosso' ? 1.64 : 1.03,
            region: userRegion,
            unit: 'R$/saca'
          },
          { 
            grain: 'Arroz', 
            price: userRegion === 'Rio Grande do Sul' ? 98.80 : 95.80,
            change: userRegion === 'Rio Grande do Sul' ? 1.20 : 0.80,
            changePercent: userRegion === 'Rio Grande do Sul' ? 1.23 : 0.84,
            region: userRegion,
            unit: 'R$/saca'
          },
          { 
            grain: 'Feijão', 
            price: userRegion === 'Minas Gerais' ? 192.20 : 185.20,
            change: userRegion === 'Minas Gerais' ? 4.40 : 3.40,
            changePercent: userRegion === 'Minas Gerais' ? 2.34 : 1.87,
            region: userRegion,
            unit: 'R$/saca'
          }
        ];
        
        setGrainsData(mockGrainsData);
        
        // Definir localização detectada
        setUserLocation(`${userCity}, ${userRegion}`);
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados de grãos:', error);
        
        // Fallback com dados do MT
        const fallbackGrainsData = [
          {
            grain: 'Soja',
            price: 148.50,
            change: 3.20,
            changePercent: 2.20,
            region: 'Mato Grosso',
            unit: 'R$/saca'
          },
          {
            grain: 'Milho',
            price: 82.20,
            change: -0.80,
            changePercent: -0.96,
            region: 'Mato Grosso',
            unit: 'R$/saca'
          },
          {
            grain: 'Algodão',
            price: 285.40,
            change: 4.60,
            changePercent: 1.64,
            region: 'Mato Grosso',
            unit: 'R$/saca'
          }
        ];
        
        setGrainsData(fallbackGrainsData);
        setUserLocation('Sinop, MT');
        setLoading(false);
      }
    };

    fetchGrainsData();
    
    // Atualizar a cada 2 minutos
    const interval = setInterval(fetchGrainsData, 120000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
          <span className="text-gray-600">Carregando dados de grãos...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-6"
      style={{ minHeight: '400px' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Cotações de Grãos</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Dados para {userLocation}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Atualizado agora
        </div>
      </div>

      <div className="space-y-4">
        {grainsData.map((grain, index) => (
          <motion.div
            key={grain.grain}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">
                  {grain.grain.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{grain.grain}</h4>
                <p className="text-sm text-gray-600">{grain.region}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-mono text-lg font-semibold text-gray-900">
                {grain.price.toFixed(2)} {grain.unit}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                grain.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {grain.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {grain.change >= 0 ? '+' : ''}{grain.change.toFixed(2)} ({grain.changePercent >= 0 ? '+' : ''}{grain.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Dados atualizados automaticamente por localização
        </p>
      </div>
    </motion.div>
  );
};

export default GrainsChart;
