# Exemplo de Trigger MongoDB (Atlas)

MongoDB Atlas permite triggers gratuitos para eventos como insert/update/delete.

Exemplo: Trigger para enviar alerta Slack ao inserir novo usuário admin.

1. No Atlas, vá em Triggers > Add Trigger
2. Configure para collection `users`, operação `insert`
3. Código exemplo:

```js
exports = function(changeEvent) {
  if (changeEvent.fullDocument.role === 'admin') {
    const url = '<SEU_WEBHOOK_SLACK>';
    const body = { text: `Novo admin cadastrado: ${changeEvent.fullDocument.email}` };
    return context.http.post({ url, body: JSON.stringify(body), headers: { 'Content-Type': ['application/json'] } });
  }
};
```

Triggers locais podem ser simulados com scripts de polling e alertas.
