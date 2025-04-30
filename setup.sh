#!/bin/bash

# StyleSense AI - Setup Script
# This script sets up the project for development

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up StyleSense AI...${NC}"

# Check if needed commands exist
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}$1 is not installed. Please install it and try again.${NC}"
    exit 1
  fi
}

check_command "node"
check_command "npm"

# Create uploads directory for the server
mkdir -p server/uploads/temp
echo -e "${GREEN}Created uploads directory for temporary files${NC}"

# Server setup
echo -e "${YELLOW}Setting up server...${NC}"
cd server

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env 2>/dev/null || echo -e "${RED}No .env.example file found. Creating a basic .env file...${NC}"
  
  # If copy failed, create a basic .env file
  if [ ! -f .env ]; then
    cat > .env << EOF
# Server environment
NODE_ENV=development
PORT=5000

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stylesense
DB_USER=postgres
DB_PASSWORD=postgres

# JWT configuration
JWT_SECRET=your-secret-key-should-be-long-and-secure
JWT_EXPIRES_IN=24h

# AWS S3 configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=stylesense-dev

# Logging
LOG_LEVEL=debug

# CORS configuration
CORS_ORIGIN=http://localhost:3000
EOF
    echo -e "${GREEN}Created basic .env file${NC}"
  fi
fi

# Modify package.json to remove TensorFlow dependency
echo -e "${YELLOW}Updating package.json to remove TensorFlow dependency...${NC}"
# This would be done with a proper JSON manipulation tool in a real script
# For now, we'll just remind the user to replace the package.json

echo -e "${YELLOW}Please replace your server/package.json with the one provided in the updated-server-package artifact${NC}"

# Install server dependencies
echo -e "${YELLOW}Installing server dependencies...${NC}"
npm install

# Build server
echo -e "${YELLOW}Building server...${NC}"
npm run build

# Client setup
echo -e "${YELLOW}Setting up client...${NC}"
cd ../client

# Install client dependencies
echo -e "${YELLOW}Installing client dependencies...${NC}"
npm install

# Create .env file for client if it doesn't exist
if [ ! -f .env ]; then
  cat > .env << EOF
REACT_APP_API_BASE_URL=http://localhost:5000/api
EOF
  echo -e "${GREEN}Created client .env file${NC}"
fi

cd ..

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}To start the server:${NC}"
echo -e "  cd server && npm run dev"
echo -e "${YELLOW}To start the client:${NC}"
echo -e "  cd client && npm start"
echo -e ""
echo -e "${YELLOW}Note: Make sure to set up your AWS credentials in server/.env for S3 file storage${NC}"
echo -e "${YELLOW}If you don't have AWS credentials, you'll need to modify the code to use local file storage instead${NC}"