---
name: js-and-css-optimization
description: JavaScript data structure and CSS rendering optimization — index maps, combined iterations, Set/Map lookups, immutable sort, loop min/max, property caching, SVG wrapper animation, layout thrashing, content-visibility. Use when optimizing hot loops, data processing, DOM performance, or scroll rendering.
---

## JS & CSS Optimization

Low-level JavaScript data structure patterns and CSS rendering optimizations.

---

## JavaScript Data Optimization

### 1. Build Index Maps for Repeated Lookups

Multiple `.find()` calls by the same key should use a Map. Build map once (O(n)), then all lookups are O(1).

**Bad (O(n) per lookup → O(n×m) total):**

```typescript
return orders.map((order) => ({
  ...order,
  user: users.find((u) => u.id === order.userId),
}));
```

**Good (O(1) per lookup):**

```typescript
const userById = new Map(users.map((u) => [u.id, u]));
return orders.map((order) => ({
  ...order,
  user: userById.get(order.userId),
}));
```

---

### 2. Combine Multiple Array Iterations

Multiple `.filter()` or `.map()` calls iterate the array multiple times. Combine into one loop.

**Bad (3 iterations):**

```typescript
const admins = users.filter((u) => u.isAdmin);
const testers = users.filter((u) => u.isTester);
const inactive = users.filter((u) => !u.isActive);
```

**Good (1 iteration):**

```typescript
const admins: User[] = [], testers: User[] = [], inactive: User[] = [];
for (const user of users) {
  if (user.isAdmin) admins.push(user);
  if (user.isTester) testers.push(user);
  if (!user.isActive) inactive.push(user);
}
```

---

### 3. Use Set/Map for O(1) Lookups

Convert arrays to Set/Map for repeated membership checks.

**Bad:** `items.filter(item => allowedIds.includes(item.id))`

**Good:**

```typescript
const allowedIds = new Set(['a', 'b', 'c']);
items.filter(item => allowedIds.has(item.id))
```

---

### 4. Use toSorted() Instead of sort() for Immutability

`.sort()` mutates the array in place, breaking React's immutability model. Use `.toSorted()`.

**Bad (mutates props):**

```tsx
const sorted = useMemo(() => users.sort((a, b) => a.name.localeCompare(b.name)), [users])
```

**Good:**

```tsx
const sorted = useMemo(() => users.toSorted((a, b) => a.name.localeCompare(b.name)), [users])
```

Other immutable methods: `.toReversed()`, `.toSpliced()`, `.with()`. For older browsers: `[...items].sort()`.

---

### 5. Use Loop for Min/Max Instead of Sort

Finding extremes needs O(n), not O(n log n) sort.

**Bad:**

```typescript
const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt);
return sorted[0];
```

**Good:**

```typescript
let latest = projects[0];
for (let i = 1; i < projects.length; i++) {
  if (projects[i].updatedAt > latest.updatedAt) latest = projects[i];
}
return latest;
```

`Math.min(...arr)` works for small arrays but fails for arrays > ~124K items (Chrome).

---

### 6. Early Length Check for Array Comparisons

Check array lengths before expensive comparison operations.

```typescript
function hasChanges(current: string[], original: string[]) {
  if (current.length !== original.length) return true;
  const currentSorted = current.toSorted();
  const originalSorted = original.toSorted();
  return currentSorted.some((v, i) => v !== originalSorted[i]);
}
```

---

### 7. Cache Property Access in Loops

Cache object property lookups in hot paths.

**Bad (3 lookups × N iterations):**

```typescript
for (let i = 0; i < arr.length; i++) { process(obj.config.settings.value); }
```

**Good (1 lookup total):**

```typescript
const value = obj.config.settings.value;
const len = arr.length;
for (let i = 0; i < len; i++) { process(value); }
```

---

## CSS Rendering Optimization

### 8. Animate SVG Wrapper Instead of SVG Element

Many browsers lack hardware acceleration for CSS animations on SVG elements. Wrap and animate the wrapper.

**Bad:**

```tsx
<svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" stroke="currentColor" />
</svg>
```

**Good:**

```tsx
<div className="animate-spin">
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" />
  </svg>
</div>
```

---

### 9. Avoid Layout Thrashing

Don't interleave style writes with layout reads. Batch reads and writes separately.

**Bad (forces reflow between each pair):**

```typescript
element.style.width = '100px';
const width = element.offsetWidth; // forces reflow
element.style.height = '200px';
const height = element.offsetHeight; // forces another reflow
```

**Good (batch writes, then read):**

```typescript
element.style.width = '100px';
element.style.height = '200px';
const { width, height } = element.getBoundingClientRect();
```

**Best: use CSS classes instead of inline styles.**

Reference: [Layout-forcing properties](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

---

### 10. CSS content-visibility for Long Lists

Apply `content-visibility: auto` to defer off-screen rendering.

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

For 1000 messages, browser skips layout/paint for ~990 off-screen items (10× faster initial render).

---

### Checklist

- [ ] Repeated lookups by key use Map instead of `.find()`
- [ ] Multiple array passes combined into single loop
- [ ] Membership checks use Set instead of `.includes()`
- [ ] Array sorting uses `.toSorted()` (immutable)
- [ ] Min/max found via single loop, not sort
- [ ] Array comparisons do length check first
- [ ] Hot loop property access cached in local variable
- [ ] SVG animations applied to wrapper div, not SVG element
- [ ] DOM reads and writes batched separately (no thrashing)
- [ ] Long lists use `content-visibility: auto`
