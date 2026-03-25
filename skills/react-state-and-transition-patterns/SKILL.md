---
name: react-state-and-transition-patterns
description: React state management and transition patterns — functional setState, useTransition, useRef for transient values, deferred reads, derived subscriptions, Activity. Use when optimizing state updates, transitions, or reducing unnecessary re-renders.
---

## React State & Transition Patterns

Patterns for efficient state updates, non-blocking transitions, and minimal re-renders.

---

### 1. Use Functional setState Updates

When new state depends on previous state, use the updater function to prevent stale closures and create stable callbacks.

**Bad (requires state as dependency, risk of stale closure):**

```tsx
const addItems = useCallback((newItems: Item[]) => {
  setItems([...items, ...newItems]);
}, [items]); // recreated on every items change
```

**Good (stable callback, no stale closures):**

```tsx
const addItems = useCallback((newItems: Item[]) => {
  setItems((curr) => [...curr, ...newItems]);
}, []); // never recreated
```

**When direct updates are fine:** Setting state to a static value (`setCount(0)`) or from arguments only (`setName(newName)`).

---

### 2. Use Transitions for Non-Urgent Updates

Mark frequent, non-urgent state updates as transitions to keep the UI responsive.

**Bad (blocks UI on every scroll):**

```tsx
const handler = () => setScrollY(window.scrollY);
```

**Good (non-blocking):**

```tsx
import { startTransition } from 'react';
const handler = () => startTransition(() => setScrollY(window.scrollY));
```

---

### 3. Use useTransition Over Manual Loading States

`useTransition` provides built-in `isPending` state, auto error resilience, and interrupt handling.

**Bad (manual loading state):**

```tsx
const [isLoading, setIsLoading] = useState(false);
const handleSearch = async (value: string) => {
  setIsLoading(true);
  const data = await fetchResults(value);
  setResults(data);
  setIsLoading(false);
};
```

**Good:**

```tsx
const [isPending, startTransition] = useTransition();
const handleSearch = (value: string) => {
  setQuery(value);
  startTransition(async () => {
    const data = await fetchResults(value);
    setResults(data);
  });
};
```

Reference: [useTransition](https://react.dev/reference/react/useTransition)

---

### 4. Use useRef for Transient Values

Values that change frequently but don't need re-renders (mouse position, timeout IDs, flags) belong in `useRef`.

**Bad (renders every mouse move):**

```tsx
const [lastX, setLastX] = useState(0);
useEffect(() => {
  const onMove = (e: MouseEvent) => setLastX(e.clientX);
  window.addEventListener('mousemove', onMove);
  return () => window.removeEventListener('mousemove', onMove);
}, []);
```

**Good (no re-render, direct DOM update):**

```tsx
const lastXRef = useRef(0);
const dotRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  const onMove = (e: MouseEvent) => {
    lastXRef.current = e.clientX;
    if (dotRef.current) dotRef.current.style.transform = `translateX(${e.clientX}px)`;
  };
  window.addEventListener('mousemove', onMove);
  return () => window.removeEventListener('mousemove', onMove);
}, []);
```

---

### 5. Defer State Reads to Usage Point

Don't subscribe to dynamic state if you only read it inside callbacks.

**Bad (subscribes to all searchParams changes):**

```tsx
const searchParams = useSearchParams();
const handleShare = () => {
  const ref = searchParams.get('ref');
  shareChat(chatId, { ref });
};
```

**Good (reads on demand, no subscription):**

```tsx
const handleShare = () => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  shareChat(chatId, { ref });
};
```

---

### 6. Subscribe to Derived State

Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.

**Bad (re-renders on every pixel change):**

```tsx
const width = useWindowWidth();
const isMobile = width < 768;
```

**Good (re-renders only when boolean changes):**

```tsx
const isMobile = useMediaQuery('(max-width: 767px)');
```

---

### 7. Use Activity Component for Show/Hide

Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle visibility.

```tsx
import { Activity } from 'react';

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  );
}
```

Avoids expensive re-renders and state loss on toggle.

---

### Checklist

- [ ] setState that depends on previous state uses updater function
- [ ] Non-urgent updates wrapped in `startTransition`
- [ ] Loading states use `useTransition` instead of manual `useState`
- [ ] Transient values (mouse, timers) stored in `useRef`
- [ ] Dynamic state only read when actually needed (not subscribed eagerly)
- [ ] Continuous values derived to booleans before subscription
- [ ] Frequently toggled expensive components use `<Activity>`
