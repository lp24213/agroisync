/**
 * Anti-DDOS Middleware
 * Protege a aplicação contra ataques de negação de serviço distribuídos
 * Implementa rate-limiting por IP, IP blocklist e proteção contra ataques de força bruta
 */

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { RateLimiter } from 'limiter';
import { getClientIp } from 'request-ip';

// Configuração do Redis para armazenamento de estado distribuído
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

// Lista de IPs bloqueados (pode ser carregada de um banco de dados ou arquivo)
const BLOCKLIST_KEY = 'agrotm:security:ip-blocklist';

// Configurações de rate limiting
const RATE_LIMIT_REQUESTS = 100; // Número máximo de requisições
const RATE_LIMIT_WINDOW = 60 * 1000; // Janela de tempo em ms (1 minuto)
const RATE_LIMIT_PENALTY = 10 * 60 * 1000; // Tempo de penalidade para excesso (10 minutos)

// Configurações para detecção de ataques
const ATTACK_THRESHOLD = 200; // Número de requisições que indica um possível ataque
const ATTACK_WINDOW = 5 * 60 * 1000; // Janela de tempo para detecção (5 minutos)

/**
 * Middleware para proteção contra DDOS
 */
export async function antiDdosMiddleware(req: NextRequest) {
  // Obter IP do cliente
  const ip = getClientIp(req as any) || 'unknown';
  
  // Verificar se o IP está na blocklist
  const isBlocked = await redis.sismember(BLOCKLIST_KEY, ip);
  if (isBlocked) {
    logger.warn(`Blocked request from blacklisted IP: ${ip}`);
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    );
  }

  // Chave para o rate limiting deste IP
  const rateLimitKey = `agrotm:ratelimit:${ip}`;
  
  // Obter contagem atual de requisições
  const currentRequests = await redis.incr(rateLimitKey);
  
  // Se for a primeira requisição, definir TTL
  if (currentRequests === 1) {
    await redis.expire(rateLimitKey, Math.floor(RATE_LIMIT_WINDOW / 1000));
  }
  
  // Verificar se excedeu o limite
  if (currentRequests > RATE_LIMIT_REQUESTS) {
    // Registrar possível ataque
    await trackPotentialAttack(ip);
    
    // Estender o tempo de bloqueio
    await redis.expire(rateLimitKey, Math.floor(RATE_LIMIT_PENALTY / 1000));
    
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.floor(RATE_LIMIT_PENALTY / 1000)),
        },
      }
    );
  }
  
  // Continuar com a requisição
  return NextResponse.next();
}

/**
 * Rastreia potenciais ataques e adiciona IPs à blocklist se necessário
 */
async function trackPotentialAttack(ip: string) {
  const attackKey = `agrotm:attack:${ip}`;
  
  // Incrementar contador de possíveis ataques
  const attackCount = await redis.incr(attackKey);
  
  // Definir TTL se for o primeiro registro
  if (attackCount === 1) {
    await redis.expire(attackKey, Math.floor(ATTACK_WINDOW / 1000));
  }
  
  // Se exceder o limite, adicionar à blocklist
  if (attackCount > ATTACK_THRESHOLD) {
    await redis.sadd(BLOCKLIST_KEY, ip);
    logger.error(`IP ${ip} added to blocklist due to suspected attack`);
    
    // Notificar sistema de monitoramento (webhook para Slack, Discord, etc)
    await notifySecurityTeam(ip, attackCount);
  }
}

/**
 * Notifica a equipe de segurança sobre possíveis ataques
 */
async function notifySecurityTeam(ip: string, attackCount: number) {
  // Implementação de webhook para Discord/Slack ou outro sistema
  const webhookUrl = process.env.SECURITY_WEBHOOK_URL;
  
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🚨 **Alerta de Segurança** 🚨\nIP ${ip} bloqueado após ${attackCount} tentativas suspeitas.\nHorário: ${new Date().toISOString()}`,
        }),
      });
    } catch (error) {
      logger.error('Failed to notify security team:', error);
    }
  }
}

/**
 * Adiciona manualmente um IP à blocklist
 */
export async function addToBlocklist(ip: string) {
  await redis.sadd(BLOCKLIST_KEY, ip);
      logger.info(`IP ${ip} manually added to blocklist`);
  return true;
}

/**
 * Remove um IP da blocklist
 */
export async function removeFromBlocklist(ip: string) {
  await redis.srem(BLOCKLIST_KEY, ip);
      logger.info(`IP ${ip} removed from blocklist`);
  return true;
}

/**
 * Obtém a lista completa de IPs bloqueados
 */
export async function getBlocklist() {
  return await redis.smembers(BLOCKLIST_KEY);
}