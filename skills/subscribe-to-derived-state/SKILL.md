---
name: subscribe-to-derived-state
description: Subscribe to derived state (e.g. from external store) instead of copying into local state when possible. Use when syncing with store or avoiding duplicate source of truth.
---

## Subscribe to Derived State

Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.

**Incorrect (re-renders on every pixel change):**

```tsx
function Sidebar() {
  const width = useWindowWidth(); // updates continuously
  const isMobile = width < 768;
  return <nav className={isMobile ? 'mobile' : 'desktop'} />;
}
```

**Correct (re-renders only when boolean changes):**

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  return <nav className={isMobile ? 'mobile' : 'desktop'} />;
}
```
