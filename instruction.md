# GitHub Copilot Context Instructions

## Project Context
This is a **React Design Patterns** learning project built with Next.js 15.3.4, React 19.1.0, TypeScript, and Tailwind CSS v4. The project demonstrates various design patterns through interactive examples and serves as a comprehensive study guide.

## Architecture Overview
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with CSS Custom Properties
- **Structure**: Feature-based architecture with clear separation of concerns
- **Package Manager**: pnpm 10.8.1+

## Current Implementation Status

### Observable Pattern (✅ Implemented)
**Location**: `src/features/observable-pattern/`

**Key Files**:
- `helpers/index.ts` - Observable factory function
- `hooks/useObservableCounter.ts` - **HAS KNOWN ISSUES** (see below)
- `components/ObservableComponent.tsx` - Display component with subscribe/unsubscribe
- `components/IncrementButton.tsx` - Controls counter increment

**Demo Page**: `/observable-pattern` - 2x2 grid of components with shared state

### Known Issues to Fix

#### Critical: `useObservableCounter.ts` Logic Error
**File**: `src/features/observable-pattern/hooks/useObservableCounter.ts`  
**Line 9**: `isSubscribe = false` should be `true`  
**Line 18**: Incorrect subscription logic in useEffect

**Current Broken Logic**:
```typescript
export const useObservableCounter = ({
  isSubscribe = false, // ❌ Should be true
}: {
  isSubscribe?: boolean;
}) => {
  useEffect(() => {
    const subscription = counterObservable.subscribe(setCounter);
    if (!isSubscribe) subscription.unsubscribe(); // ❌ Wrong logic
    return () => subscription.unsubscribe();
  }, [isSubscribe]);
};
```

**Expected Fix**:
- Default `isSubscribe` to `true`
- Properly handle subscription lifecycle based on `isSubscribe` state
- Don't immediately unsubscribe in useEffect

## Code Patterns & Conventions

### File Structure
```
src/features/[pattern-name]/
├── components/          # Pattern-specific components
├── helpers/            # Utility functions and factories
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

### Shared Components
**Location**: `src/features/shared/`
- `components/button.tsx` - Uses class-variance-authority (cva)
- `hooks/useFlashEffect.ts` - Visual feedback for re-renders
- `constants/flash-update.ts` - Color constants for visual debugging

### Styling Guidelines
- Use Tailwind CSS v4 utilities
- Custom properties defined in `@theme` block in `globals.css`
- Responsive design with mobile-first approach
- Visual debugging with flash effects for re-renders

## Development Preferences

### When Adding New Patterns
1. Create feature folder: `src/features/[pattern-name]/`
2. Add demo page: `src/app/(patterns)/[pattern-name]/page.tsx`
3. Update home page pattern list in `src/app/page.tsx`
4. Include visual debugging tools (useFlashEffect)
5. Add TypeScript types for better DX

### Component Guidelines
- Use "use client" directive for interactive components
- Implement proper TypeScript interfaces
- Include visual feedback for state changes
- Follow responsive design principles
- Use semantic HTML and proper accessibility

### State Management
- Custom observables for pattern demonstrations
- Local state with useState for component-specific data
- Props for component communication
- Visual indicators for subscription states

## Current Project Goals
1. **Fix Observable Pattern Issues** - Correct useObservableCounter logic
2. **Add More Patterns** - Factory, Strategy, Command, etc.
3. **Improve Visual Debugging** - Enhanced re-render detection
4. **Add Testing** - Unit tests for pattern implementations
5. **Documentation** - Inline code comments and examples

## Code Quality Standards
- **TypeScript**: Strict mode enabled, comprehensive typing
- **ESLint**: Next.js configuration with strict rules  
- **Performance**: Use React 19 features, avoid unnecessary re-renders
- **Accessibility**: Semantic HTML, proper ARIA attributes
- **Responsive**: Mobile-first design with Tailwind utilities

## When Assisting with Code
1. **Follow existing patterns** - Maintain architectural consistency
2. **Fix known issues first** - Prioritize useObservableCounter fix
3. **Add comprehensive typing** - Include proper TypeScript interfaces
4. **Include visual feedback** - Use flash effects for debugging
5. **Test interactively** - Ensure patterns work in demo pages
6. **Document thoroughly** - Add clear comments explaining pattern logic

## Emergency Fixes Needed
- [ ] Fix `useObservableCounter` subscription logic
- [ ] Correct default `isSubscribe` value
- [ ] Ensure proper subscription lifecycle management
- [ ] Test Observable pattern demo functionality

---
*Last Updated: June 21, 2025*  
*Status: Active Development - Observable Pattern Needs Fixes*
