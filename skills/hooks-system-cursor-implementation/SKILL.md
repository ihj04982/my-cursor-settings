---
name: hooks-system-cursor-implementation
description: Hooks System (Cursor Implementation)
---

# Hooks System (Cursor Implementation)

## Hook Types

- **beforeShellExecution**: Before terminal command execution (validation, safety checks)
- **afterShellExecution**: After terminal command execution (log analysis, result parsing)
- **afterFileEdit**: After file modification (auto-format, linting, code quality checks)
- **stop**: When session/generation ends (final verification, auditing)

## Current Hooks (in `.cursor/hooks.json` & `.cursor/hooks/*.sh`)

### beforeShellExecution (Script: `before_cmd.sh`)

- **Long-running process alert**: Detects long-running commands (npm, cargo, build, etc.) and logs a visible info message (Windows compatible, no tmux enforcement).
- **Git push safety**: Pauses execution for 3 seconds before `git push` to allow user interruption (Ctrl+C) for review.
- **Doc blocker**: Blocks creation of unnecessary `.md`/`.txt` files via shell commands (preserves README/CLAUDE.md).

### afterShellExecution (Script: `after_cmd.sh`)

- **PR creation logger**: Detects `gh pr create` output, logs the new PR URL, and suggests the review command.

### afterFileEdit (Script: `after_edit.sh`)

- **Prettier**: Auto-formats JS/TS/JSX/TSX files immediately after Agent edits.
- **TypeScript check**: Runs `tsc --noEmit` on the project root to catch new type errors in the edited file.
- **console.log warning**: Scans the specific edited file for `console.log` and alerts the Agent.

### stop (Script: `on_stop.sh`)

- **console.log audit**: Runs `git diff` to check **all** modified files in the session for remaining `console.log` statements before finishing.

## Permissions & Safety

In Cursor settings:

- **Yolo Mode**: Use with caution. Disable for exploratory or sensitive operations.
- **.cursorrules**: Define project-specific permission boundaries here instead of `~/.claude.json`.
- **Terminal Allowlist**: Configure allowed commands in Cursor settings to reduce manual approvals.

## Task Tracking Best Practices (Composer/Agent)

Use a dedicated `TODO.md` or Agent Plan to:

- Track progress on multi-step tasks
- Verify understanding of instructions
- Enable real-time steering
- Show granular implementation steps

Agent Todo list reveals:

- Out of order steps
- Missing items
- Extra unnecessary items
- Wrong granularity
- Misinterpreted requirements
