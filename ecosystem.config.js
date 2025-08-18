module.exports = {
  apps: [
    // Frontend Application
    {
      name: 'agroisync-frontend',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Production settings
      max_memory_restart: '512M',
      min_uptime: '10s',
      max_restarts: 5,
      restart_delay: 4000,
      // Logs
      log_file: './logs/frontend-combined.log',
      out_file: './logs/frontend-out.log',
      error_file: './logs/frontend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Monitoring
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
      // Health check
      health_check_grace_period: 3000,
      // Auto restart
      autorestart: true
    },

    // Backend Application
    {
      name: 'agroisync-backend',
      script: 'npm',
      args: 'start',
      cwd: './backend',
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
      // Production settings
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      // Logs
      log_file: './logs/backend-combined.log',
      out_file: './logs/backend-out.log',
      error_file: './logs/backend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Monitoring
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads', 'public'],
      // Health check
      health_check_grace_period: 3000,
      // Auto restart
      autorestart: true,
      // Cron jobs
      cron_restart: '0 2 * * *' // Restart daily at 2 AM
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-production-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/lp24213/agrotm.sol.git',
      path: '/var/www/agroisync',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    
    staging: {
      user: 'ubuntu',
      host: 'your-staging-server.com',
      ref: 'origin/develop',
      repo: 'https://github.com/lp24213/agrotm.sol.git',
      path: '/var/www/agroisync-staging',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  },

  // PM2 configuration
  pm2: {
    // Global PM2 settings
    max_memory_restart: '2G',
    min_uptime: '10s',
    max_restarts: 15,
    restart_delay: 4000,
    
    // Logging
    log_file: './logs/pm2-combined.log',
    out_file: './logs/pm2-out.log',
    error_file: './logs/pm2-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Monitoring
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads', 'public', '.next', 'dist'],
    
    // Health checks
    health_check_grace_period: 5000,
    
    // Auto restart
    autorestart: true,
    
    // Cron jobs
    cron_restart: '0 2 * * *' // Restart daily at 2 AM
  }
};
