export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validation = {
  // Validar endereço de carteira
  isValidWalletAddress: (address: string): boolean => {
    if (!address || typeof address !== 'string') return false;
    
    // Validação básica para endereços Solana (base58, 32-44 caracteres)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  },

  // Validar quantidade de tokens
  isValidTokenAmount: (amount: string): boolean => {
    if (!amount || typeof amount !== 'string') return false;
    
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= Number.MAX_SAFE_INTEGER;
  },

  // Validar email
  isValidEmail: (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validar senha
  isValidPassword: (password: string): boolean => {
    if (!password || typeof password !== 'string') return false;
    
    // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  // Validar nome de usuário
  isValidUsername: (username: string): boolean => {
    if (!username || typeof username !== 'string') return false;
    
    // 3-20 caracteres, apenas letras, números e underscore
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  // Validar URL
  isValidUrl: (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Validar número de telefone
  isValidPhone: (phone: string): boolean => {
    if (!phone || typeof phone !== 'string') return false;
    
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verifica se tem entre 10 e 15 dígitos
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  },

  // Validar CPF
  isValidCPF: (cpf: string): boolean => {
    if (!cpf || typeof cpf !== 'string') return false;
    
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  },

  // Validar CNPJ
  isValidCNPJ: (cnpj: string): boolean => {
    if (!cnpj || typeof cnpj !== 'string') return false;
    
    // Remove caracteres não numéricos
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    
    // Verifica se tem 14 dígitos
    if (cleanCNPJ.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
    
    // Validação dos dígitos verificadores
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i];
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i];
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return digit1 === parseInt(cleanCNPJ.charAt(12)) && digit2 === parseInt(cleanCNPJ.charAt(13));
  },

  // Validar data
  isValidDate: (date: string): boolean => {
    if (!date || typeof date !== 'string') return false;
    
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  },

  // Validar idade mínima
  isValidAge: (birthDate: string, minAge: number = 18): boolean => {
    if (!validation.isValidDate(birthDate)) return false;
    
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= minAge;
    }
    
    return age >= minAge;
  },

  // Sanitizar string
  sanitizeString: (str: string): string => {
    if (!str || typeof str !== 'string') return '';
    
    return str
      .trim()
      .replace(/[<>]/g, '') // Remove tags HTML básicas
      .replace(/[&]/g, '&amp;') // Escapa caracteres especiais
      .replace(/["]/g, '&quot;')
      .replace(/[']/g, '&#x27;')
      .replace(/[/]/g, '&#x2F;');
  },

  // Formatar número
  formatNumber: (num: number, decimals: number = 2): string => {
    if (isNaN(num)) return '0';
    
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  },

  // Formatar moeda
  formatCurrency: (amount: number, currency: string = 'BRL'): string => {
    if (isNaN(amount)) return 'R$ 0,00';
    
    // Validar código de moeda
    const validCurrency = currency && currency.trim() ? currency.trim() : 'BRL';
    
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: validCurrency,
      }).format(amount);
    } catch (error) {
      // Fallback para BRL se o código de moeda for inválido
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount);
    }
  },

  // Formatar porcentagem
  formatPercentage: (value: number, decimals: number = 2): string => {
    if (isNaN(value)) return '0%';
    
    return `${value.toFixed(decimals)}%`;
  },
}; 