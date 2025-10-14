// @ts-check
import logger from '../utils/logger.js';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function validateTurnstile(req, res, next) {
  try {
    const turnstileToken = req.body.turnstileToken;
    if (!turnstileToken) {
      return res.status(400).json({ error: 'Token de verificação não fornecido' });
    }

    const secret = process.env.CF_TURNSTILE_SECRET_KEY;
    if (!secret) {
      logger.error('CF_TURNSTILE_SECRET_KEY não configurada');
      throw new Error('Configuração de segurança incompleta');
    }

    // Verificação com timeout de 5 segundos
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secret,
          response: turnstileToken,
          remoteip: req.ip
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Erro na verificação: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        logger.warn('Falha na validação Turnstile:', result['error-codes']);
        return res.status(400).json({ 
          error: 'Falha na verificação de segurança',
          details: result['error-codes']
        });
      }

      // Adicionar resultado à requisição para uso posterior
      req.turnstileResult = result;
      next();
    } catch (error) {
      clearTimeout(timeout);
      if (error.name === 'AbortError') {
        throw new Error('Timeout na verificação de segurança');
      }
      throw error;
    }
  } catch (error) {
    logger.error('Erro na validação Turnstile:', error);
    return res.status(500).json({ error: 'Erro na verificação de segurança' });
  }
}