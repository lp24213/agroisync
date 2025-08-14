# 🚀 Configuração das Novas Credenciais do AWS Amplify CLI - AGROTM

## 📋 Visão Geral

Este documento contém as instruções para configurar as novas credenciais de acesso do AWS Amplify CLI para o projeto AGROTM.

## 🔑 Novas Credenciais

```
Access Key ID: AKIARXUJLK4EQEIIMUS2
Secret Access Key: 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
Region: us-east-1
Output: json
```

## 🖥️ Configuração Automática

### Windows (PowerShell)

1. **Execute o script PowerShell:**
   ```powershell
   .\setup-amplify-cli-credentials.ps1
   ```

2. **Ou execute diretamente no PowerShell:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\setup-amplify-cli-credentials.ps1
   ```

### Linux/macOS (Bash)

1. **Torne o script executável:**
   ```bash
   chmod +x setup-amplify-cli-credentials.sh
   ```

2. **Execute o script:**
   ```bash
   ./setup-amplify-cli-credentials.sh
   ```

## 🔧 Configuração Manual

### 1. Configurar AWS CLI

```bash
aws configure
```

**Insira as seguintes informações:**
- AWS Access Key ID: `AKIARXUJLK4EQEIIMUS2`
- AWS Secret Access Key: `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`
- Default region name: `us-east-1`
- Default output format: `json`

### 2. Configurar Variáveis de Ambiente

#### Windows (PowerShell)
```powershell
$env:AWS_ACCESS_KEY_ID = "AKIARXUJLK4EQEIIMUS2"
$env:AWS_SECRET_ACCESS_KEY = "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"
$env:AWS_REGION = "us-east-1"
$env:AWS_DEFAULT_OUTPUT = "json"
```

#### Linux/macOS (Bash)
```bash
export AWS_ACCESS_KEY_ID="AKIARXUJLK4EQEIIMUS2"
export AWS_SECRET_ACCESS_KEY="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"
export AWS_REGION="us-east-1"
export AWS_DEFAULT_OUTPUT="json"
```

### 3. Adicionar ao Arquivo de Perfil do Shell

#### Windows
Adicione ao arquivo de perfil do PowerShell (`$PROFILE`):
```powershell
[Environment]::SetEnvironmentVariable("AWS_ACCESS_KEY_ID", "AKIARXUJLK4EQEIIMUS2", "User")
[Environment]::SetEnvironmentVariable("AWS_SECRET_ACCESS_KEY", "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", "User")
[Environment]::SetEnvironmentVariable("AWS_REGION", "us-east-1", "User")
```

#### Linux/macOS
Adicione ao `~/.bashrc`, `~/.zshrc` ou `~/.profile`:
```bash
export AWS_ACCESS_KEY_ID="AKIARXUJLK4EQEIIMUS2"
export AWS_SECRET_ACCESS_KEY="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"
export AWS_REGION="us-east-1"
export AWS_DEFAULT_OUTPUT="json"
```

## ✅ Verificação da Configuração

### 1. Testar Autenticação AWS
```bash
aws sts get-caller-identity
```

**Resposta esperada:**
```json
{
    "UserId": "AIDARXUJLK4EQEIIMUS2",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/username"
}
```

### 2. Testar Acesso ao Amplify
```bash
aws amplify list-apps --region us-east-1 --max-items 1
```

### 3. Verificar Configuração Atual
```bash
aws configure list
```

## 🚀 Próximos Passos

### 1. Inicializar o Projeto Amplify
```bash
amplify init
```

### 2. Configurar o Ambiente
```bash
amplify configure
```

### 3. Fazer Push das Alterações
```bash
amplify push
```

### 4. Publicar o Projeto
```bash
amplify publish
```

## 📁 Arquivos Criados

Após executar os scripts, os seguintes arquivos serão criados:

- `amplify-cli-credentials.json` - Configuração das credenciais
- `amplify-cli-config.json` - Configuração do projeto Amplify

## 🔒 Segurança

### ⚠️ Importante
- **NUNCA** compartilhe suas credenciais AWS
- **NUNCA** commite credenciais no Git
- Use sempre variáveis de ambiente ou arquivos de configuração seguros
- Considere usar IAM Roles para produção

### 🔐 Boas Práticas
- Rotacione suas chaves regularmente
- Use políticas IAM com privilégios mínimos
- Monitore o uso das credenciais
- Use AWS CloudTrail para auditoria

## 🆘 Solução de Problemas

### Erro: "Unable to locate credentials"
```bash
# Verificar se as variáveis estão definidas
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY

# Reconfigurar AWS CLI
aws configure
```

### Erro: "Access Denied"
- Verifique se as credenciais têm as permissões necessárias
- Confirme se a região está correta
- Verifique se a conta AWS está ativa

### Erro: "Invalid credentials"
- Verifique se as chaves estão corretas
- Confirme se as chaves não expiraram
- Tente regenerar as chaves no console AWS

## 📚 Recursos Adicionais

- [Documentação oficial do AWS CLI](https://docs.aws.amazon.com/cli/)
- [Documentação oficial do Amplify CLI](https://docs.amplify.aws/cli/)
- [Guia de configuração do AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- [Melhores práticas de segurança AWS](https://aws.amazon.com/security/security-learning/)

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs de erro
2. Consulte a documentação oficial
3. Verifique as permissões IAM
4. Teste com credenciais de teste

---

**🔐 Configuração concluída com sucesso!**

Agora você pode usar o AWS Amplify CLI com as novas credenciais para o projeto AGROTM.
