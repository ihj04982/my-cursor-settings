---
name: design-lab
description: Conduct design interviews, generate five distinct UI variations in a temporary design lab, collect feedback, and produce implementation plans. Use when the user wants to explore UI design options, redesign existing components, or create new UI with multiple approaches to compare.
---

# Design Lab Skill

This skill implements a complete design exploration workflow: interview, generate variations, collect feedback, refine, preview, and finalize.

## CRITICAL: Cleanup Behavior

**All temporary files MUST be deleted when the process ends, whether by:**
- User confirms final design → cleanup, then generate plan
- User aborts/cancels → cleanup immediately, no plan generated

**Never leave `.claude-design/` or `__design_lab` routes behind.** If the user says "cancel", "abort", "stop", or "nevermind" at any point, confirm and then delete all temporary artifacts.

---

## Workflow Summary

| Phase | Action |
|-------|--------|
| **0** | Preflight: detect package manager, framework, styling, Design Memory; infer visual style from project |
| **1** | Interview: scope, pain points, inspiration, brand, persona, constraints (use AskUserQuestion) |
| **2** | Generate Design Brief JSON → `.claude-design/design-brief.json`; show summary |
| **3** | Generate Design Lab: `.claude-design/lab/` with 5 variants, FeedbackOverlay in route dir, `data-variant` on containers |
| **4** | Present URL to user (do not start dev server); output instructions and proceed to Phase 5 |
| **5** | Collect feedback: interactive overlay (preferred) or AskUserQuestion; parse Overall Direction and comments |
| **6** | If user likes parts of different variants: synthesize Variant F, replace lab, ask again |
| **7** | Final preview at `/__design_preview`; ask for confirmation |
| **8** | On confirm: cleanup temp files, write `DESIGN_PLAN.md`, create/update `DESIGN_MEMORY.md` |

**Abort:** If user cancels at any time, confirm then delete `.claude-design/` and route files; do not generate plan.

---

## Additional Resources

For full details (preflight detection tables, interview question options, directory structure, FeedbackOverlay setup, variant guidelines, feedback parsing, finalize templates, error handling, configuration), see [reference.md](reference.md).
