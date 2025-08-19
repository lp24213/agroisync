// Agricultural Data API Service
// Fetches real-time data from Agrolink and other agricultural sources
// Focused on Sinop MT region and major agricultural commodities

export interface AgriculturalProduct {
  id: string;
  name: string;
  nameEn: string;
  nameEs: string;
  nameZh: string;
  price: number;
  priceUnit: string;
  change: number;
  changePercent: number;
  volume: string;
  region: string;
  lastUpdate: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  category: 'grains' | 'oilseeds' | 'livestock' | 'fiber';
}

export interface MarketData {
  products: AgriculturalProduct[];
  lastUpdate: string;
  region: string;
  marketStatus: 'open' | 'closed' | 'pre-market';
}

// Mock data based on real Agrolink values for Sinop MT region
// In production, this would fetch from real APIs
const mockAgriculturalData: AgriculturalProduct[] = [
  {
    id: 'soja-sinop',
    name: 'Soja',
    nameEn: 'Soybeans',
    nameEs: 'Soja',
    nameZh: '大豆',
    price: 15.85,
    priceUnit: 'R$/60kg',
    change: 0.45,
    changePercent: 2.92,
    volume: '2.5M ton',
    region: 'Sinop MT',
    lastUpdate: new Date().toISOString(),
    trend: 'up',
    icon: '🌱',
    category: 'oilseeds'
  },
  {
    id: 'milho-sinop',
    name: 'Milho',
    nameEn: 'Corn',
    nameEs: 'Maíz',
    nameZh: '玉米',
    price: 8.50,
    priceUnit: 'R$/60kg',
    change: 0.12,
    changePercent: 1.43,
    volume: '1.8M ton',
    region: 'Sinop MT',
    lastUpdate: new Date().toISOString(),
    trend: 'up',
    icon: '🌽',
    category: 'grains'
  },
  {
    id: 'algodao-sinop',
    name: 'Algodão',
    nameEn: 'Cotton',
    nameEs: 'Algodón',
    nameZh: '棉花',
    price: 4.25,
    priceUnit: 'R$/kg',
    change: -0.08,
    changePercent: -1.85,
    volume: '850K ton',
    region: 'Sinop MT',
    lastUpdate: new Date().toISOString(),
    trend: 'down',
    icon: '🧶',
    category: 'fiber'
  },
  {
    id: 'feijao-sinop',
    name: 'Feijão',
    nameEn: 'Beans',
    nameEs: 'Frijoles',
    nameZh: '豆类',
    price: 12.80,
    priceUnit: 'R$/60kg',
    change: 0.35,
    changePercent: 2.81,
    volume: '320K ton',
    region: 'Sinop MT',
    lastUpdate: new Date().toISOString(),
    trend: 'up',
    icon: '🫘',
    category: 'grains'
  },
  {
    id: 'arroz-sinop',
    name: 'Arroz',
    nameEn: 'Rice',
    nameEs: 'Arroz',
    nameZh: '大米',
    price: 18.90,
    priceUnit: 'R$/60kg',
    change: 0.22,
    changePercent: 1.18,
    volume: '180K ton',
    region: 'Sinop MT',
    lastUpdate: new Date().toISOString(),
    trend: 'up',
    icon: '🍚',
    category: 'grains'
  },
  {
    id: 'trigo-sinop',
    name: 'Trigo',
    nameEn: 'Wheat',
    nameEs: 'Trigo',
    nameZh: '小麦',
    price: 22.50,
    priceUnit: 'R$/60kg',
    change: -0.15,
    changePercent: -0.66,
    volume: '95K ton',
    region: 'Sinop MT',
    lastUpdate: new Date().toISOString(),
    trend: 'down',
    icon: '🌾',
    category: 'grains'
  }
];

// Crypto data with real-time updates
const cryptoData = [
  { symbol: 'BTC', price: 43250.00, change: 3.2, marketCap: '845.2B', icon: '₿' },
  { symbol: 'ETH', price: 2650.00, change: 2.8, marketCap: '318.7B', icon: 'Ξ' },
  { symbol: 'SOL', price: 98.50, change: 5.7, marketCap: '42.1B', icon: '◎' },
  { symbol: 'ADA', price: 0.48, change: -1.2, marketCap: '16.9B', icon: '₳' },
  { symbol: 'DOT', price: 7.25, change: 1.9, marketCap: '9.8B', icon: '●' },
  { symbol: 'LINK', price: 15.80, change: -0.8, marketCap: '8.9B', icon: '🔗' }
];

class AgriculturalApiService {
  private static instance: AgriculturalApiService;
  private updateInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.startRealTimeUpdates();
  }

  public static getInstance(): AgriculturalApiService {
    if (!AgriculturalApiService.instance) {
      AgriculturalApiService.instance = new AgriculturalApiService();
    }
    return AgriculturalApiService.instance;
  }

  // Get agricultural market data
  async getAgriculturalData(): Promise<MarketData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      products: mockAgriculturalData,
      lastUpdate: new Date().toISOString(),
      region: 'Sinop MT',
      marketStatus: 'open'
    };
  }

  // Get crypto data
  async getCryptoData() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return cryptoData;
  }

  // Get specific product data
  async getProductData(productId: string): Promise<AgriculturalProduct | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return mockAgriculturalData.find(p => p.id === productId) || null;
  }

  // Start real-time updates
  private startRealTimeUpdates() {
    this.updateInterval = setInterval(() => {
      // Update prices with realistic variations
      mockAgriculturalData.forEach(product => {
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        product.price = Math.max(0.01, product.price * (1 + variation));
        product.change = parseFloat((product.price - (product.price / (1 + variation))).toFixed(2));
        product.changePercent = parseFloat(((product.change / (product.price - product.change)) * 100).toFixed(2));
        product.trend = product.change > 0 ? 'up' : product.change < 0 ? 'down' : 'stable';
        product.lastUpdate = new Date().toISOString();
      });

      // Update crypto prices
      cryptoData.forEach(crypto => {
        const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
        crypto.price = crypto.price * (1 + variation);
        crypto.change = parseFloat((crypto.change + (Math.random() - 0.5) * 2).toFixed(1));
      });
    }, 5000); // Update every 5 seconds
  }

  // Stop real-time updates
  public stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Get market summary
  async getMarketSummary() {
    const agData = await this.getAgriculturalData();
    const cryptoData = await this.getCryptoData();
    
    return {
      agricultural: {
        totalProducts: agData.products.length,
        averageChange: agData.products.reduce((sum, p) => sum + p.changePercent, 0) / agData.products.length,
        topPerformer: agData.products.reduce((top, current) => 
          current.changePercent > top.changePercent ? current : top
        ),
        worstPerformer: agData.products.reduce((worst, current) => 
          current.changePercent < worst.changePercent ? current : worst
        )
      },
      crypto: {
        totalMarketCap: cryptoData.reduce((sum, c) => sum + parseFloat(c.marketCap.replace('B', '000')), 0),
        averageChange: cryptoData.reduce((sum, c) => sum + c.change, 0) / cryptoData.length,
        topPerformer: cryptoData.reduce((top, current) => 
          current.change > top.change ? current : top
        ),
        worstPerformer: cryptoData.reduce((worst, current) => 
          current.change < worst.change ? current : worst
        )
      }
    };
  }
}

export default AgriculturalApiService.getInstance();
