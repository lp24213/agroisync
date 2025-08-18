module.exports = {
  apps: [
    {
      name: 'agroisync-backend',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Configurações de produção
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      // Logs
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Monitoramento
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      // Health check
      health_check_grace_period: 3000,
      // Auto restart
      autorestart: true,
      // Cron jobs
      cron_restart: '0 2 * * *', // Restart diário às 2h da manhã
      // Environment variables
      env_file: './env.production'
    }
  ],

  // Configurações de deploy
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-production-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/lp24213/agrotm.sol.git',
      path: '/var/www/agroisync-backend',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
