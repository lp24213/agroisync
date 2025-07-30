import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AGROTM Solana DeFi API',
      version: '1.0.0',
      description: 'Secure and scalable Web3 backend API for AGROTM DeFi platform',
      contact: {
        name: 'AGROTM Team',
        email: 'support@agrotm.com',
        url: 'https://agrotm.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.agrotm.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            walletAddress: {
              type: 'string',
              description: 'Solana wallet address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin', 'super_admin'],
              description: 'User role'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether user account is active'
            },
            isVerified: {
              type: 'boolean',
              description: 'Whether user email is verified'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            }
          }
        },
        StakingPool: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Pool ID'
            },
            name: {
              type: 'string',
              description: 'Pool name'
            },
            token: {
              type: 'string',
              description: 'Token symbol'
            },
            totalStaked: {
              type: 'number',
              description: 'Total amount staked in pool'
            },
            apy: {
              type: 'number',
              description: 'Annual percentage yield'
            },
            minStake: {
              type: 'number',
              description: 'Minimum stake amount'
            },
            maxStake: {
              type: 'number',
              description: 'Maximum stake amount'
            },
            lockPeriod: {
              type: 'number',
              description: 'Lock period in days'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether pool is active'
            }
          }
        },
        StakingRecord: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Staking record ID'
            },
            poolId: {
              type: 'string',
              description: 'Pool ID'
            },
            amount: {
              type: 'number',
              description: 'Staked amount'
            },
            rewards: {
              type: 'number',
              description: 'Accumulated rewards'
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Staking start date'
            },
            unlockDate: {
              type: 'string',
              format: 'date-time',
              description: 'Unlock date'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether stake is active'
            },
            status: {
              type: 'string',
              enum: ['active', 'unstaked', 'claimed', 'expired'],
              description: 'Stake status'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            },
            code: {
              type: 'string',
              description: 'Error code'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const specs = swaggerJsdoc(options); 