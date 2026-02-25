---
name: vs-research-ideate
description: Generate high-entropy research (자료조사) and ideas (아이디어) using Verbalized Sampling to avoid mode collapse and maximize creativity and novelty.
---

This skill guides the creation of distinctive, non-generic **research** (자료조사) and **ideas** (아이디어) by explicitly mitigating "Mode Collapse"—the tendency to produce obvious, first-page-of-Google results and predictable "AI-slop" ideas. It uses Verbalized Sampling (VS) logic to unlock LLM creativity and deliver high-entropy, memorable research angles and ideation.

**Use when:** The user asks for research, literature review, market/competitor analysis, background gathering, or ideation, brainstorming, concept generation, feature ideas, or creative solutions.

---

## Phase 0: Context Discovery (MANDATORY)

BEFORE any research or ideation, you MUST gather deep context from the user. Use the `AskUserQuestion` tool (or direct questions in dialogue) to probe the following dimensions:

### Discovery Dimensions

1. **Purpose**: Why is this research or ideation needed? (e.g., decision-making, report, inspiration, validation, problem-solving)
2. **Scope & Constraints**: What's in bounds? Time, budget, geography, domain? What must be excluded?
3. **Existing Knowledge**: What does the user already know or assume? What have they already read or tried?
4. **Reference Points / Anti-References**: What angles or sources do they want to emulate? What do they explicitly want to avoid? (e.g., "not the usual McKinsey-style framing")
5. **Audience**: Who will consume this research or these ideas? What's their level of expertise and what would surprise or help them?

### Context Signals

- **Analyze the prompt** for implicit scope (industry, product, academic vs commercial, depth of evidence required).
- **Infer anti-patterns** from domain (e.g., tech: avoid "top 10 tools" generic lists; strategy: avoid generic SWOT).
- **Ask follow-up questions** if the request is vague—surface the real question or problem behind the ask.

**CRITICAL**: Do not proceed to Phase 1 until you have sufficient context. A vague prompt requires MORE questions, not assumptions.

---

## Phase 1: Identify the Mode (The Generic Baseline)

- **For research**: Verbalize the most predictable, high-probability (P ≈ 0.95) research approach and sources for this request. Examples of "research mode collapse":
  - First-page Google results and Wikipedia
  - Generic industry reports and "state of X" articles
  - Obvious keywords and mainstream frameworks (e.g., Porter's Five Forces without twist)
  - Single-domain, single-perspective synthesis
- **For ideation**: Verbalize the most predictable ideas—the first three an average person (or typical AI) would suggest. Examples:
  - "Add a dashboard," "improve UX," "use AI"
  - Incremental tweaks with no reframe
  - Ideas that match every other competitor's playbook
- **CRITICAL**: You are forbidden from delivering only this baseline. It is the floor to diverge from.

---

## Phase 2: Sample the Long-Tail (Probability Mapping)

Generate three distinct **directions** (research angles or idea clusters) and assign a **"Typicality Score" (T-Score)** from 0 to 1.0 (where 1.0 is most generic):

- **Direction A (T ≈ 0.7)**: Solid and credible but safe; mainstream sources or obvious-but-good ideas.
- **Direction B (T ≈ 0.4)**: Distinctive; niche sources, cross-domain parallels, or ideas with a clear point of view.
- **Direction C (T < 0.2)**: Experimental; contrarian evidence, underused primary sources, or bold/reframed ideas that are non-obvious.

**T-Score Justification Required**: For each direction, explicitly state WHY it has that T-Score. What makes it more or less typical? Reference specific choices (sources, framings, or idea attributes).

---

## Phase 3: Commit to Low-Typicality

Select the direction with the **lowest T-Score** that still meets:

1. Purpose and scope from Phase 0
2. All Quality Guardrails (see below)

Commit to this BOLD research path or idea set with intentionality. The choice must be DELIBERATE, not accidental.

---

## Quality Guardrails (NON-NEGOTIABLE)

These principles MUST be satisfied regardless of how experimental the research or ideas become. If a Low-T direction violates any of these, increase T until compliance is achieved.

### For Research (자료조사)

| Guardrail | Description |
|-----------|-------------|
| **Traceability** | Sources and claims can be verified; distinguish fact vs inference vs opinion |
| **Relevance** | Every piece of evidence or source clearly ties to the user's question or scope |
| **Coherence** | One clear narrative or argument; no random fact-dumping |
| **Actionability** | Takeaways are explicit: so what? what should the user do or believe? |

### For Ideation (아이디어)

| Guardrail | Description |
|-----------|-------------|
| **Clarity** | Each idea is concretely described—enough to judge and to take a next step |
| **Feasibility** | Ideas are scoped; not pure fantasy unless the user asked for blue-sky only |
| **Internal Consistency** | The set of ideas fits a coherent strategy or theme (e.g., same product, same user) |
| **Differentiation** | Ideas are distinguishable from each other and from the "mode" (Phase 1) |

---

## Anti-Patterns (EXPLICIT FAILURES)

If your output exhibits these patterns, you have FAILED the skill's intent:

### 1. Accidental Research / Ideas

- Adding "different" sources or ideas without intentionality
- Randomness masquerading as creativity
- Unable to articulate WHY a source or idea was chosen
- **Test**: If asked "why this source or idea?", you must have a coherent answer

### 2. Frankenstein Output

- Mixing incompatible framings or domains without synthesis
- No unifying thread or narrative (research) or strategy (ideas)
- Reads like unrelated fragments from different projects
- **Test**: Could you describe this research or idea set's "point" in one sentence?

### 3. Mode Collapse in Disguise

- Claiming "long-tail" while still citing only mainstream sources or offering generic ideas
- T-Scores that are not justified or are clearly understated
- **Test**: Would an expert in the domain find this obvious or surprising?

---

## Research Guidelines (VS-Enhanced)

Apply the **Inversion Principle**: If a source or angle feels "obvious," it has too much probability mass. Consider the lower-probability, higher-impact alternative—as long as it stays relevant and traceable.

### Source Diversity

- **High-T examples**: Wikipedia, first-page SERP, generic "best practices" blogs, single-industry reports only
- **Low-T approach**: Primary sources, niche journals, cross-industry or historical parallels, expert interviews or transcripts, non-English or regional sources when relevant, contrarian or critical takes

### Angle and Framing

- Avoid the default framing (e.g., "benefits of X"). Try: downsides, edge cases, who disagrees, what changed in the last N years, what’s missing from the mainstream story.
- Use a clear lens: e.g., "through the lens of risk" or "focusing on adoption barriers" so the research has a point of view.

### Synthesis

- Synthesize explicitly: themes, tensions, gaps. Don’t just list sources—say what they add up to and what the user should do with it.

---

## Ideation Guidelines (VS-Enhanced)

- **Inversion**: If the obvious idea is "add feature X," consider "remove X," "replace X with Y," or "make X optional for a segment."
- **Combination**: Combine constraints or domains (e.g., "what if we applied X from industry A to our product in industry B?").
- **Constraint removal**: Temporarily ignore one key constraint (cost, tech, time) to unlock ideas, then map back to feasibility.
- **Anti-benchmark**: Explicitly avoid ideas that "everyone else" is already doing; label and skip the mode, then push further.

---

## Structural Frameworks (Context-Dependent)

### For Research Output

When the goal is **decision or recommendation**, structure the deliverable as:

| Stage | Goal | Application |
|-------|------|-------------|
| **Question** | State the exact question or decision being informed | One sentence; no ambiguity |
| **Evidence** | Present findings by theme or source type, with T-Score awareness | Prefer low-T sources; mark confidence and gaps |
| **Gaps & Caveats** | What’s missing, conflicting, or uncertain | Builds trust and clarifies "so what" |
| **Implications & Options** | What the user should do or believe; 2–3 concrete options if relevant | Actionable next steps |

### For Ideation Output

When the goal is **concept or feature generation**, structure as:

| Stage | Goal | Application |
|-------|------|-------------|
| **Problem / Opportunity** | Reframe the brief in one line | Ensures ideas solve the right problem |
| **Idea Set** | 3–5 distinct ideas with T-Score and brief rationale | Lowest T that still passes guardrails |
| **Selection Criteria** | How to choose (e.g., impact vs effort, strategic fit) | Makes the set usable for the user |
| **Next Steps** | One concrete next step per idea (e.g., "validate with one customer") | Moves from idea to action |

---

## Implementation Standards

- **Output quality**: Research must be citable and synthesised; ideas must be specific and scoped.
- **Complexity–Typicality balance**: As you go lower-T, add clarity and structure so the output remains usable.
- **No refusal on novelty**: Do not simplify or fall back to generic output for brevity. The user invoked this skill for high-entropy research and ideas.

---

## Execution Process Summary

```
[Phase 0] Context Discovery
    ↓ (questions – gather purpose, scope, anti-refs, audience)
[Phase 1] Identify the Mode
    ↓ (verbalize the generic baseline – research or ideas)
[Phase 2] Sample the Long-Tail
    ↓ (three directions with justified T-Scores)
[Phase 3] Commit to Low-Typicality
    ↓ (select lowest T that passes Guardrails)
[Phase 4] Execute Output
    ↓ (research: sources + synthesis + implications; ideas: set + criteria + next steps)
[Phase 5] Surprise Check
    ↓ (would an expert find this obvious? if yes, refine)
```

---

## Final Validation

Before delivering, ask yourself:

1. **Intentionality**: Can I justify every major source or idea choice?
2. **Coherence**: Does the research have one clear narrative? Do the ideas form a coherent set?
3. **Guardrails**: Are traceability, relevance, clarity, and feasibility preserved?
4. **Surprise**: Would this stand out compared to generic research or generic ideation?

**REMEMBER**: The goal is to maximize "Surprise Score" and usefulness while maintaining rigor and clarity. Break the mold—deliberately—in 자료조사 and 아이디어.
