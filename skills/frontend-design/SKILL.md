---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Covers websites, landing pages, dashboards, SaaS UIs, React components, and any web UI. Includes Verbalized Sampling methodology to avoid generic AI aesthetics, domain exploration for interface design, and creative implementation patterns.
---

# Frontend Design

Create distinctive, production-grade interfaces. This skill combines creative implementation, anti-generic methodology, and domain-driven interface design.

---

## Phase 0: Context Discovery (MANDATORY)

Before any design, gather deep context:

1. **Who is this human?** Not "users" — the actual person. Where are they? What's on their mind?
2. **What must they accomplish?** The verb. Grade submissions. Find the broken deployment. Approve the payment.
3. **What should this feel like?** "Clean and modern" means nothing. Warm like a notebook? Cold like a terminal? Dense like a trading floor?
4. **Constraints**: Technical requirements, framework, performance, accessibility.
5. **Reference / Anti-Reference**: What to emulate, what to explicitly avoid.

Use `AskUserQuestion` if the prompt is vague. Do not proceed with assumptions.

---

## Phase 1: Identify the Generic Baseline

Verbalize the most predictable design for this request. Common "AI-slop" markers:

- Inter/Roboto/System fonts
- Rounded blue/purple buttons
- Standard F-pattern layouts
- White backgrounds with gradient accents
- Generic hero sections

**You are forbidden from choosing this baseline.**

---

## Phase 2: Explore the Product Domain

### For Dashboards / Apps / Tools

Produce all four before proposing any direction:

- **Domain**: 5+ concepts, metaphors, vocabulary from the product's world
- **Color World**: What colors exist naturally in this domain? If this product were a physical space, what would you see?
- **Signature**: One element (visual, structural, or interaction) that could only exist for THIS product
- **Defaults to Reject**: 3 obvious visual AND structural choices for this type. You can't avoid patterns you haven't named.

### For Landing Pages / Marketing

Apply the **AIDA Framework**:

| Stage | Goal | Design Application |
|-------|------|--------------------|
| **A**ttention | Stop the scroll | Bold typography, unexpected imagery, striking contrast |
| **I**nterest | Build curiosity | Progressive reveal, visual storytelling, unique value |
| **D**esire | Emotional connection | Social proof, benefits visualization, micro-interactions |
| **A**ction | Drive conversion | High-contrast CTAs, reduced friction |

---

## Phase 3: Commit to a Bold Direction

Generate three aesthetic directions with Typicality Scores (0 = unique, 1 = generic):

- **Direction A (T ≈ 0.7)**: Modern/Clean but safe
- **Direction B (T ≈ 0.4)**: Distinctive/Characterful
- **Direction C (T < 0.2)**: Experimental/Bold

Select the lowest T-Score that still meets functional requirements and quality guardrails.

---

## Quality Guardrails (NON-NEGOTIABLE)

| Guardrail | Description |
|-----------|-------------|
| **Visual Hierarchy** | Clear priority ordering — eye knows where to go first, second, third |
| **Contrast & Legibility** | Text readable against background (WCAG AA minimum) |
| **Internal Consistency** | Follows its OWN logic — a coherent system, not random choices |
| **Functional Clarity** | Interactive elements recognizable as such; clear affordances |

---

## Design Thinking

### Typography
Choose fonts that are distinctive and context-appropriate. Avoid Inter, Roboto, Arial, system fonts, Space Grotesk as defaults. Pair a characterful display font with a refined body font. Variable fonts and unusual weights encouraged.

### Color & Theme
Commit to a cohesive palette. CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Gray builds structure; color communicates status, action, emphasis.

### Motion
Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.

### Spatial Composition
Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density. If a standard grid is P=0.9, consider P=0.1 layouts.

### Backgrounds & Visual Details
Create atmosphere. Gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, grain overlays. Match the aesthetic vision.

---

## Craft Foundations (Interface-Specific)

### Subtle Layering
Surfaces barely different but distinguishable. Study Vercel, Supabase, Linear. Elevation changes so subtle you almost can't see them — but you feel the hierarchy. Borders light but not invisible.

### Infinite Expression
Every pattern has infinite expressions. A metric display could be a hero number, sparkline, gauge, progress bar, comparison delta, or something new. Before building, ask: What's the ONE thing users do most here?

### Color Lives Somewhere
Every product exists in a world with colors. Walk into the physical version of this space — what would you see? Your palette should feel like it came FROM somewhere.

### Design Principles
- **Spacing**: Pick a base unit, stick to multiples
- **Depth**: Choose ONE approach (borders-only, subtle shadows, or layered shadows) and commit
- **Border Radius**: Sharper = technical, rounder = friendly. Consistent scale
- **States**: Every interactive element needs default, hover, active, focus, disabled. Data needs loading, empty, error
- **Animation**: Fast micro-interactions (~150ms), smooth easing. No bouncy effects in tools

---

## Anti-Patterns (FAILURES)

- **Accidental Design**: "Different" without intentionality. Unable to articulate WHY.
- **Frankenstein Style**: Mixing incompatible aesthetics without synthesis.
- **Default Convergence**: If another AI would produce substantially the same output, you have failed.
- **Harsh borders**, dramatic surface jumps, inconsistent spacing, mixed depth strategies
- Emojis as icons (use SVG: Heroicons, Lucide, Simple Icons)
- Hover states that cause layout shift

---

## Pre-Delivery Checks

### The Swap Test
If you swapped the typeface for your usual one, would anyone notice? The places where swapping wouldn't matter are where you defaulted.

### The Squint Test
Blur your eyes. Can you still perceive hierarchy? Nothing should jump out harshly.

### The Signature Test
Point to five specific elements where your signature appears. Not "the overall feel" — actual components.

### Visual Quality
- [ ] No emojis as icons
- [ ] All icons from consistent set
- [ ] Hover states don't cause layout shift
- [ ] Light/dark mode text has sufficient contrast (4.5:1)
- [ ] Responsive at 375px, 768px, 1024px, 1440px

### Interaction
- [ ] All clickable elements have `cursor-pointer`
- [ ] Transitions smooth (150–300ms)
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
