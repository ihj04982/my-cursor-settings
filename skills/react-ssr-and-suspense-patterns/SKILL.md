---
name: react-ssr-and-suspense-patterns
description: React SSR hydration and Suspense patterns — prevent hydration mismatch, suppress expected mismatches, strategic Suspense boundaries. Use when fixing hydration errors, implementing streaming, or placing Suspense fallbacks.
---

## React SSR & Suspense Patterns

Patterns for hydration correctness, flicker prevention, and streaming granularity.

---

### 1. Prevent Hydration Mismatch Without Flickering

For client-dependent values (theme, user prefs from localStorage), inject a synchronous script before React hydrates.

**Bad (breaks SSR):**

```tsx
const theme = localStorage.getItem('theme') || 'light'; // undefined on server
```

**Bad (flickers):**

```tsx
const [theme, setTheme] = useState('light');
useEffect(() => {
  const stored = localStorage.getItem('theme');
  if (stored) setTheme(stored); // flash of wrong theme
}, []);
```

**Good (no flicker, no mismatch):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">{children}</div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  );
}
```

Useful for theme toggles, user preferences, authentication states.

---

### 2. Suppress Expected Hydration Mismatches

For values that are intentionally different on server vs client (random IDs, dates, locale/timezone), use `suppressHydrationWarning`.

**Bad (noisy warnings):**

```tsx
<span>{new Date().toLocaleString()}</span>
```

**Good:**

```tsx
<span suppressHydrationWarning>{new Date().toLocaleString()}</span>
```

Do **not** use this to hide real bugs. Apply only where server/client difference is deliberate.

---

### 3. Strategic Suspense Boundaries

Place Suspense boundaries to show wrapper UI immediately while data streams in. Don't let a single fetch block the entire page.

**Bad (entire page blocked):**

```tsx
async function Page() {
  const data = await fetchData(); // blocks everything
  return (
    <div>
      <Sidebar /><Header />
      <DataDisplay data={data} />
      <Footer />
    </div>
  );
}
```

**Good (layout renders immediately):**

```tsx
function Page() {
  return (
    <div>
      <Sidebar /><Header />
      <Suspense fallback={<Skeleton />}>
        <DataDisplay />
      </Suspense>
      <Footer />
    </div>
  );
}

async function DataDisplay() {
  const data = await fetchData();
  return <div>{data.content}</div>;
}
```

**Share promise across components:**

```tsx
function Page() {
  const dataPromise = fetchData();
  return (
    <Suspense fallback={<Skeleton />}>
      <DataDisplay dataPromise={dataPromise} />
      <DataSummary dataPromise={dataPromise} />
    </Suspense>
  );
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise);
  return <div>{data.content}</div>;
}
```

**When NOT to use:** Critical layout data, SEO content above the fold, small fast queries, or when layout shift is unacceptable.

---

### Checklist

- [ ] Client-dependent values (theme, prefs) use synchronous inline script
- [ ] Intentional server/client differences use `suppressHydrationWarning`
- [ ] `suppressHydrationWarning` not masking real bugs
- [ ] Data-fetching components wrapped in individual Suspense boundaries
- [ ] Layout (header, sidebar, footer) renders without waiting for data
- [ ] Shared data uses single promise passed to multiple components
