// import axios from 'axios';

// Configuração da API
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Tipos de documento
export const DOCUMENT_TYPES = {
  CPF: {
    name: 'CPF',
    mask: '000.000.000-00',
    length: 11,
    description: 'Cadastro de Pessoa Física'
  },
  CNPJ: {
    name: 'CNPJ',
    mask: '00.000.000/0000-00',
    length: 14,
    description: 'Cadastro Nacional da Pessoa Jurídica'
  },
  IE: {
    name: 'IE',
    mask: '000.000.000.000',
    length: 12,
    description: 'Inscrição Estadual'
  }
};

// Status de validação
export const VALIDATION_STATUS = {
  VALID: {
    name: 'Válido',
    color: 'bg-green-100 text-green-800',
    description: 'Documento validado com sucesso'
  },
  INVALID: {
    name: 'Inválido',
    color: 'bg-red-100 text-red-800',
    description: 'Documento não foi validado'
  },
  PENDING: {
    name: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Validação em andamento'
  },
  ERROR: {
    name: 'Erro',
    color: 'bg-red-100 text-red-800',
    description: 'Erro na validação'
  }
};

// Estados brasileiros para validação de IE
export const BRAZILIAN_STATES = {
  AC: { name: 'Acre', ieFormat: '01.000.000-1' },
  AL: { name: 'Alagoas', ieFormat: '24.000.000-0' },
  AP: { name: 'Amapá', ieFormat: '03.000.000-0' },
  AM: { name: 'Amazonas', ieFormat: '07.000.000-0' },
  BA: { name: 'Bahia', ieFormat: '06.000.000-0' },
  CE: { name: 'Ceará', ieFormat: '07.000.000-0' },
  DF: { name: 'Distrito Federal', ieFormat: '07.000.000-0' },
  ES: { name: 'Espírito Santo', ieFormat: '08.000.000-0' },
  GO: { name: 'Goiás', ieFormat: '10.000.000-0' },
  MA: { name: 'Maranhão', ieFormat: '12.000.000-0' },
  MT: { name: 'Mato Grosso', ieFormat: '13.000.000-0' },
  MS: { name: 'Mato Grosso do Sul', ieFormat: '28.000.000-0' },
  MG: { name: 'Minas Gerais', ieFormat: '06.000.000-0' },
  PA: { name: 'Pará', ieFormat: '15.000.000-0' },
  PB: { name: 'Paraíba', ieFormat: '16.000.000-0' },
  PR: { name: 'Paraná', ieFormat: '20.000.000-0' },
  PE: { name: 'Pernambuco', ieFormat: '18.000.000-0' },
  PI: { name: 'Piauí', ieFormat: '19.000.000-0' },
  RJ: { name: 'Rio de Janeiro', ieFormat: '20.000.000-0' },
  RN: { name: 'Rio Grande do Norte', ieFormat: '20.000.000-0' },
  RS: { name: 'Rio Grande do Sul', ieFormat: '22.000.000-0' },
  RO: { name: 'Rondônia', ieFormat: '21.000.000-0' },
  RR: { name: 'Roraima', ieFormat: '24.000.000-0' },
  SC: { name: 'Santa Catarina', ieFormat: '25.000.000-0' },
  SP: { name: 'São Paulo', ieFormat: '11.000.000-0' },
  SE: { name: 'Sergipe', ieFormat: '27.000.000-0' },
  TO: { name: 'Tocantins', ieFormat: '29.000.000-0' }
};

class ReceitaService {
  constructor() {
    this.isInitialized = false;
    this.validationCache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas
  }

  // Inicializar o serviço
  async initialize() {
    try {
      this.isInitialized = true;
      console.log('Serviço da Receita Federal inicializado');
      return { success: true };
    } catch (error) {
      console.error('Erro ao inicializar serviço da Receita Federal:', error);
      return { success: false, error: error.message };
    }
  }

  // Validar CPF
  async validateCPF(cpf) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Limpar CPF (remover pontos e traços)
      const cleanCPF = cpf.replace(/\D/g, '');

      // Verificar formato básico
      if (cleanCPF.length !== 11) {
        return {
          valid: false,
          status: 'INVALID',
          error: 'CPF deve ter 11 dígitos',
          document: cleanCPF,
          type: 'CPF'
        };
      }

      // Verificar se todos os dígitos são iguais
      if (/^(\d)\1{10}$/.test(cleanCPF)) {
        return {
          valid: false,
          status: 'INVALID',
          error: 'CPF não pode ter todos os dígitos iguais',
          document: cleanCPF,
          type: 'CPF'
        };
      }

      // Verificar cache
      const cacheKey = `CPF_${cleanCPF}`;
      const cachedResult = this.getFromCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Em produção, usar API real da Receita Federal
      // const response = await axios.post(`${API_BASE_URL}/receita/validate-cpf`, {
      //   cpf: cleanCPF
      // });

      // Simular validação para desenvolvimento
      const mockValidation = await this.mockCPFValidation(cleanCPF);

      // Salvar no cache
      this.saveToCache(cacheKey, mockValidation);

      return mockValidation;
    } catch (error) {
      console.error('Erro na validação de CPF:', error);
      return {
        valid: false,
        status: 'ERROR',
        error: 'Erro na validação',
        document: cpf,
        type: 'CPF',
        details: error.message
      };
    }
  }

  // Validar CNPJ
  async validateCNPJ(cnpj) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Limpar CNPJ (remover pontos, traços e barras)
      const cleanCNPJ = cnpj.replace(/\D/g, '');

      // Verificar formato básico
      if (cleanCNPJ.length !== 14) {
        return {
          valid: false,
          status: 'INVALID',
          error: 'CNPJ deve ter 14 dígitos',
          document: cleanCNPJ,
          type: 'CNPJ'
        };
      }

      // Verificar se todos os dígitos são iguais
      if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
        return {
          valid: false,
          status: 'INVALID',
          error: 'CNPJ não pode ter todos os dígitos iguais',
          document: cleanCNPJ,
          type: 'CNPJ'
        };
      }

      // Verificar cache
      const cacheKey = `CNPJ_${cleanCNPJ}`;
      const cachedResult = this.getFromCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Em produção, usar API real da Receita Federal
      // const response = await axios.post(`${API_BASE_URL}/receita/validate-cnpj`, {
      //   cnpj: cleanCNPJ
      // });

      // Simular validação para desenvolvimento
      const mockValidation = await this.mockCNPJValidation(cleanCNPJ);

      // Salvar no cache
      this.saveToCache(cacheKey, mockValidation);

      return mockValidation;
    } catch (error) {
      console.error('Erro na validação de CNPJ:', error);
      return {
        valid: false,
        status: 'ERROR',
        error: 'Erro na validação',
        document: cnpj,
        type: 'CNPJ',
        details: error.message
      };
    }
  }

  // Validar Inscrição Estadual
  async validateIE(ie, state) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Limpar IE (remover pontos e traços)
      const cleanIE = ie.replace(/\D/g, '');

      // Verificar se o estado foi informado
      if (!state || !BRAZILIAN_STATES[state.toUpperCase()]) {
        return {
          valid: false,
          status: 'INVALID',
          error: 'Estado inválido ou não informado',
          document: cleanIE,
          type: 'IE',
          state: state
        };
      }

      // Verificar formato básico
      const stateInfo = BRAZILIAN_STATES[state.toUpperCase()];
      if (cleanIE.length < 8 || cleanIE.length > 12) {
        return {
          valid: false,
          status: 'INVALID',
          error: `IE deve ter entre 8 e 12 dígitos para ${stateInfo.name}`,
          document: cleanIE,
          type: 'IE',
          state: state.toUpperCase()
        };
      }

      // Verificar cache
      const cacheKey = `IE_${cleanIE}_${state.toUpperCase()}`;
      const cachedResult = this.getFromCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Em produção, usar API real da Receita Federal
      // const response = await axios.post(`${API_BASE_URL}/receita/validate-ie`, {
      //   ie: cleanIE,
      //   state: state.toUpperCase()
      // });

      // Simular validação para desenvolvimento
      const mockValidation = await this.mockIEValidation(cleanIE, state.toUpperCase());

      // Salvar no cache
      this.saveToCache(cacheKey, mockValidation);

      return mockValidation;
    } catch (error) {
      console.error('Erro na validação de IE:', error);
      return {
        valid: false,
        status: 'ERROR',
        error: 'Erro na validação',
        document: ie,
        type: 'IE',
        state: state,
        details: error.message
      };
    }
  }

  // Validar múltiplos documentos
  async validateDocuments(documents) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const results = {};
      const promises = [];

      // Validar CPF se fornecido
      if (documents.cpf) {
        promises.push(
          this.validateCPF(documents.cpf).then(result => {
            results.cpf = result;
          })
        );
      }

      // Validar CNPJ se fornecido
      if (documents.cnpj) {
        promises.push(
          this.validateCNPJ(documents.cnpj).then(result => {
            results.cnpj = result;
          })
        );
      }

      // Validar IE se fornecido
      if (documents.ie && documents.state) {
        promises.push(
          this.validateIE(documents.ie, documents.state).then(result => {
            results.ie = result;
          })
        );
      }

      // Aguardar todas as validações
      await Promise.all(promises);

      // Verificar se todos os documentos são válidos
      const allValid = Object.values(results).every(result => result.valid);

      return {
        valid: allValid,
        status: allValid ? 'VALID' : 'INVALID',
        results,
        summary: {
          total: Object.keys(results).length,
          valid: Object.values(results).filter(r => r.valid).length,
          invalid: Object.values(results).filter(r => !r.valid).length
        }
      };
    } catch (error) {
      console.error('Erro na validação de documentos:', error);
      return {
        valid: false,
        status: 'ERROR',
        error: 'Erro na validação de documentos',
        details: error.message
      };
    }
  }

  // Obter informações de uma empresa pelo CNPJ
  async getCompanyInfo(cnpj) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Primeiro validar o CNPJ
      const validation = await this.validateCNPJ(cnpj);
      if (!validation.valid) {
        return {
          success: false,
          error: 'CNPJ inválido',
          validation
        };
      }

      // Verificar cache
      const cacheKey = `COMPANY_${cnpj}`;
      const cachedResult = this.getFromCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Em produção, usar API real da Receita Federal
      // const response = await axios.get(`${API_BASE_URL}/receita/company/${cnpj}`);

      // Simular informações da empresa para desenvolvimento
      const mockCompanyInfo = await this.mockCompanyInfo(cnpj);

      // Salvar no cache
      this.saveToCache(cacheKey, mockCompanyInfo);

      return mockCompanyInfo;
    } catch (error) {
      console.error('Erro ao obter informações da empresa:', error);
      throw error;
    }
  }

  // Obter informações de uma pessoa pelo CPF
  async getPersonInfo(cpf) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Primeiro validar o CPF
      const validation = await this.validateCPF(cpf);
      if (!validation.valid) {
        return {
          success: false,
          error: 'CPF inválido',
          validation
        };
      }

      // Verificar cache
      const cacheKey = `PERSON_${cpf}`;
      const cachedResult = this.getFromCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Em produção, usar API real da Receita Federal
      // const response = await axios.get(`${API_BASE_URL}/receita/person/${cpf}`);

      // Simular informações da pessoa para desenvolvimento
      const mockPersonInfo = await this.mockPersonInfo(cpf);

      // Salvar no cache
      this.saveToCache(cacheKey, mockPersonInfo);

      return mockPersonInfo;
    } catch (error) {
      console.error('Erro ao obter informações da pessoa:', error);
      throw error;
    }
  }

  // Verificar situação cadastral
  async checkCadastralStatus(document, type) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      let validation;
      if (type === 'CPF') {
        validation = await this.validateCPF(document);
      } else if (type === 'CNPJ') {
        validation = await this.validateCNPJ(document);
      } else {
        throw new Error('Tipo de documento inválido');
      }

      if (!validation.valid) {
        return {
          success: false,
          error: 'Documento inválido',
          validation
        };
      }

      // Em produção, usar API real da Receita Federal
      // const response = await axios.get(`${API_BASE_URL}/receita/cadastral-status/${document}`);

      // Simular verificação de situação cadastral para desenvolvimento
      const mockCadastralStatus = await this.mockCadastralStatus(document, type);

      return mockCadastralStatus;
    } catch (error) {
      console.error('Erro ao verificar situação cadastral:', error);
      throw error;
    }
  }

  // Métodos auxiliares de cache
  getFromCache(key) {
    const cached = this.validationCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  saveToCache(key, data) {
    this.validationCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.validationCache.clear();
    console.log('Cache de validação limpo');
  }

  // Métodos mockados para desenvolvimento
  async mockCPFValidation(cpf) {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simular CPFs válidos (apenas para demonstração)
    const validCPFs = ['12345678909', '98765432100', '11144477735', '12345678901', '98765432109'];

    const isValid = validCPFs.includes(cpf);

    if (isValid) {
      return {
        valid: true,
        status: 'VALID',
        document: cpf,
        type: 'CPF',
        validatedAt: new Date().toISOString(),
        source: 'Receita Federal (Mock)',
        details: {
          situation: 'REGULAR',
          lastUpdate: new Date().toISOString()
        }
      };
    } else {
      return {
        valid: false,
        status: 'INVALID',
        error: 'CPF não encontrado na base da Receita Federal',
        document: cpf,
        type: 'CPF',
        validatedAt: new Date().toISOString(),
        source: 'Receita Federal (Mock)'
      };
    }
  }

  async mockCNPJValidation(cnpj) {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simular CNPJs válidos (apenas para demonstração)
    const validCNPJs = ['12345678000195', '98765432000100', '11111111000101', '22222222000102', '33333333000103'];

    const isValid = validCNPJs.includes(cnpj);

    if (isValid) {
      return {
        valid: true,
        status: 'VALID',
        document: cnpj,
        type: 'CNPJ',
        validatedAt: new Date().toISOString(),
        source: 'Receita Federal (Mock)',
        details: {
          situation: 'ATIVA',
          lastUpdate: new Date().toISOString(),
          companyType: 'LTDA'
        }
      };
    } else {
      return {
        valid: false,
        status: 'INVALID',
        error: 'CNPJ não encontrado na base da Receita Federal',
        document: cnpj,
        type: 'CNPJ',
        validatedAt: new Date().toISOString(),
        source: 'Receita Federal (Mock)'
      };
    }
  }

  async mockIEValidation(ie, state) {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 600));

    // Simular IEs válidas (apenas para demonstração)
    const validIEs = ['123456789', '987654321', '111222333', '444555666', '777888999'];

    const isValid = validIEs.includes(ie);

    if (isValid) {
      return {
        valid: true,
        status: 'VALID',
        document: ie,
        type: 'IE',
        state: state,
        validatedAt: new Date().toISOString(),
        source: 'Receita Federal (Mock)',
        details: {
          situation: 'ATIVA',
          lastUpdate: new Date().toISOString()
        }
      };
    } else {
      return {
        valid: false,
        status: 'INVALID',
        error: 'IE não encontrada na base da Receita Federal',
        document: ie,
        type: 'IE',
        state: state,
        validatedAt: new Date().toISOString(),
        source: 'Receita Federal (Mock)'
      };
    }
  }

  async mockCompanyInfo(cnpj) {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const companyNames = [
      'Empresa AgroSync Ltda',
      'Fazenda Modelo S/A',
      'Cooperativa Agrícola',
      'Distribuidora de Grãos',
      'Produtora Rural Ltda'
    ];

    const randomName = companyNames[Math.floor(Math.random() * companyNames.length)];

    return {
      success: true,
      cnpj,
      companyInfo: {
        name: randomName,
        tradeName: randomName,
        situation: 'ATIVA',
        openingDate: '2020-01-01',
        companyType: 'LTDA',
        legalNature: '213-5 - Empresário Individual',
        capital: 'R$ 100.000,00',
        address: {
          street: 'Rua das Empresas, 123',
          neighborhood: 'Centro Empresarial',
          city: 'São Paulo',
          state: 'SP',
          cep: '01310-100'
        },
        contact: {
          phone: '(11) 3000-0000',
          email: 'contato@empresa.com.br',
          website: 'www.empresa.com.br'
        },
        activities: [
          '01.41-3-00 - Cultivo de milho',
          '01.43-0-00 - Cultivo de soja',
          '46.31-0-00 - Comércio atacadista de produtos agrícolas'
        ]
      },
      lastUpdate: new Date().toISOString(),
      source: 'Receita Federal (Mock)'
    };
  }

  async mockPersonInfo(cpf) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const names = [
      'João Silva Santos',
      'Maria Oliveira Costa',
      'Pedro Almeida Lima',
      'Ana Pereira Rodrigues',
      'Carlos Ferreira Souza'
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];

    return {
      success: true,
      cpf,
      personInfo: {
        name: randomName,
        situation: 'REGULAR',
        birthDate: '1985-06-15',
        nationality: 'Brasileira',
        maritalStatus: 'Casado(a)',
        address: {
          street: 'Rua das Pessoas, 456',
          neighborhood: 'Bairro Residencial',
          city: 'São Paulo',
          state: 'SP',
          cep: '01310-100'
        },
        documents: {
          rg: '12.345.678-9',
          rgIssuer: 'SSP/SP',
          rgIssueDate: '2010-01-01'
        }
      },
      lastUpdate: new Date().toISOString(),
      source: 'Receita Federal (Mock)'
    };
  }

  async mockCadastralStatus(document, type) {
    await new Promise(resolve => setTimeout(resolve, 900));

    const situations = type === 'CPF' ? ['REGULAR', 'PENDENTE', 'SUSPENSO'] : ['ATIVA', 'SUSPENSA', 'BAIXADA'];
    const randomSituation = situations[Math.floor(Math.random() * situations.length)];

    return {
      success: true,
      document,
      type,
      cadastralStatus: {
        situation: randomSituation,
        lastUpdate: new Date().toISOString(),
        observations:
          randomSituation === 'REGULAR' || randomSituation === 'ATIVA'
            ? 'Situação cadastral regular'
            : 'Verificar pendências na Receita Federal',
        nextValidation: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
      },
      source: 'Receita Federal (Mock)'
    };
  }

  // Desconectar serviço
  disconnect() {
    try {
      this.isInitialized = false;
      this.clearCache();
      if (process.env.NODE_ENV !== 'production') {
        console.log('Serviço da Receita Federal desconectado');
      }
      return { success: true };
    } catch (error) {
      console.error('Erro ao desconectar serviço da Receita Federal:', error);
      return { success: false, error: error.message };
    }
  }
}

const receitaService = new ReceitaService();
export default receitaService;
