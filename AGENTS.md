# AGENTS.md — programming-bible

This file provides context and guidelines for agentic coding agents operating in this repository.

---

## Repository Layout

```
programming-bible/
├── nextjs/          # Next.js 15 app (primary codebase — all work happens here)
│   ├── src/
│   │   ├── app/             # Next.js App Router pages and API routes
│   │   │   ├── (lorem)/     # Route group: lorem ipsum demo pages
│   │   │   ├── (patterns)/  # Route group: design pattern demo pages
│   │   │   └── api/         # API routes
│   │   ├── features/        # Feature-based modules
│   │   │   ├── observable-pattern/
│   │   │   ├── performance-comparison/
│   │   │   └── shared/      # Shared components, hooks, constants
│   │   ├── components/      # Global UI components
│   │   ├── helpers/         # Pure utility functions
│   │   └── lib/             # Library wrappers and abstractions
│   ├── e2e/                 # Playwright E2E tests
│   ├── test/                # Vitest setup files
│   └── scripts/             # Build and maintenance scripts
├── rust/            # Rust experiments (separate concern)
└── .github/workflows/
    ├── parallel-checks.yml  # Main CI: lint, test, typecheck in parallel
    ├── production.yml
    ├── preview.yml
    ├── test-coverage.yml
    └── typedoc.yml
```

All commands below must be run from the `nextjs/` directory unless otherwise noted.

---

## Build, Dev, and Start

```bash
pnpm dev          # Start dev server with Turbopack (also generates service worker)
pnpm build        # Production build (also generates service worker)
pnpm start        # Start production server (requires prior build)
```

---

## Linting and Formatting

The project uses **Biome** (not ESLint/Prettier).

```bash
pnpm lint         # Lint all files (read-only)
pnpm lint:fix     # Lint and auto-fix
pnpm format       # Format all files
pnpm check        # Run lint + format check together
pnpm check:fix    # Run lint + format and auto-fix together
```

Key Biome settings (`biome.json`):
- Indent: 2 spaces, LF line endings, 80-char line width
- Quotes: single for JS/TS strings, double for JSX attributes
- Trailing commas: `es5` style
- Semicolons: omitted (ASI)
- Arrow function parens: only when needed
- `noUnusedImports` is an **error** — remove all unused imports
- `noExplicitAny` is a **warning** — avoid `any`; use `unknown` or precise types
- `noVar` is an **error** — always use `const` or `let`
- `useAltText`, `useAriaPropsForRole`, `useValidAriaProps` are **errors** — enforce accessibility

---

## Type Checking

```bash
pnpm jsdoc:check  # tsc --noEmit --checkJs (used in CI typecheck job)
```

TypeScript is configured with `strict: true`. Inline comments exist in `tsconfig.json`
(technically invalid JSON5) — do not remove or reformat them.

CSS module imports require the declaration in `src/custom.d.ts`:
```ts
declare module '*.css'
```

---

## Unit Tests (Vitest)

```bash
pnpm test              # Run tests in watch mode
pnpm test:run          # Run all tests once (used in CI)
pnpm test:watch        # Explicit watch mode
pnpm test:coverage     # Run with coverage (must meet 80% threshold)
```

**Run a single test file:**
```bash
pnpm vitest run src/features/observable-pattern/helpers/index.test.ts
```

**Run tests matching a name pattern:**
```bash
pnpm vitest run -t "should allow unsubscribing"
```

Test files are co-located with source: `src/features/**/helpers/index.test.ts`.
The test environment is `jsdom`. Setup file: `test/setup.ts`.
Coverage is collected only from `src/helpers/**`, `src/lib/**`, and
`src/features/**/helpers/**`. The threshold is 80% for branches, functions,
lines, and statements.

---

## E2E Tests (Playwright)

```bash
pnpm e2e           # Run all E2E tests (builds app first if needed)
pnpm e2e:ui        # Interactive Playwright UI
pnpm e2e:debug     # Debug mode
pnpm e2e:report    # Show last HTML report
```

E2E tests live in `e2e/`. Only Chromium is configured. On CI, retries=2,
workers=1. Locally, `reuseExistingServer: true` — start `pnpm dev` first to
skip the automatic build+start.

---

## Documentation

```bash
pnpm docs:generate    # Generate TypeDoc HTML docs
pnpm docs:entrypoints # Regenerate TypeDoc entrypoint list
pnpm jsdoc:validate   # Run custom JSDoc validation script
```

---

## Code Style Guidelines

### TypeScript

- `strict: true` — no implicit `any`, strict null checks enforced
- Use explicit return types on exported functions
- Prefer `type` imports when importing only types: `import type { Foo } from '...'`
- Define props as interfaces (not inline types) for React components:
  ```ts
  interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {}
  ```
- Use `as const` for static lookup arrays and config objects
- Path alias `@/` maps to `src/` — always use it for cross-directory imports

### Imports

- Group order (Biome `organizeImports` is off — maintain manually):
  1. React / Next.js internals
  2. External packages
  3. Internal absolute (`@/...`)
  4. Relative (`./` or `../`)
- No unused imports (enforced as error by Biome)

### Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Components | PascalCase | `ObservableComponent` |
| Hooks | camelCase, `use` prefix | `useFlashEffect` |
| Helpers/utils | camelCase | `createObservable` |
| Constants | UPPER_SNAKE_CASE | `REACT_DESIGN_PATTERNS` |
| Types/Interfaces | PascalCase | `ButtonProps` |
| Files (components) | PascalCase | `IncrementButton.tsx` |
| Files (hooks/helpers) | camelCase | `useObservableCounter.ts` |
| Route group folders | `(groupname)` | `(patterns)/` |
| Private component folders | `_component/` | `[category]/_component/` |

### React and Next.js

- Add `"use client"` at the top of any component that uses browser APIs,
  event handlers, or hooks (`useState`, `useEffect`, `useRef`, etc.)
- Server components must **never** call `fetch('http://localhost:3000/...')` —
  import and call data functions directly to avoid prerender failures
- Use `Suspense` with skeleton fallbacks for async server components
- Export `generateStaticParams` and `generateMetadata` from dynamic route pages
- Use Next.js App Router route groups `(name)` for logical grouping without
  affecting URLs
- Wrap shared layouts in route group `layout.tsx` files

### Styling

- Tailwind CSS v4 — use utility classes directly; no `@apply` unless necessary
- Custom design tokens defined in `@theme` block in `src/app/globals.css`
- Use `clsx` + `tailwind-merge` (via `class-variance-authority`) for conditional classes
- Mobile-first responsive design
- Visual re-render debugging via `useFlashEffect` hook from `@/features/shared/hooks`

### JSDoc

All public functions, hooks, and components must have JSDoc. Required tags:

```ts
/**
 * Brief description of what the function does.
 *
 * @param props - The component props
 * @param props.title - The title to display
 * @returns The rendered element
 *
 * @example
 * <MyComponent title="Hello" />
 *
 * @since 1.0.0
 */
```

- Use `@component` tag for React components
- Use `@hook` tag for custom hooks
- Use `@async` for async functions
- Keep lines under 80 characters

### Error Handling

- Use `notFound()` from `next/navigation` for missing resources in server components
- Avoid swallowing errors silently — surface them or re-throw
- Prefer `unknown` over `any` in catch clauses: `catch (err: unknown)`

---

## Adding a New Design Pattern

1. Create `src/features/[pattern-name]/` with sub-folders:
   - `components/` — React components for the pattern
   - `helpers/` — Pure factory/utility functions (+ `index.test.ts`)
   - `hooks/` — Custom React hooks
   - `types/` — TypeScript type definitions (if needed)
2. Add demo page at `src/app/(patterns)/[pattern-name]/page.tsx`
3. Register the pattern in the `REACT_DESIGN_PATTERNS` array in `src/app/page.tsx`
4. Include `useFlashEffect` for visual re-render debugging in interactive components
5. Write unit tests in `helpers/index.test.ts` targeting the pure logic

---

## CI/CD Notes

- Package manager: **pnpm 10.8.1** (locked via `packageManager` field and `.nvmrc` Node 24)
- `pnpm-lock.yaml` uses `lockfileVersion: '9.0'` — requires pnpm v9+
- Always install with `pnpm install --frozen-lockfile` in CI
- Cache pattern in GitHub Actions — resolve store path at runtime per job:
  ```yaml
  - name: Get pnpm store directory
    run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV
  - name: Setup pnpm cache
    uses: actions/cache@v4
    with:
      path: ${{ env.STORE_PATH }}
      key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
      restore-keys: |
        ${{ runner.os }}-pnpm-store-
  ```
- Do **not** use `actions/setup-node cache: 'pnpm'` or `pnpm/action-setup cache: true` —
  both have proven unreliable on fresh runners in this repo
- Branch naming: `feat/<name>` for features
- Commit style: conventional commits — `feat:`, `fix:`, `ci:`, `refactor:`, `docs:`

---

## Known Issues

- `src/features/observable-pattern/hooks/useObservableCounter.ts` has a logic
  bug (default `isSubscribe` should be `true`; subscription lifecycle is
  incorrect). See `nextjs/instruction.md` for the detailed fix spec.
- `tsconfig.json` contains inline `//` comments (invalid JSON). TypeScript
  handles them fine — do not edit or reformat this file.
- TypeDoc `generate-entrypoint.sh` excludes paths containing `[` to avoid
  glob warnings from dynamic route segments.
