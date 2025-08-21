#!/bin/bash

# AGROISYNC - Correção Definitiva da Configuração Amplify
# Este script corrige todas as configurações do Amplify para deployment perfeito

echo "🚀 AGROISYNC - Correção Definitiva Amplify"
echo "=========================================="

# 1. CORRIGIR AMPLIFY.YML PRINCIPAL
echo "⚙️ Corrigindo amplify.yml..."

cat > amplify.yml << 'EOF'
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - echo "🔧 Configurando ambiente..."
            - node --version
            - npm --version
            - echo "📦 Instalando dependências..."
            - npm ci
        build:
          commands:
            - echo "🏗️ Building aplicação..."
            - npm run build
            - echo "✅ Build concluído"
        postBuild:
          commands:
            - echo "📋 Verificando build..."
            - ls -la out/
            - echo "🎉 Deploy pronto!"
      artifacts:
        baseDirectory: out
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
    appRoot: frontend
EOF

echo "✅ amplify.yml corrigido"

# 2. CORRIGIR NEXT.CONFIG.JS PARA AMPLIFY
echo "📱 Corrigindo next.config.js para Amplify..."

cat > frontend/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para AWS Amplify
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Configurações de imagem para exportação estática
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './imageLoader.js'
  },
  
  // Variáveis de ambiente
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.agroisync.com',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://agroisync.com',
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
  },
  
  // Configurações de build
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Configurações de headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirecionamentos
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig;
EOF

echo "✅ next.config.js corrigido"

# 3. CRIAR IMAGE LOADER PARA AMPLIFY
echo "🖼️ Criando image loader..."

cat > frontend/imageLoader.js << 'EOF'
export default function imageLoader({ src, width, quality }) {
  return `${src}?w=${width}&q=${quality || 75}`;
}
EOF

echo "✅ Image loader criado"

# 4. CORRIGIR TSCONFIG.JSON DO FRONTEND
echo "📝 Corrigindo tsconfig.json do frontend..."

cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "ES2020"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "imageLoader.js"
  ],
  "exclude": ["node_modules", "out", ".next"]
}
EOF

echo "✅ tsconfig.json do frontend corrigido"

# 5. CRIAR ARQUIVO DE VARIÁVEIS DE AMBIENTE PARA PRODUÇÃO
echo "🔐 Criando arquivo de ambiente para produção..."

cat > frontend/.env.production << 'EOF'
# AGROISYNC - Produção
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_URL=https://api.agroisync.com
NEXT_PUBLIC_APP_URL=https://agroisync.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
EOF

echo "✅ .env.production criado"

# 6. CORRIGIR BACKEND-CONFIG.JSON NO AMPLIFY
echo "⚙️ Corrigindo backend-config.json..."

if [ -f "amplify/backend/backend-config.json" ]; then
    cat > amplify/backend/backend-config.json << 'EOF'
{
  "hosting": {
    "amplifyhosting": {
      "service": "amplifyhosting",
      "type": "cicd",
      "lastPushTimeStamp": "2024-01-15T12:00:00.000Z"
    }
  },
  "api": {
    "agroisync": {
      "service": "AppSync",
      "providerPlugin": "awscloudformation",
      "dependsOn": [
        {
          "category": "auth",
          "resourceName": "agroisync",
          "attributes": ["UserPoolId"]
        }
      ],
      "output": {
        "authConfig": {
          "defaultAuthentication": {
            "authenticationType": "AMAZON_COGNITO_USER_POOLS"
          },
          "additionalAuthenticationProviders": []
        }
      }
    }
  },
  "auth": {
    "agroisync": {
      "service": "Cognito",
      "providerPlugin": "awscloudformation",
      "dependsOn": [],
      "customAuth": false,
      "frontendAuthConfig": {
        "socialProviders": [],
        "usernameAttributes": ["email"],
        "signupAttributes": ["email"],
        "passwordProtectionSettings": {
          "passwordPolicyMinLength": 8,
          "passwordPolicyCharacters": []
        },
        "mfaConfiguration": "OFF",
        "mfaTypes": ["SMS"]
      }
    }
  },
  "storage": {
    "agroisyncstorage": {
      "service": "S3",
      "providerPlugin": "awscloudformation",
      "dependsOn": []
    }
  },
  "function": {
    "adminFunctions": {
      "service": "Lambda",
      "providerPlugin": "awscloudformation",
      "dependsOn": []
    },
    "stakingFunctions": {
      "service": "Lambda",
      "providerPlugin": "awscloudformation",
      "dependsOn": []
    },
    "nftFunctions": {
      "service": "Lambda",
      "providerPlugin": "awscloudformation",
      "dependsOn": []
    }
  }
}
EOF
    echo "✅ backend-config.json corrigido"
else
    echo "⚠️ backend-config.json não encontrado"
fi

# 7. CRIAR SCRIPT DE BUILD OTIMIZADO
echo "🔨 Criando script de build otimizado..."

cat > frontend/scripts/build-amplify.js << 'EOF'
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AGROISYNC - Build Amplify Otimizado');
console.log('=====================================');

try {
  // 1. Limpar builds anteriores
  console.log('🧹 Limpando builds anteriores...');
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }
  
  // 2. Verificar Next.js
  console.log('📋 Verificando configuração...');
  const nextConfigExists = fs.existsSync('next.config.js');
  if (!nextConfigExists) {
    throw new Error('next.config.js não encontrado');
  }
  
  // 3. Build da aplicação
  console.log('🏗️ Building aplicação...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 4. Verificar output
  console.log('✅ Verificando output...');
  if (!fs.existsSync('out')) {
    throw new Error('Diretório out não foi criado');
  }
  
  const files = fs.readdirSync('out');
  console.log(`📁 Arquivos gerados: ${files.length}`);
  
  // 5. Verificar arquivos essenciais
  const essentialFiles = ['index.html', '_next'];
  for (const file of essentialFiles) {
    if (!fs.existsSync(path.join('out', file))) {
      console.warn(`⚠️ Arquivo essencial não encontrado: ${file}`);
    }
  }
  
  console.log('🎉 Build concluído com sucesso!');
  
} catch (error) {
  console.error('❌ Erro no build:', error.message);
  process.exit(1);
}
EOF

mkdir -p frontend/scripts
chmod +x frontend/scripts/build-amplify.js

echo "✅ Script de build otimizado criado"

# 8. ATUALIZAR PACKAGE.JSON DO FRONTEND COM SCRIPTS CORRETOS
echo "📦 Atualizando scripts do package.json..."

# Backup do package.json atual
cp frontend/package.json frontend/package.json.backup

# Adicionar scripts ao package.json existente
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
pkg.scripts = {
  ...pkg.scripts,
  'build:amplify': 'node scripts/build-amplify.js',
  'build:final': 'next build',
  'export': 'next export',
  'build:export': 'next build && next export',
  'preview': 'next start',
  'analyze': 'ANALYZE=true next build'
};
fs.writeFileSync('frontend/package.json', JSON.stringify(pkg, null, 2));
"

echo "✅ Scripts do package.json atualizados"

echo ""
echo "🎉 CORREÇÃO AMPLIFY CONCLUÍDA!"
echo "=============================="
echo "✅ amplify.yml otimizado para deployment"
echo "✅ next.config.js configurado para exportação estática"
echo "✅ Image loader criado para Amplify"
echo "✅ tsconfig.json otimizado"
echo "✅ .env.production configurado"
echo "✅ backend-config.json corrigido"
echo "✅ Script de build otimizado criado"
echo "✅ Package.json atualizado com scripts corretos"
echo ""
echo "📊 COMANDOS PARA TESTE LOCAL:"
echo "cd frontend"
echo "npm run build:export"
echo "npx serve out"
echo ""
echo "🚀 READY FOR AMPLIFY DEPLOYMENT!"
echo "Faça commit e push para trigger automático do deploy."
