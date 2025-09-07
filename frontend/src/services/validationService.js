import axios from 'axios';

class ValidationService {
  constructor() {
    this.receitaApiUrl = 'https://www.receitaws.com.br/v1/cnpj';
    this.ibgeApiUrl = 'https://servicodados.ibge.gov.br/api/v1';
    this.cepApiUrl = 'https://viacep.com.br/ws';
    this.isLoading = false;
    this.error = null;
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 horas
  }

  // Validar CPF
  validateCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
      return { valid: false, error: 'CPF deve ter 11 dígitos' };
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { valid: false, error: 'CPF inválido' };
    }
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) {
      return { valid: false, error: 'CPF inválido' };
    }
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) {
      return { valid: false, error: 'CPF inválido' };
    }
    
    return { valid: true };
  }

  // Validar CNPJ
  validateCNPJ(cnpj) {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14) {
      return { valid: false, error: 'CNPJ deve ter 14 dígitos' };
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) {
      return { valid: false, error: 'CNPJ inválido' };
    }
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    let weight = 2;
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (digit1 !== parseInt(cnpj.charAt(12))) {
      return { valid: false, error: 'CNPJ inválido' };
    }
    
    // Validação do segundo dígito verificador
    sum = 0;
    weight = 2;
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    if (digit2 !== parseInt(cnpj.charAt(13))) {
      return { valid: false, error: 'CNPJ inválido' };
    }
    
    return { valid: true };
  }

  // Buscar dados da Receita Federal por CNPJ
  async fetchReceitaData(cnpj) {
    const cacheKey = `receita-${cnpj}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      this.isLoading = true;
      this.error = null;

      const response = await axios.get(`${this.receitaApiUrl}/${cnpj}`);
      
      if (response.data.status === 'ERROR') {
        throw new Error(response.data.message || 'CNPJ não encontrado');
      }

      const data = {
        cnpj: response.data.cnpj,
        nome: response.data.nome,
        fantasia: response.data.fantasia,
        situacao: response.data.situacao,
        abertura: response.data.abertura,
        tipo: response.data.tipo,
        porte: response.data.porte,
        natureza_juridica: response.data.natureza_juridica,
        logradouro: response.data.logradouro,
        numero: response.data.numero,
        complemento: response.data.complemento,
        bairro: response.data.bairro,
        municipio: response.data.municipio,
        uf: response.data.uf,
        cep: response.data.cep,
        telefone: response.data.telefone,
        email: response.data.email,
        capital_social: response.data.capital_social,
        atividade_principal: response.data.atividade_principal,
        atividades_secundarias: response.data.atividades_secundarias,
        qsa: response.data.qsa
      };

      // Cache dos dados
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Erro ao buscar dados da Receita Federal:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Buscar CEP
  async fetchCEP(cep) {
    const cleanCep = cep.replace(/[^\d]/g, '');
    
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    const cacheKey = `cep-${cleanCep}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      this.isLoading = true;
      this.error = null;

      const response = await axios.get(`${this.cepApiUrl}/${cleanCep}/json`);
      
      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }

      const data = {
        cep: response.data.cep,
        logradouro: response.data.logradouro,
        complemento: response.data.complemento,
        bairro: response.data.bairro,
        localidade: response.data.localidade,
        uf: response.data.uf,
        ibge: response.data.ibge,
        gia: response.data.gia,
        ddd: response.data.ddd,
        siafi: response.data.siafi
      };

      // Cache dos dados
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Buscar municípios por UF
  async fetchMunicipiosByUF(uf) {
    const cacheKey = `municipios-${uf}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      this.isLoading = true;
      this.error = null;

      const response = await axios.get(`${this.ibgeApiUrl}/localidades/estados/${uf}/municipios`);
      
      const data = response.data.map(municipio => ({
        id: municipio.id,
        nome: municipio.nome,
        microrregiao: municipio.microrregiao.nome,
        mesorregiao: municipio.microrregiao.mesorregiao.nome,
        uf: municipio.microrregiao.mesorregiao.UF.sigla
      }));

      // Cache dos dados
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Erro ao buscar municípios:', error);
      this.error = error.message;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Validar email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      valid: emailRegex.test(email),
      error: emailRegex.test(email) ? null : 'Email inválido'
    };
  }

  // Validar telefone
  validatePhone(phone) {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return { valid: false, error: 'Telefone deve ter 10 ou 11 dígitos' };
    }
    
    return { valid: true };
  }

  // Validar senha
  validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Senha deve ter pelo menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  // Validar formulário completo
  validateForm(formData) {
    const errors = {};
    
    // Validar CPF/CNPJ
    if (formData.documentType === 'cpf') {
      const cpfValidation = this.validateCPF(formData.document);
      if (!cpfValidation.valid) {
        errors.document = cpfValidation.error;
      }
    } else if (formData.documentType === 'cnpj') {
      const cnpjValidation = this.validateCNPJ(formData.document);
      if (!cnpjValidation.valid) {
        errors.document = cnpjValidation.error;
      }
    }
    
    // Validar email
    const emailValidation = this.validateEmail(formData.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error;
    }
    
    // Validar telefone
    const phoneValidation = this.validatePhone(formData.phone);
    if (!phoneValidation.valid) {
      errors.phone = phoneValidation.error;
    }
    
    // Validar senha
    if (formData.password) {
      const passwordValidation = this.validatePassword(formData.password);
      if (!passwordValidation.valid) {
        errors.password = passwordValidation.errors;
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  // Limpar cache
  clearCache() {
    this.cache.clear();
  }
}

const validationService = new ValidationService();
export default validationService;
