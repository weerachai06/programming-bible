# Codecov Configuration
# NextJS-specific Codecov configuration

This directory contains the Codecov configuration for the NextJS React Design Patterns project.

## Setup

1. **Repository Setup**: Add `CODECOV_TOKEN` to your GitHub repository secrets
2. **Coverage Generation**: Coverage is generated using Vitest with v8 provider
3. **Upload**: Coverage reports are automatically uploaded via GitHub Actions

## Configuration Details

### Coverage Targets
- **Project Coverage**: 80% minimum
- **Patch Coverage**: 75% minimum
- **Precision**: 2 decimal places

### Paths
- Only covers `nextjs/src/` directory
- Ignores other directories in the monorepo (rust/, docs/, etc.)

### Flags
- `nextjs`: Identifies coverage from the NextJS application

### Status Checks
The configuration includes status checks for:
- Project-level coverage
- Patch-level coverage (for PR reviews)

## Usage

### Local Testing
```bash
cd nextjs
pnpm test:coverage
```

### CI/CD Integration
Coverage is automatically uploaded to Codecov on:
- Push to `main` or `develop` branches
- Pull requests targeting these branches

### Viewing Reports
1. Visit [codecov.io](https://codecov.io)
2. Navigate to your repository
3. View coverage reports and trends

## Troubleshooting

### Common Issues
1. **Missing Token**: Ensure `CODECOV_TOKEN` is set in GitHub secrets
2. **Path Issues**: Verify coverage files are generated in `nextjs/coverage/`
3. **Upload Failures**: Check GitHub Actions logs for upload errors

### Debug Commands
```bash
# Generate coverage locally
pnpm test:coverage

# Check coverage files
ls -la nextjs/coverage/

# Validate Codecov config (if codecov CLI is installed)
codecov --dry-run
```