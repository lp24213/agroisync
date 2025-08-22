// Tipos globais para o projeto AgroSync

export interface Location {
  latitude: number;
  longitude: number;
}

export interface RegionInfo {
  city: string;
  state: string;
  region: string;
  country: string;
  timezone: string;
}

export interface GrainData {
  id: string;
  grain: string;
  symbol: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume: number;
  unit: string;
  region: string;
  source: string;
  lastUpdate: string;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
}

export interface MarketData {
  totalVolume: number;
  totalMarketCap: number;
  averageChange: number;
  topGainers: GrainData[];
  topLosers: GrainData[];
  mostTraded: GrainData[];
}

export interface FuturesContract {
  id: string;
  grain: string;
  symbol: string;
  month: string;
  year: number;
  lastPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  openInterest: number;
  high: number;
  low: number;
  settlement: number;
}

export interface ExportData {
  id: string;
  country: string;
  grain: string;
  exportVolume: number;
  exportValue: number;
  importVolume: number;
  importValue: number;
  netTrade: number;
  year: number;
  month: string;
  region: string;
}

export interface AgrolinkResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

export interface AgrolinkConfig {
  apiKey?: string
  baseUrl: string
  timeout: number
  maxRetries: number
}
