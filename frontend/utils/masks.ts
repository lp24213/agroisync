/**
 * Utility functions for input masks in AGROTM
 */

// Phone number masks
export const PHONE_MASKS = {
  US: '(999) 999-9999',
  BR: '(99) 99999-9999',
  EU: '+99 999 999 999',
  INT: '+99 999 999 9999'
};

/**
 * Apply phone mask based on country
 */
export function applyPhoneMask(value: string, country: string = 'US'): string {
  const mask = PHONE_MASKS[country as keyof typeof PHONE_MASKS] || PHONE_MASKS.US;
  const numbers = value.replace(/\D/g, '');
  let result = '';
  let numberIndex = 0;
  
  for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
    if (mask[i] === '9') {
      result += numbers[numberIndex];
      numberIndex++;
    } else {
      result += mask[i];
    }
  }
  
  return result;
}

// Currency masks
export const CURRENCY_MASKS = {
  USD: {
    prefix: '$',
    decimal: '.',
    thousands: ',',
    precision: 2
  },
  EUR: {
    prefix: '€',
    decimal: ',',
    thousands: '.',
    precision: 2
  },
  BRL: {
    prefix: 'R$',
    decimal: ',',
    thousands: '.',
    precision: 2
  }
};

/**
 * Apply currency mask
 */
export function applyCurrencyMask(
  value: string,
  currency: string = 'USD'
): string {
  const config = CURRENCY_MASKS[currency as keyof typeof CURRENCY_MASKS] || CURRENCY_MASKS.USD;
  const numbers = value.replace(/\D/g, '');
  const decimalPlaces = config.precision;
  
  if (numbers.length === 0) return '';
  
  const integerPart = numbers.slice(0, -decimalPlaces) || '0';
  const decimalPart = numbers.slice(-decimalPlaces).padEnd(decimalPlaces, '0');
  
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousands);
  
  return `${config.prefix}${formattedInteger}${config.decimal}${decimalPart}`;
}

// Percentage masks
export function applyPercentageMask(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  
  const percentage = parseFloat(numbers) / 100;
  return `${percentage.toFixed(2)}%`;
}

// Date masks
export const DATE_MASKS = {
  US: '99/99/9999',
  EU: '99-99-9999',
  ISO: '9999-99-99'
};

/**
 * Apply date mask
 */
export function applyDateMask(value: string, format: string = 'US'): string {
  const mask = DATE_MASKS[format as keyof typeof DATE_MASKS] || DATE_MASKS.US;
  const numbers = value.replace(/\D/g, '');
  let result = '';
  let numberIndex = 0;
  
  for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
    if (mask[i] === '9') {
      result += numbers[numberIndex];
      numberIndex++;
    } else {
      result += mask[i];
    }
  }
  
  return result;
}

// Credit card masks
export const CARD_MASKS = {
  VISA: '9999 9999 9999 9999',
  MASTERCARD: '9999 9999 9999 9999',
  AMEX: '9999 999999 99999',
  DISCOVER: '9999 9999 9999 9999'
};

/**
 * Apply credit card mask
 */
export function applyCardMask(value: string, cardType: string = 'VISA'): string {
  const mask = CARD_MASKS[cardType as keyof typeof CARD_MASKS] || CARD_MASKS.VISA;
  const numbers = value.replace(/\D/g, '');
  let result = '';
  let numberIndex = 0;
  
  for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
    if (mask[i] === '9') {
      result += numbers[numberIndex];
      numberIndex++;
    } else {
      result += mask[i];
    }
  }
  
  return result;
}

// Wallet address masks
export function applyWalletMask(address: string, network: string = 'ethereum'): string {
  if (!address) return '';
  
  if (network === 'ethereum') {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  } else if (network === 'solana') {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }
  
  return address;
}

// IPFS hash masks
export function applyIPFSMask(hash: string): string {
  if (!hash) return '';
  if (hash.startsWith('ipfs://')) {
    return `ipfs://${hash.slice(7, 13)}...${hash.slice(-6)}`;
  }
  return hash;
}

// Transaction hash masks
export function applyTxHashMask(hash: string): string {
  if (!hash) return '';
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

// Social security number mask (US)
export function applySSNMask(value: string): string {
  const numbers = value.replace(/\D/g, '');
  let result = '';
  
  for (let i = 0; i < numbers.length && i < 9; i++) {
    if (i === 3 || i === 5) {
      result += '-';
    }
    result += numbers[i];
  }
  
  return result;
}

// ZIP code masks
export const ZIP_MASKS = {
  US: '99999',
  BR: '99999-999',
  CA: 'A9A 9A9'
};

/**
 * Apply ZIP code mask
 */
export function applyZIPMask(value: string, country: string = 'US'): string {
  const mask = ZIP_MASKS[country as keyof typeof ZIP_MASKS] || ZIP_MASKS.US;
  const chars = value.replace(/[^A-Za-z0-9]/g, '');
  let result = '';
  let charIndex = 0;
  
  for (let i = 0; i < mask.length && charIndex < chars.length; i++) {
    if (mask[i] === '9') {
      if (/[0-9]/.test(chars[charIndex])) {
        result += chars[charIndex];
        charIndex++;
      }
    } else if (mask[i] === 'A') {
      if (/[A-Za-z]/.test(chars[charIndex])) {
        result += chars[charIndex].toUpperCase();
        charIndex++;
      }
    } else {
      result += mask[i];
    }
  }
  
  return result;
}

// Time masks
export const TIME_MASKS = {
  '12H': '99:99 AM',
  '24H': '99:99'
};

/**
 * Apply time mask
 */
export function applyTimeMask(value: string, format: string = '24H'): string {
  const mask = TIME_MASKS[format as keyof typeof TIME_MASKS] || TIME_MASKS['24H'];
  const numbers = value.replace(/\D/g, '');
  let result = '';
  let numberIndex = 0;
  
  for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
    if (mask[i] === '9') {
      result += numbers[numberIndex];
      numberIndex++;
    } else {
      result += mask[i];
    }
  }
  
  return result;
}

// Input validation masks
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string, country: string = 'US'): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  
  switch (country) {
    case 'US':
      return cleanPhone.length === 10;
    case 'BR':
      return cleanPhone.length === 11;
    default:
      return cleanPhone.length >= 10;
  }
}

export function validateCard(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  return cleanNumber.length >= 13 && cleanNumber.length <= 19;
}

export function validateWalletAddress(address: string, network: string = 'ethereum'): boolean {
  if (network === 'ethereum') {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  } else if (network === 'solana') {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }
  return false;
}

// Real-time input formatting
export function formatInput(
  value: string,
  type: string,
  options: any = {}
): string {
  switch (type) {
    case 'phone':
      return applyPhoneMask(value, options.country);
    case 'currency':
      return applyCurrencyMask(value, options.currency);
    case 'percentage':
      return applyPercentageMask(value);
    case 'date':
      return applyDateMask(value, options.format);
    case 'card':
      return applyCardMask(value, options.cardType);
    case 'wallet':
      return applyWalletMask(value, options.network);
    case 'ipfs':
      return applyIPFSMask(value);
    case 'txhash':
      return applyTxHashMask(value);
    case 'ssn':
      return applySSNMask(value);
    case 'zip':
      return applyZIPMask(value, options.country);
    case 'time':
      return applyTimeMask(value, options.format);
    default:
      return value;
  }
}

// Remove masks and get clean value
export function removeMask(value: string): string {
  return value.replace(/[^\w\s]/g, '');
}

// Get only numbers from masked value
export function getNumbers(value: string): string {
  return value.replace(/\D/g, '');
}

// Get only letters from masked value
export function getLetters(value: string): string {
  return value.replace(/[^A-Za-z]/g, '');
}

// Get alphanumeric characters from masked value
export function getAlphanumeric(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, '');
} 