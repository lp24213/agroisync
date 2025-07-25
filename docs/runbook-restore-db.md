# Runbook: Restore de Banco de Dados

## 1. Identificação

- Verifique qual banco precisa ser restaurado (Postgres, MySQL, MongoDB, etc)
- Identifique o backup mais recente e íntegro

## 2. Preparação

- Notifique o time de incidentes
- Isolar o banco afetado (se necessário)
- Garanta acesso ao ambiente de restore

## 3. Execução

- Siga o script de restore correspondente:
  - Postgres: `scripts/restore-postgres.sh <backup.sql>`
  - MySQL: `scripts/restore-mysql.sh <backup.sql>`
  - MongoDB: `scripts/restore-mongo.sh <backup.archive>`
- Monitore logs e progresso

## 4. Validação

- Verifique integridade dos dados restaurados
- Execute queries de validação
- Monitore dashboards de saúde

## 5. Comunicação

- Atualize stakeholders sobre status
- Documente o processo e resultados
