// Utility functions for input sanitization

/**
 * Sanitize input string by removing potentially dangerous characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitizeInput = input => {
  if (typeof input !== 'string') {
    return input;
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

/**
 * Sanitize email address
 * @param {string} email - The email to sanitize
 * @returns {string} - The sanitized email
 */
export const sanitizeEmail = email => {
  if (typeof email !== 'string') {
    return '';
  }

  return email.trim().toLowerCase();
};

/**
 * Sanitize phone number
 * @param {string} phone - The phone number to sanitize
 * @returns {string} - The sanitized phone number
 */
export const sanitizePhone = phone => {
  if (typeof phone !== 'string') {
    return '';
  }

  return phone.replace(/\D/g, ''); // Keep only digits
};

/**
 * Sanitize URL
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL
 */
export const sanitizeUrl = url => {
  if (typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  // Only allow http and https protocols
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return '';
  }

  return trimmed;
};

/**
 * Sanitize object recursively
 * @param {Object} obj - The object to sanitize
 * @returns {Object} - The sanitized object
 */
export const sanitizeObject = obj => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
};
