/**
 * Swagger/OpenAPI Configuration
 * Documentação automática das APIs
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AGROISYNC API',
      version: '2.3.1',
      description: 'API completa para plataforma de agronegócio - AGROISYNC',
      contact: {
        name: 'AgroSync Team',
        email: 'suporte@agroisync.com',
        url: 'https://agroisync.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api-staging.agroisync.com/api',
        description: 'Servidor de Staging'
      },
      {
        url: 'https://agroisync.com/api',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido no login'
        },
        csrfToken: {
          type: 'apiKey',
          in: 'header',
          name: 'X-CSRF-Token',
          description: 'Token CSRF para proteção'
        }
      },
      schemas: {
        // User
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@example.com' },
            phone: { type: 'string', example: '(11) 99999-9999' },
            businessType: {
              type: 'string',
              enum: ['producer', 'buyer', 'transporter', 'store', 'all'],
              example: 'producer'
            },
            isEmailVerified: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // Login Request
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'joao@example.com' },
            password: { type: 'string', format: 'password', example: 'Senha123!' },
            turnstileToken: { type: 'string', example: 'token-cloudflare-turnstile' }
          }
        },

        // Register Request
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'phone'],
          properties: {
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao@example.com' },
            password: { type: 'string', format: 'password', example: 'Senha123!' },
            phone: { type: 'string', example: '(11) 99999-9999' },
            businessType: {
              type: 'string',
              enum: ['producer', 'buyer', 'transporter', 'store', 'all'],
              example: 'producer'
            },
            turnstileToken: { type: 'string', example: 'token-cloudflare-turnstile' }
          }
        },

        // Auth Response
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login realizado com sucesso' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
              }
            }
          }
        },

        // Product
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Soja' },
            category: { type: 'string', example: 'graos' },
            price: { type: 'number', example: 125.5 },
            unit: { type: 'string', example: 'kg' },
            quantity: { type: 'number', example: 1000 },
            description: { type: 'string', example: 'Soja de alta qualidade' },
            images: { type: 'array', items: { type: 'string' } },
            seller: { $ref: '#/components/schemas/User' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        // Freight
        Freight: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            origin: { type: 'string', example: 'Sinop - MT' },
            destination: { type: 'string', example: 'São Paulo - SP' },
            cargo: { type: 'string', example: 'Soja' },
            weight: { type: 'number', example: 5000 },
            price: { type: 'number', example: 8500.0 },
            status: {
              type: 'string',
              enum: ['pending', 'in_transit', 'delivered'],
              example: 'pending'
            },
            transporter: { $ref: '#/components/schemas/User' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Erro ao processar requisição' },
            code: { type: 'string', example: 'VALIDATION_ERROR' },
            details: { type: 'object' }
          }
        },

        // Health Check Response
        HealthCheckResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            timestamp: { type: 'string', format: 'date-time' },
            uptime: { type: 'number', example: 3600 },
            environment: { type: 'string', example: 'production' },
            version: { type: 'string', example: '2.3.1' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de autenticação ausente ou inválido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        ValidationError: {
          description: 'Erro de validação dos dados enviados',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Autenticação e registro de usuários' },
      { name: 'Users', description: 'Gerenciamento de usuários' },
      { name: 'Products', description: 'Produtos agrícolas' },
      { name: 'Freights', description: 'Fretes e transportes' },
      { name: 'Payments', description: 'Pagamentos e transações' },
      { name: 'Crypto', description: 'Criptomoedas e blockchain' },
      { name: 'Health', description: 'Status e saúde da API' },
      { name: 'Admin', description: 'Endpoints administrativos' }
    ]
  },
  apis: ['./src/routes/*.js'] // Procura JSDoc nos arquivos de rotas
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
