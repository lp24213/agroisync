# Instruções para Corrigir o Erro de Build no Vercel

## Problema Identificado

O build do projeto no Vercel está falhando devido a problemas na configuração do Next.js e versões incompatíveis de dependências.

## Correções Necessárias

### 1. Corrigir o arquivo `next.config.js`

O arquivo atual tem uma duplicação de configuração do PWA, o que pode causar conflitos.

**Solução**: Substitua o conteúdo do arquivo `next.config.js` no diretório `frontend` pelo conteúdo do arquivo `next.config.js.corrected` que foi criado.

```bash
# No PowerShell (Windows)
copy next.config.js.corrected frontend\next.config.js -Force
```

### 2. Atualizar as dependências no `package.json`

As versões muito recentes de algumas dependências podem ser incompatíveis com o Vercel.

**Solução**: Substitua o conteúdo do arquivo `package.json` no diretório `frontend` pelo conteúdo do arquivo `package.json.corrected` que foi criado.

```bash
# No PowerShell (Windows)
copy package.json.corrected frontend\package.json -Force
```

### 3. Reinstalar as dependências

Após atualizar o `package.json`, é necessário reinstalar as dependências.

```bash
# No diretório frontend
cd frontend
npm install
```

### 4. Fazer commit e push das alterações

Após aplicar as correções e verificar que tudo está funcionando corretamente, faça commit e push das alterações.

```bash
# No diretório frontend
cd frontend
git add next.config.js package.json
git commit -m "Correção de build no Vercel: ajuste no next.config.js e downgrade de dependências"
git push origin main
```

### 5. Verificar o build no Vercel

Após enviar as alterações para o GitHub, verifique se o build no Vercel está funcionando corretamente.

## Explicação das Correções

1. **next.config.js**: Removemos a duplicação de configuração do PWA, que estava definida tanto nos parâmetros do `withPWA` quanto no objeto `nextConfig`.

2. **package.json**: Fizemos downgrade de várias dependências para versões mais estáveis e compatíveis com o Vercel:
   - Next.js: de 14.2.1 para 13.4.19
   - TailwindCSS: de 3.4.3 para 3.3.3
   - Framer Motion: de 11.0.0 para 10.16.4
   - Ethers: de 6.10.0 para 6.7.1
   - Firebase: de 10.10.0 para 10.4.0
   - React-i18next: de 13.0.1 para 13.2.2
   - i18next: de 23.10.0 para 23.5.1
   - E outras dependências de desenvolvimento
