/**
 * Monitoring - Alerts System
 * 
 * Este módulo implementa um sistema de alertas para o ecossistema AGROTM,
 * integrando com Telegram, Discord e Slack para notificações em tempo real.
 * 
 * Funcionalidades:
 * - Alertas de segurança (ataques, vulnerabilidades)
 * - Alertas de performance (latência, erros)
 * - Alertas de blockchain (transações grandes, anomalias)
 * - Alertas de infraestrutura (servidores, bancos de dados)
 * - Alertas de negócio (métricas importantes, KPIs)
 */

import axios from 'axios';
import { Redis } from 'ioredis';
import { Telegram } from 'telegraf';
import { WebClient } from '@slack/web-api';
import { Client, MessageEmbed } from 'discord.js';
import { Connection, PublicKey } from '@solana/web3.js';
// Sentry removed - using console logging instead

// Configuração do Redis para rate limiting e histórico de alertas
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Inicialização dos clientes de mensageria
const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN || '');
const slack = new WebClient(process.env.SLACK_TOKEN || '');
const discord = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

// Conexão com Solana para monitoramento de blockchain
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');

// Sentry configuration removed - using console logging instead

// Tipos de alertas
export enum AlertLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum AlertCategory {
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  BLOCKCHAIN = 'blockchain',
  INFRASTRUCTURE = 'infrastructure',
  BUSINESS = 'business',
}

export interface AlertOptions {
  level: AlertLevel;
  category: AlertCategory;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  notifyChannels?: string[];
  throttleKey?: string;
  throttleDuration?: number; // em segundos
  tags?: string[];
}

export interface AlertDestination {
  type: 'telegram' | 'slack' | 'discord' | 'email' | 'sms' | 'webhook';
  target: string; // ID do chat, canal, webhook URL, etc.
  enabled: boolean;
  minLevel?: AlertLevel; // Nível mínimo para enviar para este destino
  categories?: AlertCategory[]; // Categorias específicas para este destino
}

// Configurações de destinos de alertas
const alertDestinations: AlertDestination[] = [
  // Telegram
  {
    type: 'telegram',
    target: process.env.TELEGRAM_SECURITY_CHAT_ID || '-1001234567890',
    enabled: true,
    minLevel: AlertLevel.WARNING,
    categories: [AlertCategory.SECURITY],
  },
  {
    type: 'telegram',
    target: process.env.TELEGRAM_TECH_CHAT_ID || '-1001234567891',
    enabled: true,
    minLevel: AlertLevel.ERROR,
    categories: [AlertCategory.PERFORMANCE, AlertCategory.INFRASTRUCTURE],
  },
  {
    type: 'telegram',
    target: process.env.TELEGRAM_BUSINESS_CHAT_ID || '-1001234567892',
    enabled: true,
    minLevel: AlertLevel.ERROR,
    categories: [AlertCategory.BUSINESS],
  },
  
  // Slack
  {
    type: 'slack',
    target: process.env.SLACK_ALERTS_CHANNEL || 'C01234ABCDEF',
    enabled: true,
    minLevel: AlertLevel.WARNING,
  },
  {
    type: 'slack',
    target: process.env.SLACK_CRITICAL_CHANNEL || 'C01234ABCDEG',
    enabled: true,
    minLevel: AlertLevel.CRITICAL,
  },
  
  // Discord
  {
    type: 'discord',
    target: process.env.DISCORD_ALERTS_CHANNEL || '123456789012345678',
    enabled: true,
    minLevel: AlertLevel.WARNING,
  },
  
  // Webhook (para integração com outros sistemas)
  {
    type: 'webhook',
    target: process.env.ALERTS_WEBHOOK_URL || 'https://hooks.example.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    enabled: true,
    minLevel: AlertLevel.CRITICAL,
  },
];

/**
 * Envia um alerta para todos os canais configurados
 * @param options Opções do alerta
 * @returns Promise<boolean> indicando sucesso
 */
export async function sendAlert(options: AlertOptions): Promise<boolean> {
  try {
    const { level, category, title, message, metadata, throttleKey, throttleDuration = 300 } = options;
    
    // Verificar throttling para evitar spam de alertas
    if (throttleKey) {
      const throttleExists = await redis.get(`alert_throttle:${throttleKey}`);
      if (throttleExists) {
        console.log(`Alerta throttled: ${throttleKey}`);
        return false;
      }
      
      // Definir throttle
      await redis.set(`alert_throttle:${throttleKey}`, '1', 'EX', throttleDuration);
    }
    
    // Registrar alerta no histórico
    const alertId = await recordAlert(options);
    
    // Filtrar destinos com base no nível e categoria
    const eligibleDestinations = alertDestinations.filter(dest => {
      if (!dest.enabled) return false;
      
      // Verificar nível mínimo
      if (dest.minLevel) {
        const levels = [AlertLevel.INFO, AlertLevel.WARNING, AlertLevel.ERROR, AlertLevel.CRITICAL];
        const currentLevelIndex = levels.indexOf(level);
        const minLevelIndex = levels.indexOf(dest.minLevel);
        
        if (currentLevelIndex < minLevelIndex) return false;
      }
      
      // Verificar categorias
      if (dest.categories && !dest.categories.includes(category)) return false;
      
      return true;
    });
    
    // Enviar para cada destino elegível
    const promises = eligibleDestinations.map(dest => {
      return sendToDestination(dest, { ...options, alertId });
    });
    
    await Promise.all(promises);
    
    // Registrar no Sentry se for ERROR ou CRITICAL
    if (level === AlertLevel.ERROR || level === AlertLevel.CRITICAL) {
          console.error(`[ALERT] ${title}: ${message}`, {
      category,
      tags: options.tags || [],
      metadata,
    });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar alerta:', error);
    return false;
  }
}

/**
 * Registra um alerta no histórico
 * @param options Opções do alerta
 * @returns ID do alerta
 */
async function recordAlert(options: AlertOptions): Promise<string> {
  const alertId = `alert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  const alertRecord = {
    id: alertId,
    timestamp: Date.now(),
    ...options,
  };
  
  // Salvar no Redis
  await redis.set(`alert:${alertId}`, JSON.stringify(alertRecord));
  
  // Adicionar ao histórico por categoria
  await redis.lpush(`alerts:${options.category}`, alertId);
  await redis.ltrim(`alerts:${options.category}`, 0, 999); // Manter apenas os 1000 mais recentes
  
  // Adicionar ao histórico por nível
  await redis.lpush(`alerts:${options.level}`, alertId);
  await redis.ltrim(`alerts:${options.level}`, 0, 999);
  
  // Adicionar ao histórico geral
  await redis.lpush('alerts:all', alertId);
  await redis.ltrim('alerts:all', 0, 9999); // Manter apenas os 10000 mais recentes
  
  return alertId;
}

/**
 * Envia um alerta para um destino específico
 * @param destination Destino do alerta
 * @param options Opções do alerta com ID
 * @returns Promise<boolean> indicando sucesso
 */
async function sendToDestination(
  destination: AlertDestination,
  options: AlertOptions & { alertId: string }
): Promise<boolean> {
  const { level, category, title, message, metadata, alertId } = options;
  
  try {
    switch (destination.type) {
      case 'telegram':
        return await sendTelegramAlert(destination.target, options);
        
      case 'slack':
        return await sendSlackAlert(destination.target, options);
        
      case 'discord':
        return await sendDiscordAlert(destination.target, options);
        
      case 'webhook':
        return await sendWebhookAlert(destination.target, options);
        
      default:
        console.warn(`Tipo de destino não suportado: ${destination.type}`);
        return false;
    }
  } catch (error) {
    console.error(`Erro ao enviar alerta para ${destination.type}:`, error);
    return false;
  }
}

/**
 * Envia um alerta via Telegram
 * @param chatId ID do chat do Telegram
 * @param options Opções do alerta
 * @returns Promise<boolean> indicando sucesso
 */
async function sendTelegramAlert(
  chatId: string,
  options: AlertOptions & { alertId: string }
): Promise<boolean> {
  const { level, category, title, message, metadata, alertId } = options;
  
  // Emojis para diferentes níveis
  const levelEmojis: Record<AlertLevel, string> = {
    [AlertLevel.INFO]: 'ℹ️',
    [AlertLevel.WARNING]: '⚠️',
    [AlertLevel.ERROR]: '🔴',
    [AlertLevel.CRITICAL]: '🚨',
  };
  
  // Formatar mensagem
  let text = `${levelEmojis[level]} *${title}*\n\n${message}`;
  
  // Adicionar metadados se existirem
  if (metadata && Object.keys(metadata).length > 0) {
    text += '\n\n*Detalhes:*';
    for (const [key, value] of Object.entries(metadata)) {
      text += `\n• ${key}: ${JSON.stringify(value)}`;
    }
  }
  
  // Adicionar ID e timestamp
  text += `\n\n🆔 ${alertId}\n⏱ ${new Date().toISOString()}`;
  
  try {
    await telegram.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    return true;
  } catch (error) {
    console.error('Erro ao enviar alerta via Telegram:', error);
    return false;
  }
}

/**
 * Envia um alerta via Slack
 * @param channel Canal do Slack
 * @param options Opções do alerta
 * @returns Promise<boolean> indicando sucesso
 */
async function sendSlackAlert(
  channel: string,
  options: AlertOptions & { alertId: string }
): Promise<boolean> {
  const { level, category, title, message, metadata, alertId } = options;
  
  // Cores para diferentes níveis
  const levelColors: Record<AlertLevel, string> = {
    [AlertLevel.INFO]: '#2196F3',
    [AlertLevel.WARNING]: '#FF9800',
    [AlertLevel.ERROR]: '#F44336',
    [AlertLevel.CRITICAL]: '#9C27B0',
  };
  
  try {
    await slack.chat.postMessage({
      channel,
      text: title,
      attachments: [
        {
          color: levelColors[level],
          title,
          text: message,
          fields: metadata ? Object.entries(metadata).map(([key, value]) => ({
            title: key,
            value: JSON.stringify(value),
            short: false,
          })) : [],
          footer: `ID: ${alertId} | Categoria: ${category} | ${new Date().toISOString()}`,
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Erro ao enviar alerta via Slack:', error);
    return false;
  }
}

/**
 * Envia um alerta via Discord
 * @param channelId ID do canal do Discord
 * @param options Opções do alerta
 * @returns Promise<boolean> indicando sucesso
 */
async function sendDiscordAlert(
  channelId: string,
  options: AlertOptions & { alertId: string }
): Promise<boolean> {
  const { level, category, title, message, metadata, alertId } = options;
  
  // Cores para diferentes níveis
  const levelColors: Record<AlertLevel, number> = {
    [AlertLevel.INFO]: 0x2196F3,
    [AlertLevel.WARNING]: 0xFF9800,
    [AlertLevel.ERROR]: 0xF44336,
    [AlertLevel.CRITICAL]: 0x9C27B0,
  };
  
  try {
    // Verificar se o cliente está pronto
    if (!discord.isReady()) {
      // Se não estiver pronto, tentar enviar via webhook
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      if (webhookUrl) {
        return await sendWebhookAlert(webhookUrl, options);
      }
      return false;
    }
    
    const channel = await discord.channels.fetch(channelId);
    if (!channel || !channel.isText()) {
      throw new Error(`Canal ${channelId} não encontrado ou não é um canal de texto`);
    }
    
    const embed = new MessageEmbed()
      .setColor(levelColors[level])
      .setTitle(title)
      .setDescription(message)
      .setTimestamp()
      .setFooter({ text: `ID: ${alertId} | Categoria: ${category}` });
    
    // Adicionar metadados se existirem
    if (metadata && Object.keys(metadata).length > 0) {
      for (const [key, value] of Object.entries(metadata)) {
        embed.addField(key, JSON.stringify(value), false);
      }
    }
    
    await channel.send({ embeds: [embed] });
    return true;
  } catch (error) {
    console.error('Erro ao enviar alerta via Discord:', error);
    return false;
  }
}

/**
 * Envia um alerta via webhook genérico
 * @param webhookUrl URL do webhook
 * @param options Opções do alerta
 * @returns Promise<boolean> indicando sucesso
 */
async function sendWebhookAlert(
  webhookUrl: string,
  options: AlertOptions & { alertId: string }
): Promise<boolean> {
  const { level, category, title, message, metadata, alertId } = options;
  
  try {
    await axios.post(webhookUrl, {
      level,
      category,
      title,
      message,
      metadata,
      alertId,
      timestamp: Date.now(),
    });
    return true;
  } catch (error) {
    console.error('Erro ao enviar alerta via webhook:', error);
    return false;
  }
}

/**
 * Obtém o histórico de alertas
 * @param filter Filtros para os alertas
 * @param limit Limite de alertas a retornar
 * @param offset Offset para paginação
 * @returns Array de alertas
 */
export async function getAlertHistory(
  filter: {
    level?: AlertLevel;
    category?: AlertCategory;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  },
  limit = 100,
  offset = 0
): Promise<any[]> {
  try {
    // Determinar a chave do Redis com base no filtro
    let redisKey = 'alerts:all';
    
    if (filter.level) {
      redisKey = `alerts:${filter.level}`;
    } else if (filter.category) {
      redisKey = `alerts:${filter.category}`;
    }
    
    // Obter IDs dos alertas
    const alertIds = await redis.lrange(redisKey, offset, offset + limit - 1);
    
    // Obter detalhes de cada alerta
    const alerts = [];
    
    for (const alertId of alertIds) {
      const alertJson = await redis.get(`alert:${alertId}`);
      if (alertJson) {
        const alert = JSON.parse(alertJson);
        
        // Aplicar filtros adicionais
        if (filter.startDate && alert.timestamp < filter.startDate.getTime()) continue;
        if (filter.endDate && alert.timestamp > filter.endDate.getTime()) continue;
        if (filter.search && !alertMatchesSearch(alert, filter.search)) continue;
        
        alerts.push(alert);
      }
    }
    
    return alerts;
  } catch (error) {
    console.error('Erro ao obter histórico de alertas:', error);
    return [];
  }
}

/**
 * Verifica se um alerta corresponde a uma busca
 * @param alert Alerta a verificar
 * @param search Termo de busca
 * @returns Booleano indicando correspondência
 */
function alertMatchesSearch(alert: any, search: string): boolean {
  const searchLower = search.toLowerCase();
  
  // Verificar título e mensagem
  if (alert.title.toLowerCase().includes(searchLower)) return true;
  if (alert.message.toLowerCase().includes(searchLower)) return true;
  
  // Verificar metadados
  if (alert.metadata) {
    const metadataStr = JSON.stringify(alert.metadata).toLowerCase();
    if (metadataStr.includes(searchLower)) return true;
  }
  
  // Verificar tags
  if (alert.tags && alert.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))) {
    return true;
  }
  
  return false;
}

/**
 * Alerta de segurança para tentativas de ataque
 * @param attackType Tipo de ataque
 * @param details Detalhes do ataque
 * @returns Promise<boolean> indicando sucesso
 */
export async function securityAlert(
  attackType: string,
  details: Record<string, any>
): Promise<boolean> {
  return sendAlert({
    level: AlertLevel.CRITICAL,
    category: AlertCategory.SECURITY,
    title: `Alerta de Segurança: ${attackType}`,
    message: `Detectada possível tentativa de ${attackType}. Verifique os logs e tome medidas imediatas.`,
    metadata: details,
    throttleKey: `security_${attackType}_${details.ip || 'unknown'}`,
    throttleDuration: 300, // 5 minutos
    tags: ['security', 'attack', attackType.toLowerCase()],
  });
}

/**
 * Alerta de performance para problemas de latência
 * @param service Nome do serviço
 * @param latencyMs Latência em milissegundos
 * @param threshold Limite aceitável
 * @returns Promise<boolean> indicando sucesso
 */
export async function performanceAlert(
  service: string,
  latencyMs: number,
  threshold: number
): Promise<boolean> {
  const level = latencyMs > threshold * 2 ? AlertLevel.ERROR : AlertLevel.WARNING;
  
  return sendAlert({
    level,
    category: AlertCategory.PERFORMANCE,
    title: `Latência Alta: ${service}`,
    message: `O serviço ${service} está apresentando latência de ${latencyMs}ms, acima do limite de ${threshold}ms.`,
    metadata: {
      service,
      latencyMs,
      threshold,
      timestamp: Date.now(),
    },
    throttleKey: `latency_${service}`,
    throttleDuration: 600, // 10 minutos
    tags: ['performance', 'latency', service.toLowerCase()],
  });
}

/**
 * Alerta de blockchain para transações grandes ou suspeitas
 * @param txHash Hash da transação
 * @param details Detalhes da transação
 * @returns Promise<boolean> indicando sucesso
 */
export async function blockchainAlert(
  txHash: string,
  details: {
    amount: number;
    token: string;
    from: string;
    to: string;
    timestamp: number;
  }
): Promise<boolean> {
  return sendAlert({
    level: AlertLevel.WARNING,
    category: AlertCategory.BLOCKCHAIN,
    title: `Transação Grande Detectada`,
    message: `Transação de ${details.amount} ${details.token} detectada de ${details.from} para ${details.to}.`,
    metadata: {
      txHash,
      ...details,
    },
    throttleKey: `tx_${txHash}`,
    tags: ['blockchain', 'transaction', details.token.toLowerCase()],
  });
}

/**
 * Alerta de infraestrutura para problemas de servidor
 * @param serverName Nome do servidor
 * @param issue Problema detectado
 * @param metrics Métricas relevantes
 * @returns Promise<boolean> indicando sucesso
 */
export async function infrastructureAlert(
  serverName: string,
  issue: string,
  metrics: Record<string, any>
): Promise<boolean> {
  return sendAlert({
    level: AlertLevel.ERROR,
    category: AlertCategory.INFRASTRUCTURE,
    title: `Problema de Infraestrutura: ${serverName}`,
    message: `Detectado problema no servidor ${serverName}: ${issue}`,
    metadata: {
      serverName,
      issue,
      metrics,
      timestamp: Date.now(),
    },
    throttleKey: `infra_${serverName}_${issue}`,
    throttleDuration: 1800, // 30 minutos
    tags: ['infrastructure', 'server', serverName.toLowerCase()],
  });
}

/**
 * Alerta de negócio para métricas importantes
 * @param metric Nome da métrica
 * @param value Valor atual
 * @param threshold Limite para alerta
 * @param comparison Tipo de comparação ('above' ou 'below')
 * @returns Promise<boolean> indicando sucesso
 */
export async function businessAlert(
  metric: string,
  value: number,
  threshold: number,
  comparison: 'above' | 'below'
): Promise<boolean> {
  // Verificar se o valor está acima/abaixo do threshold conforme a comparação
  const isTriggered = comparison === 'above' ? value > threshold : value < threshold;
  
  if (!isTriggered) return false;
  
  return sendAlert({
    level: AlertLevel.WARNING,
    category: AlertCategory.BUSINESS,
    title: `Alerta de Métrica: ${metric}`,
    message: `A métrica ${metric} está ${comparison === 'above' ? 'acima' : 'abaixo'} do limite: ${value} (limite: ${threshold}).`,
    metadata: {
      metric,
      value,
      threshold,
      comparison,
      timestamp: Date.now(),
    },
    throttleKey: `business_${metric}`,
    throttleDuration: 3600, // 1 hora
    tags: ['business', 'metric', metric.toLowerCase()],
  });
}

/**
 * Inicializa o sistema de alertas
 */
export async function initAlertSystem(): Promise<void> {
  try {
    // Inicializar Discord se o token estiver configurado
    if (process.env.DISCORD_BOT_TOKEN) {
      discord.login(process.env.DISCORD_BOT_TOKEN);
    }
    
    console.log('Sistema de alertas inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar sistema de alertas:', error);
    Sentry.captureException(error);
  }
}

// Exportar funções e tipos
export default {
  sendAlert,
  getAlertHistory,
  securityAlert,
  performanceAlert,
  blockchainAlert,
  infrastructureAlert,
  businessAlert,
  initAlertSystem,
  AlertLevel,
  AlertCategory,
};