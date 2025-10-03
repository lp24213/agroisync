import axios from 'axios';
import logger from '../utils/logger.js';

// FunÃ§Ã£o para validar CPF
export const validateCPF = cpf => {
  // Remove caracteres nÃ£o numÃ©ricos
  cpf = cpf.replace(/[^\d]/g, '');

  // Verifica se tem 11 dÃ­gitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dÃ­gitos sÃ£o iguais
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // ValidaÃ§Ã£o do primeiro dÃ­gito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i, 10), 10) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  const digit1 = remainder < 2 ? 0 : remainder;

  // ValidaÃ§Ã£o do segundo dÃ­gito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i, 10), 10) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  const digit2 = remainder < 2 ? 0 : remainder;

  // Verifica se os dÃ­gitos verificadores estÃ£o corretos
  return parseInt(cpf.charAt(9, 10), 10) === digit1 && parseInt(cpf.charAt(10, 10), 10) === digit2;
};

// FunÃ§Ã£o para validar CNPJ
export const validateCNPJ = cnpj => {
  // Remove caracteres nÃ£o numÃ©ricos
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Verifica se tem 14 dÃ­gitos
  if (cnpj.length !== 14) {
    return false;
  }

  // Verifica se todos os dÃ­gitos sÃ£o iguais
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // ValidaÃ§Ã£o do primeiro dÃ­gito verificador
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i, 10), 10) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0, 10), 10)) {
    return false;
  }

  // ValidaÃ§Ã£o do segundo dÃ­gito verificador
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i, 10), 10) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1, 10), 10)) {
    return false;
  }

  return true;
};

// FunÃ§Ã£o para validar documento (CPF ou CNPJ)
export const validateDocument = document => {
  const cleanDoc = document.replace(/[^\d]/g, '');

  if (cleanDoc.length === 11) {
    return validateCPF(cleanDoc);
  } else if (cleanDoc.length === 14) {
    return validateCNPJ(cleanDoc);
  }

  return false;
};

// Middleware para validar CPF/CNPJ na Receita Federal
export const validateReceitaFederal = async (req, res, next) => {
  try {
    const { cpfCnpj } = req.body;

    if (!cpfCnpj) {
      return res.status(400).json({
        success: false,
        message: 'CPF/CNPJ Ã© obrigatÃ³rio'
      });
    }

    // Primeiro, validar formato localmente
    if (!validateDocument(cpfCnpj)) {
      return res.status(400).json({
        success: false,
        message: 'CPF/CNPJ invÃ¡lido'
      });
    }

    // Se estiver em ambiente de produÃ§Ã£o, validar na Receita Federal
    if (process.env.NODE_ENV === 'production') {
      try {
        // Aqui vocÃª pode integrar com a API da Receita Federal
        // Por enquanto, vamos simular uma validaÃ§Ã£o
        const isValid = await validateWithReceitaFederal(cpfCnpj);

        if (!isValid) {
          return res.status(400).json({
            success: false,
            message: 'CPF/CNPJ nÃ£o encontrado na Receita Federal'
          });
        }
      } catch (error) {
        logger.warn('Erro ao validar na Receita Federal:', error.message);
      }
    }

    return next();
  } catch (error) {
    logger.error('Erro na validação da Receita Federal:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro na validação do documento'
    });
  }
};

// Função para validar com a Receita Federal (implementar conforme API disponível)
// eslint-disable-next-line require-await
function validateWithReceitaFederal(_document) {
  // Stub: implementar integração real quando a API estiver disponível.
  // Mantemos função para permitir await no chamador.
  return true;
}

// Middleware para validar endereÃ§o via API IBGE
export const validateAddressIBGE = (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address || !address.zipCode) {
      return next(); // CEP é opcional para validação
    }

    const cep = address.zipCode.replace(/\D/g, '');

    if (cep.length !== 8) {
      return res.status(400).json({
        success: false,
        message: 'CEP invÃ¡lido'
      });
    }

    try {
      // Consultar CEP via API IBGE ou ViaCEP
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (response.data.erro) {
        return res.status(400).json({
          success: false,
          message: 'CEP nÃ£o encontrado'
        });
      }

      // Atualizar endereÃ§o com dados da API
      req.body.address = {
        ...address,
        street: response.data.logradouro || address.street,
        neighborhood: response.data.bairro || address.neighborhood,
        city: response.data.localidade || address.city,
        state: response.data.uf || address.state,
        zipCode: cep
      };
    } catch (error) {
      logger.warn('Erro ao consultar CEP:', error.message);
      // Em caso de erro na API, continuar com dados fornecidos
    }

    return next();
  } catch (error) {
    logger.error('Erro na validação de endereço:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro na validação de endereço'
    });
  }
};

// Middleware para validar documentos obrigatÃ³rios
export const validateRequiredDocuments = (req, res, next) => {
  try {
    const { documents } = req.body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pelo menos um documento Ã© obrigatÃ³rio'
      });
    }

    // Validar se cada documento tem os campos obrigatÃ³rios
    for (const doc of documents) {
      if (!doc.type || !doc.filename || !doc.url) {
        return res.status(400).json({
          success: false,
          message: 'Todos os documentos devem ter tipo, nome do arquivo e URL'
        });
      }

      // Validar tipo de documento
      const validTypes = ['cpf', 'cnpj', 'ie', 'address_proof', 'identity', 'other'];
      if (!validTypes.includes(doc.type)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de documento invÃ¡lido'
        });
      }
    }

    return next();
  } catch (error) {
    logger.error('Erro na validação de documentos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro na validação de documentos'
    });
  }
};
