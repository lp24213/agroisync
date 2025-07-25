# Playbook: Resposta a Ataques DDoS

## 1. Detecção

- Monitoramento detecta aumento anormal de tráfego (Prometheus, Grafana, alertas)
- Confirmar ataque via logs, dashboards, alertas de cloud provider

## 2. Contenção

- Ativar rate limiting e WAF (Web Application Firewall)
- Bloquear IPs suspeitos (via security-service ou firewall)
- Redirecionar tráfego para CDN/anti-DDoS (Cloudflare, AWS Shield, etc)

## 3. Comunicação

- Notificar time de segurança e infraestrutura
- Atualizar stakeholders e status page

## 4. Erradicação

- Identificar vetores de ataque
- Ajustar regras de firewall/WAF
- Atualizar dependências e patches

## 5. Recuperação

- Monitorar tráfego e estabilidade
- Remover bloqueios temporários conforme necessário

## 6. Pós-incidente

- Documentar ataque, resposta e lições aprendidas
- Atualizar playbooks e regras de segurança

## Checklist Rápido

- [ ] Ataque detectado e confirmado
- [ ] Contenção aplicada (rate limit, WAF, bloqueio de IP)
- [ ] Time de segurança notificado
- [ ] Stakeholders informados
- [ ] Vetores de ataque identificados
- [ ] Recuperação executada
- [ ] Pós-incidente documentado
