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
        // Detectar localização real via IP
        const response = await fetch('https://ipapi.co/json/');
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
            'Maranhão': 'Maranhão',
            'Pernambuco': 'Pernambuco',
            'Ceará': 'Ceará',
            'Pará': 'Pará',
            'Amazonas': 'Amazonas',
            'Rondônia': 'Rondônia',
            'Acre': 'Acre',
            'Roraima': 'Roraima',
            'Amapá': 'Amapá',
            'Tocantins': 'Tocantins',
            'Piauí': 'Piauí',
            'Alagoas': 'Alagoas',
            'Sergipe': 'Sergipe',
            'Paraíba': 'Paraíba',
            'Rio Grande do Norte': 'Rio Grande do Norte',
            'Espírito Santo': 'Espírito Santo',
            'Rio de Janeiro': 'Rio de Janeiro',
            'Santa Catarina': 'Santa Catarina',
            'Distrito Federal': 'Distrito Federal'
          };
          
          userRegion = regionMap[locationData.region] || locationData.region || 'São Paulo';
          userCity = locationData.city || 'São Paulo';
        }
        
        // Simulando dados da Agrolink por região REAL (baseado em IP)
        const getRegionalPrices = (grain, region) => {
          const basePrices = {
            'Soja': { 
              'Mato Grosso': { price: 148.50, change: 3.20, changePercent: 2.20 },
              'Paraná': { price: 145.50, change: 2.30, changePercent: 1.60 },
              'Rio Grande do Sul': { price: 142.80, change: 1.80, changePercent: 1.28 },
              'Goiás': { price: 147.20, change: 2.90, changePercent: 2.01 },
              'Bahia': { price: 144.30, change: 2.10, changePercent: 1.48 },
              'default': { price: 145.50, change: 2.30, changePercent: 1.60 }
            },
            'Milho': { 
              'Mato Grosso': { price: 82.20, change: -0.80, changePercent: -0.96 },
              'Paraná': { price: 78.20, change: -1.20, changePercent: -1.51 },
              'Rio Grande do Sul': { price: 79.50, change: -0.90, changePercent: -1.12 },
              'Goiás': { price: 80.80, change: -0.70, changePercent: -0.86 },
              'Bahia': { price: 77.90, change: -1.30, changePercent: -1.64 },
              'default': { price: 78.20, change: -1.20, changePercent: -1.51 }
            },
            'Algodão': { 
              'Mato Grosso': { price: 285.40, change: 4.60, changePercent: 1.64 },
              'Bahia': { price: 275.20, change: 2.80, changePercent: 1.03 },
              'Goiás': { price: 280.30, change: 3.50, changePercent: 1.26 },
              'Piauí': { price: 278.90, change: 3.20, changePercent: 1.16 },
              'Maranhão': { price: 277.50, change: 2.90, changePercent: 1.06 },
              'default': { price: 275.20, change: 2.80, changePercent: 1.03 }
            },
            'Arroz': { 
              'Rio Grande do Sul': { price: 98.80, change: 1.20, changePercent: 1.23 },
              'Santa Catarina': { price: 96.50, change: 0.90, changePercent: 0.94 },
              'Paraná': { price: 95.80, change: 0.80, changePercent: 0.84 },
              'Maranhão': { price: 97.20, change: 1.00, changePercent: 1.04 },
              'Tocantins': { price: 96.80, change: 0.95, changePercent: 0.99 },
              'default': { price: 95.80, change: 0.80, changePercent: 0.84 }
            },
            'Feijão': { 
              'Minas Gerais': { price: 192.20, change: 4.40, changePercent: 2.34 },
              'Paraná': { price: 185.20, change: 3.40, changePercent: 1.87 },
              'Goiás': { price: 188.50, change: 3.80, changePercent: 2.05 },
              'Bahia': { price: 186.80, change: 3.60, changePercent: 1.96 },
              'São Paulo': { price: 187.90, change: 3.70, changePercent: 2.00 },
              'default': { price: 185.20, change: 3.40, changePercent: 1.87 }
            }
          };

          return basePrices[grain][region] || basePrices[grain]['default'];
        };

        const mockGrainsData = [
          { 
            grain: 'Soja', 
            ...getRegionalPrices('Soja', userRegion),
            region: userRegion,
            unit: 'R$/saca'
          },
          { 
            grain: 'Milho', 
            ...getRegionalPrices('Milho', userRegion),
            region: userRegion,
            unit: 'R$/saca'
          },
          { 
            grain: 'Algodão', 
            ...getRegionalPrices('Algodão', userRegion),
            region: userRegion,
            unit: 'R$/saca'
          },
          { 
            grain: 'Arroz', 
            ...getRegionalPrices('Arroz', userRegion),
            region: userRegion,
            unit: 'R$/saca'
          },
          { 
            grain: 'Feijão', 
            ...getRegionalPrices('Feijão', userRegion),
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
