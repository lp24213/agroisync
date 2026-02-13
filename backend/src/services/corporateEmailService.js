import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { nanoid } from 'nanoid';
import logger from '../utils/logger.js';
import emailEncryption from './emailEncryption.js';

// Mailparser será importado dinamicamente quando necessário (Cloudflare Workers compatível)

// Configurar DOMPurify para ambiente Node.js
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * Serviço completo de Email Corporativo
 * Suporta SMTP (envio) e IMAP (recebimento) usando Hostinger
 */
class CorporateEmailService {
  constructor() {
    this.imapConnections = new Map(); // Cache de conexões IMAP
    this.smtpConnections = new Map(); // Cache de transportadores SMTP
  }

  /**
   * Obter ou criar transportador SMTP para uma conta
   * @param {Object} account - Conta de email com configurações SMTP
   * @returns {Promise<Object>} - Transportador nodemailer
   */
  async getSmtpTransporter(account) {
    const cacheKey = `${account.email}-smtp`;
    
    if (this.smtpConnections.has(cacheKey)) {
      const transporter = this.smtpConnections.get(cacheKey);
      try {
        await transporter.verify();
        return transporter;
      } catch (error) {
        logger.warn(`Conexão SMTP inválida para ${account.email}, recriando...`, error);
        this.smtpConnections.delete(cacheKey);
      }
    }

    try {
      const password = emailEncryption.decrypt(account.encrypted_password);

      const transporter = nodemailer.createTransport({
        host: account.smtp_host || 'smtp.hostinger.com',
        port: account.smtp_port || 465,
        secure: account.secure === 1 || account.smtp_port === 465, // true para 465, false para outras portas
        auth: {
          user: account.email,
          pass: password
        },
        tls: {
          rejectUnauthorized: true,
          minVersion: 'TLSv1.2'
        },
        connectionTimeout: 10000, // 10 segundos
        greetingTimeout: 5000,
        socketTimeout: 10000
      });

      // Verificar conexão
      await transporter.verify();
      
      this.smtpConnections.set(cacheKey, transporter);
      logger.info(`Transportador SMTP criado para ${account.email}`);
      
      return transporter;
    } catch (error) {
      logger.error(`Erro ao criar transportador SMTP para ${account.email}:`, error);
      throw new Error(`Falha ao conectar SMTP: ${error.message}`);
    }
  }

  /**
   * Obter ou criar cliente IMAP para uma conta
   * @param {Object} account - Conta de email com configurações IMAP
   * @returns {Promise<ImapFlow>} - Cliente IMAP
   */
  async getImapClient(account) {
    const cacheKey = `${account.email}-imap`;
    
    if (this.imapConnections.has(cacheKey)) {
      const client = this.imapConnections.get(cacheKey);
      if (client && !client.loggedOut) {
        try {
          await client.status('INBOX');
          return client;
        } catch (error) {
          logger.warn(`Conexão IMAP inválida para ${account.email}, recriando...`, error);
          this.imapConnections.delete(cacheKey);
          if (client && !client.loggedOut) {
            try {
              await client.logout();
            } catch (e) {
              // Ignorar erros de logout
            }
          }
        }
      }
    }

    try {
      const password = emailEncryption.decrypt(account.encrypted_password);

      const client = new ImapFlow({
        host: account.imap_host || 'imap.hostinger.com',
        port: account.imap_port || 993,
        secure: account.secure === 1,
        auth: {
          user: account.email,
          pass: password
        },
        logger: process.env.NODE_ENV === 'development' ? logger : false
      });

      // Conectar e autenticar
      await client.connect();
      logger.info(`Cliente IMAP conectado para ${account.email}`);
      
      this.imapConnections.set(cacheKey, client);
      
      // Cleanup ao desconectar
      client.on('close', () => {
        this.imapConnections.delete(cacheKey);
        logger.info(`Conexão IMAP fechada para ${account.email}`);
      });

      return client;
    } catch (error) {
      logger.error(`Erro ao criar cliente IMAP para ${account.email}:`, error);
      throw new Error(`Falha ao conectar IMAP: ${error.message}`);
    }
  }

  /**
   * Enviar email via SMTP
   * @param {string} accountId - ID da conta de email
   * @param {Object} account - Dados da conta de email do banco
   * @param {string|Array} to - Destinatário(s)
   * @param {string} subject - Assunto
   * @param {string} html - Conteúdo HTML (será sanitizado)
   * @param {string} text - Conteúdo texto plano (opcional)
   * @param {Array} attachments - Anexos (opcional) [{filename, path, content, contentType}]
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendEmail(accountId, account, to, subject, html, text = null, attachments = []) {
    const startTime = Date.now();
    
    try {
      // Sanitizar HTML
      const sanitizedHtml = purify.sanitize(html || '', {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'img', 'div', 'span'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style']
      });

      const transporter = await this.getSmtpTransporter(account);

      // Processar anexos
      const processedAttachments = attachments.map(att => {
        const attachment = {
          filename: att.filename || 'anexo',
          contentType: att.contentType || 'application/octet-stream'
        };

        // Se for File (FormData)
        if (att.content && typeof att.content.read === 'function') {
          // Stream de arquivo
          attachment.content = att.content;
        } else if (att.contentBase64) {
          // Base64 string
          attachment.content = Buffer.from(att.contentBase64, 'base64');
        } else if (att.content) {
          // Buffer ou string direta
          attachment.content = Buffer.isBuffer(att.content) ? att.content : Buffer.from(att.content);
        } else if (att.path) {
          // Caminho do arquivo
          attachment.path = att.path;
        }

        if (att.contentId) attachment.contentId = att.contentId;
        if (att.cid) attachment.cid = att.cid;

        return attachment;
      }).filter(att => att.content || att.path); // Filtrar anexos inválidos

      const mailOptions = {
        from: `"${account.name || 'AgroSync'}" <${account.email}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject: subject || '(Sem assunto)',
        html: sanitizedHtml,
        text: text || this.htmlToText(sanitizedHtml),
        attachments: processedAttachments
      };

      const info = await transporter.sendMail(mailOptions);
      
      const duration = Date.now() - startTime;
      logger.performance('sendEmail', duration, { 
        accountId, 
        to: Array.isArray(to) ? to.length : 1,
        subject,
        messageId: info.messageId 
      });

      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`Erro ao enviar email de ${account.email}:`, error);
      
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  /**
   * Buscar mensagens da caixa de entrada (com cache)
   * @param {Object} account - Dados da conta de email
   * @param {string} folder - Pasta IMAP (padrão: INBOX)
   * @param {number} limit - Limite de mensagens (padrão: 50)
   * @param {number} offset - Offset para paginação
   * @param {Object} env - Environment (para acesso ao banco de cache)
   * @returns {Promise<Array>} - Array de mensagens
   */
  async fetchInbox(account, folder = 'INBOX', limit = 50, offset = 0, env = null) {
    const startTime = Date.now();
    
    try {
      const client = await this.getImapClient(account);
      
      // Selecionar pasta
      const lock = await client.getMailboxLock(folder);
      try {
        // Buscar UIDs das mensagens (mais recentes primeiro)
        const messages = client.fetch(`${Math.max(1, client.mailbox.exists - offset - limit + 1)}:${client.mailbox.exists}`, {
          envelope: true,
          uid: true,
          flags: true,
          bodyStructure: true,
          internalDate: true
        }, {
          changedSince: null
        });

        const results = [];
        let count = 0;
        const skip = offset;

        for await (const message of messages) {
          if (count++ < skip) continue;
          if (results.length >= limit) break;

          const envelope = message.envelope;
          
          results.push({
            uid: message.uid,
            seq: message.seq,
            messageId: envelope.messageId || `local-${message.uid}`,
            from: this.formatAddresses(envelope.from),
            to: this.formatAddresses(envelope.to),
            cc: this.formatAddresses(envelope.cc),
            bcc: this.formatAddresses(envelope.bcc),
            subject: envelope.subject || '(Sem assunto)',
            date: envelope.date ? envelope.date.toISOString() : message.internalDate.toISOString(),
            flags: message.flags,
            isRead: message.flags.has('\\Seen'),
            isDeleted: message.flags.has('\\Deleted'),
            hasAttachments: this.hasAttachments(message.bodyStructure),
            size: message.size || 0
          });
        }

        // Salvar mensagens no cache (se env disponível)
        if (env && env.DB && results.length > 0) {
          try {
            await this.cacheMessages(env.DB, account.id, results, folder);
          } catch (cacheError) {
            logger.warn('Erro ao cachear mensagens (não crítico):', cacheError);
          }
        }

        const duration = Date.now() - startTime;
        logger.performance('fetchInbox', duration, { 
          accountId: account.id,
          folder,
          count: results.length 
        });

        return {
          success: true,
          messages: results,
          total: client.mailbox.exists,
          folder
        };
      } finally {
        lock.release();
      }
    } catch (error) {
      logger.error(`Erro ao buscar inbox de ${account.email}:`, error);
      return {
        success: false,
        error: error.message,
        messages: []
      };
    }
  }

  /**
   * Buscar mensagem completa por UID
   * @param {Object} account - Dados da conta de email
   * @param {number} uid - UID da mensagem
   * @param {string} folder - Pasta IMAP
   * @param {Object} env - Environment (para cache de anexos)
   * @returns {Promise<Object>} - Mensagem completa
   */
  async fetchMessage(account, uid, folder = 'INBOX', env = null) {
    try {
      const client = await this.getImapClient(account);
      const lock = await client.getMailboxLock(folder);
      
      try {
        const message = await client.fetchOne(uid, {
          envelope: true,
          bodyStructure: true,
          source: true
        });

        if (!message) {
          throw new Error('Mensagem não encontrada');
        }

        // Parsear mensagem MIME
        const parsed = await this.parseMessage(message.source);

        // Buscar do cache se disponível (para anexos)
        let cachedMessage = null;
        try {
          if (env && env.DB) {
            const messageId = parsed.messageId || message.envelope.messageId || `local-${uid}`;
            cachedMessage = await env.DB.prepare(`
              SELECT * FROM email_messages 
              WHERE email_account_id = ? AND message_id = ? AND folder = ?
            `).bind(account.id, messageId, folder).first();

            // Se tem anexos no cache, adicionar informações
            if (cachedMessage && cachedMessage.has_attachments === 1) {
              try {
                const cachedAttachments = await env.DB.prepare(`
                  SELECT * FROM email_attachments WHERE message_id = ?
                `).bind(cachedMessage.id).all();

                if (cachedAttachments.results && cachedAttachments.results.length > 0) {
                  // Combinar anexos do cache com os parseados (evitar duplicatas)
                  const cachedAtts = cachedAttachments.results.map(att => ({
                    filename: att.filename,
                    contentType: att.content_type,
                    size: att.size,
                    contentId: att.content_id,
                    filePath: att.file_path,
                    cached: true
                  }));

                  // Adicionar apenas anexos que não existem no parsed
                  const existingFilenames = new Set(parsed.attachments.map(a => a.filename));
                  const newAtts = cachedAtts.filter(a => !existingFilenames.has(a.filename));
                  parsed.attachments = parsed.attachments.concat(newAtts);
                }
              } catch (attError) {
                logger.debug('Erro ao buscar anexos do cache:', attError);
              }
            }
          }
        } catch (cacheError) {
          logger.debug('Erro ao buscar anexos do cache (não crítico):', cacheError);
        }

        const fullMessage = {
          uid: message.uid,
          messageId: parsed.messageId || message.envelope.messageId,
          from: this.formatAddresses(message.envelope.from),
          to: this.formatAddresses(message.envelope.to),
          cc: this.formatAddresses(message.envelope.cc),
          bcc: this.formatAddresses(message.envelope.bcc),
          subject: message.envelope.subject || '(Sem assunto)',
          date: message.envelope.date ? message.envelope.date.toISOString() : new Date().toISOString(),
          html: parsed.html,
          text: parsed.text,
          attachments: parsed.attachments,
          flags: message.flags || new Set(),
          isRead: message.flags?.has('\\Seen') || false,
          isDeleted: message.flags?.has('\\Deleted') || false
        };

        return {
          success: true,
          message: fullMessage
        };
      } finally {
        lock.release();
      }
    } catch (error) {
      logger.error(`Erro ao buscar mensagem ${uid} de ${account.email}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Marcar mensagem como lida
   * @param {Object} account - Dados da conta de email
   * @param {number} uid - UID da mensagem
   * @param {string} folder - Pasta IMAP
   * @returns {Promise<boolean>}
   */
  async markAsRead(account, uid, folder = 'INBOX') {
    try {
      const client = await this.getImapClient(account);
      const lock = await client.getMailboxLock(folder);
      
      try {
        await client.messageFlagsAdd(uid, ['\\Seen'], { uid: true });
        logger.info(`Mensagem ${uid} marcada como lida`);
        return true;
      } finally {
        lock.release();
      }
    } catch (error) {
      logger.error(`Erro ao marcar mensagem como lida:`, error);
      return false;
    }
  }

  /**
   * Deletar mensagem
   * @param {Object} account - Dados da conta de email
   * @param {number} uid - UID da mensagem
   * @param {string} folder - Pasta IMAP
   * @returns {Promise<boolean>}
   */
  async deleteMessage(account, uid, folder = 'INBOX') {
    try {
      const client = await this.getImapClient(account);
      const lock = await client.getMailboxLock(folder);
      
      try {
        await client.messageFlagsAdd(uid, ['\\Deleted'], { uid: true });
        // Opcionalmente, expurgar (remover permanentemente)
        // await client.expunge();
        logger.info(`Mensagem ${uid} marcada para exclusão`);
        return true;
      } finally {
        lock.release();
      }
    } catch (error) {
      logger.error(`Erro ao deletar mensagem:`, error);
      return false;
    }
  }

  /**
   * Parsear mensagem MIME (melhorado com mailparser quando disponível)
   * @private
   */
  async parseMessage(source) {
    try {
      // Tentar usar mailparser se disponível (import dinâmico)
      try {
        const { simpleParser } = await import('mailparser');
        const sourceBuffer = Buffer.isBuffer(source) ? source : Buffer.from(source);
        const parsed = await simpleParser(sourceBuffer);
        
        // Sanitizar HTML
        const html = parsed.html ? purify.sanitize(parsed.html) : '';
        const text = parsed.text || this.htmlToText(html);
        
        // Processar anexos
        const attachments = [];
        if (parsed.attachments && parsed.attachments.length > 0) {
          for (const att of parsed.attachments) {
            let contentBase64 = null;
            if (att.content) {
              if (Buffer.isBuffer(att.content)) {
                contentBase64 = att.content.toString('base64');
              } else if (typeof att.content === 'string') {
                contentBase64 = Buffer.from(att.content).toString('base64');
              }
            }

            attachments.push({
              filename: att.filename || att.contentDisposition?.filename || 'anexo',
              contentType: att.contentType || 'application/octet-stream',
              size: att.size || (att.content ? (Buffer.isBuffer(att.content) ? att.content.length : String(att.content).length) : 0),
              contentId: att.contentId,
              cid: att.cid,
              contentBase64: contentBase64
            });
          }
        }
        
        return {
          html: html || '',
          text: text || '',
          attachments: attachments,
          messageId: parsed.messageId || parsed.headers?.get('message-id')
        };
      } catch (mailparserError) {
        // mailparser não disponível ou erro, usar método simples
        throw new Error('mailparser not available');
      }
    } catch (error) {
      logger.debug('Usando parser simples (mailparser não disponível ou erro):', error.message);
      
      // Fallback para método simples
      const sourceStr = source.toString();
      const htmlMatch = sourceStr.match(/Content-Type: text\/html[^]*?([^]*?)(?=Content-Type:|--=|$)/s);
      const textMatch = sourceStr.match(/Content-Type: text\/plain[^]*?([^]*?)(?=Content-Type:|--=|$)/s);
      
      let html = htmlMatch ? htmlMatch[1].replace(/^[\r\n]+/, '').replace(/[\r\n]+$/, '') : '';
      let text = textMatch ? textMatch[1].replace(/^[\r\n]+/, '').replace(/[\r\n]+$/, '') : '';
      
      html = this.decodeContent(html);
      text = this.decodeContent(text);
      html = purify.sanitize(html);
      
      return {
        html: html || '',
        text: text || this.htmlToText(html),
        attachments: []
      };
    }
  }

  /**
   * Converter HTML para texto
   * @private
   */
  htmlToText(html) {
    if (!html) return '';
    return html
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Decodificar conteúdo (quoted-printable, base64)
   * @private
   */
  decodeContent(content) {
    if (!content) return '';
    // Remover encoding headers e decodificar
    return content
      .replace(/=\r?\n/g, '') // Unfold quoted-printable
      .replace(/=[0-9A-F]{2}/gi, (match) => String.fromCharCode(parseInt(match.substring(1), 16)))
      .trim();
  }

  /**
   * Formatar endereços de email
   * @private
   */
  formatAddresses(addresses) {
    if (!addresses || !Array.isArray(addresses)) return [];
    return addresses.map(addr => ({
      name: addr.name || '',
      address: addr.address || ''
    }));
  }

  /**
   * Verificar se mensagem tem anexos
   * @private
   */
  hasAttachments(bodyStructure) {
    if (!bodyStructure) return false;
    // Lógica simplificada - verificar se há partes adicionais além de texto
    return bodyStructure.childNodes && bodyStructure.childNodes.some(
      node => node.disposition && node.disposition.type === 'attachment'
    );
  }

  /**
   * Cachear mensagens no banco de dados
   * @private
   */
  async cacheMessages(db, accountId, messages, folder) {
    try {
      const now = new Date().toISOString();
      
      for (const msg of messages) {
        const messageId = msg.messageId || `local-${msg.uid}`;
        
        // Verificar se já existe
        const existing = await db.prepare(`
          SELECT id FROM email_messages 
          WHERE email_account_id = ? AND message_id = ? AND folder = ?
        `).bind(accountId, messageId, folder).first();

        if (existing) {
          // Atualizar existente
          await db.prepare(`
            UPDATE email_messages SET
              uid = ?,
              from_address = ?,
              to_address = ?,
              subject = ?,
              date = ?,
              is_read = ?,
              is_deleted = ?,
              has_attachments = ?,
              updated_at = ?
            WHERE id = ?
          `).bind(
            msg.uid,
            JSON.stringify(msg.from),
            JSON.stringify(msg.to),
            msg.subject,
            msg.date,
            msg.isRead ? 1 : 0,
            msg.isDeleted ? 1 : 0,
            msg.hasAttachments ? 1 : 0,
            now,
            existing.id
          ).run();
        } else {
          // Inserir novo
          const cacheId = nanoid();
          await db.prepare(`
            INSERT INTO email_messages (
              id, email_account_id, message_id, uid, folder,
              from_address, to_address, subject, date,
              is_read, is_deleted, has_attachments, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            cacheId,
            accountId,
            messageId,
            msg.uid,
            folder,
            JSON.stringify(msg.from),
            JSON.stringify(msg.to),
            msg.subject,
            msg.date,
            msg.isRead ? 1 : 0,
            msg.isDeleted ? 1 : 0,
            msg.hasAttachments ? 1 : 0,
            now,
            now
          ).run();
        }
      }
      
      logger.debug(`Cacheadas ${messages.length} mensagens para conta ${accountId}`);
    } catch (error) {
      logger.error('Erro ao cachear mensagens:', error);
      throw error;
    }
  }

  /**
   * Buscar mensagens do cache
   * @param {Object} db - Database connection
   * @param {string} accountId - ID da conta
   * @param {string} folder - Pasta
   * @param {number} limit - Limite
   * @param {number} offset - Offset
   */
  async fetchCachedMessages(db, accountId, folder = 'INBOX', limit = 50, offset = 0) {
    try {
      const cached = await db.prepare(`
        SELECT * FROM email_messages
        WHERE email_account_id = ? AND folder = ? AND is_deleted = 0
        ORDER BY date DESC
        LIMIT ? OFFSET ?
      `).bind(accountId, folder, limit, offset).all();

      return {
        success: true,
        messages: (cached.results || []).map(msg => ({
          uid: msg.uid,
          messageId: msg.message_id,
          from: JSON.parse(msg.from_address || '[]'),
          to: JSON.parse(msg.to_address || '[]'),
          subject: msg.subject,
          date: msg.date,
          isRead: msg.is_read === 1,
          isDeleted: msg.is_deleted === 1,
          hasAttachments: msg.has_attachments === 1
        })),
        fromCache: true
      };
    } catch (error) {
      logger.error('Erro ao buscar mensagens do cache:', error);
      return { success: false, messages: [] };
    }
  }

  /**
   * Fechar todas as conexões
   */
  async closeAllConnections() {
    // Fechar conexões IMAP
    for (const [key, client] of this.imapConnections.entries()) {
      try {
        if (client && !client.loggedOut) {
          await client.logout();
        }
      } catch (error) {
        logger.warn(`Erro ao fechar conexão IMAP ${key}:`, error);
      }
    }
    this.imapConnections.clear();

    // Fechar transportadores SMTP (não precisam ser explicitamente fechados)
    this.smtpConnections.clear();
    
    logger.info('Todas as conexões de email fechadas');
  }
}

export default new CorporateEmailService();

