import { useState, useEffect } from 'react';

interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  icon: string;
  lastUpdated: string;
}

interface WeatherForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  humidity: number;
  condition: string;
  icon: string;
}

interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  affectedAreas: string[];
}

interface UseWeatherDataReturn {
  currentWeather: WeatherData[];
  forecast: WeatherForecast[];
  alerts: WeatherAlert[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getWeatherByLocation: (location: string) => WeatherData | undefined;
}

// Mock weather data for different agricultural regions in Brazil
const mockWeatherData: WeatherData[] = [
  {
    location: 'Mato Grosso',
    latitude: -15.6014,
    longitude: -56.0979,
    temperature: 28.5,
    humidity: 65,
    precipitation: 2.5,
    windSpeed: 12.3,
    windDirection: 'NE',
    pressure: 1013.2,
    visibility: 10,
    uvIndex: 8,
    condition: 'Parcialmente nublado',
    icon: 'partly-cloudy',
    lastUpdated: new Date().toISOString()
  },
  {
    location: 'São Paulo',
    latitude: -23.5505,
    longitude: -46.6333,
    temperature: 22.1,
    humidity: 72,
    precipitation: 0,
    windSpeed: 8.7,
    windDirection: 'SE',
    pressure: 1018.5,
    visibility: 15,
    uvIndex: 6,
    condition: 'Ensolarado',
    icon: 'sunny',
    lastUpdated: new Date().toISOString()
  },
  {
    location: 'Goiás',
    latitude: -16.6869,
    longitude: -49.2648,
    temperature: 26.8,
    humidity: 58,
    precipitation: 0,
    windSpeed: 15.2,
    windDirection: 'E',
    pressure: 1015.8,
    visibility: 12,
    uvIndex: 9,
    condition: 'Ensolarado',
    icon: 'sunny',
    lastUpdated: new Date().toISOString()
  },
  {
    location: 'Minas Gerais',
    latitude: -19.9167,
    longitude: -43.9345,
    temperature: 24.3,
    humidity: 68,
    precipitation: 1.2,
    windSpeed: 10.5,
    windDirection: 'SW',
    pressure: 1016.3,
    visibility: 8,
    uvIndex: 7,
    condition: 'Chuvisco',
    icon: 'light-rain',
    lastUpdated: new Date().toISOString()
  },
  {
    location: 'Rio Grande do Sul',
    latitude: -30.0346,
    longitude: -51.2177,
    temperature: 18.7,
    humidity: 78,
    precipitation: 5.8,
    windSpeed: 18.9,
    windDirection: 'S',
    pressure: 1008.7,
    visibility: 6,
    uvIndex: 4,
    condition: 'Chuva moderada',
    icon: 'rain',
    lastUpdated: new Date().toISOString()
  }
];

// Generate mock forecast data
const generateMockForecast = (): WeatherForecast[] => {
  const forecast: WeatherForecast[] = [];
  const conditions = ['Ensolarado', 'Parcialmente nublado', 'Nublado', 'Chuvisco', 'Chuva'];
  const icons = ['sunny', 'partly-cloudy', 'cloudy', 'light-rain', 'rain'];
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const conditionIndex = Math.floor(Math.random() * conditions.length);
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      maxTemp: Math.floor(Math.random() * 15) + 20, // 20-35°C
      minTemp: Math.floor(Math.random() * 10) + 10, // 10-20°C
      precipitation: Math.random() * 10, // 0-10mm
      humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
      condition: conditions[conditionIndex],
      icon: icons[conditionIndex]
    });
  }
  
  return forecast;
};

// Mock weather alerts
const mockWeatherAlerts: WeatherAlert[] = [
  {
    id: 'alert_1',
    type: 'warning',
    severity: 'medium',
    title: 'Alerta de Chuva Forte',
    description: 'Previsão de chuvas intensas nas próximas 24 horas. Recomenda-se proteção das culturas.',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    affectedAreas: ['Mato Grosso', 'Goiás']
  },
  {
    id: 'alert_2',
    type: 'advisory',
    severity: 'low',
    title: 'Condições Favoráveis para Plantio',
    description: 'Condições climáticas ideais para plantio de soja nas próximas 48 horas.',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    affectedAreas: ['São Paulo', 'Minas Gerais']
  }
];

export const useWeatherData = (): UseWeatherDataReturn => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData[]>([]);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, you would fetch from weather APIs
      // like OpenWeatherMap, WeatherAPI, or AccuWeather
      // For now, we'll use mock data with some randomization
      const updatedWeather = mockWeatherData.map(weather => ({
        ...weather,
        temperature: weather.temperature + (Math.random() * 6 - 3),
        humidity: Math.max(30, Math.min(95, weather.humidity + Math.floor(Math.random() * 20 - 10))),
        precipitation: Math.max(0, weather.precipitation + (Math.random() * 4 - 2)),
        windSpeed: Math.max(0, weather.windSpeed + (Math.random() * 10 - 5)),
        pressure: weather.pressure + (Math.random() * 20 - 10),
        lastUpdated: new Date().toISOString()
      }));
      
      setCurrentWeather(updatedWeather);
      setForecast(generateMockForecast());
      setAlerts(mockWeatherAlerts);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados meteorológicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    // Set up interval to update weather data every 10 minutes
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const refetch = () => {
    fetchWeatherData();
  };

  const getWeatherByLocation = (location: string): WeatherData | undefined => {
    return currentWeather.find(weather => 
      weather.location.toLowerCase().includes(location.toLowerCase())
    );
  };

  return {
    currentWeather,
    forecast,
    alerts,
    loading,
    error,
    refetch,
    getWeatherByLocation
  };
};

/**
 * Função para obter dados meteorológicos (para uso em summary-export)
 * @returns Promise com dados meteorológicos
 */
export const getWeatherData = async (): Promise<WeatherData> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    ...mockWeatherData[0],
    temperature: mockWeatherData[0].temperature + (Math.random() * 10 - 5),
    humidity: mockWeatherData[0].humidity + (Math.random() * 20 - 10),
    windSpeed: mockWeatherData[0].windSpeed + (Math.random() * 5 - 2.5),
    lastUpdated: new Date().toISOString()
  };
};