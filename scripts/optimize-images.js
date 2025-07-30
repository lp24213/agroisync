#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const config = {
  inputDir: 'public/assets/images',
  outputDir: 'public/assets/images/optimized',
  formats: ['webp', 'avif'],
  sizes: {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200,
    hero: 1920
  },
  quality: {
    webp: 80,
    avif: 75,
    jpeg: 85
  }
};

// Ensure output directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Get all image files recursively
function getImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getImageFiles(fullPath));
    } else if (/\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Optimize image
async function optimizeImage(inputPath, outputPath, format, width, quality) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Resize if width is specified and image is larger
    if (width && metadata.width > width) {
      image.resize(width, null, { withoutEnlargement: true });
    }
    
    // Convert to format
    switch (format) {
      case 'webp':
        await image.webp({ quality }).toFile(outputPath);
        break;
      case 'avif':
        await image.avif({ quality }).toFile(outputPath);
        break;
      case 'jpeg':
        await image.jpeg({ quality }).toFile(outputPath);
        break;
      default:
        await image.toFile(outputPath);
    }
    
    console.log(`✅ Optimized: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

// Generate favicon variants
async function generateFavicons() {
  const faviconSizes = [16, 32, 48, 64, 128, 256];
  const inputPath = path.join(config.inputDir, 'logo/agrotm-icon.svg');
  const outputDir = path.join(config.outputDir, 'favicons');
  
  ensureDir(outputDir);
  
  for (const size of faviconSizes) {
    const outputPath = path.join(outputDir, `favicon-${size}x${size}.png`);
    await optimizeImage(inputPath, outputPath, 'png', size, 90);
  }
  
  // Generate ICO file (16x16, 32x32, 48x48)
  const icoSizes = [16, 32, 48];
  const icoImages = [];
  
  for (const size of icoSizes) {
    const pngPath = path.join(outputDir, `favicon-${size}x${size}.png`);
    const buffer = await sharp(pngPath).png().toBuffer();
    icoImages.push({ size, buffer });
  }
  
  // Note: ICO generation would require additional library
  console.log('📝 ICO generation requires additional library (ico-endec)');
}

// Generate responsive images
async function generateResponsiveImages(inputPath) {
  const relativePath = path.relative(config.inputDir, inputPath);
  const name = path.basename(inputPath, path.extname(inputPath));
  const dir = path.dirname(relativePath);
  
  for (const [sizeName, width] of Object.entries(config.sizes)) {
    const outputDir = path.join(config.outputDir, dir, sizeName);
    ensureDir(outputDir);
    
    for (const format of config.formats) {
      const outputPath = path.join(outputDir, `${name}.${format}`);
      const quality = config.quality[format];
      await optimizeImage(inputPath, outputPath, format, width, quality);
    }
  }
}

// Main function
async function main() {
  console.log('🚀 Starting image optimization...');
  
  ensureDir(config.outputDir);
  
  // Get all image files
  const imageFiles = getImageFiles(config.inputDir);
  console.log(`📁 Found ${imageFiles.length} images to optimize`);
  
  // Generate favicons
  console.log('\n🎨 Generating favicons...');
  await generateFavicons();
  
  // Optimize all images
  console.log('\n🖼️  Optimizing images...');
  for (const imagePath of imageFiles) {
    await generateResponsiveImages(imagePath);
  }
  
  // Generate image manifest
  const manifest = {
    generated: new Date().toISOString(),
    totalImages: imageFiles.length,
    formats: config.formats,
    sizes: config.sizes,
    quality: config.quality
  };
  
  fs.writeFileSync(
    path.join(config.outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('\n✅ Image optimization completed!');
  console.log(`📊 Manifest saved to: ${path.join(config.outputDir, 'manifest.json')}`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, generateFavicons, generateResponsiveImages }; 