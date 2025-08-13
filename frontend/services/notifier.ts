/**
 * Notifier Service
 * Serviço para envio de alertas e notificações
 */

export interface AlertMessage {
  farmId: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: Date;
  category: 'productivity' | 'pest' | 'weather' | 'soil' | 'general';
}

export interface NotificationChannel {
  email: boolean;
  sms: boolean;
  push: boolean;
  webhook: boolean;
}

/**
 * Envia um alerta para a fazenda especificada
 */
export async function sendAlert(
  farmId: string, 
  message: string, 
  severity: AlertMessage['severity'] = 'warning',
  category: AlertMessage['category'] = 'general'
): Promise<boolean> {
  try {
    const alert: AlertMessage = {
      farmId,
      message,
      severity,
      timestamp: new Date(),
      category
    };

    // Em produção, isso enviaria para um sistema de notificação real
    console.log('🚨 ALERTA ENVIADO:', alert);
    
    // Simulação de envio para diferentes canais
    await sendToChannels(alert);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar alerta:', error);
    return false;
  }
}

/**
 * Envia notificação para múltiplos canais
 */
async function sendToChannels(alert: AlertMessage): Promise<void> {
  const channels: NotificationChannel = {
    email: true,
    sms: false,
    push: true,
    webhook: true
  };

  // Simulação de envio para email
  if (channels.email) {
    await sendEmailAlert(alert);
  }

  // Simulação de envio para push notification
  if (channels.push) {
    await sendPushNotification(alert);
  }

  // Simulação de envio para webhook
  if (channels.webhook) {
    await sendWebhookAlert(alert);
  }
}

/**
 * Simula envio de email
 */
async function sendEmailAlert(alert: AlertMessage): Promise<void> {
  // Simulação de delay de rede
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log(`📧 Email enviado para fazenda ${alert.farmId}: ${alert.message}`);
}

/**
 * Simula envio de push notification
 */
async function sendPushNotification(alert: AlertMessage): Promise<void> {
  // Simulação de delay de rede
  await new Promise(resolve => setTimeout(resolve, 50));
  console.log(`📱 Push notification enviado para fazenda ${alert.farmId}: ${alert.message}`);
}

/**
 * Simula envio para webhook
 */
async function sendWebhookAlert(alert: AlertMessage): Promise<void> {
  // Simulação de delay de rede
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`🔗 Webhook enviado para fazenda ${alert.farmId}: ${alert.message}`);
}

/**
 * Busca histórico de alertas de uma fazenda
 */
export async function getAlertHistory(farmId: string, limit: number = 10): Promise<AlertMessage[]> {
  // Simulação de dados históricos
  const alerts: AlertMessage[] = [];
  
  for (let i = 0; i < limit; i++) {
    alerts.push({
      farmId,
      message: `Alerta histórico ${i + 1}`,
      severity: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)] as AlertMessage['severity'],
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      category: ['productivity', 'pest', 'weather', 'soil', 'general'][Math.floor(Math.random() * 5)] as AlertMessage['category']
    });
  }
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
