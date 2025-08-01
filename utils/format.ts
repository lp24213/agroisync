/**
 * Format Utilities - Premium formatting functions
 * 
 * @description Comprehensive formatting utilities for currency, numbers, percentages,
 * dates, and other data types. Optimized for performance and internationalization.
 * 
 * @features
 * - Currency formatting with locale support
 * - Number formatting with abbreviations (K, M, B)
 * - Percentage formatting with precision control
 * - Date and time formatting
 * - File size formatting
 * - Duration formatting
 * - Input masking utilities
 */

/**
 * Format currency with locale support
 * @param value - The numeric value to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale string (default: 'en-US')
 * @param minimumFractionDigits - Minimum decimal places
 * @param maximumFractionDigits - Maximum decimal places
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  } catch (error) {
    // Fallback formatting for currency
    return `${currency} ${value.toFixed(2)}`;
  }
}

/**
 * Format percentage with precision control
 * @param value - The numeric value (0-1 for percentage)
 * @param decimals - Number of decimal places (default: 2)
 * @param locale - Locale string (default: 'en-US')
 */
export function formatPercentage(
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    // Fallback formatting for percentage
    return `${(value * 100).toFixed(decimals)}%`;
  }
}

/**
 * Format number with abbreviations (K, M, B, T)
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 1)
 * @param locale - Locale string (default: 'en-US')
 */
export function formatNumber(
  value: number,
  decimals: number = 1,
  locale: string = 'en-US'
): string {
  try {
    if (value === 0) return '0';
    
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 1e12) {
      return `${sign}${(absValue / 1e12).toFixed(decimals)}T`;
    } else if (absValue >= 1e9) {
      return `${sign}${(absValue / 1e9).toFixed(decimals)}B`;
    } else if (absValue >= 1e6) {
      return `${sign}${(absValue / 1e6).toFixed(decimals)}M`;
    } else if (absValue >= 1e3) {
      return `${sign}${(absValue / 1e3).toFixed(decimals)}K`;
    } else {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      }).format(value);
    }
  } catch (error) {
    // Fallback formatting for number
    return value.toString();
  }
}

/**
 * Format number with full precision (no abbreviations)
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 2)
 * @param locale - Locale string (default: 'en-US')
 */
export function formatNumberFull(
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    // Fallback formatting for number
    return value.toFixed(decimals);
  }
}

/**
 * Format date with locale support
 * @param date - Date object or string
 * @param options - Intl.DateTimeFormatOptions
 * @param locale - Locale string (default: 'en-US')
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  locale: string = 'en-US'
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    // Fallback formatting for date
    return date.toString();
  }
}

/**
 * Format time with locale support
 * @param date - Date object or string
 * @param options - Intl.DateTimeFormatOptions
 * @param locale - Locale string (default: 'en-US')
 */
export function formatTime(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  },
  locale: string = 'en-US'
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    // Fallback formatting for time
    return date.toString();
  }
}

/**
 * Format file size in bytes to human readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format duration in milliseconds to human readable format
 * @param ms - Duration in milliseconds
 * @param short - Use short format (default: false)
 */
export function formatDuration(ms: number, short: boolean = false): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (short) {
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  }
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours % 24 > 0) parts.push(`${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`);
  if (seconds % 60 > 0) parts.push(`${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`);
  
  return parts.join(', ') || '0 seconds';
}

/**
 * Format crypto address with ellipsis
 * @param address - Crypto address string
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 */
export function formatAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format phone number with mask
 * @param phone - Phone number string
 * @param format - Format pattern (default: '(###) ###-####')
 */
export function formatPhone(
  phone: string,
  format: string = '(###) ###-####'
): string {
  const cleaned = phone.replace(/\D/g, '');
  let formatted = format;
  
  for (let i = 0; i < cleaned.length; i++) {
    formatted = formatted.replace('#', cleaned[i]);
  }
  
  return formatted.replace(/#/g, '');
}

/**
 * Format credit card number with spaces
 * @param cardNumber - Credit card number string
 */
export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(' ').substr(0, 19); // Max 16 digits + 3 spaces
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date - Date object or string
 * @param locale - Locale string (default: 'en-US')
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return formatDate(dateObj, { month: 'short', day: 'numeric' }, locale);
  } catch (error) {
    // Fallback formatting for relative time
    return 'unknown';
  }
}

/**
 * Format APY (Annual Percentage Yield)
 * @param apy - APY value (as decimal, e.g., 0.15 for 15%)
 * @param decimals - Number of decimal places (default: 2)
 */
export function formatAPY(apy: number, decimals: number = 2): string {
  return `${(apy * 100).toFixed(decimals)}% APY`;
}

/**
 * Format TVL (Total Value Locked)
 * @param tvl - TVL value in USD
 * @param currency - Currency symbol (default: '$')
 */
export function formatTVL(tvl: number, currency: string = '$'): string {
  return `${currency}${formatNumber(tvl)} TVL`;
}

/**
 * Format token amount with symbol
 * @param amount - Token amount
 * @param symbol - Token symbol
 * @param decimals - Number of decimal places (default: 4)
 */
export function formatTokenAmount(
  amount: number,
  symbol: string,
  decimals: number = 4
): string {
  return `${formatNumberFull(amount, decimals)} ${symbol}`;
}

export default {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatNumberFull,
  formatDate,
  formatTime,
  formatFileSize,
  formatDuration,
  formatAddress,
  formatPhone,
  formatCreditCard,
  formatRelativeTime,
  formatAPY,
  formatTVL,
  formatTokenAmount,
};