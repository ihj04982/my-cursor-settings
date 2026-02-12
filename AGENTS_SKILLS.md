# Agents vs Skills Guide

Relationship between `agents/` and `skills/` based on [Plugins reference](https://code.claude.com/docs/en/plugins-reference).

---

## 1. Concept

| | Agents | Skills |
|-|--------|--------|
| **Role** | Specialized subagents for specific tasks | `/name` shortcuts, context triggers |
| **Location** | `agents/` (markdown files) | `skills/` (directories with SKILL.md) |
| **Format** | Agent frontmatter (name, description, tools, model) | Skill frontmatter (name, description, disable-model-invocation, etc.) |
| **Usage** | Exposed in /agents UI, invoked manually or automatically | Loaded automatically based on task context |
| **Content** | Procedures, checklists, tool usage | When/how to use, or agent delegation |

---

## 2. Recommended Patterns

### Pattern A: Skill → Agent Delegation (Command style)

Skills stay thin: "when to use" and "which agent to invoke". Actual work is delegated to agents.

| Skill | Agent | Notes |
|-------|-------|-------|
| `plan` | `planner` | Requirements → implementation plan |
| `tdd` | `tdd-guide` | Test-driven development workflow |
| `e2e` | `e2e-runner` | Playwright E2E tests |
| `code-review` | `code-reviewer` | Code review (quality, security) |
| `build-fix` | `build-error-resolver` | Build/type error resolution |
| `refactor-clean` | `refactor-cleaner` | Dead code cleanup, refactoring |

**Rule**: Do not duplicate procedures in skills; reference agents only.

### Pattern B: Skill = Knowledge Trigger, Agent = Executor

Skills define "when to apply this context"; agents hold detailed procedures and checklists.

| Skill | Agent | Notes |
|-------|-------|-------|
| `security-review` | `security-reviewer` | Pre-commit checklist + agent invocation |
| `tdd-workflow` | `tdd-guide` | TDD principles + agent execution guide |

### Pattern C: Skill = Knowledge Only (No Agent)

Skills with domain knowledge/patterns. Used as context only, no agent invocation.

Examples: `vercel-react-best-practices`, `avoid-barrel-file-imports`, `hoist-regexp-creation`, etc.

### Pattern D: Agent = Orchestrator, Skill = Sub-procedures

Agents orchestrate multiple skills/commands.

| Agent | Invokes | Notes |
|-------|---------|-------|
| `doc-updater` | `update-codemaps`, `update-docs` | Documentation and codemap updates |

---

## 3. Avoid Duplication

1. **No duplicate procedures**: Do not define the same workflow in both skill and agent.
2. **Thin skills, thick agents**: Skills = triggers and summaries; agents = detailed procedures.
3. **Single source of truth**: Keep detailed content in one place (usually the agent).

---

## 4. Mapping Summary

```
agents/                    skills/ (delegation/reference)
────────────────────────────────────────────────
planner          ←── plan
tdd-guide        ←── tdd, tdd-workflow
e2e-runner       ←── e2e
code-reviewer    ←── code-review
build-error-resolver ←── build-fix
refactor-cleaner ←── refactor-clean
security-reviewer ←── security-review (knowledge + reference)
doc-updater      ──→ update-codemaps, update-docs
architect        (standalone)
vercel-react-best-practices (reference doc/skill)
```
