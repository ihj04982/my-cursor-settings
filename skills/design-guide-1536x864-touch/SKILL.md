---
name: design-guide-1536x864-touch
description: Fixed 1536×864 touch viewport — grid, margins, 8px rhythm, touch targets, typography, components, vertical rhythm, and QA checklist for panel/kiosk/HMI. Use when designing or implementing UIs for this resolution with touch-first input.
---

# Design Guide: 1536 × 864 Touch Screen

This guide applies the principles in `docs/` (spacing, hierarchy, touch ergonomics, and dashboard standards) to a fixed **1536 × 864 px** viewport with **touch** as the primary input.

---

## 1. Viewport context

| Property | Value | Notes |
|----------|--------|--------|
| Resolution | **1536 × 864** | Same 16:9 aspect as 1920×1080; linear scale ≈ **80%** of Full HD. |
| Input | **Touch first** | Treat pointer hover as optional; all primary actions must be finger-reachable. |
| Mental model | Panel / kiosk / HMI | Prefer predictable regions, large targets, and low mis-tap risk over dense “mouse” layouts. |

---

## 2. Layout grid and margins

Align with the **1320px / 12-column** content logic from the design system, adapted to this width:

- **Max content width:** **1320px**, horizontally centered when possible.  
  - Side margin ≈ `(1536 − 1320) / 2` = **108px** per side on a full-bleed artboard.
- **8px base grid:** Use rhythm **8, 12, 16, 20, 24, 32, 48, 64, 80** for padding and gaps (per UI specification and white-space workshop).
- **Section separation:** Gap between unrelated blocks should be **≥ 2×** the gap inside a block (proximity rule). Prefer **32–48px** between major sections; use **40–80px** for strong “chapter” breaks.
- **Grouping default:** **Whitespace over lines.** Reserve 1px dividers for deep nesting, dense tables, or cases where space alone cannot separate meaning (see “Lines vs. Whitespace” and Professional Design System Manual).

---

## 3. Touch targets and spacing (non-negotiable)

From the touch handbook and component specs:

| Rule | Specification |
|------|----------------|
| Minimum touch height | **44–48px** for list rows, icons with actions, and compact controls. |
| Primary actions | Prefer **48px** or **56px** height for main CTAs and frequent actions. |
| Hit area vs. visible size | Use **padding** to enlarge the tappable region without oversized visuals (“volume” without clutter). |
| Adjacent targets | Leave enough **clear space** so taps do not overlap neighbors (fat-finger prevention). |
| Thumb / reach | Place high-frequency actions in **stable, easy-to-hit zones**; avoid tight grids of small icons. |

**Dashboard caveat:** Dense dashboards may use **36–40px** row heights for data *when* each cell is not individually tappable; for **touch**, prefer **44px+** for any interactive row or control. If you use smaller visual buttons, compensate with **extra external spacing** (compensation rule from white space workshop).

---

## 4. Typography at this resolution

Follow the tier system in `design_rationale.md` and `ui_design_specification.md`, with touch-first legibility:

| Tier | Size (reference) | Use |
|------|------------------|-----|
| Screen / page title | **24–28px**, bold or semi-bold | Anchors orientation; avoid oversized hero type that steals vertical space from data. |
| Section label | **16–20px** as needed | Secondary structure. |
| Body | **16px** default for touch-first UIs; **14px** allowed for dense commerce/lists if contrast and line height stay strong. |
| Metadata / captions | **12–13px** | Lowest priority; use **muted gray (e.g. ~60–70% opacity or ~#767676)** vs. primary text. |

**Contrast:** Prefer **bold black / white titles + regular gray secondary** over “everything medium weight.” Reduce pure black/white vibration on large fields where the docs recommend softer tones.

---

## 5. Components

- **Buttons:** Use **48px (medium)** or **56px (large)** for primary touch actions; **36px** only for secondary, non-critical actions with safe surrounding space. Primary = filled; secondary = stroke; tertiary = text (per UI Design Specification).
- **Inputs:** **48–56px** height, **16–20px** horizontal inner padding; avoid oversized fields (e.g. 77–96px) that push content below the fold without reason.
- **Cards:** Corner radius **8–12px** (up to **20px** if the product allows a softer look); internal padding **≥ 20px** (20–30px per touch handbook). Text must not touch card edges.
- **Icons:** Keep a **fixed alignment box** (e.g. **28px** region) so text baselines stay stable; **3–8px** between icon and label.
- **Shadows:** No drop shadows on ordinary surfaces; reserve for **floating** UI (docks, modals, overlays) per system manual.

---

## 6. Vertical rhythm and “fold”

- **864px height** is limited: keep **GNB / chrome thin and consistent** so KPIs and primary tasks stay visible (visual hierarchy primer).
- Use **asymmetric vertical spacing:** bottom margin of a group **> top margin** to “ground” blocks (nesting / 1:1.5 style rules from white space workshop).
- **Footer / bottom safe area:** Reserve **≥ 40px** (often **40–60px**) above the physical edge so content does not feel cramped.

---

## 7. Motion and feedback

- Touch UIs need clear **pressed / active** states (not only hover).
- Avoid interactions that require double-click precision; prefer **explicit** controls for destructive actions.

---

## 8. Quality checklist (this viewport + touch)

- [ ] All interactive targets meet **44–48px** minimum height (or have expanded hit areas).
- [ ] Spacing follows the **8px scale**; section gaps clearly exceed inner gaps.
- [ ] Grouping uses **margins** first; lines only where the docs allow exceptions.
- [ ] Typography uses a clear **three-level** hierarchy; secondary text is **muted**, not competing with titles.
- [ ] Cards and inputs respect **padding and radius**; no text flush to edges.
- [ ] **GNB** height is consistent and not consuming excess vertical space.
- [ ] Bottom of screen has **breathing room**; no “tight” footer against the bezel.

---

## 9. Source alignment

This guide consolidates rules and vocabulary from:

- `touch_friendly_design.md` — finger thickness, cards, hierarchy, responsive continuity  
- `ui_design_specification.md` — margins, grid, components, breakpoints  
- `design_rationale.md` — grid, typography tiers, spacing table  
- `Professional Design System Manual_ Web & Dashboard Standards.md` — dashboard type scale, buttons, touch constants  
- `The Beginner’s Guide to UI Grouping_ Lines vs. Whitespace.md` — proximity, 1:2 margin ratio, finger test  
- `visual_hierarchy.md` — three depths, GNB audit  
- `white_space_workshop.md` — seven spacing tips, compensation for smaller targets  

Use this document as the **viewport-specific profile**; when a rule conflicts, prioritize **touch safety** and **readability at arm’s length** on a fixed 1536×864 display.
