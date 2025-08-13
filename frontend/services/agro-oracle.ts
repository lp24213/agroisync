/**
 * Agro Oracle Service
 * Serviço para buscar dados históricos e alertas de pragas
 */

export interface HistoricalYield {
  farmId: string;
  lastYearYield: number;
  averageYield: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface PestAlert {
  farmId: string;
  recent: number;
  severity: 'low' | 'medium' | 'high';
  lastIncident: Date;
}

/**
 * Busca dados históricos de produtividade da fazenda
 */
export async function fetchHistoricalYields(farmId: string): Promise<HistoricalYield> {
  // Simulação de dados - em produção, isso viria de uma API real
  return {
    farmId,
    lastYearYield: 85 + Math.random() * 20, // 85-105
    averageYield: 90,
    trend: 'increasing'
  };
}

/**
 * Busca alertas de pragas da fazenda
 */
export async function fetchPestAlerts(farmId: string): Promise<PestAlert> {
  // Simulação de dados - em produção, isso viria de uma API real
  return {
    farmId,
    recent: Math.floor(Math.random() * 3), // 0-2 incidentes
    severity: 'low',
    lastIncident: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
  };
}

/**
 * Busca dados meteorológicos da fazenda
 */
export async function fetchWeatherData(farmId: string) {
  // Simulação de dados meteorológicos
  return {
    temperature: 20 + Math.random() * 10, // 20-30°C
    humidity: 60 + Math.random() * 30, // 60-90%
    rainfall: Math.random() * 50, // 0-50mm
    windSpeed: Math.random() * 20 // 0-20 km/h
  };
}

/**
 * Busca dados de solo da fazenda
 */
export async function fetchSoilData(farmId: string) {
  // Simulação de dados de solo
  return {
    ph: 6.0 + Math.random() * 2, // 6.0-8.0
    nitrogen: 20 + Math.random() * 30, // 20-50 mg/kg
    phosphorus: 15 + Math.random() * 25, // 15-40 mg/kg
    potassium: 150 + Math.random() * 100, // 150-250 mg/kg
    organicMatter: 2 + Math.random() * 3 // 2-5%
  };
}
