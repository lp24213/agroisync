@echo off
chcp 65001 >nul

echo 🚀 Configurando Deploy Automático - Vercel + GitHub Actions
echo ==========================================================

REM Verificar se estamos no diretório correto
if not exist "package.json" (
    echo ❌ Execute este script na raiz do projeto AGROTM
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Diretório frontend não encontrado
    pause
    exit /b 1
)

echo ✅ Verificando estrutura do projeto...

REM Verificar arquivos necessários
if not exist ".github\workflows\ci-cd.yml" (
    echo ❌ Arquivo necessário não encontrado: .github\workflows\ci-cd.yml
    pause
    exit /b 1
)

if not exist "frontend\vercel.json" (
    echo ❌ Arquivo necessário não encontrado: frontend\vercel.json
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ❌ Arquivo necessário não encontrado: frontend\package.json
    pause
    exit /b 1
)

if not exist "frontend\next.config.js" (
    echo ❌ Arquivo necessário não encontrado: frontend\next.config.js
    pause
    exit /b 1
)

echo ✅ Estrutura do projeto verificada

echo.
echo ℹ️  PRÓXIMOS PASSOS PARA CONFIGURAR O VERCEL:
echo.

echo ℹ️  1. 🌐 Criar Projeto no Vercel:
echo    - Acesse: https://vercel.com/dashboard
echo    - Clique em 'New Project'
echo    - Importe este repositório GitHub
echo    - Configure:
echo      • Framework Preset: Next.js
echo      • Root Directory: frontend
echo      • Build Command: pnpm build
echo      • Output Directory: .next
echo      • Install Command: pnpm install --frozen-lockfile
echo.

echo ℹ️  2. 🔑 Obter Credenciais do Vercel:
echo.

echo ℹ️     VERCEL_TOKEN:
echo    - Acesse: https://vercel.com/account/tokens
echo    - Clique em 'Create Token'
echo    - Nome: AGROTM-GitHub-Actions
echo    - Expiration: No Expiration
echo    - Scope: Full Account
echo    - Copie o token gerado
echo.

echo ℹ️     VERCEL_ORG_ID:
echo    - Acesse: https://vercel.com/account
echo    - Vá para 'Settings' ^> 'General'
echo    - Copie o 'Team ID' (team) ou 'User ID' (pessoal)
echo.

echo ℹ️     VERCEL_PROJECT_ID:
echo    - No dashboard do Vercel, abra seu projeto
echo    - Vá para 'Settings' ^> 'General'
echo    - Copie o 'Project ID'
echo.

echo ℹ️  3. 🔐 Configurar Secrets no GitHub:
echo    - Vá para seu repositório no GitHub
echo    - Settings ^> Secrets and variables ^> Actions
echo    - Adicione os seguintes secrets:
echo      • VERCEL_TOKEN
echo      • VERCEL_ORG_ID
echo      • VERCEL_PROJECT_ID
echo.

echo ℹ️  4. 🚀 Testar Deploy:
echo    - Faça um push para a branch main
echo    - Verifique o status em:
echo      • GitHub: Actions tab
echo      • Vercel: Deployments
echo.

REM Verificar se o Vercel CLI está instalado
vercel --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Vercel CLI encontrado

    echo.
    echo ℹ️  🔧 Comandos úteis do Vercel CLI:
    echo    vercel login                    # Fazer login
    echo    vercel projects                # Listar projetos
    echo    vercel env ls                  # Listar variáveis de ambiente
    echo    vercel logs                    # Ver logs do deploy
    echo    vercel --help                  # Ver todos os comandos
) else (
    echo ⚠️  Vercel CLI não encontrado
    echo    Para instalar: npm i -g vercel
)

echo.
echo ℹ️  📚 Documentação Completa:
echo    - Vercel: https://vercel.com/docs
echo    - GitHub Actions: https://docs.github.com/en/actions
echo    - Este projeto: VERCEL_DEPLOY.md
echo.

echo ✅ Configuração concluída! Siga os passos acima para finalizar.

REM Verificar se há problemas comuns
echo.
echo ℹ️  🔍 Verificações adicionais:

REM Verificar se o frontend tem as dependências necessárias
if exist "frontend\package.json" (
    findstr /C:"\"next\"" "frontend\package.json" >nul
    if %errorlevel% equ 0 (
        echo ✅ Next.js encontrado no frontend
    ) else (
        echo ⚠️  Next.js não encontrado no frontend\package.json
    )

    findstr /C:"\"build\"" "frontend\package.json" >nul
    if %errorlevel% equ 0 (
        echo ✅ Script build encontrado no frontend
    ) else (
        echo ⚠️  Script build não encontrado no frontend\package.json
    )
)

REM Verificar se o workflow está configurado corretamente
findstr /C:"amondnet/vercel-action" ".github\workflows\ci-cd.yml" >nul
if %errorlevel% equ 0 (
    echo ✅ Vercel action configurada no workflow
) else (
    echo ⚠️  Vercel action não encontrada no workflow
)

findstr /C:"working-directory: ./frontend" ".github\workflows\ci-cd.yml" >nul
if %errorlevel% equ 0 (
    echo ✅ Working directory configurado corretamente
) else (
    echo ⚠️  Working directory não configurado no workflow
)

echo.
echo ✅ Script de configuração concluído!
echo.
echo ℹ️  💡 Dica: Execute 'type VERCEL_DEPLOY.md' para ver a documentação completa

pause
