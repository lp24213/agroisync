@echo off
REM 🚀 AGROISYNC IA - Script de Inicialização (Windows)

echo 🧠 Iniciando Agroisync IA Admin...

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado! Instale Python 3.8+
    exit /b 1
)

REM Verificar se .env existe
if not exist .env (
    echo ⚠️ Arquivo .env não encontrado!
    echo 📋 Copiando env.example para .env...
    copy env.example .env
    echo ✅ Arquivo .env criado!
    echo 🔧 IMPORTANTE: Edite o arquivo .env e configure:
    echo    - IA_SECRET_TOKEN
    echo    - ALLOWED_IPS
    exit /b 1
)

REM Verificar se ambiente virtual existe
if not exist venv (
    echo 📦 Criando ambiente virtual...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo 📥 Instalando dependências...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

REM Iniciar servidor
echo 🚀 Iniciando servidor FastAPI...
python main.py

