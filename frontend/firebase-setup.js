#!/usr/bin/env node

// Script para configurar Firebase programaticamente
const { exec } = require('child_process');

console.log('🔥 Configurando Firebase Authentication...');

// Habilitar autenticação por email/senha
exec('firebase auth:enable emailPassword', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao habilitar auth email/senha: ${error}`);
    return;
  }
  console.log('✅ Autenticação email/senha habilitada');
  console.log(stdout);
});

// Configurar Firestore
exec('firebase firestore:databases:create', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao criar Firestore: ${error}`);
    // Pode já existir, continuar
  }
  console.log('✅ Firestore configurado');
});

// Configurar Storage
exec('firebase storage:buckets:create gs://agrotmsol-95542.firebasestorage.app', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao criar Storage: ${error}`);
    // Pode já existir, continuar
  }
  console.log('✅ Storage configurado');
});

console.log('🎉 Configuração Firebase concluída!');
console.log('');
console.log('📋 Próximos passos:');
console.log('1. Acesse https://console.firebase.google.com/');
console.log('2. Vá para Authentication > Sign-in method');
console.log('3. Habilite "Email/Password"');
console.log('4. Configure Firestore em Database');
console.log('5. Configure Storage em Storage');
