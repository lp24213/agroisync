/**
 * Utility functions for data conversions in AGROTM
 */

// Currency conversions
export const CURRENCY_DECIMALS = {
  ETH: 18,
  MATIC: 18,
  BNB: 18,
  SOL: 9,
  AGROTM: 18,
  USDC: 6,
  USDT: 6,
  DAI: 18
};

/**
 * Convert wei to ether
 */
export function weiToEther(wei: string | number): string {
  const weiStr = wei.toString();
  const ether = parseFloat(weiStr) / Math.pow(10, 18);
  return ether.toFixed(6);
}

/**
 * Convert ether to wei
 */
export function etherToWei(ether: string | number): string {
  const etherNum = parseFloat(ether.toString());
  const wei = etherNum * Math.pow(10, 18);
  return wei.toString();
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: string | number): string {
  const lamportsNum = parseFloat(lamports.toString());
  const sol = lamportsNum / Math.pow(10, 9);
  return sol.toFixed(6);
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: string | number): string {
  const solNum = parseFloat(sol.toString());
  const lamports = solNum * Math.pow(10, 9);
  return lamports.toString();
}

/**
 * Convert any token amount from smallest unit to standard unit
 */
export function tokenToStandard(
  amount: string | number,
  decimals: number,
  symbol: string
): string {
  const amountNum = parseFloat(amount.toString());
  const standard = amountNum / Math.pow(10, decimals);
  return `${standard.toFixed(6)} ${symbol}`;
}

/**
 * Convert any token amount from standard unit to smallest unit
 */
export function standardToToken(
  amount: string | number,
  decimals: number
): string {
  const amountNum = parseFloat(amount.toString());
  const token = amountNum * Math.pow(10, decimals);
  return token.toString();
}

// Time conversions
export const TIME_UNITS = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000,
  YEAR: 31536000
};

/**
 * Convert seconds to human readable time
 */
export function secondsToHuman(seconds: number): string {
  if (seconds < TIME_UNITS.MINUTE) {
    return `${seconds} seconds`;
  } else if (seconds < TIME_UNITS.HOUR) {
    const minutes = Math.floor(seconds / TIME_UNITS.MINUTE);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (seconds < TIME_UNITS.DAY) {
    const hours = Math.floor(seconds / TIME_UNITS.HOUR);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (seconds < TIME_UNITS.WEEK) {
    const days = Math.floor(seconds / TIME_UNITS.DAY);
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (seconds < TIME_UNITS.MONTH) {
    const weeks = Math.floor(seconds / TIME_UNITS.WEEK);
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  } else if (seconds < TIME_UNITS.YEAR) {
    const months = Math.floor(seconds / TIME_UNITS.MONTH);
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(seconds / TIME_UNITS.YEAR);
    return `${years} year${years > 1 ? 's' : ''}`;
  }
}

/**
 * Convert timestamp to relative time
 */
export function timestampToRelative(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 0) {
    return 'in the future';
  }
  
  return secondsToHuman(seconds) + ' ago';
}

/**
 * Convert date to ISO string with timezone
 */
export function dateToISO(date: Date, timezone: string = 'UTC'): string {
  return date.toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

// Size conversions
export const SIZE_UNITS = {
  BYTE: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024
};

/**
 * Convert bytes to human readable size
 */
export function bytesToHuman(bytes: number): string {
  if (bytes < SIZE_UNITS.KB) {
    return `${bytes} B`;
  } else if (bytes < SIZE_UNITS.MB) {
    const kb = bytes / SIZE_UNITS.KB;
    return `${kb.toFixed(2)} KB`;
  } else if (bytes < SIZE_UNITS.GB) {
    const mb = bytes / SIZE_UNITS.MB;
    return `${mb.toFixed(2)} MB`;
  } else if (bytes < SIZE_UNITS.TB) {
    const gb = bytes / SIZE_UNITS.GB;
    return `${gb.toFixed(2)} GB`;
  } else {
    const tb = bytes / SIZE_UNITS.TB;
    return `${tb.toFixed(2)} TB`;
  }
}

// Agricultural conversions
export const AGRICULTURAL_UNITS = {
  // Weight
  GRAM: 1,
  KILOGRAM: 1000,
  TON: 1000000,
  POUND: 453.592,
  BUSHEL: 27215.5, // Corn bushel
  
  // Area
  SQUARE_METER: 1,
  HECTARE: 10000,
  ACRE: 4046.86,
  
  // Volume
  LITER: 1,
  GALLON: 3.78541,
  
  // Length
  METER: 1,
  FOOT: 0.3048,
  YARD: 0.9144
};

/**
 * Convert agricultural weight units
 */
export function convertWeight(
  amount: number,
  fromUnit: string,
  toUnit: string
): number {
  const units: { [key: string]: number } = {
    g: AGRICULTURAL_UNITS.GRAM,
    kg: AGRICULTURAL_UNITS.KILOGRAM,
    ton: AGRICULTURAL_UNITS.TON,
    lb: AGRICULTURAL_UNITS.POUND,
    bushel: AGRICULTURAL_UNITS.BUSHEL
  };
  
  const fromValue = units[fromUnit.toLowerCase()];
  const toValue = units[toUnit.toLowerCase()];
  
  if (!fromValue || !toValue) {
    throw new Error(`Invalid unit: ${fromUnit} or ${toUnit}`);
  }
  
  return (amount * fromValue) / toValue;
}

/**
 * Convert agricultural area units
 */
export function convertArea(
  amount: number,
  fromUnit: string,
  toUnit: string
): number {
  const units: { [key: string]: number } = {
    'm²': AGRICULTURAL_UNITS.SQUARE_METER,
    ha: AGRICULTURAL_UNITS.HECTARE,
    acre: AGRICULTURAL_UNITS.ACRE
  };
  
  const fromValue = units[fromUnit.toLowerCase()];
  const toValue = units[toUnit.toLowerCase()];
  
  if (!fromValue || !toValue) {
    throw new Error(`Invalid unit: ${fromUnit} or ${toUnit}`);
  }
  
  return (amount * fromValue) / toValue;
}

/**
 * Calculate yield per hectare
 */
export function calculateYieldPerHectare(
  totalYield: number,
  totalArea: number,
  yieldUnit: string = 'kg',
  areaUnit: string = 'ha'
): number {
  const yieldInKg = convertWeight(totalYield, yieldUnit, 'kg');
  const areaInHa = convertArea(totalArea, areaUnit, 'ha');
  
  return yieldInKg / areaInHa;
}

// Temperature conversions
/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}

/**
 * Convert Celsius to Kelvin
 */
export function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15;
}

/**
 * Convert Kelvin to Celsius
 */
export function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}

// Percentage calculations
/**
 * Calculate percentage
 */
export function calculatePercentage(
  value: number,
  total: number,
  decimals: number = 2
): number {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number,
  decimals: number = 2
): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  const change = ((newValue - oldValue) / oldValue) * 100;
  return parseFloat(change.toFixed(decimals));
}

/**
 * Calculate APY from APR
 */
export function calculateAPY(apr: number, compoundingFrequency: number = 365): number {
  return (Math.pow(1 + apr / compoundingFrequency, compoundingFrequency) - 1) * 100;
}

/**
 * Calculate APR from APY
 */
export function calculateAPR(apy: number, compoundingFrequency: number = 365): number {
  return (Math.pow(1 + apy / 100, 1 / compoundingFrequency) - 1) * compoundingFrequency * 100;
}

// Address formatting
/**
 * Format wallet address for display
 */
export function formatAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address || address.length < startChars + endChars) {
    return address;
  }
  
  const start = address.substring(0, startChars);
  const end = address.substring(address.length - endChars);
  return `${start}...${end}`;
}

/**
 * Validate Ethereum address format
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate Solana address format
 */
export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

// Number formatting
/**
 * Format number with commas
 */
export function formatNumber(
  num: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  return num.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}

// Data validation
/**
 * Check if value is a valid number
 */
export function isValidNumber(value: unknown): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Check if value is a valid positive number
 */
export function isValidPositiveNumber(value: unknown): boolean {
  return isValidNumber(value) && value > 0;
}

/**
 * Check if value is a valid integer
 */
export function isValidInteger(value: unknown): boolean {
  return Number.isInteger(value);
}

/**
 * Check if value is a valid positive integer
 */
export function isValidPositiveInteger(value: unknown): boolean {
  return isValidInteger(value) && value > 0;
}

// Array and object conversions
/**
 * Convert array to object with specified key
 */
export function arrayToObject<T>(
  array: T[],
  key: keyof T
): { [key: string]: T } {
  return array.reduce((obj, item) => {
    obj[String(item[key])] = item;
    return obj;
  }, {} as { [key: string]: T });
}

/**
 * Convert object to array
 */
export function objectToArray<T>(obj: { [key: string]: T }): T[] {
  return Object.values(obj);
}

/**
 * Convert object keys to array
 */
export function objectKeysToArray<T>(obj: { [key: string]: T }): string[] {
  return Object.keys(obj);
}

/**
 * Convert array to chunks
 */
export function arrayToChunks<T>(
  array: T[],
  chunkSize: number
): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// String conversions
/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Convert string to camel case
 */
export function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Convert string to kebab case
 */
export function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert string to snake case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

// Base64 conversions
/**
 * Convert string to base64
 */
export function stringToBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Convert base64 to string
 */
export function base64ToString(base64: string): string {
  return decodeURIComponent(escape(atob(base64)));
}

/**
 * Convert object to base64
 */
export function objectToBase64(obj: any): string {
  return stringToBase64(JSON.stringify(obj));
}

/**
 * Convert base64 to object
 */
export function base64ToObject(base64: string): any {
  return JSON.parse(base64ToString(base64));
} 