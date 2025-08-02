// services/agro-oracle.ts
import axios from 'axios';

// Tipos para dados agrícolas
export interface WeatherForecast {
  avgTemp: number;
  rainMM: number;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    date: string;
    temp: number;
    rain: number;
    humidity: number;
  }>;
}

export interface SoilData {
  nutrients: number;
  ph: number;
  moisture: number;
  organicMatter: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export interface HistoricalYields {
  lastYearYield: number;
  averageYield: number;
  yieldHistory: Array<{
    year: number;
    yield: number;
    crop: string;
  }>;
}

export interface PestAlert {
  recent: number;
  severity: 'low' | 'medium' | 'high';
  pests: Array<{
    name: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
}

export interface CropRecommendation {
  crop: string;
  confidence: number;
  expectedYield: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
}

/**
 * Serviço de oráculo agrícola para fornecer dados em tempo real
 * sobre clima, solo, histórico de produção e alertas de pragas
 */
export class AgroOracleService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = process.env.AGRO_ORACLE_API_URL || '', apiKey: string = process.env.AGRO_ORACLE_API_KEY || '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Busca previsão do tempo para uma fazenda específica
   */
  async fetchWeatherForecast(farmId: string, crop: string): Promise<WeatherForecast> {
    try {
      if (this.baseUrl && this.apiKey) {
        const response = await axios.get(`${this.baseUrl}/weather/${farmId}`, {
          headers: { 'Authorization': `Bearer ${this.apiKey}` },
          params: { crop }
        });
        return response.data;
      }
      
      // Fallback para dados simulados
      return {
        avgTemp: 23,
        rainMM: 820,
        humidity: 65,
        windSpeed: 12,
        forecast: [
          { date: new Date().toISOString(), temp: 23, rain: 0, humidity: 65 },
          { date: new Date(Date.now() + 86400000).toISOString(), temp: 25, rain: 5, humidity: 70 },
          { date: new Date(Date.now() + 172800000).toISOString(), temp: 22, rain: 15, humidity: 80 }
        ]
      };
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  /**
   * Busca dados do solo para uma fazenda específica
   */
  async fetchSoilData(farmId: string): Promise<SoilData> {
    try {
      if (this.baseUrl && this.apiKey) {
        const response = await axios.get(`${this.baseUrl}/soil/${farmId}`, {
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        });
        return response.data;
      }
      
      // Fallback para dados simulados
      return {
        nutrients: 88,
        ph: 6.5,
        moisture: 45,
        organicMatter: 3.2,
        nitrogen: 25,
        phosphorus: 18,
        potassium: 32
      };
    } catch (error) {
      console.error('Error fetching soil data:', error);
      throw new Error('Failed to fetch soil data');
    }
  }

  /**
   * Busca histórico de produção para uma fazenda
   */
  async fetchHistoricalYields(farmId: string): Promise<HistoricalYields> {
    try {
      if (this.baseUrl && this.apiKey) {
        const response = await axios.get(`${this.baseUrl}/yields/${farmId}`, {
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        });
        return response.data;
      }
      
      // Fallback para dados simulados
      return {
        lastYearYield: 93,
        averageYield: 87.5,
        yieldHistory: [
          { year: 2020, yield: 85, crop: 'soybean' },
          { year: 2021, yield: 90, crop: 'soybean' },
          { year: 2022, yield: 88, crop: 'soybean' },
          { year: 2023, yield: 93, crop: 'soybean' }
        ]
      };
    } catch (error) {
      console.error('Error fetching historical yields:', error);
      throw new Error('Failed to fetch historical yields');
    }
  }

  /**
   * Busca alertas de pragas para uma fazenda
   */
  async fetchPestAlerts(farmId: string): Promise<PestAlert> {
    try {
      if (this.baseUrl && this.apiKey) {
        const response = await axios.get(`${this.baseUrl}/pests/${farmId}`, {
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        });
        return response.data;
      }
      
      // Fallback para dados simulados
      return {
        recent: 0,
        severity: 'low',
        pests: []
      };
    } catch (error) {
      console.error('Error fetching pest alerts:', error);
      throw new Error('Failed to fetch pest alerts');
    }
  }

  /**
   * Gera recomendações de plantio baseadas em dados históricos e atuais
   */
  async getCropRecommendations(farmId: string): Promise<CropRecommendation[]> {
    try {
      const [weather, soil, yields] = await Promise.all([
        this.fetchWeatherForecast(farmId, ''),
        this.fetchSoilData(farmId),
        this.fetchHistoricalYields(farmId)
      ]);

      // Lógica de recomendação baseada nos dados
      const recommendations: CropRecommendation[] = [];

      // Recomendação para soja
      if (soil.ph >= 6.0 && soil.ph <= 7.0 && weather.avgTemp >= 20) {
        recommendations.push({
          crop: 'soybean',
          confidence: 85,
          expectedYield: yields.averageYield * 1.1,
          riskLevel: 'low',
          factors: ['pH adequado', 'Temperatura ideal', 'Histórico positivo']
        });
      }

      // Recomendação para milho
      if (soil.nutrients >= 80 && weather.rainMM >= 800) {
        recommendations.push({
          crop: 'corn',
          confidence: 75,
          expectedYield: 120,
          riskLevel: 'medium',
          factors: ['Solo fértil', 'Precipitação adequada']
        });
      }

      return recommendations;
    } catch (error) {
      console.error('Error generating crop recommendations:', error);
      throw new Error('Failed to generate crop recommendations');
    }
  }
}

// Instância padrão do serviço
export const agroOracle = new AgroOracleService();

// Funções de conveniência para compatibilidade
export async function fetchWeatherForecast(farmId: string, crop: string): Promise<WeatherForecast> {
  return agroOracle.fetchWeatherForecast(farmId, crop);
}

export async function fetchSoilData(farmId: string): Promise<SoilData> {
  return agroOracle.fetchSoilData(farmId);
}

export async function fetchHistoricalYields(farmId: string): Promise<HistoricalYields> {
  return agroOracle.fetchHistoricalYields(farmId);
}

export async function fetchPestAlerts(farmId: string): Promise<PestAlert> {
  return agroOracle.fetchPestAlerts(farmId);
}