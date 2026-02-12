#!/bin/bash
# afterFileEdit (Hooks Cursor Docs)
# Input: { "file_path": "<absolute path>", "edits": [{ "old_string", "new_string" }] }
# Output: none (no output fields)
set -euo pipefail

input=$(cat)

file_path=""
if command -v jq >/dev/null 2>&1; then
  file_path=$(printf '%s' "$input" | jq -r '.file_path // ""' 2>/dev/null || true)
else
  file_path=$(printf '%s' "$input" | sed -nE 's/.*"file_path"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p' | head -n 1)
fi

if [ -z "$file_path" ] || [ ! -f "$file_path" ]; then
  exit 0
fi

# 1. Prettier (when available)
if command -v prettier >/dev/null 2>&1 && [[ "$file_path" =~ \.(js|jsx|ts|tsx)$ ]]; then
  prettier --write "$file_path" >/dev/null 2>&1 || true
fi

# 2. TypeScript check (.ts/.tsx)
if [[ "$file_path" =~ \.(ts|tsx)$ ]] && command -v npx >/dev/null 2>&1; then
  file_dir=$(dirname "$file_path")
  search_dir="$file_dir"
  tsconfig_dir=""
  while [ "$search_dir" != "$(dirname "$search_dir")" ]; do
    if [ -f "$search_dir/tsconfig.json" ]; then
      tsconfig_dir="$search_dir"
      break
    fi
    search_dir=$(dirname "$search_dir")
  done
  if [ -z "$tsconfig_dir" ] && [ -n "${CURSOR_PROJECT_DIR:-}" ] && [ -f "${CURSOR_PROJECT_DIR}/tsconfig.json" ]; then
    tsconfig_dir="${CURSOR_PROJECT_DIR}"
  fi
  if [ -n "$tsconfig_dir" ]; then
    tsc_output=$(cd "$tsconfig_dir" && npx tsc --noEmit --pretty false 2>&1 || true)
    if [ -n "$tsc_output" ]; then
      file_base=$(basename "$file_path")
      echo "$tsc_output" | grep -E "($file_path|$file_base)" | head -n 10 >&2 || true
    fi
  fi
fi

# 3. console.log warning
if [[ "$file_path" =~ \.(js|jsx|ts|tsx)$ ]] && grep -q "console\.log" "$file_path"; then
  echo "[Hook WARNING] $file_path 파일에 console.log가 남아있습니다." >&2
fi

exit 0
