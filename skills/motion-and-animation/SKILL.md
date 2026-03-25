---
name: motion-and-animation
description: Comprehensive motion and animation guide — Disney's 12 principles for web, animation performance rules (compositor-only, measurement, scroll), and interaction design patterns (microinteractions, transitions, loading states, gestures). Use when implementing, reviewing, or fixing UI animations, transitions, or motion.
---

# Motion & Animation

Complete guide to web animation: principles for quality, performance rules for smoothness, and implementation patterns for common interactions.

---

## Part A: Animation Principles (Disney's 12 for Web)

Disney animators codified these in the 1930s. We use them to make pixels feel human.

| # | Principle | Web Application |
|---|-----------|-----------------|
| 1 | **Squash & Stretch** | Subtle deformation conveys weight in morphing elements — don't overdo it |
| 2 | **Anticipation** | Cues before action (pull-to-refresh hints, button compress before send) |
| 3 | **Staging** | Guide eye through sequential animation; dim backgrounds to focus |
| 4 | **Straight Ahead & Pose to Pose** | Define key poses (start, end, maybe midpoint); let browser interpolate |
| 5 | **Follow Through & Overlapping** | Springs add organic overshoot-and-settle; too much stagger feels slow |
| 6 | **Slow In & Slow Out** | `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for deliberate |
| 7 | **Arcs** | Curved paths feel natural; best for hero moments and playful interactions |
| 8 | **Secondary Action** | Flourishes supporting the main action (sparkles, sound, particles) |
| 9 | **Timing** | Keep interactions <300ms; be consistent across similar elements |
| 10 | **Exaggeration** | Push past accuracy sparingly (onboarding, empty states, confirmations) |
| 11 | **Solid Drawing** | Shadows suggest depth; CSS `perspective` gives real 3D |
| 12 | **Appeal** | The sum of all techniques applied with care and taste |

### Key Guidelines

- **Balance**: Too much animation turns professional software into a cartoon
- **Consistency**: Define timing scales early, reuse everywhere
- **Purpose**: Great animation is invisible — users think "this feels good"
- **Restraint**: Not everything needs to be animated

---

## Part B: Animation Performance Rules

### Rendering Pipeline

- **Composite** (cheapest): `transform`, `opacity`
- **Paint**: color, borders, gradients, masks, images, filters
- **Layout** (most expensive): size, position, flow, grid, flex

### Rule Categories by Priority

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Never Patterns | CRITICAL |
| 2 | Choose the Mechanism | CRITICAL |
| 3 | Measurement | HIGH |
| 4 | Scroll | HIGH |
| 5 | Paint | MEDIUM-HIGH |
| 6 | Layers | MEDIUM |
| 7 | Blur & Filters | MEDIUM |
| 8 | View Transitions | LOW |
| 9 | Tool Boundaries | CRITICAL |

### 1. Never Patterns (CRITICAL)

- Do not interleave layout reads and writes in the same frame
- Do not animate layout continuously on large surfaces
- Do not drive animation from `scrollTop`, `scrollY`, or scroll events
- No `requestAnimationFrame` loops without a stop condition
- Do not mix multiple animation systems that each measure or mutate layout

### 2. Choose the Mechanism (CRITICAL)

- Default to `transform` and `opacity` for motion
- JS-driven animation only when interaction requires it
- Paint/layout animation acceptable only on small, isolated surfaces
- One-shot effects acceptable more often than continuous motion
- Prefer downgrading technique over removing motion entirely

### 3. Measurement (HIGH)

- Measure once, then animate via transform or opacity
- Batch all DOM reads before writes
- Do not read layout repeatedly during an animation
- Prefer FLIP-style transitions for layout-like effects

### 4. Scroll (HIGH)

- Prefer Scroll/View Timelines for scroll-linked motion
- Use `IntersectionObserver` for visibility and pausing
- Do not poll scroll position for animation
- Pause or stop animations when off-screen

### 5. Paint (MEDIUM-HIGH)

- Paint-triggering animation allowed only on small, isolated elements
- Do not animate CSS variables for transform, opacity, or position
- Scope animated CSS variables locally; avoid inheritance

### 6. Layers (MEDIUM)

- Compositor motion requires layer promotion — never assume it
- Use `will-change` temporarily and surgically
- Avoid many or large promoted layers

### 7. Blur & Filters (MEDIUM)

- Keep blur ≤8px; use only for short, one-time effects
- Never animate blur continuously or on large surfaces
- Prefer opacity and translate before blur

### 8. View Transitions (LOW)

- Use only for navigation-level changes
- Avoid for interaction-heavy UI or when interruption is needed

### 9. Tool Boundaries (CRITICAL)

- Do not migrate animation libraries unless explicitly requested
- Apply rules within the existing animation system

---

## Part C: Interaction Design Patterns

### Timing Guidelines

| Duration | Use Case |
|----------|----------|
| 100-150ms | Micro-feedback (hovers, clicks) |
| 200-300ms | Small transitions (toggles, dropdowns) |
| 300-500ms | Medium transitions (modals, page changes) |
| 500ms+ | Complex choreographed animations |

### Easing Functions

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);    /* Entering */
--ease-in: cubic-bezier(0.55, 0, 1, 0.45);    /* Exiting */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* Moving between */
--spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Playful overshoot */
```

### Loading States

**Skeleton screens** (preserve layout):

```tsx
function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg" />
      <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
```

**Progress bar**:

```tsx
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-blue-600"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "easeOut" }}
      />
    </div>
  );
}
```

### State Transitions

**Toggle with spring**:

```tsx
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch" aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200
        ${checked ? "bg-blue-600" : "bg-gray-300"}`}
    >
      <motion.span
        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow"
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
```

### Page Transitions

```tsx
import { AnimatePresence, motion } from "framer-motion";

function PageTransition({ children, key }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### Gesture Interactions

**Swipe to dismiss**:

```tsx
function SwipeCard({ children, onDismiss }) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) onDismiss();
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  );
}
```

### CSS Animation Patterns

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
```

### Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Checklist

### Quality
- [ ] Motion has clear purpose (feedback, orientation, focus, continuity)
- [ ] Timing consistent across similar elements
- [ ] Springs used for organic movement where appropriate
- [ ] Animations feel right but aren't noticeable

### Performance
- [ ] Using `transform` and `opacity` for motion (compositor-only)
- [ ] No interleaved DOM reads and writes
- [ ] No continuous layout animation on large surfaces
- [ ] Scroll-linked motion uses Scroll/View Timelines or IntersectionObserver
- [ ] `will-change` used temporarily, not permanently
- [ ] Blur ≤8px and only for one-shot effects

### Accessibility
- [ ] `prefers-reduced-motion` respected
- [ ] Animations interruptible
- [ ] `transition: all` never used — properties listed explicitly
- [ ] No motion that blocks user interaction

### Implementation
- [ ] Micro-feedback: 100-150ms
- [ ] Small transitions: 200-300ms
- [ ] Loading states use skeleton screens
- [ ] Hover states use transform/opacity (no layout shift)

## References

- [Framer Motion](https://www.framer.com/motion/)
- [CSS Animation Guide](https://web.dev/animations-guide/)
- [easing.dev](https://easing.dev)
- [The Illusion of Life: Disney Animation](https://www.amazon.com/Illusion-Life-Disney-Animation/dp/0786860707)
- [Layout-forcing properties](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
