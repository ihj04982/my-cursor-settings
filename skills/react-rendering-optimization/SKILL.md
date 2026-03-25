---
name: react-rendering-optimization
description: React rendering optimization patterns — memoization, derived state, static hoisting, conditional rendering, caching. Use when reviewing or optimizing React component render performance.
---

## React Rendering Optimization

Patterns to reduce unnecessary computation and re-creation during React renders.

---

### 1. Don't Wrap Simple Expressions in useMemo

When an expression is simple and returns a primitive (boolean, number, string), `useMemo` overhead exceeds the expression cost.

**Bad:**

```tsx
const isLoading = useMemo(() => {
  return user.isLoading || notifications.isLoading;
}, [user.isLoading, notifications.isLoading]);
```

**Good:**

```tsx
const isLoading = user.isLoading || notifications.isLoading;
```

---

### 2. Extract Default Non-Primitive Parameters to Constants

Default non-primitive values in memoized components create new instances every render, breaking `memo()`.

**Bad:**

```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})
```

**Good:**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})
```

---

### 3. Hoist Static JSX Elements

Extract static JSX outside components to avoid re-creation on every render. Especially helpful for large static SVG nodes.

**Bad:**

```tsx
function Container() {
  return <div>{loading && <div className="animate-pulse h-20 bg-gray-200" />}</div>;
}
```

**Good:**

```tsx
const loadingSkeleton = <div className="animate-pulse h-20 bg-gray-200" />;

function Container() {
  return <div>{loading && loadingSkeleton}</div>;
}
```

> If [React Compiler](https://react.dev/learn/react-compiler) is enabled, it handles this automatically.

---

### 4. Hoist RegExp Creation

Don't create RegExp inside render. Hoist to module scope or memoize.

**Bad:**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**Good:**

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

> Warning: Global regex (`/g`) has mutable `lastIndex` state — `regex.test('foo')` returns `true` then `false` alternately.

---

### 5. Calculate Derived State During Rendering

If a value can be computed from current props/state, derive it during render instead of storing in state + syncing with useEffect.

**Bad:**

```tsx
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);
```

**Good:**

```tsx
const fullName = firstName + ' ' + lastName;
```

Reference: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

---

### 6. Cache Repeated Function Calls

Use a module-level Map to memoize pure functions called repeatedly with the same inputs.

**Bad:**

```tsx
{projects.map(project => {
  const slug = slugify(project.name) // called 100+ times for same names
  return <ProjectCard key={project.id} slug={slug} />
})}
```

**Good:**

```typescript
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) return slugifyCache.get(text)!
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}
```

Use a Map (not a hook) so it works everywhere: utilities, event handlers, not just components.

---

### 7. Use Explicit Conditional Rendering

Use explicit ternary instead of `&&` when the condition can be `0`, `NaN`, or other falsy values that render visibly.

**Bad (renders "0" when count is 0):**

```tsx
<div>{count && <span className="badge">{count}</span>}</div>
```

**Good:**

```tsx
<div>{count > 0 ? <span className="badge">{count}</span> : null}</div>
```

---

### Checklist

- [ ] No `useMemo` wrapping simple primitive expressions
- [ ] Default non-primitive props extracted to module-level constants
- [ ] Static JSX hoisted outside components
- [ ] RegExp created at module scope or memoized
- [ ] Derived state computed during render, not in useEffect
- [ ] Repeated pure function calls cached with module-level Map
- [ ] Conditional rendering uses explicit checks for falsy values
