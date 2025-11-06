Android CI: como gerar AAB (bundle) no GitHub Actions

Resumo
-------
Este repositório já contém um workflow GitHub Actions que gera um AAB (Android App Bundle) e publica o arquivo como artifact de workflow.

Fluxo rápido (recomendado)
--------------------------
1. Gere o Base64 do seu arquivo keystore (.jks) localmente (não enviar o arquivo para o repositório):

   No PowerShell (Windows):

   ```powershell
   $bytes = [System.IO.File]::ReadAllBytes('C:\caminho\para\seu\keystore.jks')
   $b64 = [System.Convert]::ToBase64String($bytes)
   $b64 | clip
   ```

   O comando acima coloca o Base64 na sua área de transferência (clip). Guarde esse valor em segurança — ele será o conteúdo do secret `KEYSTORE_BASE64`.

2. No repositório GitHub, vá em Settings -> Secrets -> Actions e adicione os seguintes secrets:

   - KEYSTORE_BASE64: (valor do Base64 do keystore)
   - KEYSTORE_PASSWORD: senha do keystore (storePassword)
   - KEY_ALIAS: alias da chave
   - KEY_PASSWORD: senha da chave (keyPassword)

3. Disparar o workflow:

   - Vá para a aba Actions no GitHub, selecione o workflow "Build Android AAB" e clique em "Run workflow" (ou faça push para branch main) — o job irá rodar e ao final publicará o artifact chamado `agroisync-aab`.

4. Baixar o AAB:

   - Após execução, abra o run correspondente e baixe o artifact `agroisync-aab` — o arquivo .aab estará dentro.

Executar localmente (alternativa)
--------------------------------
Se preferir gerar o AAB localmente (no seu Windows) sem adicionar secrets ao GitHub, use o script PowerShell já incluído:

  1. Copie `frontend/android/keystore.properties.template` para `frontend/android/keystore.properties` e preencha os campos (storeFile, keyAlias, storePassword, keyPassword).
  2. Execute a partir da raiz do repositório:

     ```powershell
     .\scripts\build-android-release.ps1
     ```

  O script pedirá o caminho para o keystore e as senhas (não aparecerão na tela). Ao final ele roda `gradlew bundleRelease` e mostrar o caminho do .aab gerado em `frontend/android/app/build/outputs/bundle/release/`.

Observações de segurança
------------------------
- Nunca commit o arquivo `frontend/android/keystore.properties` nem o .jks no repositório.
- Mantenha as senhas e o Base64 do keystore em local seguro.

Limitações e opções para entregar o AAB "na Área de Trabalho"
-----------------------------------------------------------
Não tenho acesso direto à sua máquina para salvar o AAB na sua Área de Trabalho. As opções disponíveis:

- Você adiciona os secrets ao GitHub e eu já configurei o workflow — o output será um artifact que você baixa manualmente (mais seguro).
- Você executa o script local `scripts/build-android-release.ps1` aqui mesmo (ele grava o AAB na sua máquina) — esse é o caminho mais direto se você tem o Android SDK/Java instalados.

Precisa que eu faça mais alguma coisa? Posso:

- Ajustar o workflow para enviar o .aab para um release automaticamente.
- Adicionar um job que publica o AAB para um Google Play internal track (requer service-account e configuração adicional).
