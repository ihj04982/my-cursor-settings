#!/bin/bash
# postToolUse (Hooks Cursor Docs) - matcher: Shell
# Input: { "tool_name", "tool_input": { "command" }, "tool_output", "duration", ... }
# Output: none
set -euo pipefail

input=$(cat)

cmd=""
if command -v jq >/dev/null 2>&1; then
  cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""' 2>/dev/null || true)
else
  cmd=$(printf '%s' "$input" | sed -nE 's/.*"tool_input"[[:space:]]*:[^}]*"command"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/p' | head -n 1)
fi

if echo "$cmd" | grep -qE '(npm run build|pnpm build|yarn build|bun run build)'; then
  echo "[Hook] Build completed." >&2
fi

exit 0
