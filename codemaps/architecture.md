# Architecture Overview

**Last Updated**: 2024-12-19

## System Architecture

This is a **frontend-only** Single Page Application (SPA) built with React 19 and Vite.

### High-Level Structure

```
┌─────────────────────────────────────┐
│         React Application           │
│                                     │
│  ┌───────────────────────────────┐ │
│  │      App.tsx (Router)         │ │
│  │  - Navigation Management      │ │
│  │  - State Management           │ │
│  │  - Config Loading             │ │
│  └───────────────┬───────────────┘ │
│                  │                  │
│     ┌────────────┼────────────┐    │
│     │            │            │    │
│  ┌──▼──┐    ┌───▼───┐   ┌───▼───┐ │
│  │Agents│    │ Hooks │   │ Rules │ │
│  │ View │    │ View  │   │ View  │ │
│  └──┬──┘    └───┬───┘   └───┬───┘ │
│     │            │            │    │
│     └────────────┼────────────┘    │
│                  │                  │
│         ┌────────▼────────┐        │
│         │  configLoader   │        │
│         │  (Data Layer)   │        │
│         └─────────────────┘        │
└─────────────────────────────────────┘
```

## Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Testing**: Vitest (Unit), Playwright (E2E)

## Architecture Patterns

### Component Structure
- **Presentational Components**: `AgentsView`, `HooksView`, `RulesView`, `SectionHeader`
- **Container Component**: `App.tsx` (manages state and routing)
- **Utility Layer**: `utils/` (data loading, constants)

### State Management
- **Local State**: React `useState` hooks
- **No Global State**: No Redux/Zustand (not needed for current scope)

### Data Flow
1. App loads → `loadCursorConfig()` called
2. Config data returned (currently sample data)
3. Components receive data via props
4. Views render based on active tab

## Key Design Decisions

1. **No Backend**: Pure frontend application with sample data
2. **Type Safety**: Full TypeScript coverage
3. **Component Reusability**: Shared components and constants
4. **Testing**: 80%+ coverage requirement with unit and E2E tests

## File Organization

```
src/
├── components/          # UI Components
│   ├── __tests__/      # Component tests
│   ├── AgentsView.tsx
│   ├── HooksView.tsx
│   ├── RulesView.tsx
│   └── SectionHeader.tsx
├── utils/               # Utilities
│   ├── configLoader.ts  # Data loading
│   ├── constants.ts     # Shared constants
│   └── *.test.ts        # Utility tests
├── test/                # Test setup
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## External Dependencies

### Runtime Dependencies
- `react`, `react-dom`: UI framework
- `lucide-react`: Icon library

### Development Dependencies
- `@vitejs/plugin-react`: React support for Vite
- `vitest`, `@vitest/coverage-v8`: Testing framework
- `@playwright/test`: E2E testing
- `@testing-library/react`: Component testing
- `tailwindcss`, `@tailwindcss/postcss`: Styling
- `typescript`, `typescript-eslint`: Type safety and linting

## Build & Deployment

- **Development**: `vite` dev server (HMR enabled)
- **Production**: `vite build` → static files in `dist/`
- **Preview**: `vite preview` for production build testing

## Testing Architecture

- **Unit Tests**: Vitest with React Testing Library
- **E2E Tests**: Playwright (Chrome, Firefox, Safari)
- **Coverage**: v8 provider with 80% threshold
- **Test Location**: Co-located with components or in `__tests__/`
