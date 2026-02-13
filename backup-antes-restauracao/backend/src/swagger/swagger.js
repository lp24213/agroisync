// =============================================================
// AGROISYNC â€¢ DocumentaÃ§Ã£o Swagger/OpenAPI
// =============================================================

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgroSync API',
      version: '1.0.0',
      description: 'API para plataforma AgroSync - Marketplace agrÃ­cola e serviÃ§os de frete',
      contact: {
        name: 'Equipe AgroSync',
        email: 'contato@agroisync.com',
        url: 'https://agroisync.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://agroisync.com/api',
        description: 'Servidor de ProduÃ§Ã£o'
      },
      {
        url: 'https://staging.agroisync.com/api',
        description: 'Servidor de Staging'
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticaÃ§Ã£o'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'email', 'name'],
          properties: {
            id: {
              type: 'string',
              description: 'ID Ãºnico do usuÃ¡rio',
              example: 'uuid-string'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuÃ¡rio',
              example: 'usuario@exemplo.com'
            },
            name: {
              type: 'string',
              description: 'Nome completo do usuÃ¡rio',
              example: 'JoÃ£o Silva'
            },
            phone: {
              type: 'string',
              description: 'Telefone do usuÃ¡rio',
              example: '11999999999'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Papel do usuÃ¡rio',
              example: 'user'
            },
            isActive: {
              type: 'boolean',
              description: 'Se o usuÃ¡rio estÃ¡ ativo',
              example: true
            },
            isEmailVerified: {
              type: 'boolean',
              description: 'Se o email foi verificado',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criaÃ§Ã£o',
              example: '2024-01-01T00:00:00Z'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          required: ['success', 'data'],
          properties: {
            success: {
              type: 'boolean',
              description: 'Se a operaÃ§Ã£o foi bem-sucedida',
              example: true
            },
            data: {
              type: 'object',
              required: ['token', 'user'],
              properties: {
                token: {
                  type: 'string',
                  description: 'Token JWT',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            },
            message: {
              type: 'string',
              description: 'Mensagem de resposta',
              example: 'Login realizado com sucesso'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: {
              type: 'boolean',
              description: 'Se a operaÃ§Ã£o foi bem-sucedida',
              example: false
            },
            error: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Credenciais invÃ¡lidas'
            },
            code: {
              type: 'string',
              description: 'CÃ³digo do erro',
              example: 'INVALID_CREDENTIALS'
            }
          }
        }
      }
    },
    paths: {
      '/auth/login': {
        post: {
          tags: ['AutenticaÃ§Ã£o'],
          summary: 'Fazer login',
          description: 'Autentica um usuÃ¡rio e retorna um token JWT',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'usuario@exemplo.com'
                    },
                    password: {
                      type: 'string',
                      format: 'password',
                      example: 'senha123'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuthResponse'
                  }
                }
              }
            },
            401: {
              description: 'Credenciais invÃ¡lidas',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            },
            500: {
              description: 'Erro interno do servidor',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const specs = swaggerJSDoc(options);

// Middleware para servir a documentaÃ§Ã£o
export const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'AgroSync API Documentation',
  customfavIcon: '/favicon.ico'
};

export const setupSwagger = app => {
  // Servir a documentaÃ§Ã£o Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

  // Servir o JSON da especificaÃ§Ã£o
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export default specs;
