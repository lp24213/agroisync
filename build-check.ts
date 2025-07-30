#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

const packages = [
  'frontend',
  'backend',
  'contracts'
]

const errors: string[] = []

console.log('🔍 Checking build configuration...')

for (const pkg of packages) {
  const packagePath = join(process.cwd(), pkg)
  
  if (!existsSync(packagePath)) {
    console.log(`⚠️  Package ${pkg} not found, skipping...`)
    continue
  }
  
  const packageJsonPath = join(packagePath, 'package.json')
  
  if (!existsSync(packageJsonPath)) {
    console.log(`⚠️  package.json not found in ${pkg}, skipping...`)
    continue
  }
  
  try {
    console.log(`📦 Building ${pkg}...`)
    execSync('pnpm build', { 
      cwd: packagePath, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    })
    console.log(`✅ ${pkg} built successfully`)
  } catch (error) {
    const errorMsg = `❌ Failed to build ${pkg}: ${error}`
    console.error(errorMsg)
    errors.push(errorMsg)
  }
}

if (errors.length > 0) {
  console.error('\n🚨 Build check failed with the following errors:')
  errors.forEach(error => console.error(error))
  process.exit(1)
} else {
  console.log('\n🎉 All packages built successfully!')
} 