export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  animation_url?: string;
  background_color?: string;
  attributes: NFTAttribute[];
  properties?: NFTProperties;
  category: NFTCategory;
  rarity: NFTRarity;
  farmData?: FarmData;
  tokenId?: string;
  contractAddress?: string;
  creator?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_number' | 'boost_percentage' | 'date';
  max_value?: number;
}

export interface NFTProperties {
  files?: NFTFile[];
  category?: string;
  creators?: NFTCreator[];
}

export interface NFTFile {
  uri: string;
  type: string;
  cdn_uri?: string;
}

export interface NFTCreator {
  address: string;
  share: number;
  verified?: boolean;
}

export type NFTCategory = 
  | 'Farm Land'
  | 'Crop Token'
  | 'Equipment'
  | 'Harvest'
  | 'Certificate'
  | 'Insurance'
  | 'Yield Bond'
  | 'Carbon Credit'
  | 'Water Rights'
  | 'Seed Bank'
  | 'Livestock'
  | 'Machinery';

export type NFTRarity = 
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Legendary'
  | 'Mythic';

export interface FarmData {
  location: {
    country: string;
    state: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  cropType: string;
  harvestDate: string;
  yield: {
    expected: number;
    unit: 'tons' | 'kg' | 'bushels' | 'liters';
    actual?: number;
  };
  quality: {
    grade: 'A' | 'B' | 'C' | 'D';
    score: number; // 0-100
    factors: string[];
  };
  soilData?: {
    type: string;
    ph: number;
    organicMatter: number;
    nutrients: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
  };
  weatherData?: {
    rainfall: number;
    temperature: number;
    humidity: number;
    windSpeed: number;
  };
  sustainability?: {
    organic: boolean;
    carbonFootprint: number;
    waterUsage: number;
    certifications: string[];
  };
}

export interface NFTMarketData {
  floorPrice: number;
  lastSalePrice: number;
  volume24h: number;
  totalSupply: number;
  holders: number;
  listed: number;
  averagePrice: number;
  priceHistory: PricePoint[];
}

export interface PricePoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface NFTCollection {
  name: string;
  description: string;
  image: string;
  bannerImage?: string;
  category: NFTCategory;
  totalSupply: number;
  holders: number;
  floorPrice: number;
  volume24h: number;
  contractAddress: string;
  creator: string;
  createdAt: string;
  attributes: CollectionAttribute[];
}

export interface CollectionAttribute {
  trait_type: string;
  values: string[];
  counts: number[];
}

// Validation schemas
export const NFTMetadataSchema = {
  type: 'object',
  required: ['name', 'description', 'image', 'attributes', 'category', 'rarity'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100
    },
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 1000
    },
    image: {
      type: 'string',
      pattern: '^(ipfs://|https://|data:image/)'
    },
    external_url: {
      type: 'string',
      format: 'uri'
    },
    animation_url: {
      type: 'string',
      format: 'uri'
    },
    background_color: {
      type: 'string',
      pattern: '^[0-9a-fA-F]{6}$'
    },
    attributes: {
      type: 'array',
      items: {
        type: 'object',
        required: ['trait_type', 'value'],
        properties: {
          trait_type: {
            type: 'string',
            minLength: 1
          },
          value: {
            oneOf: [
              { type: 'string' },
              { type: 'number' }
            ]
          },
          display_type: {
            type: 'string',
            enum: ['number', 'boost_number', 'boost_percentage', 'date']
          },
          max_value: {
            type: 'number'
          }
        }
      }
    },
    category: {
      type: 'string',
      enum: [
        'Farm Land',
        'Crop Token',
        'Equipment',
        'Harvest',
        'Certificate',
        'Insurance',
        'Yield Bond',
        'Carbon Credit',
        'Water Rights',
        'Seed Bank',
        'Livestock',
        'Machinery'
      ]
    },
    rarity: {
      type: 'string',
      enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic']
    }
  }
};

export const FarmDataSchema = {
  type: 'object',
  required: ['location', 'cropType', 'harvestDate', 'yield', 'quality'],
  properties: {
    location: {
      type: 'object',
      required: ['country', 'state', 'city'],
      properties: {
        country: { type: 'string' },
        state: { type: 'string' },
        city: { type: 'string' },
        coordinates: {
          type: 'object',
          properties: {
            latitude: { type: 'number', minimum: -90, maximum: 90 },
            longitude: { type: 'number', minimum: -180, maximum: 180 }
          }
        }
      }
    },
    cropType: { type: 'string' },
    harvestDate: { type: 'string', format: 'date' },
    yield: {
      type: 'object',
      required: ['expected', 'unit'],
      properties: {
        expected: { type: 'number', minimum: 0 },
        unit: { type: 'string', enum: ['tons', 'kg', 'bushels', 'liters'] },
        actual: { type: 'number', minimum: 0 }
      }
    },
    quality: {
      type: 'object',
      required: ['grade', 'score', 'factors'],
      properties: {
        grade: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
        score: { type: 'number', minimum: 0, maximum: 100 },
        factors: { type: 'array', items: { type: 'string' } }
      }
    }
  }
};

// Utility functions
export function validateNFTMetadata(metadata: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic validation
  if (!metadata.name || typeof metadata.name !== 'string') {
    errors.push('Name is required and must be a string');
  }
  
  if (!metadata.description || typeof metadata.description !== 'string') {
    errors.push('Description is required and must be a string');
  }
  
  if (!metadata.image || typeof metadata.image !== 'string') {
    errors.push('Image URI is required and must be a string');
  }
  
  if (!metadata.attributes || !Array.isArray(metadata.attributes)) {
    errors.push('Attributes are required and must be an array');
  }
  
  if (!metadata.category || !Object.values(NFT_CATEGORIES).includes(metadata.category)) {
    errors.push('Category is required and must be a valid category');
  }
  
  if (!metadata.rarity || !Object.values(NFT_RARITIES).includes(metadata.rarity)) {
    errors.push('Rarity is required and must be a valid rarity level');
  }
  
  // Validate attributes
  if (metadata.attributes) {
    metadata.attributes.forEach((attr: any, index: number) => {
      if (!attr.trait_type || typeof attr.trait_type !== 'string') {
        errors.push(`Attribute ${index}: trait_type is required and must be a string`);
      }
      if (attr.value === undefined || attr.value === null) {
        errors.push(`Attribute ${index}: value is required`);
      }
    });
  }
  
  // Validate farm data if present
  if (metadata.farmData) {
    const farmErrors = validateFarmData(metadata.farmData);
    errors.push(...farmErrors);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateFarmData(farmData: any): string[] {
  const errors: string[] = [];
  
  if (!farmData.location) {
    errors.push('Farm location is required');
  } else {
    if (!farmData.location.country) errors.push('Country is required');
    if (!farmData.location.state) errors.push('State is required');
    if (!farmData.location.city) errors.push('City is required');
  }
  
  if (!farmData.cropType) {
    errors.push('Crop type is required');
  }
  
  if (!farmData.harvestDate) {
    errors.push('Harvest date is required');
  }
  
  if (!farmData.yield) {
    errors.push('Yield data is required');
  } else {
    if (typeof farmData.yield.expected !== 'number' || farmData.yield.expected < 0) {
      errors.push('Expected yield must be a non-negative number');
    }
    if (!farmData.yield.unit || !['tons', 'kg', 'bushels', 'liters'].includes(farmData.yield.unit)) {
      errors.push('Yield unit must be one of: tons, kg, bushels, liters');
    }
  }
  
  if (!farmData.quality) {
    errors.push('Quality data is required');
  } else {
    if (!farmData.quality.grade || !['A', 'B', 'C', 'D'].includes(farmData.quality.grade)) {
      errors.push('Quality grade must be A, B, C, or D');
    }
    if (typeof farmData.quality.score !== 'number' || farmData.quality.score < 0 || farmData.quality.score > 100) {
      errors.push('Quality score must be a number between 0 and 100');
    }
    if (!Array.isArray(farmData.quality.factors)) {
      errors.push('Quality factors must be an array');
    }
  }
  
  return errors;
}

// Constants
export const NFT_CATEGORIES: Record<NFTCategory, string> = {
  'Farm Land': 'Agricultural land parcels',
  'Crop Token': 'Tokenized crop yields',
  'Equipment': 'Farming machinery and tools',
  'Harvest': 'Harvested crops and produce',
  'Certificate': 'Quality and compliance certificates',
  'Insurance': 'Crop and farm insurance policies',
  'Yield Bond': 'Yield-based financial instruments',
  'Carbon Credit': 'Carbon sequestration credits',
  'Water Rights': 'Water usage and access rights',
  'Seed Bank': 'Genetic material and seeds',
  'Livestock': 'Farm animals and livestock',
  'Machinery': 'Heavy farming equipment'
};

export const NFT_RARITIES: Record<NFTRarity, { weight: number; color: string }> = {
  'Common': { weight: 50, color: '#6B7280' },
  'Uncommon': { weight: 25, color: '#10B981' },
  'Rare': { weight: 15, color: '#3B82F6' },
  'Epic': { weight: 7, color: '#8B5CF6' },
  'Legendary': { weight: 2.5, color: '#F59E0B' },
  'Mythic': { weight: 0.5, color: '#EF4444' }
};

export function getRarityColor(rarity: NFTRarity): string {
  return NFT_RARITIES[rarity].color;
}

export function getRarityWeight(rarity: NFTRarity): number {
  return NFT_RARITIES[rarity].weight;
}

export function calculateRarityScore(attributes: NFTAttribute[]): number {
  let score = 0;
  
  attributes.forEach(attr => {
    // This is a simplified scoring system
    // In a real implementation, you'd calculate based on trait rarity
    score += 10;
  });
  
  return Math.min(score, 100);
}

export function generateTokenId(category: NFTCategory, timestamp: number): string {
  const categoryCode = category.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const timestampStr = timestamp.toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  
  return `${categoryCode}-${timestampStr}-${randomStr}`;
}

export function createMetadataURI(metadata: NFTMetadata): string {
  // In a real implementation, this would upload to IPFS and return the hash
  const metadataString = JSON.stringify(metadata, null, 2);
  const blob = new Blob([metadataString], { type: 'application/json' });
  
  // Mock IPFS hash generation
  const hash = btoa(metadataString).substring(0, 46);
  return `ipfs://${hash}`;
} 