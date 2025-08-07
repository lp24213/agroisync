const fs = require('fs');
const path = require('path');

// Função para preparar o build estático
function prepareStaticBuild() {
  const apiPath = path.join(__dirname, '../app/api/[...path]');
  const backupPath = path.join(__dirname, '../app/api/[...path].backup');
  
  // Verificar se o arquivo existe
  if (fs.existsSync(apiPath)) {
    // Fazer backup do diretório
    if (fs.existsSync(backupPath)) {
      fs.rmSync(backupPath, { recursive: true, force: true });
    }
    
    // Renomear o diretório para backup
    fs.renameSync(apiPath, backupPath);
    console.log('✅ Arquivo de API dinâmica movido para backup');
  }
}

// Função para restaurar após o build
function restoreAfterBuild() {
  const apiPath = path.join(__dirname, '../app/api/[...path]');
  const backupPath = path.join(__dirname, '../app/api/[...path].backup');
  
  // Verificar se existe backup
  if (fs.existsSync(backupPath)) {
    // Remover diretório atual se existir
    if (fs.existsSync(apiPath)) {
      fs.rmSync(apiPath, { recursive: true, force: true });
    }
    
    // Restaurar o backup
    fs.renameSync(backupPath, apiPath);
    console.log('✅ Arquivo de API dinâmica restaurado');
  }
}

// Executar baseado no argumento
const action = process.argv[2];

if (action === 'prepare') {
  prepareStaticBuild();
} else if (action === 'restore') {
  restoreAfterBuild();
} else {
  console.log('Uso: node prepare-static-build.js [prepare|restore]');
}
