import { json } from 'itty-router-extras';

// Validação do Turnstile
export async function validateTurnstile(request, env) {
  try {
    const token = request.headers.get('cf-turnstile-token');
    
    // Verificar token do Turnstile se habilitado
    if (env.CF_TURNSTILE_ENABLED === 'true' && !request.url.includes('/health')) {
      if (!token) {
        return {
          success: false,
          error: 'Verificação de segurança necessária'
        };
      }

      const formData = new FormData();
      formData.append('secret', env.CF_TURNSTILE_SECRET_KEY);
      formData.append('response', token);
      formData.append('remoteip', request.headers.get('cf-connecting-ip'));

      const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData
      });

      const outcome = await result.json();
      if (!outcome.success) {
        return {
          success: false,
          error: 'Verificação de segurança falhou',
          details: outcome['error-codes']
        };
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Erro na validação do Turnstile',
      details: error.message
    };
  }
}

// Middleware de validação geral
export async function validateRequest(request, env) {
  try {
    // Validar Turnstile primeiro
    const turnstileCheck = await validateTurnstile(request, env);
    if (!turnstileCheck.success) {
      return json(turnstileCheck, { status: 400 });
    }

    // Obter corpo da requisição
    const body = await request.json();

    // Mapear validações por rota
    const validations = {
      '/api/auth/register': validateRegistration,
      '/api/auth/login': validateLogin,
      '/api/auth/recover': validateRecovery,
      '/api/auth/reset': validateReset,
      '/api/products': validateProduct,
      '/api/freights': validateFreight,
      '/api/messages': validateMessage
    };

    // Obter função de validação correta
    const validator = validations[new URL(request.url).pathname];
    if (!validator) {
      return null; // Sem validação específica para esta rota
    }

    // Executar validação
    const errors = await validator(body);
    if (errors.length > 0) {
      return json({
        success: false,
        errors
      }, { status: 400 });
    }

    return null; // Continua para o próximo handler

  } catch (error) {
    return json({
      success: false,
      error: 'Erro na validação',
      details: error.message
    }, { status: 400 });
  }
}

// Função auxiliar de validação
async function validateData(data, rules) {
  const errors = [];

  for (const [field, validations] of Object.entries(rules)) {
    const value = data[field];

    // Campos obrigatórios
    if (validations.required && !value) {
      errors.push(`${field} é obrigatório`);
      continue;
    }

    // Pular validações se campo opcional está vazio
    if (!validations.required && !value) {
      continue;
    }

    // Validar comprimento
    if (validations.minLength && value.length < validations.minLength) {
      errors.push(`${field} deve ter pelo menos ${validations.minLength} caracteres`);
    }
    if (validations.maxLength && value.length > validations.maxLength) {
      errors.push(`${field} deve ter no máximo ${validations.maxLength} caracteres`);
    }

    // Validar regex
    if (validations.pattern && !validations.pattern.test(value)) {
      errors.push(validations.message || `${field} inválido`);
    }

    // Validar enum
    if (validations.enum && !validations.enum.includes(value)) {
      errors.push(`${field} deve ser um dos seguintes valores: ${validations.enum.join(', ')}`);
    }

    // Validar número
    if (validations.min !== undefined && value < validations.min) {
      errors.push(`${field} deve ser maior ou igual a ${validations.min}`);
    }
    if (validations.max !== undefined && value > validations.max) {
      errors.push(`${field} deve ser menor ou igual a ${validations.max}`);
    }

    // Validação customizada
    if (validations.validate) {
      const error = validations.validate(value, data);
      if (error) errors.push(error);
    }
  }

  return errors;
}

// Regras de validação
const validationRules = {
  // Regras para registro
  registration: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
      message: 'Nome deve conter apenas letras e espaços'
    },
    email: {
      required: true,
      maxLength: 100,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email inválido'
    },
    password: {
      required: true,
      minLength: 8,
      maxLength: 128,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'
    },
    phone: {
      pattern: /^[+]?\d{6,16}$/,
      message: 'Telefone inválido'
    }
  },

  // Regras para login
  login: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email inválido'
    },
    password: {
      required: true,
      minLength: 8,
      message: 'Senha inválida'
    }
  },

  // Regras para recuperação de senha
  recovery: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email inválido'
    }
  },

  // Regras para reset de senha
  reset: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email inválido'
    },
    code: {
      required: true,
      pattern: /^\d{6}$/,
      message: 'Código de recuperação inválido'
    },
    newPassword: {
      required: true,
      minLength: 8,
      maxLength: 128,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Nova senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'
    }
  },

  // Regras para produtos
  product: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
      message: 'Título deve ter entre 3 e 100 caracteres'
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: 'Descrição deve ter entre 10 e 1000 caracteres'
    },
    category: {
      required: true,
      enum: ['grains', 'vegetables', 'fruits', 'livestock', 'machinery', 'fertilizers', 'seeds', 'tools', 'other'],
      message: 'Categoria inválida'
    },
    price: {
      required: true,
      min: 0,
      message: 'Preço deve ser um número positivo'
    },
    stock: {
      required: true,
      min: 1,
      message: 'Estoque deve ser um número inteiro positivo'
    },
    unit: {
      required: true,
      enum: ['kg', 'ton', 'un', 'l', 'm²', 'm³', 'outro'],
      message: 'Unidade inválida'
    }
  },

  // Regras para fretes
  freight: {
    title: {
      required: true,
      minLength: 5,
      maxLength: 100,
      message: 'Título deve ter entre 5 e 100 caracteres'
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: 'Descrição deve ter entre 10 e 1000 caracteres'
    },
    originCity: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Cidade de origem deve ter entre 2 e 100 caracteres'
    },
    originState: {
      required: true,
      minLength: 2,
      maxLength: 2,
      message: 'Estado de origem deve ter 2 caracteres'
    },
    destinationCity: {
      required: true,
      minLength: 2,
      maxLength: 100,
      message: 'Cidade de destino deve ter entre 2 e 100 caracteres'
    },
    destinationState: {
      required: true,
      minLength: 2,
      maxLength: 2,
      message: 'Estado de destino deve ter 2 caracteres'
    },
    cargoType: {
      required: true,
      enum: ['grains', 'vegetables', 'fruits', 'livestock', 'machinery', 'fertilizers', 'general'],
      message: 'Tipo de carga inválido'
    },
    price: {
      required: true,
      min: 0,
      message: 'Preço deve ser um número positivo'
    }
  },

  // Regras para mensagens
  message: {
    subject: {
      required: true,
      minLength: 5,
      maxLength: 200,
      message: 'Assunto deve ter entre 5 e 200 caracteres'
    },
    content: {
      required: true,
      minLength: 10,
      maxLength: 2000,
      message: 'Mensagem deve ter entre 10 e 2000 caracteres'
    },
    messageType: {
      enum: ['inquiry', 'offer', 'negotiation', 'freight_request', 'general'],
      message: 'Tipo de mensagem inválido'
    }
  }
};

// Funções de validação específicas
export async function validateRegistration(data) {
  return validateData(data, validationRules.registration);
}

export async function validateLogin(data) {
  return validateData(data, validationRules.login);
}

export async function validateRecovery(data) {
  return validateData(data, validationRules.recovery);
}

export async function validateReset(data) {
  return validateData(data, validationRules.reset);
}

export async function validateProduct(data) {
  return validateData(data, validationRules.product);
}

export async function validateFreight(data) {
  return validateData(data, validationRules.freight);
}

export async function validateMessage(data) {
  return validateData(data, validationRules.message);
}