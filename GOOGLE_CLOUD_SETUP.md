# Configuração do Google Cloud e Play Integrity API

## 1. Criar Projeto no Google Cloud
1. Acesse https://console.cloud.google.com
2. Clique em "Criar Projeto"
3. Nome do projeto: `AgroiSync`
4. Clique em "Criar"

## 2. Habilitar a Play Integrity API
1. No Console do Google Cloud
2. Menu lateral -> APIs e Serviços -> Biblioteca
3. Pesquise por "Play Integrity API"
4. Clique em "Ativar"

## 3. Criar Credenciais
1. Menu lateral -> APIs e Serviços -> Credenciais
2. Clique em "Criar Credenciais" -> "ID do cliente OAuth"
3. Tipo: Aplicativo Android
4. Nome do pacote: `com.agroisync.mobile`
5. SHA-1: Execute no terminal dentro da pasta do projeto:
   ```bash
   keytool -list -v -keystore "C:/Users/luisp/OneDrive/Área de Trabalho/KEY PORRA/keystore.jks" -alias upload
   ```
6. Copie a impressão digital SHA-1
7. Cole no campo SHA-1
8. Clique em "Criar"

## 4. Baixar google-services.json
1. No Console do Firebase
2. Configurações do Projeto
3. Adicionar app -> Android
4. Package name: `com.agroisync.mobile`
5. Baixar `google-services.json`
6. Colocar em: `frontend/android/app/google-services.json`

## 5. Verificar Integridade
Para verificar se um dispositivo está executando uma versão legítima do app:

```java
PlayIntegrityManager integrityManager = new PlayIntegrityManager(context);
integrityManager.verifyDeviceIntegrity(new IntegrityCallback() {
    @Override
    public void onSuccess() {
        // App é legítimo
    }
    
    @Override
    public void onFailure(String error) {
        // App pode ser modificado/pirata
    }
});
```

## 6. Testar
1. Instale o app em um dispositivo/emulador com Play Services
2. Verifique os logs para confirmar que a verificação passou
3. O app só funcionará em dispositivos com:
   - Play Services instalado
   - Versão oficial da Play Store
   - Dispositivo não rooteado
   - Build oficial do app

## Observações de Segurança
- A verificação é feita no primeiro launch
- O token tem validade curta (minutos)
- Recomenda-se verificar novamente em operações sensíveis
- O backend deve validar o token com a API do Google

## Próximos Passos
1. Implementar validação do token no backend
2. Adicionar verificações periódicas
3. Bloquear funções sensíveis se falhar
4. Monitorar tentativas de bypass