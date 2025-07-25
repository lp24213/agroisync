// Audit logs service: registra todas as ações sensíveis para rastreabilidade e compliance

import { Logger } from '../utils/logger';

export class AuditLogsService {
  private logger: Logger;
  constructor() {
    this.logger = new Logger('AuditLogs');
  }
  log(event: string, details: any) {
    this.logger.info(`[AUDIT] ${event}`, details);
    // Aqui pode-se integrar com SIEM externo
  }
}
