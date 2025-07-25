# Playbook de Incident Response

## 1. Detecção

- Monitoramento alerta sobre incidente (ex: downtime, vazamento, ataque)
- Confirmar o incidente via logs, dashboards, alertas

## 2. Comunicação

- Notificar time de resposta (Slack, Teams, PagerDuty)
- Notificar stakeholders (email, canal de status)
- Atualizar status page (se aplicável)

## 3. Contenção

- Isolar sistemas afetados
- Ativar scripts de failover/disaster recovery
- Bloquear acessos suspeitos

## 4. Erradicação

- Identificar causa raiz
- Remover vulnerabilidades
- Atualizar sistemas/segredos

## 5. Recuperação

- Restaurar serviços a partir de backup
- Validar integridade dos dados
- Monitorar estabilidade

## 6. Pós-incidente

- Documentar lições aprendidas
- Atualizar playbooks/runbooks
- Realizar post-mortem com equipe

## Checklist Rápido

- [ ] Incidente detectado e confirmado
- [ ] Time de resposta notificado
- [ ] Stakeholders informados
- [ ] Contenção aplicada
- [ ] Causa raiz identificada
- [ ] Recuperação executada
- [ ] Pós-incidente documentado
