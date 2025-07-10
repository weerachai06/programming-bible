# GitHub Actions CI/CD Setup

## Overview
This project uses GitHub Actions to automatically run unit tests and generate coverage reports on every push and pull request. The workflow is designed to provide comprehensive feedback without relying on external services.

## Workflow Features

### 🔄 Automated Testing
- **Trigger**: Runs on push to `main`/`develop` branches and all pull requests
- **Node.js**: Uses Node.js 20 with pnpm package manager
- **Caching**: Implements pnpm store caching for faster builds
- **Linting**: Runs Biome linting before tests
- **Testing**: Executes all unit tests with Vitest

### 📊 Coverage Reporting
- **Provider**: Uses Vitest with V8 coverage provider
- **Formats**: Generates HTML, JSON, LCOV, and JSON-summary reports
- **Thresholds**: Enforces 80% coverage for:
  - Lines
  - Functions
  - Branches
  - Statements

### 💬 PR Comments
- **Automatic**: Posts coverage summary as PR comment
- **Smart Updates**: Updates existing coverage comment instead of creating new ones
- **Rich Format**: Includes tables, emojis, and detailed breakdown
- **Artifacts**: Provides download links for detailed HTML reports

## Workflow Files

### `.github/workflows/test-coverage.yml`
Main workflow file that orchestrates the entire CI/CD process:

```yaml
name: Unit Tests & Coverage
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

#### Key Steps:
1. **Checkout & Setup**: Code checkout and Node.js/pnpm setup
2. **Caching**: Implements pnpm store caching for performance
3. **Install**: Installs dependencies with frozen lockfile
4. **Lint**: Runs Biome linting
5. **Test**: Executes unit tests with coverage
6. **Parse Coverage**: Generates markdown summary from coverage JSON
7. **Upload Artifacts**: Stores coverage reports for download
8. **Comment on PR**: Posts/updates coverage summary on pull requests
9. **Threshold Check**: Fails workflow if coverage thresholds not met

## Coverage Report Format

The generated coverage report includes:

### 📊 Coverage Table
| Metric | Coverage | Threshold |
|--------|----------|-----------|
| 🌿 **Branches** | XX.XX% | 80% |
| 🔧 **Functions** | XX.XX% | 80% |
| 📝 **Lines** | XX.XX% | 80% |
| 📋 **Statements** | XX.XX% | 80% |

### 📈 Detailed Breakdown
- Total metrics with covered/total counts
- Status indicator (✅ passed / ❌ failed)
- Workflow metadata (run number, commit, etc.)

## Configuration

### Vitest Configuration (`vitest.config.ts`)
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
  reportsDirectory: './coverage',
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### Coverage Exclusions
- `node_modules/**`
- `test/**`
- `**/*.d.ts`
- `**/*.config.*`
- `public/**`
- `scripts/**`
- `.next/**`
- `docs/**`
- `**/*.test.*`
- `**/*.spec.*`

## Usage

### Local Development
```bash
# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# View coverage report
open coverage/index.html
```

### GitHub Actions
The workflow automatically triggers on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Manual Trigger
You can manually trigger the workflow from the GitHub Actions tab.

## Benefits

### ✅ No External Dependencies
- Uses only GitHub's built-in features
- No codecov, coveralls, or other external services
- Fully self-contained within repository

### 🚀 Fast & Efficient
- Caching reduces build times
- Parallel execution where possible
- Smart comment updates reduce noise

### 📊 Comprehensive Reporting
- Multiple report formats
- Detailed coverage breakdown
- Historical tracking via artifacts

### 🔒 Security
- Uses official GitHub actions
- Minimal permissions required
- No secrets or tokens needed for basic functionality

## Troubleshooting

### Coverage Not Generated
- Ensure `@vitest/coverage-v8` is installed
- Check `vitest.config.ts` for correct coverage settings
- Verify test files are being executed

### Workflow Failures
- Check Node.js version compatibility
- Ensure all dependencies are in `package.json`
- Verify pnpm lockfile is up to date

### PR Comments Not Working
- Ensure workflow has `pull-requests: write` permission
- Check if comment template is properly formatted
- Verify GitHub token has sufficient permissions

## Customization

### Changing Coverage Thresholds
Edit `vitest.config.ts` and `.github/workflows/test-coverage.yml` to adjust the 80% threshold.

### Adding More Checks
You can extend the workflow to include:
- Type checking
- Build verification
- Integration tests
- Performance benchmarks

### Custom Report Format
Modify the coverage parsing script in the workflow to change the markdown format.

## Best Practices

1. **Write Tests First**: Maintain high coverage from the start
2. **Review Coverage**: Use the detailed HTML report to identify gaps
3. **Quality Over Quantity**: Focus on meaningful test coverage
4. **Regular Updates**: Keep dependencies and actions up to date
5. **Monitor Performance**: Track workflow execution times

## Integration with Development Workflow

This setup integrates seamlessly with your development process:

1. **Feature Development**: Write tests alongside code
2. **Pull Request**: Automatic coverage feedback
3. **Code Review**: Use coverage data to guide reviews
4. **Merge**: Ensure coverage thresholds are met
5. **Deploy**: Confident deployments with tested code

The GitHub Actions workflow provides a robust foundation for maintaining code quality and ensuring comprehensive test coverage without relying on external services.
