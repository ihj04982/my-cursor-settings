---
name: async-parallelization-patterns
description: Async parallelization patterns — Promise.all, waterfall prevention, dependency-based parallelism, RSC component composition, deferred await. Use when optimizing async operations, API routes, or data fetching.
---

## Async Parallelization Patterns

Run independent operations in parallel; sequence only when there are actual dependencies.

---

### 1. Promise.all for Independent Operations

**Bad (sequential, 3 round trips):**

```typescript
const user = await fetchUser();
const posts = await fetchPosts();
const comments = await fetchComments();
```

**Good (parallel, 1 round trip):**

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments(),
]);
```

---

### 2. Prevent Waterfall Chains in API Routes

Start independent operations immediately, even before awaiting dependent ones.

**Bad (config waits for auth, data waits for both):**

```typescript
export async function GET(request: Request) {
  const session = await auth();
  const config = await fetchConfig();
  const data = await fetchData(session.user.id);
  return Response.json({ data, config });
}
```

**Good (auth and config start in parallel):**

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth();
  const configPromise = fetchConfig();
  const session = await sessionPromise;
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id),
  ]);
  return Response.json({ data, config });
}
```

---

### 3. Dependency-Based Parallelization

For partial dependencies, use `better-all` or chain promises to maximize parallelism.

**Using `better-all`:**

```typescript
import { all } from 'better-all';

const { user, config, profile } = await all({
  async user() { return fetchUser(); },
  async config() { return fetchConfig(); },
  async profile() { return fetchProfile((await this.$.user).id); },
});
```

**Without extra dependencies:**

```typescript
const userPromise = fetchUser();
const profilePromise = userPromise.then((user) => fetchProfile(user.id));

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise,
]);
```

Reference: [better-all](https://github.com/shuding/better-all)

---

### 4. Parallel Data Fetching with Component Composition (RSC)

RSC components execute sequentially within a tree. Restructure with composition to parallelize.

**Bad (Sidebar waits for Header's fetch):**

```tsx
export default async function Page() {
  const header = await fetchHeader();
  return <div><div>{header}</div><Sidebar /></div>;
}
```

**Good (both fetch simultaneously):**

```tsx
async function Header() {
  const data = await fetchHeader();
  return <div>{data}</div>;
}

async function Sidebar() {
  const items = await fetchSidebarItems();
  return <nav>{items.map(renderItem)}</nav>;
}

export default function Page() {
  return <div><Header /><Sidebar /></div>;
}
```

---

### 5. Defer Await Until Needed

Move `await` into branches where the value is actually used. Don't block paths that don't need the data.

**Bad (blocks both branches):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId);
  if (skipProcessing) return { skipped: true };
  return processUserData(userData);
}
```

**Good (only blocks when needed):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) return { skipped: true };
  const userData = await fetchUserData(userId);
  return processUserData(userData);
}
```

---

### Checklist

- [ ] Independent async calls use `Promise.all`
- [ ] API routes start independent fetches before awaiting dependent ones
- [ ] Complex dependency chains use promise chaining or `better-all`
- [ ] RSC data fetching parallelized via component composition
- [ ] `await` deferred to the branch that actually uses the value
