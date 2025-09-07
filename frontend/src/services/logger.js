/**
 * Serviço de Logging para AgroSync
 * Substitui console.error por um sistema de logging mais robusto
 */

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Log de erro
   * @param {string} message - Mensagem do erro
   * @param {Error|Object} error - Objeto de erro ou dados adicionais
   * @param {Object} context - Contexto adicional
   */
  error(message, error = null, context = {}) {
    const logData = {
      level: 'ERROR',
      message,
      timestamp: new Date().toISOString(),
      context,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
    };

    // Em desenvolvimento, usar console.error
    if (this.isDevelopment) {
      console.error('🚨 [ERROR]', message, error, context);
    }

    // Em produção, enviar para serviço de monitoramento
    if (this.isProduction) {
      this.sendToMonitoring(logData);
    }

    // Salvar no localStorage para debug
    this.saveToLocalStorage(logData);
  }

  /**
   * Log de warning
   * @param {string} message - Mensagem do warning
   * @param {Object} data - Dados adicionais
   */
  warn(message, data = {}) {
    const logData = {
      level: 'WARN',
      message,
      timestamp: new Date().toISOString(),
      data
    };

    if (this.isDevelopment) {
      console.warn('⚠️ [WARN]', message, data);
    }

    if (this.isProduction) {
      this.sendToMonitoring(logData);
    }

    this.saveToLocalStorage(logData);
  }

  /**
   * Log de informação
   * @param {string} message - Mensagem informativa
   * @param {Object} data - Dados adicionais
   */
  info(message, data = {}) {
    const logData = {
      level: 'INFO',
      message,
      timestamp: new Date().toISOString(),
      data
    };

    if (this.isDevelopment) {
      console.info('ℹ️ [INFO]', message, data);
    }

    this.saveToLocalStorage(logData);
  }

  /**
   * Log de debug
   * @param {string} message - Mensagem de debug
   * @param {Object} data - Dados adicionais
   */
  debug(message, data = {}) {
    if (!this.isDevelopment) return;

    const logData = {
      level: 'DEBUG',
      message,
      timestamp: new Date().toISOString(),
      data
    };

    console.debug('🐛 [DEBUG]', message, data);
    this.saveToLocalStorage(logData);
  }

  /**
   * Enviar logs para serviço de monitoramento
   * @param {Object} logData - Dados do log
   */
  async sendToMonitoring(logData) {
    try {
      // Integração com Sentry, LogRocket, ou outro serviço
      if (window.Sentry) {
        if (logData.level === 'ERROR') {
          window.Sentry.captureException(new Error(logData.message), {
            extra: logData.context
          });
        } else {
          window.Sentry.addBreadcrumb({
            message: logData.message,
            level: logData.level.toLowerCase(),
            data: logData.data || logData.context
          });
        }
      }

      // Enviar para API própria se necessário
      if (process.env.REACT_APP_LOGGING_ENDPOINT) {
        await fetch(process.env.REACT_APP_LOGGING_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logData)
        });
      }
    } catch (error) {
      // Fallback para console se o serviço de monitoramento falhar
      console.error('Erro ao enviar log para monitoramento:', error);
    }
  }

  /**
   * Salvar logs no localStorage para debug
   * @param {Object} logData - Dados do log
   */
  saveToLocalStorage(logData) {
    try {
      const logs = JSON.parse(localStorage.getItem('agrosync_logs') || '[]');
      logs.push(logData);
      
      // Manter apenas os últimos 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('agrosync_logs', JSON.stringify(logs));
    } catch (error) {
      // Se não conseguir salvar no localStorage, não fazer nada
    }
  }

  /**
   * Obter logs salvos
   * @returns {Array} Array de logs
   */
  getLogs() {
    try {
      return JSON.parse(localStorage.getItem('agrosync_logs') || '[]');
    } catch (error) {
      return [];
    }
  }

  /**
   * Limpar logs salvos
   */
  clearLogs() {
    localStorage.removeItem('agrosync_logs');
  }

  /**
   * Exportar logs para download
   */
  exportLogs() {
    const logs = this.getLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `agrosync-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }
}

// Instância singleton
const logger = new Logger();

export default logger;
