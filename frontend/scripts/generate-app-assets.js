/**
 * Script para gerar todos os assets do app (ícones, splash screens)
 * Requer: sharp (npm install --save-dev sharp)
 * 
 * Uso: node scripts/generate-app-assets.js
 */

const fs = require('fs');
const path = require('path');

// Cores do Agroisync
const PRIMARY_COLOR = '#22c55e'; // Verde principal
const BACKGROUND_COLOR = '#ffffff'; // Branco

// Tamanhos de ícones necessários
const ANDROID_ICONS = [
  { size: 48, name: 'icon-48.png' },
  { size: 72, name: 'icon-72.png' },
  { size: 96, name: 'icon-96.png' },
  { size: 144, name: 'icon-144.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' }
];

const IOS_ICONS = [
  { size: 20, name: 'icon-20.png' },
  { size: 29, name: 'icon-29.png' },
  { size: 40, name: 'icon-40.png' },
  { size: 58, name: 'icon-58.png' },
  { size: 60, name: 'icon-60.png' },
  { size: 76, name: 'icon-76.png' },
  { size: 80, name: 'icon-80.png' },
  { size: 87, name: 'icon-87.png' },
  { size: 114, name: 'icon-114.png' },
  { size: 120, name: 'icon-120.png' },
  { size: 152, name: 'icon-152.png' },
  { size: 167, name: 'icon-167.png' },
  { size: 180, name: 'icon-180.png' },
  { size: 1024, name: 'icon-1024.png' }
];

const IOS_SPLASH_SCREENS = [
  { width: 1242, height: 2688, name: 'iphone-6.5.png' }, // iPhone 11 Pro Max, 12 Pro Max, etc
  { width: 828, height: 1792, name: 'iphone-6.1.png' }, // iPhone XR, 11
  { width: 1242, height: 2208, name: 'iphone-5.5.png' }, // iPhone 8 Plus
  { width: 750, height: 1334, name: 'iphone-4.7.png' }, // iPhone 8
  { width: 640, height: 1136, name: 'iphone-4.0.png' }, // iPhone SE
  { width: 2048, height: 2732, name: 'ipad-12.9.png' }, // iPad Pro 12.9"
  { width: 1668, height: 2388, name: 'ipad-11.png' }, // iPad Pro 11"
  { width: 1668, height: 2224, name: 'ipad-10.5.png' }, // iPad Pro 10.5"
  { width: 1536, height: 2048, name: 'ipad-9.7.png' } // iPad
];

async function checkDependencies() {
  try {
    require.resolve('sharp');
    return true;
  } catch (e) {
    console.error('❌ Dependência "sharp" não encontrada!');
    console.log('\n📦 Instale com: npm install --save-dev sharp\n');
    return false;
  }
}

async function generateIcons() {
  const sharp = require('sharp');
  const publicDir = path.join(__dirname, '..', 'public');
  const logoPath = path.join(publicDir, 'LOGO_AGROISYNC_TRANSPARENTE.png');
  
  if (!fs.existsSync(logoPath)) {
    console.error(`❌ Logo não encontrado em: ${logoPath}`);
    return false;
  }

  console.log('🎨 Gerando ícones Android...');
  const androidDir = path.join(publicDir, 'app-icons', 'android');
  if (!fs.existsSync(androidDir)) {
    fs.mkdirSync(androidDir, { recursive: true });
  }

  for (const icon of ANDROID_ICONS) {
    const outputPath = path.join(androidDir, icon.name);
    // Ícones Android podem ter transparência
    await sharp(logoPath)
      .resize(icon.size, icon.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outputPath);
    
    // Também copiar para public root (para manifest.json)
    if (icon.size === 192 || icon.size === 512) {
      fs.copyFileSync(outputPath, path.join(publicDir, icon.name));
    }
    
    console.log(`  ✅ ${icon.name} (${icon.size}x${icon.size})`);
  }

  console.log('\n🍎 Gerando ícones iOS...');
  const iosDir = path.join(publicDir, 'app-icons', 'ios');
  if (!fs.existsSync(iosDir)) {
    fs.mkdirSync(iosDir, { recursive: true });
  }

  // Logo com fundo verde para iOS
  const logoBuffer = await sharp(logoPath)
    .resize(1024, 1024, { fit: 'contain', background: { r: 34, g: 197, b: 94, alpha: 1 } })
    .png()
    .toBuffer();

  for (const icon of IOS_ICONS) {
    const outputPath = path.join(iosDir, icon.name);
    await sharp(logoBuffer)
      .resize(icon.size, icon.size)
      .png()
      .toFile(outputPath);
    console.log(`  ✅ ${icon.name} (${icon.size}x${icon.size})`);
  }

  console.log('\n📱 Gerando Splash Screens iOS...');
  const splashDir = path.join(iosDir, 'splash');
  if (!fs.existsSync(splashDir)) {
    fs.mkdirSync(splashDir, { recursive: true });
  }

  for (const splash of IOS_SPLASH_SCREENS) {
    const outputPath = path.join(splashDir, splash.name);
    const logoSize = Math.min(splash.width, splash.height) * 0.4; // 40% da tela
    
    // Redimensionar logo para o splash
    const splashLogo = await sharp(logoPath)
      .resize(Math.floor(logoSize), Math.floor(logoSize), { 
        fit: 'contain', 
        background: { r: 34, g: 197, b: 94, alpha: 1 } 
      })
      .png()
      .toBuffer();
    
    // Criar splash screen com logo centralizado
    await sharp({
      create: {
        width: splash.width,
        height: splash.height,
        channels: 4,
        background: { r: 34, g: 197, b: 94, alpha: 1 } // Verde #22c55e
      }
    })
      .composite([
        {
          input: splashLogo,
          top: Math.floor((splash.height - logoSize) / 2),
          left: Math.floor((splash.width - logoSize) / 2)
        }
      ])
      .png()
      .toFile(outputPath);
    
    console.log(`  ✅ ${splash.name} (${splash.width}x${splash.height})`);
  }

  return true;
}

async function generateFeatureGraphic() {
  const sharp = require('sharp');
  const publicDir = path.join(__dirname, '..', 'public');
  const logoPath = path.join(publicDir, 'LOGO_AGROISYNC_TRANSPARENTE.png');
  const outputPath = path.join(publicDir, 'feature-graphic.png');

  console.log('\n🎨 Gerando Feature Graphic (Google Play)...');
  
  // Redimensionar logo primeiro
  const logoBuffer = await sharp(logoPath)
    .resize(300, 300, { 
      fit: 'contain', 
      background: { r: 0, g: 0, b: 0, alpha: 0 } 
    })
    .png()
    .toBuffer();
  
  await sharp({
    create: {
      width: 1024,
      height: 500,
      channels: 4,
      background: { r: 34, g: 197, b: 94, alpha: 1 } // Verde #22c55e
    }
  })
    .composite([
      {
        input: logoBuffer,
        top: 100,
        left: 50
      }
    ])
    .png()
    .toFile(outputPath);
  
  console.log(`  ✅ feature-graphic.png (1024x500)`);
}

async function main() {
  console.log('🚀 Gerando assets do Agroisync App...\n');

  const hasSharp = await checkDependencies();
  if (!hasSharp) {
    process.exit(1);
  }

  try {
    await generateIcons();
    await generateFeatureGraphic();
    
    console.log('\n✅ Todos os assets foram gerados com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Verifique os ícones gerados em frontend/public/app-icons/');
    console.log('   2. Revise o manifest.json e index.html');
    console.log('   3. Teste o PWA no navegador');
    console.log('   4. Submeta para as lojas seguindo o GUIA_PUBLICACAO_APP.md\n');
  } catch (error) {
    console.error('\n❌ Erro ao gerar assets:', error);
    process.exit(1);
  }
}

// Executar
if (require.main === module) {
  main();
}

module.exports = { generateIcons, generateFeatureGraphic };

