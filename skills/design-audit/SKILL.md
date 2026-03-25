---
name: design-audit
description: Design audit and review — typography audit, structural analysis, Web Interface Guidelines compliance, accessibility, UX anti-patterns, and brand resonance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or evaluate design quality.
---

# Design Audit

Comprehensive audit framework combining typographic analysis, structural review, and Web Interface Guidelines compliance.

---

## Part A: Typography & Structure Audit

### Typographic Job Matrix

| Category | Objective | Metrics |
|----------|-----------|---------|
| **Display** | Catch attention, evoke resonance | Interest, gut feeling, memorability |
| **Body** | Clear, comfortable information | Legibility, comfort, "gets out of the way" |

### Body Text Legibility

Four critical decisions (use "Break It and Fix It" — push to broken extreme, then adjust):

1. **Font (sturdiness)**: Typographic color and "active texture" — sturdy shapes, not muddy gray
2. **Size**: Comfortable at standard viewing distance; test boundaries
3. **Measure/line length**: Too narrow = frantic rhythm; too wide = eye loses return to left margin
4. **Leading**: Narrower measure → tighter leading; wider measure → looser leading

### Display Text & Shape Harmony

Display text must share **Visual DNA** with body text:
- **Stems**: Slanted or straight? Same backbone as body?
- **Arcs/joins**: Shared sharpness or curves?
- **Positive/negative space**: Counters match word/line spacing weight?
- **Weight benchmarking**: Display thin vs body stems; display heavy vs x-height

### Structural Audit (Alignment & Proximity)

- **Strong alignment axis**: Find the primary axis. Audit for visual alignment (can snap to grid but still look "off")
- **Proximity**: Headings associate with their content blocks, not each other. Related items closer than unrelated
- **Edge tension**: Elements closer to page edges than to each other cause mess

### Resonance

- **Adjective mapping**: Describe gut feeling (elegant, trustworthy, casual, official)
- **Competitive benchmarking**: Familiar (expected) vs memorably unexpected

### Diagnostic Tools

- **Squint test**: Judge volumes of space and typographic color without reading
- **Inversion**: Turn layout upside down to judge weight, alignment, balance
- **Distance study**: Step back — what is first, second, third? Match to intent
- **Toggle/side-by-side**: Never audit one solution alone; compare variations

---

## Part B: Web Interface Guidelines

### Accessibility (CRITICAL)

- Icon-only buttons need `aria-label`
- Form controls need `<label>` or `aria-label`
- Interactive elements need keyboard handlers
- `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div onClick>`)
- Images need `alt` (or `alt=""` if decorative)
- `aria-live="polite"` for async updates (toasts, validation)
- Headings hierarchical `<h1>`–`<h6>`; include skip link

### Focus States

- Visible focus: `focus-visible:ring-*` or equivalent
- Never `outline-none` without focus replacement
- Use `:focus-visible` over `:focus`
- Group focus with `:focus-within` for compound controls

### Forms

- `autocomplete` and meaningful `name` on inputs
- Correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`
- Never block paste (`onPaste` + `preventDefault`)
- Labels clickable (`htmlFor` or wrapping control)
- Errors inline next to fields; focus first error on submit
- Warn before navigation with unsaved changes

### Animation

- Honor `prefers-reduced-motion`
- Animate `transform`/`opacity` only
- Never `transition: all` — list properties explicitly
- Animations interruptible

### Typography Rules

- `…` not `...`; curly quotes `"` `"` not straight `"`
- `font-variant-numeric: tabular-nums` for number columns
- `text-wrap: balance` or `text-pretty` on headings

### Content Handling

- Text containers handle long content: `truncate`, `line-clamp-*`, or `break-words`
- Flex children need `min-w-0` for truncation
- Handle empty states

### Images

- `<img>` needs explicit `width` and `height` (prevents CLS)
- Below-fold: `loading="lazy"`; above-fold: `priority` or `fetchpriority="high"`

### Performance

- Large lists (>50 items): virtualize
- No layout reads in render
- `<link rel="preconnect">` for CDN domains
- Critical fonts: `<link rel="preload" as="font">` with `font-display: swap`

### Navigation & State

- URL reflects state — filters, tabs, pagination in query params
- Links use `<a>`/`<Link>` (Cmd/Ctrl+click support)
- Destructive actions need confirmation or undo

### Touch & Interaction

- `touch-action: manipulation` (prevents double-tap zoom delay)
- `overscroll-behavior: contain` in modals/drawers
- `autoFocus` sparingly

### Dark Mode & Theming

- `color-scheme: dark` on `<html>` for dark themes
- `<meta name="theme-color">` matches page background

### Locale & i18n

- Use `Intl.DateTimeFormat` and `Intl.NumberFormat`, not hardcoded formats
- Detect language via `Accept-Language`, not IP

### Anti-Patterns (FLAG THESE)

- `user-scalable=no` or `maximum-scale=1`
- `onPaste` with `preventDefault`
- `transition: all`
- `outline-none` without focus-visible replacement
- `<div>`/`<span>` with click handlers (should be `<button>`)
- Images without dimensions
- Large arrays `.map()` without virtualization
- Form inputs without labels
- Hardcoded date/number formats

---

## Output Format

Group by file. Use `file:line` format. Terse findings.

```text
## src/Button.tsx

src/Button.tsx:42 - icon button missing aria-label
src/Button.tsx:55 - animation missing prefers-reduced-motion

## src/Modal.tsx

src/Modal.tsx:12 - missing overscroll-behavior: contain

## src/Card.tsx

✓ pass
```
