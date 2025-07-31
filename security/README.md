# Auditoria Premium de Contratos AGROTM

## Auditoria Automática (Slither)

Execute:

```
pnpm audit:contracts
```

- Gera o relatório em `security/slither-report.json`.
- Analise o relatório para identificar vulnerabilidades, warnings e recomendações.

## Cobertura de Contratos

Execute:

```
pnpm coverage:contracts
```

- Gera relatório de cobertura dos contratos Solidity.
- Garanta cobertura >80% para máxima segurança.

## Limpeza de Docker

Execute:

```
pnpm docker:prune
```

- Remove imagens e volumes Docker antigos para liberar espaço.

## Deploy Seguro na Vercel

- Configure todas as variáveis sensíveis apenas pelo painel da Vercel.
- Nunca exponha segredos em arquivos versionados ou no frontend.
- O projeto está pronto para deploy sem erros na Vercel, desde que as variáveis estejam corretamente configuradas.

## Rollback Automático e Monitoramento

### Rollback Automático
- **CI/CD**: Rollback automático em caso de falha no deploy ou health check
- **Manual**: Workflow `rollback.yml` para rollback manual via GitHub Actions
- **Notificações**: Alertas via webhook em caso de falha

### Monitoramento Contínuo
- **Health Check**: Verificação automática a cada 5 minutos
- **Endpoints**: Monitoramento de frontend, backend e APIs críticas
- **Alertas**: Notificações automáticas em caso de problemas
- **Issues**: Criação automática de issues para investigação

### Configuração de Secrets

Para usar rollback e monitoramento, configure os seguintes secrets no GitHub:

- `NOTIFICATION_WEBHOOK_URL`: Webhook para notificações (Slack, Teams, etc.)
- `BACKEND_URL`: URL do backend para health checks
- `HEALTH_LOG_WEBHOOK`: Webhook opcional para logs de saúde
