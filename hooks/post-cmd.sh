#!/bin/bash
# postToolUse (Hooks Cursor Docs) - matcher: Shell
# Input: { "tool_name", "tool_input": { "command" }, "tool_output", "tool_use_id", "cwd", "duration", "model" }
# Output: none (updated_mcp_tool_output only for MCP tools)
set -euo pipefail

input=$(cat)

cmd=""
output_blob="$input"
if command -v jq >/dev/null 2>&1; then
  cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""' 2>/dev/null || true)
  output_blob=$(printf '%s' "$input" | jq -r '.tool_output // ""' 2>/dev/null || printf '%s' "$input")
else
  cmd=$(printf '%s' "$input" | sed -nE 's/.*"tool_input"[[:space:]]*:[^}]*"command"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/p' | head -n 1)
fi

if echo "$cmd" | grep -qE '(^|[[:space:]])gh[[:space:]]+pr[[:space:]]+create([[:space:]]|$)'; then
  pr_url=$(printf '%s' "$output_blob" | sed -nE 's#.*(https://github.com/[^ ]+/[^ ]+/pull/[0-9]+).*#\1#p' | head -n 1)
  if [ -n "$pr_url" ]; then
    echo "[Hook] PR created: $pr_url" >&2
  fi
fi

exit 0
