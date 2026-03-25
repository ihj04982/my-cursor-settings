---
name: bundle-optimization
description: Bundle optimization patterns — barrel file avoidance, conditional/dynamic imports, deferred third-party scripts, SVG precision. Use when reducing bundle size, improving LCP/TTI, or code-splitting.
---

## Bundle Optimization

Patterns to reduce initial bundle size, improve loading performance, and enable effective code-splitting.

---

### 1. Avoid Barrel File Imports

Import directly from source files instead of barrel (index) files to avoid loading thousands of unused modules.

**Bad (imports entire library):**

```tsx
import { Check, X, Menu } from 'lucide-react';
// Loads 1,583 modules, takes ~2.8s extra in dev

import { Button, TextField } from '@mui/material';
// Loads 2,225 modules
```

**Good (direct imports):**

```tsx
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';
import Menu from 'lucide-react/dist/esm/icons/menu';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
```

**Alternative (Next.js 13.5+):**

```js
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/material'],
  },
};
```

Commonly affected: `lucide-react`, `@mui/material`, `@mui/icons-material`, `@tabler/icons-react`, `react-icons`, `lodash`, `date-fns`, `rxjs`.

Reference: [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)

---

### 2. Dynamic Imports for Heavy Components

Use `next/dynamic` to lazy-load large components not needed on initial render.

**Bad (Monaco bundles with main chunk ~300KB):**

```tsx
import { MonacoEditor } from './monaco-editor';
```

**Good (loads on demand):**

```tsx
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then((m) => m.MonacoEditor),
  { ssr: false },
);
```

---

### 3. Conditional Module Loading

Load large data/modules only when a feature is activated.

```tsx
function AnimationPlayer({ enabled, setEnabled }: Props) {
  const [frames, setFrames] = useState<Frame[] | null>(null);

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      import('./animation-frames.js')
        .then((mod) => setFrames(mod.frames))
        .catch(() => setEnabled(false));
    }
  }, [enabled, frames, setEnabled]);

  if (!frames) return <Skeleton />;
  return <Canvas frames={frames} />;
}
```

The `typeof window !== 'undefined'` check prevents bundling for SSR.

---

### 4. Defer Non-Critical Third-Party Libraries

Analytics, logging, and error tracking don't block user interaction. Load after hydration.

**Bad (blocks initial bundle):**

```tsx
import { Analytics } from '@vercel/analytics/react';
```

**Good (loads after hydration):**

```tsx
import dynamic from 'next/dynamic';

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then((m) => m.Analytics),
  { ssr: false },
);
```

---

### 5. Optimize SVG Precision

Reduce SVG coordinate precision to decrease file size.

**Bad:** `<path d="M 10.293847 20.847362 L 30.938472 40.192837" />`

**Good:** `<path d="M 10.3 20.8 L 30.9 40.2" />`

**Automate:** `npx svgo --precision=1 --multipass icon.svg`

---

### Checklist

- [ ] Icon/component libraries imported directly, not via barrel files
- [ ] Heavy components (editors, charts) use dynamic imports
- [ ] Feature-gated modules loaded conditionally
- [ ] Analytics/logging/error tracking deferred to post-hydration
- [ ] SVG assets optimized with reduced precision
