module.exports = {
  apps: [
    {
      name: 'agrosync-backend',
      script: 'src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 5000
      },
      // Configurações de performance
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=4096',
      
      // Configurações de logs
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Configurações de restart
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Configurações de monitoramento
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      // Configurações de cluster
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 8000,
      
      // Variáveis de ambiente específicas
      env_file: '.env',
      
      // Scripts de lifecycle
      pre_start: 'npm run db:migrate',
      post_start: 'echo "Backend iniciado com sucesso!"',
      
      // Configurações de health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true
    }
  ],

  // Configurações de deploy
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'seu-servidor.com',
      ref: 'origin/main',
      repo: 'https://github.com/agrosync/backend.git',
      path: '/var/www/agrosync-backend',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    
    staging: {
      user: 'ubuntu',
      host: 'staging.agrosync.com',
      ref: 'origin/develop',
      repo: 'https://github.com/agrosync/backend.git',
      path: '/var/www/agrosync-backend-staging',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': ''
    }
  },

  // Configurações de monitoramento
  monitoring: {
    // Configurações do PM2 Plus (opcional)
    // pm2_plus: true,
    
    // Configurações de métricas
    metrics: {
      // Coleta métricas a cada 30 segundos
      collection_interval: 30000,
      
      // Métricas personalizadas
      custom_metrics: {
        // Contadores de requisições
        requests_total: 0,
        requests_success: 0,
        requests_error: 0,
        
        // Métricas de banco de dados
        db_connections: 0,
        db_queries: 0,
        
        // Métricas de pagamentos
        payments_total: 0,
        payments_success: 0,
        payments_failed: 0
      }
    }
  },

  // Configurações de notificações
  notifications: {
    // Slack (opcional)
    slack: {
      webhook: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
      channel: '#agrosync-alerts',
      username: 'PM2 Bot'
    },
    
    // Email (opcional)
    email: {
      host: 'smtp.gmail.com',
      port: 587,
      user: 'alerts@agrosync.com',
      pass: 'sua_senha_email',
      from: 'alerts@agrosync.com',
      to: 'admin@agrosync.com'
    }
  }
};
