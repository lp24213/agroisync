import express from 'express';
import axios from 'axios';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting
router.use(apiLimiter);

// POST /api/validation/cpf - Validar CPF
router.post('/cpf', async (req, res) => {
  try {
    const { cpf } = req.body;

    if (!cpf) {
      return res.status(400).json({
        success: false,
        error: 'CPF é obrigatório'
      });
    }

    // Remove caracteres não numéricos
    const cleanCpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleanCpf.length !== 11) {
      return res.json({
        success: false,
        valid: false,
        error: 'CPF deve ter 11 dígitos'
      });
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      return res.json({
        success: false,
        valid: false,
        error: 'CPF inválido'
      });
    }
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder < 2 ? 0 : remainder;
    
    if (parseInt(cleanCpf.charAt(9)) !== digit1) {
      return res.json({
        success: false,
        valid: false,
        error: 'CPF inválido'
      });
    }
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder < 2 ? 0 : remainder;
    
    if (parseInt(cleanCpf.charAt(10)) !== digit2) {
      return res.json({
        success: false,
        valid: false,
        error: 'CPF inválido'
      });
    }

    res.json({
      success: true,
      valid: true,
      message: 'CPF válido'
    });
  } catch (error) {
    console.error('Erro ao validar CPF:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/validation/cnpj - Validar CNPJ
router.post('/cnpj', async (req, res) => {
  try {
    const { cnpj } = req.body;

    if (!cnpj) {
      return res.status(400).json({
        success: false,
        error: 'CNPJ é obrigatório'
      });
    }

    // Remove caracteres não numéricos
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    
    // Verifica se tem 14 dígitos
    if (cleanCnpj.length !== 14) {
      return res.json({
        success: false,
        valid: false,
        error: 'CNPJ deve ter 14 dígitos'
      });
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleanCnpj)) {
      return res.json({
        success: false,
        valid: false,
        error: 'CNPJ inválido'
      });
    }
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCnpj.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cleanCnpj.charAt(12)) !== digit1) {
      return res.json({
        success: false,
        valid: false,
        error: 'CNPJ inválido'
      });
    }
    
    // Validação do segundo dígito verificador
    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCnpj.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cleanCnpj.charAt(13)) !== digit2) {
      return res.json({
        success: false,
        valid: false,
        error: 'CNPJ inválido'
      });
    }

    // Buscar dados na Receita Federal
    try {
      const response = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cleanCnpj}`);
      const data = response.data;

      res.json({
        success: true,
        valid: true,
        message: 'CNPJ válido',
        data: {
          company: data.nome,
          fantasy: data.fantasia,
          address: data.logradouro,
          city: data.municipio,
          state: data.uf,
          zipCode: data.cep,
          phone: data.telefone,
          email: data.email,
          status: data.status
        }
      });
    } catch (apiError) {
      // Se a API da Receita falhar, retorna apenas validação básica
      res.json({
        success: true,
        valid: true,
        message: 'CNPJ válido (dados não disponíveis)'
      });
    }
  } catch (error) {
    console.error('Erro ao validar CNPJ:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/validation/cep - Buscar CEP
router.post('/cep', async (req, res) => {
  try {
    const { cep } = req.body;

    if (!cep) {
      return res.status(400).json({
        success: false,
        error: 'CEP é obrigatório'
      });
    }

    const cleanCep = cep.replace(/[^\d]/g, '');
    
    if (cleanCep.length !== 8) {
      return res.json({
        success: false,
        valid: false,
        error: 'CEP deve ter 8 dígitos'
      });
    }

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = response.data;

      if (data.erro) {
        return res.json({
          success: false,
          valid: false,
          error: 'CEP não encontrado'
        });
      }

      res.json({
        success: true,
        valid: true,
        data: {
          zipCode: data.cep,
          address: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          ibge: data.ibge,
          gia: data.gia,
          ddd: data.ddd,
          siafi: data.siafi
        }
      });
    } catch (apiError) {
      res.json({
        success: false,
        valid: false,
        error: 'Erro ao buscar CEP'
      });
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/validation/plate - Validar placa de veículo
router.post('/plate', async (req, res) => {
  try {
    const { plate } = req.body;

    if (!plate) {
      return res.status(400).json({
        success: false,
        error: 'Placa é obrigatória'
      });
    }

    const cleanPlate = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    // Validar formato antigo (ABC-1234) ou novo (ABC1D23)
    const oldFormat = /^[A-Z]{3}[0-9]{4}$/;
    const newFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    
    if (!oldFormat.test(cleanPlate) && !newFormat.test(cleanPlate)) {
      return res.json({
        success: false,
        valid: false,
        error: 'Formato de placa inválido'
      });
    }

    res.json({
      success: true,
      valid: true,
      message: 'Placa válida',
      data: {
        plate: cleanPlate,
        format: oldFormat.test(cleanPlate) ? 'antigo' : 'novo'
      }
    });
  } catch (error) {
    console.error('Erro ao validar placa:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/validation/phone - Validar telefone
router.post('/phone', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Telefone é obrigatório'
      });
    }

    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    // Validar formato brasileiro (10 ou 11 dígitos)
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return res.json({
        success: false,
        valid: false,
        error: 'Telefone deve ter 10 ou 11 dígitos'
      });
    }

    // Verificar se começa com DDD válido
    const ddd = cleanPhone.substring(0, 2);
    const validDdds = [
      '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
      '21', '22', '24', // RJ
      '27', '28', // ES
      '31', '32', '33', '34', '35', '37', '38', // MG
      '41', '42', '43', '44', '45', '46', // PR
      '47', '48', '49', // SC
      '51', '53', '54', '55', // RS
      '61', // DF
      '62', '64', // GO
      '63', // TO
      '65', '66', // MT
      '67', // MS
      '68', // AC
      '69', // RO
      '71', '73', '74', '75', '77', // BA
      '79', // SE
      '81', '87', // PE
      '82', // AL
      '83', // PB
      '84', // RN
      '85', '88', // CE
      '86', '89', // PI
      '91', '93', '94', // PA
      '92', '97', // AM
      '95', // RR
      '96', // AP
      '98', '99' // MA
    ];

    if (!validDdds.includes(ddd)) {
      return res.json({
        success: false,
        valid: false,
        error: 'DDD inválido'
      });
    }

    res.json({
      success: true,
      valid: true,
      message: 'Telefone válido',
      data: {
        phone: cleanPhone,
        ddd: ddd,
        type: cleanPhone.length === 11 ? 'celular' : 'fixo'
      }
    });
  } catch (error) {
    console.error('Erro ao validar telefone:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

export default router;