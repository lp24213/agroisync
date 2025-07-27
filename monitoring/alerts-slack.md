# Integração de Alertas Gratuita (Slack)

Exemplo de integração gratuita de alertas de incidentes:

1. Crie um Incoming Webhook no Slack (https://api.slack.com/messaging/webhooks).
2. No backend, envie POST para a URL do webhook:

```js
fetch('https://hooks.slack.com/services/SEU/WEBHOOK/URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: '🚨 Incidente detectado no AGROTM!' })
});
```

Adapte para Teams, Telegram, Email, SMS conforme necessidade.
