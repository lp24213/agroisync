import { useState, useEffect, useCallback } from 'react';

interface WeatherData {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  currentWeather: {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: string;
  icon: string;
  };
  forecast: {
  date: string;
    highTemp: number;
    lowTemp: number;
  precipitation: number;
  condition: string;
  }[];
  agriculturalImpact: {
    soilMoisture: number;
    cropStress: number;
    irrigationNeed: number;
    harvestConditions: 'excellent' | 'good' | 'fair' | 'poor';
  };
  alerts: Array<{
    type: 'storm' | 'drought' | 'flood' | 'frost' | 'heat';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    expiresAt: string;
  }>;
  lastUpdated: string;
}

interface UseWeatherDataReturn {
  currentWeather: WeatherData | null;
  loading: boolean;
  error: string | null;
  refreshWeather: () => void;
  getWeatherByLocation: (lat: number, lng: number) => Promise<WeatherData>;
  getAgriculturalImpact: (location: string) => Promise<WeatherData['agriculturalImpact']>;
}

const useWeatherData = (): UseWeatherDataReturn => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gerar dados mock de clima
  const generateMockWeather = (location: string = 'Brasília, Brasil'): WeatherData => {
    const baseData = {
      id: 'weather_1',
      location,
      latitude: -15.7801,
      longitude: -47.9292,
      currentWeather: {
        temperature: 28,
        humidity: 65,
        precipitation: 0,
        windSpeed: 12,
        condition: 'Ensolarado',
        icon: '☀️'
      },
      forecast: [
        {
          date: '2024-12-16',
          highTemp: 30,
          lowTemp: 22,
          precipitation: 0,
          condition: 'Ensolarado'
        },
        {
          date: '2024-12-17',
          highTemp: 29,
          lowTemp: 21,
          precipitation: 5,
          condition: 'Parcialmente nublado'
        },
        {
          date: '2024-12-18',
          highTemp: 27,
          lowTemp: 20,
          precipitation: 15,
          condition: 'Chuvoso'
        },
        {
          date: '2024-12-19',
          highTemp: 26,
          lowTemp: 19,
          precipitation: 25,
          condition: 'Chuvoso'
        },
        {
          date: '2024-12-20',
          highTemp: 28,
          lowTemp: 21,
          precipitation: 10,
          condition: 'Parcialmente nublado'
        }
      ],
      agriculturalImpact: {
        soilMoisture: 0.75,
        cropStress: 0.2,
        irrigationNeed: 0.1,
        harvestConditions: 'excellent' as const
      },
      alerts: [
        {
                  type: 'heat' as const,
        severity: 'medium' as const,
          message: 'Temperaturas elevadas podem afetar o desenvolvimento das culturas',
          expiresAt: '2024-12-16T18:00:00Z'
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    // Ajustar dados baseado na localização
    if (location.includes('Goiás')) {
      baseData.currentWeather.temperature = 32;
      baseData.currentWeather.humidity = 55;
      baseData.agriculturalImpact.soilMoisture = 0.6;
      baseData.agriculturalImpact.cropStress = 0.4;
    } else if (location.includes('Mato Grosso')) {
      baseData.currentWeather.temperature = 34;
      baseData.currentWeather.humidity = 70;
      baseData.agriculturalImpact.soilMoisture = 0.8;
      baseData.agriculturalImpact.cropStress = 0.3;
    } else if (location.includes('Paraná')) {
      baseData.currentWeather.temperature = 25;
      baseData.currentWeather.humidity = 80;
      baseData.agriculturalImpact.soilMoisture = 0.9;
      baseData.agriculturalImpact.cropStress = 0.1;
    }

    return baseData;
  };

  // Carregar dados meteorológicos
  const loadWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Em produção, aqui seria uma chamada real para a API
      // const response = await fetch('/api/weather/current');
      // const data = await response.json();

      const mockWeather = generateMockWeather();
      setCurrentWeather(mockWeather);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados meteorológicos');
      console.error('Erro ao carregar dados meteorológicos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter clima por localização
  const getWeatherByLocation = useCallback(async (lat: number, lng: number): Promise<WeatherData> => {
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Em produção, aqui seria uma chamada real para a API
      // const response = await fetch(`/api/weather/location?lat=${lat}&lng=${lng}`);
      // const data = await response.json();

      // Determinar localização baseada nas coordenadas
      let location = 'Brasília, Brasil';
      if (lat > -16 && lat < -14 && lng > -49 && lng < -47) {
        location = 'Goiás, Brasil';
      } else if (lat > -16 && lat < -14 && lng > -57 && lng < -55) {
        location = 'Mato Grosso, Brasil';
      } else if (lat > -26 && lat < -24 && lng > -50 && lng < -48) {
        location = 'Paraná, Brasil';
      }

      return generateMockWeather(location);
    } catch (err) {
      console.error('Erro ao obter clima por localização:', err);
      throw err;
    }
  }, []);

  // Obter impacto agrícola
  const getAgriculturalImpact = useCallback(async (location: string): Promise<WeatherData['agriculturalImpact']> => {
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Em produção, aqui seria uma chamada real para a API
      // const response = await fetch(`/api/weather/agricultural-impact?location=${location}`);
      // const data = await response.json();

      const mockWeather = generateMockWeather(location);
      return mockWeather.agriculturalImpact;
    } catch (err) {
      console.error('Erro ao obter impacto agrícola:', err);
      throw err;
    }
  }, []);

  // Função para atualizar dados meteorológicos
  const refreshWeather = useCallback(() => {
    loadWeather();
  }, [loadWeather]);

  // Carregar dados iniciais
  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  // Simular atualizações em tempo real (a cada 15 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && currentWeather) {
        // Simular pequenas variações no clima
        setCurrentWeather(prev => {
          if (!prev) return prev;

          const newTemp = prev.currentWeather.temperature + (Math.random() - 0.5) * 2;
          const newHumidity = Math.max(0, Math.min(100, prev.currentWeather.humidity + (Math.random() - 0.5) * 5));
          const newWindSpeed = Math.max(0, prev.currentWeather.windSpeed + (Math.random() - 0.5) * 3);

          // Ajustar impacto agrícola baseado no clima
          let newSoilMoisture = prev.agriculturalImpact.soilMoisture;
          let newCropStress = prev.agriculturalImpact.cropStress;
          let newIrrigationNeed = prev.agriculturalImpact.irrigationNeed;

          if (newTemp > 30) {
            newSoilMoisture = Math.max(0, newSoilMoisture - 0.02);
            newCropStress = Math.min(1, newCropStress + 0.03);
            newIrrigationNeed = Math.min(1, newIrrigationNeed + 0.05);
          } else if (newTemp < 20) {
            newSoilMoisture = Math.min(1, newSoilMoisture + 0.01);
            newCropStress = Math.max(0, newCropStress - 0.01);
            newIrrigationNeed = Math.max(0, newIrrigationNeed - 0.02);
          }

          // Determinar condições de colheita
          let newHarvestConditions: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
          if (newSoilMoisture > 0.8 && newCropStress < 0.2) {
            newHarvestConditions = 'excellent';
          } else if (newSoilMoisture < 0.4 || newCropStress > 0.6) {
            newHarvestConditions = 'poor';
          } else if (newSoilMoisture < 0.6 || newCropStress > 0.4) {
            newHarvestConditions = 'fair';
          }

          return {
            ...prev,
            currentWeather: {
              ...prev.currentWeather,
              temperature: Math.round(newTemp * 10) / 10,
              humidity: Math.round(newHumidity),
              windSpeed: Math.round(newWindSpeed * 10) / 10
            },
            agriculturalImpact: {
              ...prev.agriculturalImpact,
              soilMoisture: Math.round(newSoilMoisture * 100) / 100,
              cropStress: Math.round(newCropStress * 100) / 100,
              irrigationNeed: Math.round(newIrrigationNeed * 100) / 100,
              harvestConditions: newHarvestConditions
            },
            lastUpdated: new Date().toISOString()
          };
        });
      }
    }, 900000); // 15 minutos
    
    return () => clearInterval(interval);
  }, [loading, currentWeather]);

  return {
    currentWeather,
    loading,
    error,
    refreshWeather,
    getWeatherByLocation,
    getAgriculturalImpact
  };
};

export default useWeatherData;