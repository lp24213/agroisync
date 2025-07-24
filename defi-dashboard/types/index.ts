// This file defines TypeScript types and interfaces used throughout the project, ensuring type safety and clarity.

export interface DeFiPool {
    id: string;
    name: string;
    token: string;
    tvl: number;
}

export interface PriceData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    total_volume: number;
    price_change_percentage_24h: number;
}

export interface DeFiContextType {
    pools: DeFiPool[];
    loading: boolean;
    error: string | null;
    fetchPools: () => Promise<void>;
}

export interface CoinGeckoResponse {
    prices: PriceData[];
}