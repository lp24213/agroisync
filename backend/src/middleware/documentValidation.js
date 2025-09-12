import axios from 'axios';

// Função para validar CPF
export const validateCPF = cpf => {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  const digit1 = remainder < 2 ? 0 : remainder;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  const digit2 = remainder < 2 ? 0 : remainder;

  // Verifica se os dígitos verificadores estão corretos
  return parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2;
};

// Função para validar CNPJ
export const validateCNPJ = cnpj => {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return false;
  }

  // Validação do segundo dígito verificador
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return false;
  }

  return true;
};

// Função para validar documento (CPF ou CNPJ)
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
        message: 'CPF/CNPJ é obrigatório'
      });
    }

    // Primeiro, validar formato localmente
    if (!validateDocument(cpfCnpj)) {
      return res.status(400).json({
        success: false,
        message: 'CPF/CNPJ inválido'
      });
    }

    // Se estiver em ambiente de produção, validar na Receita Federal
    if (process.env.NODE_ENV === 'production') {
      try {
        // Aqui você pode integrar com a API da Receita Federal
        // Por enquanto, vamos simular uma validação
        const isValid = await validateWithReceitaFederal(cpfCnpj);

        if (!isValid) {
          return res.status(400).json({
            success: false,
            message: 'CPF/CNPJ não encontrado na Receita Federal'
          });
        }
      } catch (error) {
        console.warn('Erro ao validar na Receita Federal:', error.message);
        // Em caso de erro na API, continuar com validação local
      }
    }

    next();
  } catch (error) {
    console.error('Erro na validação da Receita Federal:', error);
    res.status(500).json({
      success: false,
      message: 'Erro na validação do documento'
    });
  }
};

// Função para validar com a Receita Federal (implementar conforme API disponível)
async function validateWithReceitaFederal(document) {
  try {
    // Aqui você implementaria a integração real com a API da Receita Federal
    // Por exemplo:
    // const response = await axios.get(`https://api.receita.fazenda.gov.br/consulta/${document}`);
    // return response.data.situacao === 'ATIVA';

    // Por enquanto, retorna true para simular validação bem-sucedida
    return true;
  } catch (error) {
    console.error('Erro na API da Receita Federal:', error);
    throw new Error('Erro na validação com a Receita Federal');
  }
}

// Middleware para validar endereço via API IBGE
export const validateAddressIBGE = async (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address || !address.zipCode) {
      return next(); // CEP é opcional para validação
    }

    const cep = address.zipCode.replace(/\D/g, '');

    if (cep.length !== 8) {
      return res.status(400).json({
        success: false,
        message: 'CEP inválido'
      });
    }

    try {
      // Consultar CEP via API IBGE ou ViaCEP
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (response.data.erro) {
        return res.status(400).json({
          success: false,
          message: 'CEP não encontrado'
        });
      }

      // Atualizar endereço com dados da API
      req.body.address = {
        ...address,
        street: response.data.logradouro || address.street,
        neighborhood: response.data.bairro || address.neighborhood,
        city: response.data.localidade || address.city,
        state: response.data.uf || address.state,
        zipCode: cep
      };
    } catch (error) {
      console.warn('Erro ao consultar CEP:', error.message);
      // Em caso de erro na API, continuar com dados fornecidos
    }

    next();
  } catch (error) {
    console.error('Erro na validação de endereço:', error);
    res.status(500).json({
      success: false,
      message: 'Erro na validação de endereço'
    });
  }
};

// Middleware para validar documentos obrigatórios
export const validateRequiredDocuments = (req, res, next) => {
  try {
    const { documents } = req.body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pelo menos um documento é obrigatório'
      });
    }

    // Validar se cada documento tem os campos obrigatórios
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
          message: 'Tipo de documento inválido'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Erro na validação de documentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro na validação de documentos'
    });
  }
};
