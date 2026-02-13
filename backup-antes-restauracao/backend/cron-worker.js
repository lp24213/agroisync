/**
 * 🤖 AGROISYNC - Cron Worker
 * Worker que executa tarefas agendadas (atualização de clima, cotações, notícias)
 * Executa a cada 6 horas automaticamente
 */

const { runAllUpdates } = require('./src/services/aiUpdateService');

export default {
  /**
   * Scheduled event - executa a cada 6 horas
   */
  async scheduled(event, env, ctx) {
    console.log('⏰ Cron Worker iniciado:', new Date().toISOString());
    
    try {
      // Executar todas as atualizações da IA
      const results = await runAllUpdates(env);
      
      console.log('✅ Atualizações concluídas:', results);
      
      // Notificar admins por email (opcional)
      if (results.weather.success && results.cotations.success && results.news.success) {
        await sendAdminNotification(env, results);
      }
      
      return { success: true, results };
    } catch (error) {
      console.error('❌ Erro no cron worker:', error);
      
      // Notificar erro crítico
      await sendErrorNotification(env, error);
      
      return { success: false, error: error.message };
    }
  },

  /**
   * HTTP handler - permite execução manual
   */
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Endpoint manual para forçar atualização
    if (url.pathname === '/cron/update-now') {
      // Verificar autenticação
      const authHeader = request.headers.get('Authorization');
      const expectedToken = env.CRON_SECRET || 'cron-secret-token';
      
      if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      try {
        console.log('🔧 Atualização manual solicitada');
        const results = await runAllUpdates(env);
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Atualização executada com sucesso',
          results 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: error.message 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Health check
    if (url.pathname === '/cron/health') {
      return new Response(JSON.stringify({ 
        status: 'healthy',
        service: 'Agroisync Cron Worker',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Not Found',
      message: 'Use /cron/update-now ou /cron/health' 
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Enviar notificação de sucesso para admins
 */
async function sendAdminNotification(env, results) {
  try {
    if (!env.RESEND_API_KEY) return;
    
    const html = `
      <h2>🤖 Atualização Automática Concluída</h2>
      <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      
      <h3>✅ Clima</h3>
      <p>Cidades atualizadas: ${results.weather.updated || 0}</p>
      
      <h3>💰 Cotações</h3>
      <p>Produtos atualizados: ${results.cotations.updated || 0}</p>
      
      <h3>📰 Notícias</h3>
      <p>Notícia: ${results.news.title || 'N/A'}</p>
      
      <hr>
      <small>Agroisync IA - Sistema Automático</small>
    `;
    
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Agroisync IA <contato@agroisync.com>',
        to: 'admin@agroisync.com',
        subject: '✅ Atualização Automática Concluída',
        html
      })
    });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
  }
}

/**
 * Enviar notificação de erro
 */
async function sendErrorNotification(env, error) {
  try {
    if (!env.RESEND_API_KEY) return;
    
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Agroisync IA <contato@agroisync.com>',
        to: 'admin@agroisync.com',
        subject: '❌ ERRO na Atualização Automática',
        html: `
          <h2>❌ Erro no Cron Worker</h2>
          <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <p><strong>Erro:</strong> ${error.message}</p>
          <pre>${error.stack}</pre>
        `
      })
    });
  } catch (e) {
    console.error('Erro ao enviar notificação de erro:', e);
  }
}

