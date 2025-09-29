/**
 * Get the real client IP address from request headers
 * Handles Cloudflare, AWS, and other proxy scenarios
 */
export const getClientIP = req => {
  // Cloudflare headers (priority order)
  if (req.headers['cf-connecting-ip']) {
    return req.headers['cf-connecting-ip'];
  }

  // AWS ALB/ELB headers
  if (req.headers['x-forwarded-for']) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const forwardedFor = req.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0].trim();
    }
  }

  // AWS specific headers
  if (req.headers['x-aws-vpc']) {
    return req.headers['x-aws-vpc'];
  }

  // Standard proxy headers
  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'];
  }

  if (req.headers['x-client-ip']) {
    return req.headers['x-client-ip'];
  }

  // Express.js trust proxy
  if (req.ip) {
    return req.ip;
  }

  // Fallback to connection remote address
  if (req.connection && req.connection.remoteAddress) {
    return req.connection.remoteAddress;
  }

  // Socket remote address
  if (req.socket && req.socket.remoteAddress) {
    return req.socket.remoteAddress;
  }

  // Request remote address
  if (req.request && req.request.remoteAddress) {
    return req.request.remoteAddress;
  }

  // Default fallback
  return 'unknown';
};

/**
 * Get client IP with additional metadata
 */
export const getClientIPInfo = req => {
  const ip = getClientIP(req);

  return {
    ip,
    // Cloudflare specific info
    cloudflare: {
      rayId: req.headers['cf-ray'] || null,
      country: req.headers['cf-ipcountry'] || null,
      region: req.headers['cf-ipregion'] || null,
      city: req.headers['cf-ipcity'] || null,
      threatScore: parseInt(req.headers['cf-threat-score'], 10) || 0,
      botScore: parseInt(req.headers['cf-bot-score'], 10) || 0,
      verifiedBot: req.headers['cf-verified-bot'] === 'true',
      challengePassed: req.headers['cf-challenge-passed'] === 'true'
    },
    // AWS specific info
    aws: {
      requestId: req.headers['x-amz-cf-id'] || req.headers['x-amzn-trace-id'] || null,
      region: req.headers['x-amz-cf-pop'] || null
    },
    // User agent
    userAgent: req.get('User-Agent') || null,
    // Referer
    referer: req.get('Referer') || null,
    // Origin
    origin: req.get('Origin') || null
  };
};

/**
 * Check if IP is from Cloudflare
 */
export const isCloudflareIP = req => {
  return !!req.headers['cf-connecting-ip'];
};

/**
 * Check if IP is from AWS
 */
export const isAWSIP = req => {
  return !!req.headers['x-amz-cf-id'] || !!req.headers['x-amzn-trace-id'];
};

/**
 * Get geolocation info from headers
 */
export const getGeolocation = req => {
  return {
    country: req.headers['cf-ipcountry'] || null,
    region: req.headers['cf-ipregion'] || null,
    city: req.headers['cf-ipcity'] || null,
    coordinates: null // Cloudflare doesn't provide coordinates by default
  };
};

/**
 * Validate IP address format
 */
export const isValidIP = ip => {
  if (ip === 'unknown' || ip === 'localhost' || ip === '127.0.0.1') {
    return false;
  }

  // IPv4 validation
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(ip)) {
    return true;
  }

  // IPv6 validation (basic)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  if (ipv6Regex.test(ip)) {
    return true;
  }

  return false;
};

/**
 * Check if IP is private/local
 */
export const isPrivateIP = ip => {
  if (!isValidIP(ip)) {
    return true;
  }

  // Private IPv4 ranges
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./,
    /^0\./,
    /^255\.255\.255\.255$/
  ];

  return privateRanges.some(range => range.test(ip));
};

/**
 * Sanitize IP address for logging
 */
export const sanitizeIP = ip => {
  if (!isValidIP(ip)) {
    return 'invalid';
  }

  if (isPrivateIP(ip)) {
    return 'private';
  }

  // For IPv4, mask the last octet for privacy
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.*`;
    }
  }

  // For IPv6, mask the last 64 bits
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length === 8) {
      return `${parts.slice(0, 4).join(':')}:****:****`;
    }
  }

  return ip;
};
