export async function fetchWeatherForecast(farmId: string, crop: string) { return { avgTemp: 23, rainMM: 820 }; }
export async function fetchSoilData(farmId: string) { return { nutrients: 88 }; }

export async function fetchHistoricalYields(farmId: string) {
  return { lastYearYield: 93 }; // Exemplo
}

export async function fetchPestAlerts(farmId: string) {
  return { recent: 0 }; // Simulação
}