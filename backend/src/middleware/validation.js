import { body, validationResult } from 'express-validator';

// Validation middleware for registration
export const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido')
    .isLength({ max: 100 })
    .withMessage('Email muito longo'),

  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Senha deve ter entre 8 e 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
    ),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Telefone inválido'),

  body('company.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome da empresa deve ter entre 2 e 100 caracteres'),

  body('company.cnpj')
    .optional()
    .trim()
    .matches(/^\d{14}$/)
    .withMessage('CNPJ deve ter 14 dígitos'),

  body('company.address.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Endereço deve ter entre 5 e 200 caracteres'),

  body('company.address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres'),

  body('company.address.state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter 2 caracteres'),

  body('company.address.zipCode')
    .optional()
    .trim()
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP deve ter formato 00000-000'),

  body('userType')
    .optional()
    .isIn(['buyer', 'seller', 'freight'])
    .withMessage('Tipo de usuário inválido'),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados de entrada inválidos',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }
    next();
  }
];

// Validation middleware for login
export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),

  body('password').notEmpty().withMessage('Senha é obrigatória'),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados de entrada inválidos',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }
    next();
  }
];

// Validation middleware for password change
export const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),

  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('Nova senha deve ter entre 8 e 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'Nova senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
    ),

  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Confirmação de senha não confere');
    }
    return true;
  }),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados de entrada inválidos',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }
    next();
  }
];

// Validation middleware for product creation
export const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome do produto deve ter entre 3 e 100 caracteres'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Descrição deve ter entre 10 e 1000 caracteres'),

  body('category')
    .isIn([
      'grains',
      'vegetables',
      'fruits',
      'livestock',
      'machinery',
      'fertilizers',
      'seeds',
      'tools',
      'other'
    ])
    .withMessage('Categoria inválida'),

  body('price').isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),

  body('quantity.available')
    .isInt({ min: 1 })
    .withMessage('Quantidade disponível deve ser um número inteiro positivo'),

  body('location.city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres'),

  body('location.state')
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter 2 caracteres'),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados do produto inválidos',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }
    next();
  }
];

// Validation middleware for freight creation
export const validateFreight = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Título deve ter entre 5 e 100 caracteres'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Descrição deve ter entre 10 e 1000 caracteres'),

  body('origin.city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade de origem deve ter entre 2 e 100 caracteres'),

  body('origin.state')
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado de origem deve ter 2 caracteres'),

  body('destination.city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade de destino deve ter entre 2 e 100 caracteres'),

  body('destination.state')
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado de destino deve ter 2 caracteres'),

  body('cargoType')
    .isIn(['grains', 'vegetables', 'fruits', 'livestock', 'machinery', 'fertilizers', 'general'])
    .withMessage('Tipo de carga inválido'),

  body('weight.min').isFloat({ min: 0 }).withMessage('Peso mínimo deve ser um número positivo'),

  body('weight.max')
    .isFloat({ min: 0 })
    .custom((value, { req }) => {
      if (value <= req.body.weight.min) {
        throw new Error('Peso máximo deve ser maior que o peso mínimo');
      }
      return true;
    }),

  body('price').isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),

  body('availableFrom').isISO8601().withMessage('Data de disponibilidade inicial inválida'),

  body('availableUntil')
    .isISO8601()
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.availableFrom)) {
        throw new Error('Data de disponibilidade final deve ser posterior à data inicial');
      }
      return true;
    }),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados do frete inválidos',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }
    next();
  }
];

// Validation middleware for message creation
export const validateMessage = [
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Assunto deve ter entre 5 e 200 caracteres'),

  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Mensagem deve ter entre 10 e 2000 caracteres'),

  body('receiverId').isMongoId().withMessage('ID do destinatário inválido'),

  body('messageType')
    .optional()
    .isIn(['inquiry', 'offer', 'negotiation', 'freight_request', 'general'])
    .withMessage('Tipo de mensagem inválido'),

  // Check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados da mensagem inválidos',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }
    next();
  }
];

// Generic validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados de entrada inválidos',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};
