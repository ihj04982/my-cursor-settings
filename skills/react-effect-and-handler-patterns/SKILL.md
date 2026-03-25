---
name: react-effect-and-handler-patterns
description: React effect and event handler optimization — narrow deps, handler refs, useEffectEvent, global listener dedup, one-time init. Use when writing or fixing useEffect, event handlers, or component initialization.
---

## React Effect & Handler Patterns

Patterns for efficient useEffect usage, stable event handler references, and proper initialization.

---

### 1. Narrow Effect Dependencies

Specify primitive dependencies instead of objects to minimize effect re-runs.

**Bad (re-runs on any user field change):**

```tsx
useEffect(() => {
  console.log(user.id);
}, [user]);
```

**Good (re-runs only when id changes):**

```tsx
useEffect(() => {
  console.log(user.id);
}, [user.id]);
```

**Derive booleans from continuous values:**

```tsx
// Bad: runs on width=767, 766, 765...
useEffect(() => {
  if (width < 768) enableMobileMode();
}, [width]);

// Good: runs only on boolean transition
const isMobile = width < 768;
useEffect(() => {
  if (isMobile) enableMobileMode();
}, [isMobile]);
```

---

### 2. Put Interaction Logic in Event Handlers

If a side effect is triggered by a specific user action, run it in the handler — not as state + effect.

**Bad (event modeled as state + effect):**

```tsx
const [submitted, setSubmitted] = useState(false);
const theme = useContext(ThemeContext);

useEffect(() => {
  if (submitted) {
    post('/api/register');
    showToast('Registered', theme);
  }
}, [submitted, theme]);
```

**Good:**

```tsx
const theme = useContext(ThemeContext);

function handleSubmit() {
  post('/api/register');
  showToast('Registered', theme);
}
```

Reference: [Should this code move to an event handler?](https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler)

---

### 3. Store Event Handlers in Refs

Store callbacks in refs when used in effects that shouldn't re-subscribe on callback changes.

**Bad (re-subscribes on every render):**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  useEffect(() => {
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  }, [event, handler]);
}
```

**Good (stable subscription):**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  const handlerRef = useRef(handler);
  useEffect(() => { handlerRef.current = handler; }, [handler]);

  useEffect(() => {
    const listener = (e) => handlerRef.current(e);
    window.addEventListener(event, listener);
    return () => window.removeEventListener(event, listener);
  }, [event]);
}
```

---

### 4. useEffectEvent for Stable Callback Refs

`useEffectEvent` provides a cleaner API: a stable function that always calls the latest handler without being in effect deps.

**Bad (effect re-runs on every callback change):**

```tsx
useEffect(() => {
  const timeout = setTimeout(() => onSearch(query), 300);
  return () => clearTimeout(timeout);
}, [query, onSearch]);
```

**Good:**

```tsx
import { useEffectEvent } from 'react';

const onSearchEvent = useEffectEvent(onSearch);

useEffect(() => {
  const timeout = setTimeout(() => onSearchEvent(query), 300);
  return () => clearTimeout(timeout);
}, [query]);
```

---

### 5. Deduplicate Global Event Listeners

Register global event listeners once and share across component instances.

**Bad (N instances = N listeners):**

```tsx
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) callback();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback]);
}
```

**Good (N instances = 1 listener via module-level Map + `useSWRSubscription`):**

```tsx
const keyCallbacks = new Map<string, Set<() => void>>();

function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    if (!keyCallbacks.has(key)) keyCallbacks.set(key, new Set());
    keyCallbacks.get(key)!.add(callback);
    return () => {
      const set = keyCallbacks.get(key);
      if (set) { set.delete(callback); if (set.size === 0) keyCallbacks.delete(key); }
    };
  }, [key, callback]);

  useSWRSubscription('global-keydown', () => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && keyCallbacks.has(e.key))
        keyCallbacks.get(e.key)!.forEach((cb) => cb());
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });
}
```

---

### 6. Initialize App Once, Not Per Mount

App-wide init (analytics, auth check) must run once at module load, not inside `useEffect([])` which re-runs on remount.

**Bad (runs twice in dev, re-runs on remount):**

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage();
    checkAuthToken();
  }, []);
}
```

**Good:**

```tsx
let didInit = false;

function Comp() {
  useEffect(() => {
    if (didInit) return;
    didInit = true;
    loadFromStorage();
    checkAuthToken();
  }, []);
}
```

Reference: [Initializing the application](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)

---

### Checklist

- [ ] Effect deps use primitives, not objects
- [ ] Interaction logic lives in event handlers, not state + effect
- [ ] Callbacks in effects stored in refs or use `useEffectEvent`
- [ ] Global event listeners registered once and shared
- [ ] App-wide initialization guarded against re-runs
