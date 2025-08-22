import { useState, useEffect, useCallback } from 'react';

// Hook para dados da API Agrolink (simulado + integração futura)
export const useAgrolinkGrains = (regionInfo) => {
  const [grainsData, setGrainsData] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dados base de grãos (simulados baseados em dados reais)
  const getBaseGrainsData = useCallback((region) => {
    // Variação de preços por região (simulado)
    const regionMultiplier = getRegionMultiplier(region);
    
    const baseGrains = [
      {
        id: 'soja',
        name: 'Soja',
        symbol: 'SOY',
        unit: 'sc/60kg',
        basePrice: 165.00,
        market: 'SPOT'
      },
      {
        id: 'milho',
        name: 'Milho',
        symbol: 'CORN',
        unit: 'sc/60kg',
        basePrice: 78.00,
        market: 'SPOT'
      },
      {
        id: 'trigo',
        name: 'Trigo',
        symbol: 'WHEAT',
        unit: 'sc/60kg',
        basePrice: 210.00,
        market: 'SPOT'
      },
      {
        id: 'arroz',
        name: 'Arroz',
        symbol: 'RICE',
        unit: 'sc/50kg',
        basePrice: 95.00,
        market: 'SPOT'
      },
      {
        id: 'cafe',
        name: 'Café',
        symbol: 'COFFEE',
        unit: 'sc/60kg',
        basePrice: 870.00,
        market: 'SPOT'
      },
      {
        id: 'algodao',
        name: 'Algodão',
        symbol: 'COTTON',
        unit: '@/15kg',
        basePrice: 150.00,
        market: 'SPOT'
      }
    ];

    return baseGrains.map(grain => {
      // Simulação de variação de preços
      const priceVariation = (Math.random() - 0.5) * 0.1; // ±5%
      const currentPrice = grain.basePrice * regionMultiplier * (1 + priceVariation);
      const change = currentPrice - grain.basePrice;
      const changePercent = (change / grain.basePrice) * 100;

      return {
        ...grain,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        volume: Math.floor(Math.random() * 10000) + 1000,
        lastUpdate: new Date().toISOString(),
        region: region?.city || 'Nacional'
      };
    });
  }, []);

  // Multiplicador de preços por região (simulado)
  const getRegionMultiplier = (region) => {
    if (!region) return 1.0;

    const stateMultipliers = {
      'MT': 1.05, // Mato Grosso - maior produtor
      'RS': 1.02, // Rio Grande do Sul
      'PR': 1.03, // Paraná
      'GO': 1.04, // Goiás
      'MS': 1.03, // Mato Grosso do Sul
      'BA': 0.98, // Bahia
      'MG': 1.01, // Minas Gerais
      'SP': 1.08, // São Paulo - maior consumidor
      'SC': 1.02, // Santa Catarina
      'RO': 1.06, // Rondônia
    };

    const stateCode = region.state?.split(' ')[0] || region.state;
    return stateMultipliers[stateCode] || 1.0;
  };

  // Simulação de chamada para API Agrolink real
  const fetchAgrolinkData = useCallback(async (region) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implementar chamada real para API Agrolink
      // const response = await fetch(`https://api.agrolink.com.br/graos?regiao=${region.state}`);
      // const realData = await response.json();

      // Por enquanto, usar dados simulados
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay da API
      
      const mockData = getBaseGrainsData(region);
      setGrainsData(mockData);

      // Dados de mercado simulados
      const marketInfo = {
        totalVolume: mockData.reduce((sum, grain) => sum + grain.volume, 0),
        averageChange: mockData.reduce((sum, grain) => sum + grain.changePercent, 0) / mockData.length,
        lastUpdate: new Date().toISOString(),
        region: region?.city || 'Nacional'
      };
      setMarketData(marketInfo);

    } catch (err) {
      setError('Erro ao buscar dados da Agrolink: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [getBaseGrainsData]);

  // Integração com API IBGE para dados regionais complementares
  const fetchIBGEData = useCallback(async (region) => {
    try {
      if (!region?.state) return null;

      // Buscar dados do IBGE sobre produção agrícola do estado
      const ibgeResponse = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${region.state}/microrregioes`
      );
      
      if (ibgeResponse.ok) {
        const ibgeData = await ibgeResponse.json();
        return ibgeData;
      }
    } catch (error) {
      console.warn('Erro ao buscar dados IBGE:', error);
    }
    return null;
  }, []);

  const refreshData = useCallback(() => {
    if (regionInfo) {
      fetchAgrolinkData(regionInfo);
    }
  }, [regionInfo, fetchAgrolinkData]);

  useEffect(() => {
    if (regionInfo) {
      fetchAgrolinkData(regionInfo);
      fetchIBGEData(regionInfo);
    }
  }, [regionInfo, fetchAgrolinkData, fetchIBGEData]);

  // Auto-refresh a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (regionInfo && !loading) {
        refreshData();
      }
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, [regionInfo, loading, refreshData]);

  return {
    grainsData,
    marketData,
    loading,
    error,
    refreshData
  };
};

// Função auxiliar para buscar preços históricos
export const fetchHistoricalPrices = async (grainId, days = 30) => {
  try {
    // TODO: Implementar busca real de dados históricos
    // Por enquanto, gerar dados simulados
    const data = [];
    const basePrice = 100;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const variation = (Math.random() - 0.5) * 20;
      const price = basePrice + variation;
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: price,
        volume: Math.floor(Math.random() * 1000) + 100
      });
    }
    
    return data;
  } catch (error) {
    throw new Error('Erro ao buscar dados históricos: ' + error.message);
  }
};

// Função para buscar dados de mercado futuro B3
export const fetchFuturesData = async () => {
  try {
    // TODO: Implementar integração real com B3
    // Por enquanto, retornar dados simulados
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        symbol: 'SOYF24',
        name: 'Soja Futuro Mai/24',
        price: 168.50,
        change: 2.30,
        changePercent: 1.38,
        volume: 15420,
        openInterest: 89340
      },
      {
        symbol: 'CORNF24',
        name: 'Milho Futuro Jul/24', 
        price: 82.75,
        change: -1.25,
        changePercent: -1.49,
        volume: 8950,
        openInterest: 45670
      }
    ];
  } catch (error) {
    throw new Error('Erro ao buscar dados de futuros: ' + error.message);
  }
};
