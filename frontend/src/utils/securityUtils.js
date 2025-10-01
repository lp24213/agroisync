// Utilitários de Segurança Avançada - AGROISYNC
// Proteção contra XSS, CSRF, Injection e outros ataques

class SecurityUtils {
  constructor() {
    this.suspiciousPatterns = [
      // XSS Patterns
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi,
      /onclick\s*=/gi,
      /onmouseover\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      /<link[^>]*>/gi,
      /<meta[^>]*>/gi,

      // SQL Injection Patterns
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
      /(\b(or|and)\s+\d+\s*=\s*\d+)/gi,
      /(\b(or|and)\s+['"]\s*=\s*['"])/gi,
      /(\b(or|and)\s+\w+\s*=\s*\w+)/gi,

      // Command Injection Patterns
      /(\b(cmd|command|exec|system|eval|setTimeout|setInterval)\b)/gi,
      /(\||&|;|\$\(|`)/gi,

      // Path Traversal Patterns
      /\.\.\/|\.\.\\|\.\.%2f|\.\.%5c/gi,
      /\.\.%252f|\.\.%255c/gi,

      // LDAP Injection Patterns
      /(\b(\(|\)|\*|\||&)\b)/gi,

      // NoSQL Injection Patterns
      /(\$where|\$ne|\$gt|\$lt|\$regex)/gi,

      // Template Injection Patterns
      /(\{\{.*\}\}|\{%.*%\})/gi,

      // Code Injection Patterns
      /(\beval\s*\(|\bFunction\s*\(|\bnew\s+Function)/gi
    ];

    this.allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'span'];
    this.allowedAttributes = ['class', 'id'];
  }

  // Sanitizar entrada de usuário
  sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') {
      return input;
    }

    const { allowHtml = false, maxLength = 1000, stripTags = true, escapeHtml = true } = options;

    // Limitar tamanho
    let sanitized = input.substring(0, maxLength);

    // Detectar padrões suspeitos
    if (this.detectSuspiciousPattern(sanitized)) {
      console.warn('Padrão suspeito detectado:', sanitized.substring(0, 100));
      return this.escapeHtml(sanitized);
    }

    // Remover tags HTML se não permitido
    if (stripTags && !allowHtml) {
      sanitized = this.stripHtmlTags(sanitized);
    }

    // Escapar HTML se necessário
    if (escapeHtml) {
      sanitized = this.escapeHtml(sanitized);
    }

    // Limpar caracteres especiais perigosos
    sanitized = this.cleanSpecialChars(sanitized);

    return sanitized.trim();
  }

  // Detectar padrões suspeitos
  detectSuspiciousPattern(input) {
    return this.suspiciousPatterns.some(pattern => pattern.test(input));
  }

  // Escapar caracteres HTML
  escapeHtml(input) {
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };

    return input.replace(/[&<>"'/]/g, char => htmlEscapes[char]);
  }

  // Remover tags HTML
  stripHtmlTags(input) {
    return input.replace(/<[^>]*>/g, '');
  }

  // Limpar caracteres especiais perigosos
  cleanSpecialChars(input) {
    return input
      .replace(/[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]/g, '') // Remover caracteres de controle
      .replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F]/g, '') // Remover caracteres Unicode perigosos
      .replace(/\s+/g, ' ') // Normalizar espaços
      .trim();
  }

  // Validar URL
  validateUrl(url) {
    try {
      const urlObj = new URL(url);

      // Verificar protocolo permitido
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }

      // Verificar domínio suspeito
      const suspiciousDomains = ['localhost', '127.0.0.1', '0.0.0.0', 'file:', 'javascript:', 'data:', 'vbscript:'];

      if (suspiciousDomains.some(domain => urlObj.hostname.includes(domain))) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  // Validar email com proteção adicional
  validateEmail(email) {
    if (typeof email !== 'string') return false;

    // Verificar tamanho
    if (email.length > 254) return false;

    // Verificar padrão básico
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email)) return false;

    // Verificar se não contém padrões suspeitos
    if (this.detectSuspiciousPattern(email)) return false;

    // Verificar domínios suspeitos
    const suspiciousDomains = ['localhost', '127.0.0.1', 'test.com', 'example.com'];

    const domain = email.split('@')[1];
    if (suspiciousDomains.includes(domain)) return false;

    return true;
  }

  // Validar senha com critérios rigorosos
  validatePassword(password) {
    if (typeof password !== 'string') return { valid: false, errors: ['Senha deve ser texto'] };

    const errors = [];

    // Verificar tamanho mínimo
    if (password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres');
    }

    // Verificar tamanho máximo
    if (password.length > 128) {
      errors.push('Senha deve ter no máximo 128 caracteres');
    }

    // Verificar maiúscula
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    // Verificar minúscula
    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }

    // Verificar número
    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }

    // Verificar caractere especial
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial');
    }

    // Verificar padrões comuns
    const commonPatterns = [/123456/, /password/i, /qwerty/i, /abc123/i, /admin/i, /user/i];

    if (commonPatterns.some(pattern => pattern.test(password))) {
      errors.push('Senha muito comum, escolha uma mais segura');
    }

    // Verificar repetição de caracteres
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Senha não pode ter mais de 2 caracteres iguais consecutivos');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Gerar token CSRF
  generateCSRFToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Verificar token CSRF
  verifyCSRFToken(token, sessionToken) {
    if (!token || !sessionToken) return false;
    return token === sessionToken;
  }

  // Sanitizar dados de formulário
  sanitizeFormData(formData) {
    const sanitized = {};

    for (const [key, value] of Object.entries(formData)) {
      // Sanitizar chave
      const cleanKey = this.sanitizeInput(key, { maxLength: 50 });

      // Sanitizar valor baseado no tipo
      if (typeof value === 'string') {
        sanitized[cleanKey] = this.sanitizeInput(value);
      } else if (Array.isArray(value)) {
        sanitized[cleanKey] = value.map(item => (typeof item === 'string' ? this.sanitizeInput(item) : item));
      } else {
        sanitized[cleanKey] = value;
      }
    }

    return sanitized;
  }

  // Validar arquivo
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
    } = options;

    const errors = [];

    // Verificar tamanho
    if (file.size > maxSize) {
      errors.push(`Arquivo muito grande. Máximo: ${maxSize / (1024 * 1024)}MB`);
    }

    // Verificar tipo MIME
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Tipo de arquivo não permitido: ${file.type}`);
    }

    // Verificar extensão
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(extension)) {
      errors.push(`Extensão não permitida: ${extension}`);
    }

    // Verificar nome do arquivo
    if (this.detectSuspiciousPattern(file.name)) {
      errors.push('Nome do arquivo contém caracteres suspeitos');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Rate limiting simples
  createRateLimiter(maxRequests = 10, windowMs = 60000) {
    const requests = new Map();

    return identifier => {
      const now = Date.now();
      const windowStart = now - windowMs;

      // Limpar requisições antigas
      for (const [key, timestamp] of requests.entries()) {
        if (timestamp < windowStart) {
          requests.delete(key);
        }
      }

      // Verificar limite
      const userRequests = Array.from(requests.values()).filter(timestamp => timestamp > windowStart);

      if (userRequests.length >= maxRequests) {
        return false;
      }

      // Adicionar nova requisição
      requests.set(identifier, now);
      return true;
    };
  }

  // Log de segurança
  logSecurityEvent(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };

    // Enviar para backend (se disponível)
    if (window.securityLogger) {
      window.securityLogger.log(logEntry);
    }

    // Log local para debug
    console.warn('Security Event:', logEntry);
  }

  // Verificar integridade de dados
  verifyDataIntegrity(data, expectedHash) {
    // Implementar verificação de hash
    const actualHash = this.generateHash(JSON.stringify(data));
    return actualHash === expectedHash;
  }

  // Gerar hash simples
  generateHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
}

// Instância única
const securityUtils = new SecurityUtils();

export default securityUtils;

// Exportar funções específicas para uso direto
export const {
  sanitizeInput,
  validateEmail,
  validatePassword,
  validateUrl,
  validateFile,
  sanitizeFormData,
  generateCSRFToken,
  verifyCSRFToken,
  createRateLimiter,
  logSecurityEvent
} = securityUtils;
