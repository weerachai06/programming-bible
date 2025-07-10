# Migration from ESLint to Biome

This document outlines the migration from ESLint to Biome for this Next.js project.

## What Changed

### Removed Packages
- `eslint`
- `eslint-config-next`
- `@eslint/eslintrc`
- `eslint-plugin-jsdoc`

### Added Packages
- `@biomejs/biome`

### Configuration Files
- **Removed**: `eslint.config.mjs`
- **Added**: `biome.json`
- **Updated**: `tsconfig.json` (added JSDoc validation)

## New Scripts

### Biome Scripts
```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check both linting and formatting
pnpm check

# Fix both linting and formatting
pnpm check:fix
```

### JSDoc Scripts
```bash
# Validate JSDoc comments
pnpm jsdoc:validate

# Check JSDoc with TypeScript
pnpm jsdoc:check
```

## JSDoc Linting

Since Biome doesn't have built-in JSDoc linting like ESLint's `eslint-plugin-jsdoc`, we've implemented a comprehensive JSDoc solution:

### 1. TypeScript JSDoc Validation
- Enabled `checkJs: true` in `tsconfig.json`
- TypeScript now validates JSDoc comments for type consistency
- Ensures `@param` tags match function parameters
- Validates `@returns` tags match actual return types

### 2. Custom JSDoc Validation Script
- Created `scripts/validate-jsdoc.mjs` for additional JSDoc checking
- Validates presence of JSDoc comments on public functions
- Checks for missing documentation on classes and interfaces
- Provides detailed reporting of JSDoc issues

### 3. JSDoc Style Guide
- Created `JSDOC_STYLE_GUIDE.md` with comprehensive documentation standards
- Includes examples for functions, classes, React components, and API routes
- Defines required tags and formatting rules
- Provides best practices and common mistakes to avoid

## Biome Configuration

The `biome.json` configuration includes:

### Linting Rules
- **Recommended rules**: Enabled by default
- **Style rules**: Consistent code style enforcement
- **Suspicious patterns**: Potential bugs and issues
- **Complexity rules**: Code complexity management
- **Correctness rules**: Code correctness validation
- **Performance rules**: Performance optimization hints
- **Accessibility rules**: A11y compliance checking

### Formatting Rules
- **Indent**: 2 spaces
- **Line width**: 80 characters
- **Semicolons**: As needed
- **Quotes**: Single quotes for JS, double for JSX
- **Trailing commas**: ES5 style

### File Handling
- **Ignored directories**: `node_modules`, `.next`, `dist`, `build`, `coverage`, `docs`
- **Processed files**: `.js`, `.jsx`, `.ts`, `.tsx`
- **Organize imports**: Automatically sorts imports

## Migration Benefits

### Performance
- **Faster linting**: Biome is significantly faster than ESLint
- **Single tool**: Combines linting and formatting in one tool
- **Less dependencies**: Fewer packages to manage

### Developer Experience
- **Better error messages**: More descriptive and actionable
- **Consistent formatting**: Unified code style across the project
- **IDE integration**: Excellent VS Code support

### Maintenance
- **Simpler configuration**: Single configuration file
- **Fewer conflicts**: Less dependency management issues
- **Regular updates**: Active development and maintenance

## TypeScript Integration

Enhanced TypeScript configuration for better JSDoc validation:

```json
{
  "compilerOptions": {
    "checkJs": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## VSCode Integration

### Recommended Extensions
1. **Biome**: Official Biome extension for VS Code
2. **TypeScript and JavaScript JSDoc**: Built-in VS Code JSDoc support

### Settings
Add to your VS Code settings:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": true,
    "source.organizeImports.biome": true
  }
}
```

## Validation Workflow

### Pre-commit Hooks
Consider adding these to your pre-commit workflow:

```bash
# Format code
pnpm format

# Check linting and formatting
pnpm check

# Validate JSDoc
pnpm jsdoc:validate

# Type check with JSDoc validation
pnpm jsdoc:check
```

### CI/CD Integration
Add to your CI pipeline:

```yaml
# Example GitHub Actions step
- name: Lint and format check
  run: pnpm check

- name: Validate JSDoc
  run: pnpm jsdoc:validate

- name: TypeScript JSDoc check
  run: pnpm jsdoc:check
```

## Troubleshooting

### Common Issues

1. **Import organization**: Biome may reorganize imports differently than ESLint
2. **Formatting differences**: Some formatting rules may differ from Prettier/ESLint
3. **JSDoc validation**: New JSDoc validation may find previously undetected issues

### Solutions

1. **Run format command**: `pnpm format` to apply new formatting rules
2. **Update JSDoc**: Use the style guide to fix JSDoc comments
3. **Gradual migration**: Fix issues incrementally rather than all at once

## Next Steps

1. **Run initial validation**: `pnpm check` to see current issues
2. **Fix formatting**: `pnpm check:fix` to auto-fix issues
3. **Validate JSDoc**: `pnpm jsdoc:validate` to check documentation
4. **Update documentation**: Follow the JSDoc style guide for consistency
5. **Configure IDE**: Set up VS Code integration for better DX

## Support

For issues or questions:
1. Check the [Biome documentation](https://biomejs.dev/)
2. Review the JSDoc style guide in this repository
3. Run validation scripts to identify specific issues
4. Consult TypeScript documentation for JSDoc validation
