#!/bin/bash

# Script to initialize and push the DeFi Dashboard repository to GitHub

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}DeFi Dashboard - GitHub Push Script${NC}"
echo "This script will help you push your DeFi Dashboard project to GitHub."
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: Git is not installed. Please install Git and try again.${NC}"
    exit 1
fi

# Check if the directory is already a git repository
if [ -d ".git" ]; then
    echo -e "${YELLOW}This directory is already a Git repository.${NC}"
else
    echo -e "${GREEN}Initializing Git repository...${NC}"
    git init
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to initialize Git repository.${NC}"
        exit 1
    fi
fi

# Add all files to the repository
echo -e "${GREEN}Adding files to the repository...${NC}"
git add .
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to add files to the repository.${NC}"
    exit 1
fi

# Commit the changes
echo -e "${GREEN}Committing changes...${NC}"
git commit -m "Initial commit: DeFi Dashboard project"
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to commit changes.${NC}"
    exit 1
fi

# Ask for GitHub repository URL
echo ""
echo -e "${YELLOW}Please enter your GitHub repository URL:${NC}"
read -p "URL: " repo_url

if [ -z "$repo_url" ]; then
    echo -e "${RED}Error: No repository URL provided.${NC}"
    exit 1
fi

# Add remote repository
echo -e "${GREEN}Adding remote repository...${NC}"
git remote add origin $repo_url
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to add remote repository.${NC}"
    exit 1
fi

# Push to GitHub
echo -e "${GREEN}Pushing to GitHub...${NC}"
git push -u origin main
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Trying to push to master branch instead...${NC}"
    git push -u origin master
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to push to GitHub. Please check your repository URL and credentials.${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}Success! Your DeFi Dashboard project has been pushed to GitHub.${NC}"
echo "Repository URL: $repo_url"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Set up GitHub Pages or Vercel for deployment"
echo "2. Configure environment variables in your deployment platform"
echo "3. Share your project with others!"
echo ""