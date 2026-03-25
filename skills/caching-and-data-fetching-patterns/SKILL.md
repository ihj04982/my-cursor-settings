---
name: caching-and-data-fetching-patterns
description: Caching and data fetching patterns — storage API caching, LRU cache, SWR deduplication, React.cache, preloading, RSC serialization, localStorage versioning, after() for non-blocking work. Use when implementing data fetching, caching, or optimizing network requests.
---

## Caching & Data Fetching Patterns

Patterns for efficient caching, request deduplication, preloading, and non-blocking side effects.

---

### 1. Cache Storage API Calls

`localStorage`, `sessionStorage`, and `document.cookie` are synchronous and expensive. Cache reads in memory.

**Bad:**

```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'; // called 10 times = 10 reads
}
```

**Good:**

```typescript
const storageCache = new Map<string, string | null>();

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) storageCache.set(key, localStorage.getItem(key));
  return storageCache.get(key);
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
  storageCache.set(key, value);
}
```

Invalidate on external changes:

```typescript
window.addEventListener('storage', (e) => { if (e.key) storageCache.delete(e.key); });
```

---

### 2. Cross-Request LRU Caching

`React.cache()` only works within one request. For data shared across sequential requests, use an LRU cache.

```typescript
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, any>({ max: 1000, ttl: 5 * 60 * 1000 });

export async function getUser(id: string) {
  const cached = cache.get(id);
  if (cached) return cached;
  const user = await db.user.findUnique({ where: { id } });
  cache.set(id, user);
  return user;
}
```

With Vercel Fluid Compute, LRU caching is especially effective because concurrent requests share the same function instance.

Reference: [node-lru-cache](https://github.com/isaacs/node-lru-cache)

---

### 3. SWR for Automatic Deduplication

SWR provides request deduplication, caching, and revalidation across component instances.

**Bad (each instance fetches independently):**

```tsx
useEffect(() => { fetch('/api/users').then(r => r.json()).then(setUsers); }, []);
```

**Good (multiple instances share one request):**

```tsx
import useSWR from 'swr';
const { data: users } = useSWR('/api/users', fetcher);
```

For mutations: `useSWRMutation('/api/user', updateUser)`

Reference: [swr.vercel.app](https://swr.vercel.app)

---

### 4. Per-Request Deduplication with React.cache()

Use `React.cache()` for server-side deduplication within a single RSC request.

```typescript
import { cache } from 'react';

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return await db.user.findUnique({ where: { id: session.user.id } });
});
```

**Avoid inline objects as arguments** — `React.cache()` uses `Object.is` (reference equality):

```typescript
// Bad: always cache miss
getUser({ uid: 1 }); getUser({ uid: 1 });

// Good: cache hit
getUser(1); getUser(1);
```

In Next.js, `fetch` is automatically deduplicated. Use `React.cache()` for DB queries, auth checks, and other non-fetch async work.

---

### 5. Preload Based on User Intent

Preload heavy bundles on hover/focus to reduce perceived latency.

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => { void import('./monaco-editor'); };
  return (
    <button onMouseEnter={preload} onFocus={preload} onClick={onClick}>
      Open Editor
    </button>
  );
}
```

---

### 6. Avoid Duplicate Serialization in RSC Props

RSC serialization deduplicates by object **reference**, not value. Do transformations (`.toSorted()`, `.filter()`) in client, not server.

**Bad (duplicates array in RSC payload):**

```tsx
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

**Good (sends once, transforms in client):**

```tsx
<ClientList usernames={usernames} />
// Client: const sorted = useMemo(() => [...usernames].sort(), [usernames]);
```

Operations that break deduplication: `.toSorted()`, `.filter()`, `.map()`, `.slice()`, `{...obj}`, `structuredClone()`.

---

### 7. Version and Minimize localStorage Data

Add version prefix to keys and store only needed fields.

```typescript
const VERSION = 'v2';

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config));
  } catch {} // Throws in incognito, quota exceeded
}
```

Always wrap in try-catch. Never store tokens/PII.

---

### 8. Use after() for Non-Blocking Operations

Use Next.js `after()` to schedule work after response is sent.

**Bad (logging blocks response):**

```tsx
await updateDatabase(request);
await logUserAction({ userAgent }); // blocks
return Response.json({ status: 'success' });
```

**Good:**

```tsx
import { after } from 'next/server';

await updateDatabase(request);
after(async () => { logUserAction({ sessionCookie, userAgent }); });
return Response.json({ status: 'success' });
```

Common use cases: analytics, audit logging, notifications, cache invalidation.

Reference: [next/server after()](https://nextjs.org/docs/app/api-reference/functions/after)

---

### Checklist

- [ ] Storage API reads cached in memory Map
- [ ] Cross-request shared data uses LRU cache
- [ ] Client data fetching uses SWR or React Query for dedup
- [ ] Server-side repeated queries use `React.cache()`
- [ ] Heavy assets preloaded on user intent (hover/focus)
- [ ] RSC props avoid duplicate serialization (transform in client)
- [ ] localStorage versioned, minimized, wrapped in try-catch
- [ ] Non-critical server work uses `after()` to avoid blocking response
