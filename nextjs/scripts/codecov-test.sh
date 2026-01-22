#!/usr/bin/env bash

# Codecov Upload Script for NextJS
# This script helps test Codecov upload locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔧 NextJS Codecov Upload Script${NC}"
echo "================================="

# Check if we're in the nextjs directory
if [[ ! -f "package.json" ]] || [[ ! $(grep -q "react-design-pattern" package.json 2>/dev/null) ]]; then
    echo -e "${RED}❌ Error: Must run from nextjs directory${NC}"
    exit 1
fi

# Check if coverage directory exists
if [[ ! -d "coverage" ]]; then
    echo -e "${YELLOW}⚠️  Coverage directory not found. Running tests...${NC}"
    pnpm test:coverage
fi

# Check for CODECOV_TOKEN
if [[ -z "${CODECOV_TOKEN}" ]]; then
    echo -e "${YELLOW}⚠️  CODECOV_TOKEN not set. This is required for upload.${NC}"
    echo "Set it with: export CODECOV_TOKEN=your_token_here"
    echo "Or add it to your .env file"
fi

# Display coverage info
echo -e "${GREEN}📊 Coverage Summary:${NC}"
if [[ -f "coverage/coverage-summary.json" ]]; then
    cat coverage/coverage-summary.json | grep -A 5 -B 1 "total" || echo "Coverage summary not available"
else
    echo "Coverage summary file not found"
fi

# Display coverage files
echo -e "${GREEN}📁 Coverage Files Generated:${NC}"
ls -la coverage/ || echo "No coverage files found"

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Ensure CODECOV_TOKEN is set in GitHub repository secrets"
echo "2. Push changes to trigger GitHub Actions workflow"
echo "3. Check coverage reports at https://codecov.io/gh/YOUR_USERNAME/programming-bible"
echo ""
echo -e "${YELLOW}Local testing:${NC}"
echo "- Generate coverage: pnpm test:coverage"
echo "- View HTML report: open coverage/index.html"