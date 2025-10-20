const fs = require('fs');
const path = require('path');

const filesToFix = [
  'frontend/src/components/AgroisyncHeader.js',
  'frontend/src/components/CloudflareTurnstile.js',
  'frontend/src/components/CompactWeatherWidget.js',
  'frontend/src/components/CryptoRouteHandler.js',
  'frontend/src/components/ErrorBoundary.js',
  'frontend/src/components/GlobalWeatherWidget.js',
  'frontend/src/components/MetaMaskIntegration.js',
  'frontend/src/components/StockTicker.js',
  'frontend/src/components/VisibilityManager.js',
  'frontend/src/contexts/AuthContext.js',
  'frontend/src/pages/AdminPanel.js',
  'frontend/src/pages/AgroisyncForgotPassword.js',
  'frontend/src/pages/AgroisyncLogin.js',
  'frontend/src/pages/AgroisyncMarketplace.js',
  'frontend/src/pages/AgroisyncPlans.js',
  'frontend/src/pages/AgroisyncRegister.js',
  'frontend/src/pages/CryptoDashboard.js',
  'frontend/src/pages/PaymentCreditCard.js',
  'frontend/src/pages/SignupFreight.js',
  'frontend/src/pages/SignupProduct.js',
  'frontend/src/pages/SignupStore.js',
  'frontend/src/pages/UserDashboard.js',
  'frontend/src/services/aiService.js',
  'frontend/src/services/authService.js',
  'frontend/src/services/cryptoService.js',
  'frontend/src/services/freightService.js',
  'frontend/src/services/logger.js',
  'frontend/src/services/messagingService.js',
  'frontend/src/services/osmService.js',
  'frontend/src/services/paymentService.js',
  'frontend/src/services/productService.js',
  'frontend/src/services/validationService.js'
];

console.log('🔥 REMOVENDO CONSOLE.LOG DE PRODUÇÃO\n');

let totalRemoved = 0;

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Arquivo não encontrado: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalLength = content.length;
  
  // Substituir console.log, console.error, console.warn por versão condicional
  // Manter apenas em desenvolvimento
  content = content.replace(
    /(\s+)console\.(log|error|warn|info|debug)\((.*?)\);?/g,
    (match, indent, method, args) => {
      // Se já tem if (process.env.NODE_ENV, pular
      if (content.includes(`if (process.env.NODE_ENV`) && 
          content.indexOf(match) > content.lastIndexOf(`if (process.env.NODE_ENV`)) {
        return match;
      }
      
      totalRemoved++;
      return `${indent}if (process.env.NODE_ENV === 'development') console.${method}(${args});`;
    }
  );

  if (content.length !== originalLength) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} - console.logs envolvidos em if`);
  }
});

console.log(`\n✅ TOTAL: ${totalRemoved} console.* removidos/protegidos`);
console.log('\n🎯 Agora os console.log só aparecem em desenvolvimento!');

