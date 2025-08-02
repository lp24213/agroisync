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
  feelsLike: number;
  dewPoint: number;
  cloudCover: number;
  sunrise: string;
  sunset: string;
  airQuality: {
    index: number;
    category: string;
    pm25: number;
    pm10: number;
    o3: number;
  };
}

interface WeatherForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  humidity: number;
  condition: string;
  icon: string;
  windSpeed: number;
  windDirection: string;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  probability: number;
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
  source: string;
  certainty: string;
}

interface UseWeatherDataReturn {
  currentWeather: WeatherData[];
  forecast: WeatherForecast[];
  alerts: WeatherAlert[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getWeatherByLocation: (location: string) => WeatherData | undefined;
  getWeatherByCoordinates: (lat: number, lon: number) => Promise<WeatherData>;
}

/**
 * AGROTM Premium Weather Service
 * Enterprise-grade weather data integration with multi-provider support
 */
class PremiumWeatherService {
  private weatherCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheTTL = 10 * 60 * 1000; // 10 minutes

  private providers = [
    {
      name: 'OpenWeatherMap',
      apiKey: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
      baseUrl: 'https://api.openweathermap.org/data/2.5'
    },
    {
      name: 'WeatherAPI',
      apiKey: process.env.NEXT_PUBLIC_WEATHERAPI_KEY,
      baseUrl: 'https://api.weatherapi.com/v1'
    },
    {
      name: 'AccuWeather',
      apiKey: process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY,
      baseUrl: 'https://dataservice.accuweather.com'
    }
  ];

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = `weather_${lat}_${lon}`;
    const cached = this.weatherCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    // Try multiple providers for redundancy
    for (const provider of this.providers) {
      if (!provider.apiKey) continue;
      
      try {
        const weatherData = await this.fetchFromProvider(provider, lat, lon);
        this.weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
        return weatherData;
      } catch (error) {
        console.error(`Failed to fetch from ${provider.name}:`, error);
        continue;
      }
    }

    throw new Error('All weather providers failed');
  }

  async getForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
    const cacheKey = `forecast_${lat}_${lon}`;
    const cached = this.weatherCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    for (const provider of this.providers) {
      if (!provider.apiKey) continue;
      
      try {
        const forecastData = await this.fetchForecastFromProvider(provider, lat, lon);
        this.weatherCache.set(cacheKey, { data: forecastData, timestamp: Date.now() });
        return forecastData;
      } catch (error) {
        console.error(`Failed to fetch forecast from ${provider.name}:`, error);
        continue;
      }
    }

    throw new Error('All forecast providers failed');
  }

  async getAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    const cacheKey = `alerts_${lat}_${lon}`;
    const cached = this.weatherCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    for (const provider of this.providers) {
      if (!provider.apiKey) continue;
      
      try {
        const alertsData = await this.fetchAlertsFromProvider(provider, lat, lon);
        this.weatherCache.set(cacheKey, { data: alertsData, timestamp: Date.now() });
        return alertsData;
      } catch (error) {
        console.error(`Failed to fetch alerts from ${provider.name}:`, error);
        continue;
      }
    }

    return [];
  }

  private async fetchFromProvider(provider: any, lat: number, lon: number): Promise<WeatherData> {
    let url: string;
    let response: Response;

    switch (provider.name) {
      case 'OpenWeatherMap':
        url = `${provider.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${provider.apiKey}&units=metric&lang=pt_br`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`OpenWeatherMap: ${response.statusText}`);
        
        const owmData = await response.json();
        return this.transformOpenWeatherData(owmData);

      case 'WeatherAPI':
        url = `${provider.baseUrl}/current.json?key=${provider.apiKey}&q=${lat},${lon}&aqi=yes`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`WeatherAPI: ${response.statusText}`);
        
        const waData = await response.json();
        return this.transformWeatherAPIData(waData);

      case 'AccuWeather':
        // First get location key
        const locationUrl = `${provider.baseUrl}/locations/v1/cities/geoposition/search?apikey=${provider.apiKey}&q=${lat},${lon}`;
        const locationResponse = await fetch(locationUrl);
        if (!locationResponse.ok) throw new Error(`AccuWeather location: ${locationResponse.statusText}`);
        
        const locationData = await locationResponse.json();
        const locationKey = locationData.Key;
        
        // Then get current conditions
        const conditionsUrl = `${provider.baseUrl}/currentconditions/v1/${locationKey}?apikey=${provider.apiKey}&details=true`;
        const conditionsResponse = await fetch(conditionsUrl);
        if (!conditionsResponse.ok) throw new Error(`AccuWeather conditions: ${conditionsResponse.statusText}`);
        
        const awData = await conditionsResponse.json();
        return this.transformAccuWeatherData(awData[0], locationData);

      default:
        throw new Error(`Unknown provider: ${provider.name}`);
    }
  }

  private async fetchForecastFromProvider(provider: any, lat: number, lon: number): Promise<WeatherForecast[]> {
    let url: string;
    let response: Response;

    switch (provider.name) {
      case 'OpenWeatherMap':
        url = `${provider.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${provider.apiKey}&units=metric&lang=pt_br`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`OpenWeatherMap forecast: ${response.statusText}`);
        
        const owmData = await response.json();
        return this.transformOpenWeatherForecast(owmData);

      case 'WeatherAPI':
        url = `${provider.baseUrl}/forecast.json?key=${provider.apiKey}&q=${lat},${lon}&days=7&aqi=no`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`WeatherAPI forecast: ${response.statusText}`);
        
        const waData = await response.json();
        return this.transformWeatherAPIForecast(waData);

      case 'AccuWeather':
        const locationUrl = `${provider.baseUrl}/locations/v1/cities/geoposition/search?apikey=${provider.apiKey}&q=${lat},${lon}`;
        const locationResponse = await fetch(locationUrl);
        if (!locationResponse.ok) throw new Error(`AccuWeather location: ${locationResponse.statusText}`);
        
        const locationData = await locationResponse.json();
        const locationKey = locationData.Key;
        
        const forecastUrl = `${provider.baseUrl}/forecasts/v1/daily/5day/${locationKey}?apikey=${provider.apiKey}&metric=true`;
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error(`AccuWeather forecast: ${forecastResponse.statusText}`);
        
        const awData = await forecastResponse.json();
        return this.transformAccuWeatherForecast(awData, locationData);

      default:
        throw new Error(`Unknown provider: ${provider.name}`);
    }
  }

  private async fetchAlertsFromProvider(provider: any, lat: number, lon: number): Promise<WeatherAlert[]> {
    let url: string;
    let response: Response;

    switch (provider.name) {
      case 'OpenWeatherMap':
        url = `${provider.baseUrl}/onecall?lat=${lat}&lon=${lon}&appid=${provider.apiKey}&exclude=current,minutely,hourly,daily`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`OpenWeatherMap alerts: ${response.statusText}`);
        
        const owmData = await response.json();
        return this.transformOpenWeatherAlerts(owmData);

      case 'WeatherAPI':
        url = `${provider.baseUrl}/forecast.json?key=${provider.apiKey}&q=${lat},${lon}&days=1&aqi=no&alerts=yes`;
        response = await fetch(url);
        if (!response.ok) throw new Error(`WeatherAPI alerts: ${response.statusText}`);
        
        const waData = await response.json();
        return this.transformWeatherAPIAlerts(waData);

      default:
        return [];
    }
  }

  private transformOpenWeatherData(data: any): WeatherData {
    return {
      location: data.name,
      latitude: data.coord.lat,
      longitude: data.coord.lon,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      precipitation: data.rain?.['1h'] || 0,
      windSpeed: data.wind.speed,
      windDirection: this.degreesToDirection(data.wind.deg),
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      uvIndex: 0, // Not available in free tier
      condition: data.weather[0].description,
      icon: data.weather[0].icon,
      lastUpdated: new Date().toISOString(),
      feelsLike: data.main.feels_like,
      dewPoint: data.main.temp, // Not available in free tier
      cloudCover: data.clouds.all,
      sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
      sunset: new Date(data.sys.sunset * 1000).toISOString(),
      airQuality: {
        index: 0,
        category: 'Unknown',
        pm25: 0,
        pm10: 0,
        o3: 0
      }
    };
  }

  private transformWeatherAPIData(data: any): WeatherData {
    return {
      location: data.location.name,
      latitude: data.location.lat,
      longitude: data.location.lon,
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      precipitation: data.current.precip_mm,
      windSpeed: data.current.wind_kph,
      windDirection: data.current.wind_dir,
      pressure: data.current.pressure_mb,
      visibility: data.current.vis_km,
      uvIndex: data.current.uv,
      condition: data.current.condition.text,
      icon: data.current.condition.icon,
      lastUpdated: new Date().toISOString(),
      feelsLike: data.current.feelslike_c,
      dewPoint: data.current.dewpoint_c,
      cloudCover: data.current.cloud,
      sunrise: data.location.localtime,
      sunset: data.location.localtime,
      airQuality: {
        index: data.current.air_quality?.['us-epa-index'] || 0,
        category: this.getAirQualityCategory(data.current.air_quality?.['us-epa-index'] || 0),
        pm25: data.current.air_quality?.['pm2_5'] || 0,
        pm10: data.current.air_quality?.['pm10'] || 0,
        o3: data.current.air_quality?.o3 || 0
      }
    };
  }

  private transformAccuWeatherData(data: any, location: any): WeatherData {
    return {
      location: location.LocalizedName,
      latitude: location.GeoPosition.Latitude,
      longitude: location.GeoPosition.Longitude,
      temperature: data.Temperature.Metric.Value,
      humidity: data.RelativeHumidity,
      precipitation: data.Precip1Hr?.Metric?.Value || 0,
      windSpeed: data.Wind.Speed.Metric.Value,
      windDirection: data.Wind.Direction.Localized,
      pressure: data.Pressure.Metric.Value,
      visibility: data.Visibility.Metric.Value,
      uvIndex: data.UVIndex || 0,
      condition: data.WeatherText,
      icon: `${data.WeatherIcon}.png`,
      lastUpdated: new Date().toISOString(),
      feelsLike: data.RealFeelTemperature.Metric.Value,
      dewPoint: data.DewPoint.Metric.Value,
      cloudCover: data.CloudCover,
      sunrise: new Date().toISOString(), // Not available in current conditions
      sunset: new Date().toISOString(),
      airQuality: {
        index: 0,
        category: 'Unknown',
        pm25: 0,
        pm10: 0,
        o3: 0
      }
    };
  }

  private transformOpenWeatherForecast(data: any): WeatherForecast[] {
    const dailyData = data.list.filter((item: any, index: number) => index % 8 === 0);
    
    return dailyData.slice(1, 8).map((item: any) => ({
      date: new Date(item.dt * 1000).toISOString().split('T')[0],
      maxTemp: item.main.temp_max,
      minTemp: item.main.temp_min,
      precipitation: item.pop * 100, // Probability of precipitation
      humidity: item.main.humidity,
      condition: item.weather[0].description,
      icon: item.weather[0].icon,
      windSpeed: item.wind.speed,
      windDirection: this.degreesToDirection(item.wind.deg),
      uvIndex: 0,
      sunrise: new Date().toISOString(),
      sunset: new Date().toISOString(),
      probability: item.pop * 100
    }));
  }

  private transformWeatherAPIForecast(data: any): WeatherForecast[] {
    return data.forecast.forecastday.map((day: any) => ({
      date: day.date,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      precipitation: day.day.totalprecip_mm,
      humidity: day.day.avghumidity,
      condition: day.day.condition.text,
      icon: day.day.condition.icon,
      windSpeed: day.day.maxwind_kph,
      windDirection: 'N/A',
      uvIndex: day.day.uv,
      sunrise: day.astro.sunrise,
      sunset: day.astro.sunset,
      probability: day.day.daily_chance_of_rain
    }));
  }

  private transformAccuWeatherForecast(data: any, location: any): WeatherForecast[] {
    return data.DailyForecasts.map((day: any) => ({
      date: day.Date.split('T')[0],
      maxTemp: day.Temperature.Maximum.Value,
      minTemp: day.Temperature.Minimum.Value,
      precipitation: day.Day.PrecipitationProbability,
      humidity: day.Day.RelativeHumidity.Average,
      condition: day.Day.IconPhrase,
      icon: `${day.Day.Icon}.png`,
      windSpeed: day.Day.Wind.Speed.Value,
      windDirection: day.Day.Wind.Direction.Localized,
      uvIndex: day.Day.UVIndex,
      sunrise: day.Sun.Rise,
      sunset: day.Sun.Set,
      probability: day.Day.PrecipitationProbability
    }));
  }

  private transformOpenWeatherAlerts(data: any): WeatherAlert[] {
    return (data.alerts || []).map((alert: any) => ({
      id: alert.event,
      type: this.mapAlertType(alert.event),
      severity: this.mapAlertSeverity(alert.severity),
      title: alert.event,
      description: alert.description,
      startTime: new Date(alert.start * 1000).toISOString(),
      endTime: new Date(alert.end * 1000).toISOString(),
      affectedAreas: [alert.sender_name],
      source: 'OpenWeatherMap',
      certainty: 'Likely'
    }));
  }

  private transformWeatherAPIAlerts(data: any): WeatherAlert[] {
    return (data.alerts?.alert || []).map((alert: any) => ({
      id: alert.alert_id,
      type: this.mapAlertType(alert.alert_type),
      severity: this.mapAlertSeverity(alert.severity),
      title: alert.headline,
      description: alert.desc,
      startTime: alert.effective,
      endTime: alert.expires,
      affectedAreas: [alert.areas],
      source: 'WeatherAPI',
      certainty: 'Likely'
    }));
  }

  private degreesToDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  private getAirQualityCategory(index: number): string {
    if (index <= 50) return 'Good';
    if (index <= 100) return 'Moderate';
    if (index <= 150) return 'Unhealthy for Sensitive Groups';
    if (index <= 200) return 'Unhealthy';
    if (index <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  private mapAlertType(type: string): 'warning' | 'watch' | 'advisory' {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('warning')) return 'warning';
    if (lowerType.includes('watch')) return 'watch';
    return 'advisory';
  }

  private mapAlertSeverity(severity: string): 'low' | 'medium' | 'high' | 'extreme' {
    const lowerSeverity = severity.toLowerCase();
    if (lowerSeverity.includes('extreme')) return 'extreme';
    if (lowerSeverity.includes('severe') || lowerSeverity.includes('high')) return 'high';
    if (lowerSeverity.includes('moderate') || lowerSeverity.includes('medium')) return 'medium';
    return 'low';
  }
}

const weatherService = new PremiumWeatherService();

// Brazilian agricultural regions with coordinates
const agriculturalRegions = [
  { name: 'Mato Grosso', lat: -15.6014, lon: -56.0979 },
  { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
  { name: 'Goiás', lat: -16.6869, lon: -49.2648 },
  { name: 'Minas Gerais', lat: -19.9167, lon: -43.9345 },
  { name: 'Rio Grande do Sul', lat: -30.0346, lon: -51.2177 },
  { name: 'Paraná', lat: -25.4289, lon: -49.2671 },
  { name: 'Mato Grosso do Sul', lat: -20.4486, lon: -54.6295 },
  { name: 'Bahia', lat: -12.9714, lon: -38.5011 }
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

      const weatherPromises = agriculturalRegions.map(async (region) => {
        try {
          return await weatherService.getCurrentWeather(region.lat, region.lon);
        } catch (error) {
          console.error(`Failed to fetch weather for ${region.name}:`, error);
          return null;
        }
      });

      const weatherResults = await Promise.allSettled(weatherPromises);
      const validWeather = weatherResults
        .filter((result): result is PromiseFulfilledResult<WeatherData> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);

      setCurrentWeather(validWeather);

      // Get forecast for the first region (can be expanded)
      if (agriculturalRegions.length > 0) {
        try {
          const forecastData = await weatherService.getForecast(
            agriculturalRegions[0].lat, 
            agriculturalRegions[0].lon
          );
          setForecast(forecastData);
        } catch (error) {
          console.error('Failed to fetch forecast:', error);
        }
      }

      // Get alerts for all regions
      const alertPromises = agriculturalRegions.map(async (region) => {
        try {
          return await weatherService.getAlerts(region.lat, region.lon);
        } catch (error) {
          console.error(`Failed to fetch alerts for ${region.name}:`, error);
          return [];
        }
      });

      const alertResults = await Promise.allSettled(alertPromises);
      const allAlerts = alertResults
        .filter((result): result is PromiseFulfilledResult<WeatherAlert[]> => 
          result.status === 'fulfilled'
        )
        .flatMap(result => result.value);

      setAlerts(allAlerts);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    // Update weather data every 10 minutes
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

  const getWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherData> => {
    return await weatherService.getCurrentWeather(lat, lon);
  };

  return {
    currentWeather,
    forecast,
    alerts,
    loading,
    error,
    refetch,
    getWeatherByLocation,
    getWeatherByCoordinates
  };
};

/**
 * Function to get weather data (for use in summary-export)
 * @returns Promise with weather data
 */
export const getWeatherData = async (): Promise<WeatherData> => {
  if (agriculturalRegions.length > 0) {
    return await weatherService.getCurrentWeather(
      agriculturalRegions[0].lat, 
      agriculturalRegions[0].lon
    );
  }
  
  throw new Error('No agricultural regions configured');
};