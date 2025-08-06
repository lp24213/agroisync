/**
 * Universal Formatters - Funções de formatação para o frontend AGROTM
 * 
 * @description Funções de formatação universais para números, porcentagens e valores monetários
 * com suporte completo a internacionalização (PT-BR, EN, ES, ZH).
 * 
 * @features
 * - Formatação de números com locale
 * - Formatação de porcentagens
 * - Formatação de moeda
 * - Suporte a múltiplos idiomas
 * - Fallback seguro para valores inválidos
 */

/**
 * Formata número com suporte a locale
 * @param {number} value - Valor numérico
 * @param {string} locale - Locale (default: 'pt-BR')
 * @param {number} decimals - Casas decimais (default: 2)
 * @returns {string} Número formatado
 */
export const formatNumber = (value, locale = 'pt-BR', decimals = 2) => {
  if (isNaN(value) || value === null || value === undefined) return '0';
  
  try {
    // Para valores grandes, usar abreviações
    if (Math.abs(value) >= 1e9) {
      return new Intl.NumberFormat(locale, { 
        maximumFractionDigits: decimals,
        notation: 'compact',
        compactDisplay: 'short'
      }).format(value);
    } else if (Math.abs(value) >= 1e6) {
      return new Intl.NumberFormat(locale, { 
        maximumFractionDigits: decimals,
        notation: 'compact',
        compactDisplay: 'short'
      }).format(value);
    } else if (Math.abs(value) >= 1e3) {
      return new Intl.NumberFormat(locale, { 
        maximumFractionDigits: decimals,
        notation: 'compact',
        compactDisplay: 'short'
      }).format(value);
    }
    
    // Para valores normais, usar formatação padrão
    return new Intl.NumberFormat(locale, { 
      maximumFractionDigits: decimals,
      minimumFractionDigits: 0
    }).format(value);
  } catch (error) {
    // Fallback para formatação básica
    return value.toFixed(decimals);
  }
};

/**
 * Formata porcentagem com suporte a locale
 * @param {number} value - Valor da porcentagem (0-100)
 * @param {string} locale - Locale (default: 'pt-BR')
 * @param {number} decimals - Casas decimais (default: 2)
 * @returns {string} Porcentagem formatada
 */
export const formatPercentage = (value, locale = 'pt-BR', decimals = 2) => {
  if (isNaN(value) || value === null || value === undefined) return '0%';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100);
  } catch (error) {
    // Fallback para formatação básica
    return `${value.toFixed(decimals)}%`;
  }
};

/**
 * Formata moeda com suporte a locale
 * @param {number} value - Valor monetário
 * @param {string} currency - Código da moeda (default: 'BRL')
 * @param {string} locale - Locale (default: 'pt-BR')
 * @param {number} decimals - Casas decimais (default: 2)
 * @returns {string} Valor monetário formatado
 */
export const formatCurrency = (value, currency = 'BRL', locale = 'pt-BR', decimals = 2) => {
  if (isNaN(value) || value === null || value === undefined) return 'R$ 0,00';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  } catch (error) {
    // Fallback para formatação básica
    return `R$ ${value.toFixed(decimals)}`;
  }
};

/**
 * Formata número completo sem abreviações
 * @param {number} value - Valor numérico
 * @param {string} locale - Locale (default: 'pt-BR')
 * @param {number} decimals - Casas decimais (default: 2)
 * @returns {string} Número formatado completo
 */
export const formatNumberFull = (value, locale = 'pt-BR', decimals = 2) => {
  if (isNaN(value) || value === null || value === undefined) return '0';
  
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  } catch (error) {
    // Fallback para formatação básica
    return value.toFixed(decimals);
  }
};

/**
 * Formata endereço de criptomoeda
 * @param {string} address - Endereço
 * @param {number} startChars - Caracteres no início (default: 6)
 * @param {number} endChars - Caracteres no final (default: 4)
 * @returns {string} Endereço formatado
 */
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Formata data com locale
 * @param {Date|string} date - Data
 * @param {string} locale - Locale (default: 'pt-BR')
 * @param {Object} options - Opções de formatação
 * @returns {string} Data formatada
 */
export const formatDate = (date, locale = 'pt-BR', options = {}) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  } catch (error) {
    // Fallback para formatação básica
    return date.toString();
  }
};

/**
 * Formata tempo relativo
 * @param {Date|string} date - Data
 * @param {string} locale - Locale (default: 'pt-BR')
 * @returns {string} Tempo relativo formatado
 */
export const formatRelativeTime = (date, locale = 'pt-BR') => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSeconds < 60) return 'agora mesmo';
    if (diffMinutes < 60) return `${diffMinutes} min atrás`;
    if (diffHours < 24) return `${diffHours} h atrás`;
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return formatDate(dateObj, locale, { month: 'short', day: 'numeric' });
  } catch (error) {
    return 'desconhecido';
  }
};

// Exporta todas as funções como objeto para compatibilidade
export default {
  formatNumber,
  formatPercentage,
  formatCurrency,
  formatNumberFull,
  formatAddress,
  formatDate,
  formatRelativeTime
}; 