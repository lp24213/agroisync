const axios = require('axios');
const logger = require('../utils/logger');

class CloudflareService {
  constructor() {
    this.turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET;
    this.accessToken = process.env.CLOUDFLARE_ACCESS_TOKEN;
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    this.zoneId = process.env.CLOUDFLARE_ZONE_ID;
  }

  /**
   * Verifica token Turnstile do Cloudflare
   */
  async verifyTurnstileToken(token, remoteip = null) {
    try {
      if (!this.turnstileSecret) {
        logger.warn('CLOUDFLARE_TURNSTILE_SECRET não configurado, pulando verificação');
        return true; // Em desenvolvimento, sempre retorna true
      }

      const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        secret: this.turnstileSecret,
        response: token,
        remoteip: remoteip
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { success, error_codes, challenge_ts } = response.data;

      if (!success) {
        logger.warn(`Token Turnstile inválido: ${error_codes?.join(', ') || 'erro desconhecido'}`);
        return false;
      }

      logger.info(`Token Turnstile verificado com sucesso para IP: ${remoteip}`);
      return true;
    } catch (error) {
      logger.error('Erro ao verificar token Turnstile:', error);
      return false;
    }
  }

  /**
   * Configura Cloudflare Access para proteger rotas admin
   */
  async setupAccessPolicy(route, allowedEmails = []) {
    try {
      if (!this.accessToken || !this.accountId) {
        logger.warn('Cloudflare Access não configurado');
        return false;
      }

      const policy = {
        name: `AgroSync Admin - ${route}`,
        decision: {
          type: 'allow'
        },
        include: [
          {
            email_domain: {
              domain: 'agrotm.com.br'
            }
          }
        ],
        exclude: [],
        require: [
          {
            email: {
              email: allowedEmails
            }
          }
        ]
      };

      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/access/apps`,
        {
          name: `AgroSync Admin`,
          domain: `${process.env.DOMAIN || 'agroisync.com'}/admin`,
          type: 'self_hosted',
          policies: [policy]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Política Cloudflare Access configurada com sucesso');
      return response.data;
    } catch (error) {
      logger.error('Erro ao configurar Cloudflare Access:', error);
      return false;
    }
  }

  /**
   * Verifica se usuário tem acesso via Cloudflare Access
   */
  async verifyAccessToken(accessToken) {
    try {
      if (!this.accessToken || !this.accountId) {
        return { valid: false, user: null };
      }

      const response = await axios.get(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/access/apps`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'CF-Access-Token': accessToken
          }
        }
      );

      return {
        valid: true,
        user: response.data.user
      };
    } catch (error) {
      logger.error('Erro ao verificar token Cloudflare Access:', error);
      return { valid: false, user: null };
    }
  }

  /**
   * Configura Workers para autenticação JWT
   */
  async deployAuthWorker() {
    try {
      if (!this.accessToken || !this.accountId) {
        logger.warn('Cloudflare Workers não configurado');
        return false;
      }

      const workerScript = `
        export default {
          async fetch(request, env) {
            const url = new URL(request.url);
            
            // Verificar se é rota protegida
            if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin')) {
              const token = request.headers.get('Authorization')?.replace('Bearer ', '');
              
              if (!token) {
                return new Response('Unauthorized', { status: 401 });
              }
              
              try {
                // Verificar JWT
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                if (payload.exp < Date.now() / 1000) {
                  return new Response('Token expired', { status: 401 });
                }
                
                if (payload.role !== 'admin' && payload.role !== 'super-admin') {
                  return new Response('Insufficient permissions', { status: 403 });
                }
                
                // Adicionar headers de usuário
                const modifiedRequest = new Request(request, {
                  headers: {
                    ...request.headers,
                    'X-User-ID': payload.id,
                    'X-User-Email': payload.email,
                    'X-User-Role': payload.role
                  }
                });
                
                return fetch(modifiedRequest);
              } catch (error) {
                return new Response('Invalid token', { status: 401 });
              }
            }
            
            return fetch(request);
          }
        }
      `;

      const response = await axios.put(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/workers/scripts/agroisync-auth`,
        workerScript,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/javascript'
          }
        }
      );

      logger.info('Worker de autenticação Cloudflare implantado com sucesso');
      return response.data;
    } catch (error) {
      logger.error('Erro ao implantar Worker Cloudflare:', error);
      return false;
    }
  }

  /**
   * Configura cache para APIs
   */
  async setupCacheRules() {
    try {
      if (!this.accessToken || !this.zoneId) {
        logger.warn('Cloudflare Cache não configurado');
        return false;
      }

      const cacheRules = [
        {
          name: 'API Cache',
          expression: 'http.host eq "api.agroisync.com"',
          action: 'cache',
          cache_ttl: 300 // 5 minutos
        },
        {
          name: 'Static Assets',
          expression: 'http.host eq "agroisync.com" and http.request.uri.path matches "^/static/.*"',
          action: 'cache',
          cache_ttl: 86400 // 24 horas
        }
      ];

      for (const rule of cacheRules) {
        await axios.post(
          `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/rulesets`,
          {
            name: rule.name,
            kind: 'zone',
            phase: 'http_request_cache',
            rules: [
              {
                expression: rule.expression,
                action: rule.action,
                action_parameters: {
                  cache_ttl: rule.cache_ttl
                }
              }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      logger.info('Regras de cache Cloudflare configuradas com sucesso');
      return true;
    } catch (error) {
      logger.error('Erro ao configurar cache Cloudflare:', error);
      return false;
    }
  }

  /**
   * Configura proteção DDoS
   */
  async setupDDoSProtection() {
    try {
      if (!this.accessToken || !this.zoneId) {
        logger.warn('Proteção DDoS Cloudflare não configurada');
        return false;
      }

      const response = await axios.patch(
        `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/settings/security_level`,
        {
          value: 'high'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Proteção DDoS Cloudflare ativada');
      return response.data;
    } catch (error) {
      logger.error('Erro ao configurar proteção DDoS:', error);
      return false;
    }
  }

  /**
   * Obtém estatísticas de segurança
   */
  async getSecurityStats(startDate, endDate) {
    try {
      if (!this.accessToken || !this.zoneId) {
        return null;
      }

      const response = await axios.get(
        `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/analytics/dashboard`,
        {
          params: {
            since: startDate,
            until: endDate
          },
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Erro ao obter estatísticas de segurança:', error);
      return null;
    }
  }

  /**
   * Configuração inicial completa do Cloudflare
   */
  async initializeCloudflare() {
    try {
      logger.info('Inicializando configurações do Cloudflare...');

      const results = {
        turnstile: !!this.turnstileSecret,
        access: await this.setupAccessPolicy('/admin', [process.env.ADMIN_EMAIL]),
        worker: await this.deployAuthWorker(),
        cache: await this.setupCacheRules(),
        ddos: await this.setupDDoSProtection()
      };

      logger.info('Configurações Cloudflare inicializadas:', results);
      return results;
    } catch (error) {
      logger.error('Erro na inicialização do Cloudflare:', error);
      return false;
    }
  }
}

module.exports = new CloudflareService();
