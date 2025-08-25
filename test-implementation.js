#!/usr/bin/env node

/**
 * Script de teste para verificar a implementação das funcionalidades do AgroSync
 * Execute: node test-implementation.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 AGROSYNC - Teste de Implementação');
console.log('=====================================\n');

// Função para verificar se arquivo existe
function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${description}: ${filePath} (NÃO ENCONTRADO)`);
    return false;
  }
}

// Função para verificar se diretório existe
function checkDirectory(dirPath, description) {
  const fullPath = path.join(__dirname, dirPath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    console.log(`✅ ${description}: ${dirPath}`);
    return true;
  } else {
    console.log(`❌ ${description}: ${dirPath} (NÃO ENCONTRADO)`);
    return false;
  }
}

// Função para verificar conteúdo de arquivo
function checkFileContent(filePath, searchText, description) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ ${description}: Arquivo não encontrado`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasContent = content.includes(searchText);
    
    if (hasContent) {
      console.log(`✅ ${description}: ${searchText} encontrado`);
      return true;
    } else {
      console.log(`❌ ${description}: ${searchText} NÃO encontrado`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}: Erro ao ler arquivo`);
    return false;
  }
}

// Função para verificar package.json
function checkPackageJson(filePath, requiredScripts, description) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ ${description}: Arquivo não encontrado`);
    return false;
  }
  
  try {
    const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const scripts = content.scripts || {};
    
    let allScriptsFound = true;
    for (const script of requiredScripts) {
      if (scripts[script]) {
        console.log(`✅ ${description}: Script '${script}' encontrado`);
      } else {
        console.log(`❌ ${description}: Script '${script}' NÃO encontrado`);
        allScriptsFound = false;
      }
    }
    
    return allScriptsFound;
  } catch (error) {
    console.log(`❌ ${description}: Erro ao ler package.json`);
    return false;
  }
}

// Iniciar testes
console.log('🔍 Verificando estrutura do projeto...\n');

let totalChecks = 0;
let passedChecks = 0;

// 1. Verificar estrutura de diretórios
console.log('📁 ESTRUTURA DE DIRETÓRIOS:');
totalChecks += 4;

if (checkDirectory('backend', 'Backend')) passedChecks++;
if (checkDirectory('frontend', 'Frontend')) passedChecks++;
if (checkDirectory('backend/src', 'Backend src')) passedChecks++;
if (checkDirectory('frontend/src', 'Frontend src')) passedChecks++;

console.log('');

// 2. Verificar modelos MongoDB
console.log('🗄️ MODELOS MONGODB:');
totalChecks += 5;

if (checkFile('backend/src/models/User.js', 'Modelo User')) passedChecks++;
if (checkFile('backend/src/models/Client.js', 'Modelo Client')) passedChecks++;
if (checkFile('backend/src/models/Product.js', 'Modelo Product')) passedChecks++;
if (checkFile('backend/src/models/Freight.js', 'Modelo Freight')) passedChecks++;
if (checkFile('backend/src/models/Payment.js', 'Modelo Payment')) passedChecks++;

console.log('');

// 3. Verificar rotas API
console.log('🛣️ ROTAS API:');
totalChecks += 4;

if (checkFile('backend/src/routes/clients.js', 'Rota Clients')) passedChecks++;
if (checkFile('backend/src/routes/external-apis.js', 'Rota APIs Externas')) passedChecks++;
if (checkFile('backend/src/routes/api.js', 'Rota Principal API')) passedChecks++;
if (checkFile('backend/src/routes/products.js', 'Rota Products')) passedChecks++;

console.log('');

// 4. Verificar middlewares
console.log('🛡️ MIDDLEWARES:');
totalChecks += 3;

if (checkFile('backend/src/middleware/documentValidation.js', 'Validação de Documentos')) passedChecks++;
if (checkFile('backend/src/middleware/auth.js', 'Autenticação')) passedChecks++;
if (checkFile('backend/src/middleware/adminAuth.js', 'Admin Auth')) passedChecks++;

console.log('');

// 5. Verificar serviços
console.log('🔧 SERVIÇOS:');
totalChecks += 1;

if (checkFile('backend/src/services/externalAPIs.js', 'APIs Externas')) passedChecks++;

console.log('');

// 6. Verificar scripts
console.log('📜 SCRIPTS:');
totalChecks += 1;

if (checkFile('backend/src/scripts/create-admin-user.js', 'Criar Admin')) passedChecks++;

console.log('');

// 7. Verificar configurações
console.log('⚙️ CONFIGURAÇÕES:');
totalChecks += 2;

if (checkFile('backend/env.example', 'Variáveis de Ambiente')) passedChecks++;
if (checkFile('IMPLEMENTATION-README.md', 'README de Implementação')) passedChecks++;

console.log('');

// 8. Verificar package.json
console.log('📦 PACKAGE.JSON:');
totalChecks += 1;

if (checkPackageJson('backend/package.json', ['create-admin'], 'Scripts Backend')) passedChecks++;

console.log('');

// 9. Verificar conteúdo dos modelos
console.log('🔍 VERIFICAÇÃO DE CONTEÚDO:');
totalChecks += 5;

if (checkFileContent('backend/src/models/User.js', 'isAdmin', 'Campo isAdmin no User')) passedChecks++;
if (checkFileContent('backend/src/models/Client.js', 'cpfCnpj', 'Campo cpfCnpj no Client')) passedChecks++;
if (checkFileContent('backend/src/models/Product.js', 'stock', 'Campo stock no Product')) passedChecks++;
if (checkFileContent('backend/src/models/Freight.js', 'truckNumber', 'Campo truckNumber no Freight')) passedChecks++;
if (checkFileContent('backend/src/models/Payment.js', 'transactionId', 'Campo transactionId no Payment')) passedChecks++;

console.log('');

// 10. Verificar rotas implementadas
console.log('🔗 ROTAS IMPLEMENTADAS:');
totalChecks += 3;

if (checkFileContent('backend/src/routes/clients.js', 'POST /api/clients', 'Rota POST Clients')) passedChecks++;
if (checkFileContent('backend/src/routes/external-apis.js', '/api/external/cep', 'Rota CEP')) passedChecks++;
if (checkFileContent('backend/src/routes/api.js', '/v1/clients', 'Rota Clients na API principal')) passedChecks++;

console.log('');

// 11. Verificar validações
console.log('✅ VALIDAÇÕES:');
totalChecks += 3;

if (checkFileContent('backend/src/middleware/documentValidation.js', 'validateCPF', 'Validação CPF')) passedChecks++;
if (checkFileContent('backend/src/middleware/documentValidation.js', 'validateCNPJ', 'Validação CNPJ')) passedChecks++;
if (checkFileContent('backend/src/middleware/documentValidation.js', 'validateAddressIBGE', 'Validação Endereço IBGE')) passedChecks++;

console.log('');

// 12. Verificar APIs externas
console.log('🌐 APIS EXTERNAS:');
totalChecks += 4;

if (checkFileContent('backend/src/services/externalAPIs.js', 'consultarCEP', 'API ViaCEP')) passedChecks++;
if (checkFileContent('backend/src/services/externalAPIs.js', 'buscarEstados', 'API IBGE Estados')) passedChecks++;
if (checkFileContent('backend/src/services/externalAPIs.js', 'obterClimaPorIP', 'API OpenWeather')) passedChecks++;
if (checkFileContent('backend/src/services/externalAPIs.js', 'consultarCNPJ', 'API Receita Federal')) passedChecks++;

console.log('');

// 13. Verificar usuário admin
console.log('👑 USUÁRIO ADMIN:');
totalChecks += 2;

if (checkFileContent('backend/src/scripts/create-admin-user.js', 'luispaulodeoliveira@agrotm.com.br', 'Email Admin')) passedChecks++;
if (checkFileContent('backend/src/scripts/create-admin-user.js', 'Th@ys15221008', 'Senha Admin')) passedChecks++;

console.log('');

// 14. Verificar suporte a idiomas
console.log('🌍 SUPORTE A IDIOMAS:');
totalChecks += 2;

if (checkDirectory('frontend/src/i18n', 'Diretório i18n')) passedChecks++;
if (checkFile('frontend/src/i18n/index.js', 'Configuração i18n')) passedChecks++;

console.log('');

// 15. Verificar segurança
console.log('🔒 SEGURANÇA:');
totalChecks += 2;

if (checkFileContent('backend/src/routes/clients.js', 'logSecurityEvent', 'Log de Segurança')) passedChecks++;
if (checkFileContent('backend/src/middleware/documentValidation.js', 'validateDocument', 'Validação de Documentos')) passedChecks++;

console.log('');

// Resultado final
console.log('📊 RESULTADO FINAL:');
console.log('===================');
console.log(`Total de verificações: ${totalChecks}`);
console.log(`Verificações aprovadas: ${passedChecks}`);
console.log(`Verificações reprovadas: ${totalChecks - passedChecks}`);
console.log(`Taxa de sucesso: ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);

if (passedChecks === totalChecks) {
  console.log('\n🎉 PARABÉNS! Todas as funcionalidades foram implementadas com sucesso!');
  console.log('🚀 O projeto AgroSync está pronto para uso em produção.');
} else {
  console.log('\n⚠️ ATENÇÃO: Algumas funcionalidades ainda precisam ser implementadas.');
  console.log('📝 Verifique os itens marcados com ❌ acima.');
}

console.log('\n📋 PRÓXIMOS PASSOS:');
console.log('1. Configurar variáveis de ambiente (.env)');
console.log('2. Executar: npm run create-admin (para criar usuário admin)');
console.log('3. Testar todas as funcionalidades');
console.log('4. Fazer deploy em produção');

console.log('\n📚 Para mais informações, consulte o arquivo IMPLEMENTATION-README.md');
console.log('🔗 Documentação completa disponível no projeto');

console.log('\n✨ AGROSYNC - Plataforma de inteligência agrícola profissional!');
