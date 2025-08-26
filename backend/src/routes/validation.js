const express = require('express');
const router = express.Router();
const axios = require('axios');
const rateLimit = require('express-rate-limit');

// Rate limiting para evitar abuso das APIs externas
const validationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: 'Muitas requisições de validação. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware para aplicar rate limiting em todas as rotas
router.use(validationLimiter);

// Validação de CPF via ReceitaWS (simulada)
router.post('/cpf', async (req, res) => {
  try {
    const { cpf } = req.body;
    
    if (!cpf) {
      return res.status(400).json({ 
        success: false, 
        error: 'CPF é obrigatório' 
      });
    }

    // Limpar CPF (remover pontos e traços)
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) {
      return res.status(400).json({ 
        success: false, 
        error: 'CPF deve ter 11 dígitos' 
      });
    }

    // Validação básica de CPF
    if (!isValidCPF(cleanCpf)) {
      return res.status(400).json({ 
        success: false, 
        error: 'CPF inválido' 
      });
    }

    // Simular consulta à ReceitaWS
    // Em produção, usar: https://receita.fazenda.df.gov.br/servicos/cnpj/
    const mockReceitaResponse = {
      cpf: cleanCpf,
      nome: 'Nome do Titular',
      dataNascimento: '1980-01-01',
      situacao: 'REGULAR',
      dataConsulta: new Date().toISOString(),
      origem: 'ReceitaWS'
    };

    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 500));

    res.json({
      success: true,
      valid: true,
      data: mockReceitaResponse,
      message: 'CPF válido e regular'
    });

  } catch (error) {
    console.error('Erro na validação de CPF:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Validação de CNPJ via ReceitaWS (simulada)
router.post('/cnpj', async (req, res) => {
  try {
    const { cnpj } = req.body;
    
    if (!cnpj) {
      return res.status(400).json({ 
        success: false, 
        error: 'CNPJ é obrigatório' 
      });
    }

    // Limpar CNPJ (remover pontos, traços e barras)
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) {
      return res.status(400).json({ 
        success: false, 
        error: 'CNPJ deve ter 14 dígitos' 
      });
    }

    // Validação básica de CNPJ
    if (!isValidCNPJ(cleanCnpj)) {
      return res.status(400).json({ 
        success: false, 
        error: 'CNPJ inválido' 
      });
    }

    // Simular consulta à ReceitaWS
    const mockReceitaResponse = {
      cnpj: cleanCnpj,
      razaoSocial: 'Empresa Exemplo LTDA',
      nomeFantasia: 'Empresa Exemplo',
      dataAbertura: '2010-01-01',
      situacao: 'ATIVA',
      tipo: 'MATRIZ',
      porte: 'MEDIO PORTE',
      naturezaJuridica: '206-2 - LTDA',
      dataConsulta: new Date().toISOString(),
      origem: 'ReceitaWS'
    };

    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json({
      success: true,
      valid: true,
      data: mockReceitaResponse,
      message: 'CNPJ válido e ativo'
    });

  } catch (error) {
    console.error('Erro na validação de CNPJ:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Validação de CEP via IBGE + fallback ViaCEP
router.post('/cep', async (req, res) => {
  try {
    const { cep } = req.body;
    
    if (!cep) {
      return res.status(400).json({ 
        success: false, 
        error: 'CEP é obrigatório' 
      });
    }

    // Limpar CEP (remover traços)
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return res.status(400).json({ 
        success: false, 
        error: 'CEP deve ter 8 dígitos' 
      });
    }

    let addressData = null;
    let source = '';

    try {
      // Primeiro tentar IBGE API
      const ibgeResponse = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/cep/${cleanCep}`, {
        timeout: 5000
      });

      if (ibgeResponse.data && ibgeResponse.data.length > 0) {
        const ibgeData = ibgeResponse.data[0];
        addressData = {
          cep: cleanCep,
          logradouro: ibgeData.logradouro || '',
          bairro: ibgeData.bairro || '',
          cidade: ibgeData.localidade || '',
          uf: ibgeData.uf || '',
          estado: ibgeData.estado || '',
          ibge: ibgeData.id || '',
          ddd: ibgeData.ddd || '',
          source: 'IBGE'
        };
        source = 'IBGE';
      }
    } catch (ibgeError) {
      console.log('IBGE API falhou, tentando ViaCEP...');
    }

    // Fallback para ViaCEP se IBGE falhar
    if (!addressData) {
      try {
        const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`, {
          timeout: 5000
        });

        if (viaCepResponse.data && !viaCepResponse.data.erro) {
          const viaCepData = viaCepResponse.data;
          addressData = {
            cep: viaCepData.cep,
            logradouro: viaCepData.logradouro || '',
            bairro: viaCepData.bairro || '',
            cidade: viaCepData.localidade || '',
            uf: viaCepData.uf || '',
            estado: viaCepData.uf || '',
            ibge: viaCepData.ibge || '',
            ddd: viaCepData.ddd || '',
            source: 'ViaCEP'
          };
          source = 'ViaCEP';
        }
      } catch (viaCepError) {
        console.log('ViaCEP também falhou');
      }
    }

    if (!addressData) {
      return res.status(404).json({ 
        success: false, 
        error: 'CEP não encontrado' 
      });
    }

    res.json({
      success: true,
      valid: true,
      address: addressData,
      source: source,
      message: `CEP válido - ${addressData.cidade}/${addressData.uf}`
    });

  } catch (error) {
    console.error('Erro na validação de CEP:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Validação de IE (Inscrição Estadual) via Sefaz (simulada)
router.post('/ie', async (req, res) => {
  try {
    const { ie, state } = req.body;
    
    if (!ie || !state) {
      return res.status(400).json({ 
        success: false, 
        error: 'IE e estado são obrigatórios' 
      });
    }

    // Limpar IE (remover pontos e traços)
    const cleanIE = ie.replace(/\D/g, '');
    
    if (cleanIE.length < 8 || cleanIE.length > 12) {
      return res.status(400).json({ 
        success: false, 
        error: 'IE deve ter entre 8 e 12 dígitos' 
      });
    }

    // Simular consulta à Sefaz
    // Em produção, usar APIs específicas de cada estado
    const mockSefazResponse = {
      ie: cleanIE,
      estado: state,
      razaoSocial: 'Empresa Exemplo LTDA',
      cnpj: '12345678000199',
      situacao: 'ATIVA',
      dataEmissao: '2010-01-01',
      dataVencimento: '2025-12-31',
      tipo: 'CONTRIBUINTE',
      regime: 'SIMPLES NACIONAL',
      dataConsulta: new Date().toISOString(),
      origem: 'Sefaz'
    };

    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 600));

    res.json({
      success: true,
      valid: true,
      data: mockSefazResponse,
      message: 'IE válida e ativa'
    });

  } catch (error) {
    console.error('Erro na validação de IE:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Funções auxiliares de validação
function isValidCPF(cpf) {
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validar primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  // Validar segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

function isValidCNPJ(cnpj) {
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  // Validar primeiro dígito verificador
  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cnpj.charAt(12))) return false;
  
  // Validar segundo dígito verificador
  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cnpj.charAt(13))) return false;
  
  return true;
}

module.exports = router;
