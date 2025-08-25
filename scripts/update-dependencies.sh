#!/bin/bash

echo "🔄 AGROISYNC - Dependency Update Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the root directory of the project${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Checking current dependency status...${NC}"

# Update frontend dependencies
if [ -d "frontend" ]; then
    echo -e "\n${GREEN}🔄 Updating Frontend Dependencies...${NC}"
    cd frontend
    
    # Check for outdated packages
    echo "📊 Checking for outdated packages..."
    npm outdated || true
    
    # Update specific deprecated packages
    echo "🔄 Updating deprecated packages..."
    
    # Update Babel plugins
    npm install --save-dev @babel/plugin-transform-private-methods@latest
    npm install --save-dev @babel/plugin-transform-numeric-separator@latest
    npm install --save-dev @babel/plugin-transform-optional-chaining@latest
    npm install --save-dev @babel/plugin-transform-nullish-coalescing-operator@latest
    npm install --save-dev @babel/plugin-transform-private-property-in-object@latest
    
    # Update ESLint packages
    npm install --save-dev @eslint/object-schema@latest
    npm install --save-dev @eslint/config-array@latest
    
    # Update other deprecated packages
    npm install --save-dev @jridgewell/sourcemap-codec@latest
    
    # Update SVGO
    npm install --save-dev svgo@latest
    
    # Clean install
    echo "🧹 Cleaning and reinstalling dependencies..."
    rm -rf node_modules package-lock.json
    npm install
    
    cd ..
fi

# Update backend dependencies
if [ -d "backend" ]; then
    echo -e "\n${GREEN}🔄 Updating Backend Dependencies...${NC}"
    cd backend
    
    # Check for outdated packages
    echo "📊 Checking for outdated packages..."
    npm outdated || true
    
    # Update specific deprecated packages
    echo "🔄 Updating deprecated packages..."
    
    # Update ESLint
    npm install --save-dev eslint@latest
    
    # Clean install
    echo "🧹 Cleaning and reinstalling dependencies..."
    rm -rf node_modules package-lock.json
    npm install
    
    cd ..
fi

# Update root dependencies if they exist
if [ -f "package.json" ]; then
    echo -e "\n${GREEN}🔄 Updating Root Dependencies...${NC}"
    
    # Check for outdated packages
    echo "📊 Checking for outdated packages..."
    npm outdated || true
    
    # Clean install
    echo "🧹 Cleaning and reinstalling dependencies..."
    rm -rf node_modules package-lock.json
    npm install
fi

echo -e "\n${GREEN}✅ Dependency update completed!${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "1. Test your application to ensure everything still works"
echo "2. Commit the updated package.json and package-lock.json files"
echo "3. Run the build process to verify deprecation warnings are reduced"
echo "4. Consider updating to the latest LTS Node.js version if not already done"

# Check Node.js version
echo -e "\n${YELLOW}📊 Current Node.js version:${NC}"
node --version
npm --version

echo -e "\n${GREEN}🎉 Script completed successfully!${NC}"
